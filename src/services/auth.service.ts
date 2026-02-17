import bcrypt from "bcrypt"
import { createUser } from "../repositories/users.repository"
import { signJwt } from "@/lib/jwt"
import { CreateUserPayload } from "@/types/user.types";

export async function registerUser(payload: CreateUserPayload) {
  try {
    return createUser(payload)
  } catch (error) {
    throw error;
  }
};

// export async function loginUser(email: string, password: string) {
//   const user = await findUserByEmail(email)
//   if (!user) throw new Error("Invalid credentials")

//   const isMatch = await bcrypt.compare(password, user.password)
//   if (!isMatch) throw new Error("Invalid credentials")

//   return signJwt({
//     userId: user.id,
//     role: user.role,
//   })
// }
