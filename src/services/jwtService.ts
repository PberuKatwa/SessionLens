import jwt from "jsonwebtoken"
import type { SignedUser } from "@/types/user.types"
import { globalConfig } from "@/config/config"

const { jwtSecret } = globalConfig();

export function signJwt(payload: SignedUser) {
  try {
    return jwt.sign(payload, jwtSecret, { expiresIn: "7d" })
  } catch (error) {
    throw error;
  }
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, jwtSecret)
  } catch (error) {
    throw error;
  }
}
