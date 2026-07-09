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
    const { username, password } = parsed.body;

    // Check if user already exists
    const userExists = await CookbookUser.findOne({
      username: username.toLowerCase(),
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
    }
    )
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



export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Check if the cookie exists
    const token = req.cookies.cookbook_session;
    if (!token) {
      res.status(401).json({ error: 'No active session' });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

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