import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { validatePassword } from "@/repositories/users.repository";
import { AuthUser } from "@/types/user.types";

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (email, password, done) {
    try {

      const user = await validatePassword(email, password);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
)
