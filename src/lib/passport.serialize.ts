import passport from "passport";
import { findUserByEmail } from "@/repositories/users.repository";
import { AuthUser } from "@/types/user.types";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (email: string, done) => {
  try {
    const user = await findUserByEmail(email);
    done(null, user || null);
  } catch (err) {
    done(err);
  }
});
