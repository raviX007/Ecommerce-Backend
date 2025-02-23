import { JwtPayload } from "../auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: number };
      fileValidationError?: string;
    }
  }
}
