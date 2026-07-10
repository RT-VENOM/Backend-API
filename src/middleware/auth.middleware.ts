import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to hold our user data
export interface AuthRequest extends Request {
  user?: { userId: string; username: string };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.cookbook_session;

  if (!token) {
    res.status(401).json({ error: "Unauthorized: Please log in." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; username: string };
    req.user = decoded; // Attach the user info to the request!
    next(); // Let them pass
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid session." });
  }
};