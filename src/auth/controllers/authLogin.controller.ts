import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmailIdServices } from "../auth.service";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const user = await getUserByEmailIdServices(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials." });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not set.");

    const token = jwt.sign(
      { userId: user.id, email: user.email, user_type: user.user_type },
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
      user_type: user.user_type,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || "Login failed." });
  }
};
