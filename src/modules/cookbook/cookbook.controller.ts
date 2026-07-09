import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { CookbookUser } from "./cookbook.model";
import { AuthSchema, CheckUsernameSchema } from "./cookbook.schema";

// 1. Check if a username is already taken
export const checkUsername = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Validate query params using your Zod schema
    const parsed = CheckUsernameSchema.parse({ query: req.query });
    const username = parsed.query.username.toLowerCase();

    const userExists = await CookbookUser.findOne({ username });

    if (userExists) {
      res
        .status(200)
        .json({ available: false, message: "Username is already taken" });
      return;
    }

    res.status(200).json({ available: true, message: "Username is available" });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Validation failed" });
  }
};

// 2. Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body using Zod
    const parsed = AuthSchema.parse({ body: req.body });
    
    // FORCE LOWERCASE HERE
    const username = parsed.body.username.toLowerCase(); 
    const password = parsed.body.password;

    // Check if user already exists
    const userExists = await CookbookUser.findOne({
      username: username,
    });
    
    if (userExists) {
      res.status(400).json({ error: "Username is already taken" });
      return;
    }

    // Hash the password securely with argon2
    const passwordHash = await argon2.hash(password);

    // Save to MongoDB
    const newUser = await CookbookUser.create({
      username,
      passwordHash,
    });

    // Generate a JWT token for immediate login session
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );
    
    res.cookie('cookbook_session', token, {
      httpOnly:true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7*24*60*60 * 1000
    });
    
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Registration failed" });
  }
};

// src/modules/cookbook/cookbook.controller.ts
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validate the incoming request body exactly like the register route
    const parsed = AuthSchema.parse({ body: req.body });
    const { username, password } = parsed.body;

    // 2. Look for the user in the database
    const user = await CookbookUser.findOne({ username: username.toLowerCase() });
    
    // ... the rest of your login logic stays exactly the same
    // SECURITY: Don't specify if it was the username or password that failed
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // 3. Verify the password mathematically
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // 4. Generate the session token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' } 
    );

    // 5. Attach the secure cookie
    res.cookie('cookbook_session', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    // 6. Send success response back to React
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Login failed' });
  }
};



// 4. Verify Active Session (The missing getMe function!)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Check if the cookie exists
    const token = req.cookies.cookbook_session;
    if (!token) {
      res.status(401).json({ error: 'No active session' });
      return;
    }
    
    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // 3. Find the user (excluding the password hash for security)
    const user = await CookbookUser.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      res.status(401).json({ error: 'User no longer exists' });
      return;
    }

    // 4. Send the user data back
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
};