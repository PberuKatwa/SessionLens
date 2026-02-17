import jwt from "jsonwebtoken"
import type { SignedUser } from "@/types/user.types"

const secret = process.env.JWT_SECRET!

export function signJwt(payload: SignedUser) {
  try {
    return jwt.sign(payload, secret, { expiresIn: "7d" })
  } catch (error) {
    throw error;
  }
}

export function verifyJwt(token: string) {
  return jwt.verify(token, secret)
}
