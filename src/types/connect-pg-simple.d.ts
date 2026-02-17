declare module "connect-pg-simple" {
  import session from "express-session";
  function connectPgSimple(
    session: typeof session
  ): any;
  export default connectPgSimple;
}
