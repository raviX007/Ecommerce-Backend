// src/controllers/auth.controller.ts

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";
import {
  LoginCredentials,
  JwtPayload,
  RegistrationRequest,
  UserRole,
} from "../types/auth.types";
import { validateOrReject } from "class-validator";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const userRepository = AppDataSource.getRepository(User);

export const register = async (
  req: Request<{}, {}, RegistrationRequest>,
  res: Response
): Promise<void> => {
  try {
    const {
      email,
      password,
      role = UserRole.CUSTOMER,
      firstName,
      lastName,
    } = req.body;

    // Validate role
    if (role && !Object.values(UserRole).includes(role)) {
      res.status(400).json({ message: "Invalid role specified" });
      return;
    }

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    // Create new user
    const user = new User();
    user.email = email;
    user.password = password;
    user.role = role;
    user.firstName = firstName || ""; // Provide default empty string
    user.lastName = lastName || ""; // Provide default empty string

    // Validate user entity
    await validateOrReject(user).catch((errors) => {
      throw { status: 400, errors };
    });

    // Password hashing is handled by @BeforeInsert in User entity
    const savedUser = await userRepository.save(user);

    // Generate JWT token
    const payload: JwtPayload = {
      id: savedUser.id,
      userId: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

    // Return response without password
    res.status(201).json({
      token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.status === 400) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
      return;
    }

    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (
  req: Request<{}, {}, LoginCredentials>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Debug log 1: Check incoming credentials
    console.log("Login attempt for email:", email);

    const user = await userRepository.findOne({ where: { email } });

    // Debug log 2: Check if user was found
    if (!user) {
      console.log("No user found with email:", email);
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    console.log("User found:", { id: user.id, email: user.email });

    // Debug log 3: Password validation
    const isPasswordValid = await user.validatePassword(password);
    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Password validation failed for user:", user.id);
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const payload: JwtPayload = {
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

    user.lastLoginAt = new Date();
    await userRepository.save(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Login failed" });
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const user = await userRepository.findOne({
      where: { id: userId },
      select: ["id", "email", "role", "lastLoginAt"],
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};
