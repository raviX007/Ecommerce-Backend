import { getRepository } from "typeorm";
import { User } from "../models/User";
import { UserRole } from "../types/auth.types";
import { validate } from "class-validator";

export class AuthService {
  private userRepository = getRepository(User);

  async register(
    email: string,
    password: string,
    role: UserRole = UserRole.CUSTOMER,
    userData?: Partial<User>
  ): Promise<User> {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const user = new User();
    user.email = email.toLowerCase();
    user.password = password;
    user.role = role;

    if (userData) {
      Object.assign(user, userData);
    }

    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(
        `Validation failed: ${errors
          .map((error) => Object.values(error.constraints || {}))
          .join(", ")}`
      );
    }

    try {
      const savedUser = await this.userRepository.save(user);

      const { password: _, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;
    } catch (error: any) {
      throw new Error(`Failed to register user: ${error.message}`);
    }
  }

  async login(email: string, password: string): Promise<Partial<User>> {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    if (newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters long");
    }

    user.password = newPassword;
    await this.userRepository.save(user);
  }

  async deactivateAccount(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    user.isActive = false;
    await this.userRepository.save(user);
  }
}
