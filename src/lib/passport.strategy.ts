import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { findUserByEmail } from "@/repositories/users.repository";

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (email, password, done) {

  })
)
