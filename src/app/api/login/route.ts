import nc from "next-connect";
import passport from "@/lib/passport.strategy";
import "@/lib/passport.serialize";
import { sessionMiddleware } from "@/lib/session";

const handler = nc();

// Attach session first
handler.use(sessionMiddleware);

// Then passport
handler.use(passport.initialize());
handler.use(passport.session());

handler.post((req: any, res: any, next: any) => {

  passport.authenticate("local", (err: any, user: any, info: any) => {

    if (err) return res.status(500).json({ message: "Server error" });

    if (!user) {
      return res.status(401).json({ message: info?.message || "Invalid credentials" });
    }

    // This creates the session
    req.login(user, (err: any) => {
      if (err) return res.status(500).json({ message: "Login failed" });

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
        }
      });
    });

  })(req, res, next);

});

export const POST = handler;
