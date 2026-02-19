import { createUser } from "../../repositories/users.repository"
import { CreateUserPayload } from "@/types/user.types";

export async function registerUser(payload: CreateUserPayload) {
  try {
    return createUser(payload)
  } catch (error) {
    throw error;
  }
};
