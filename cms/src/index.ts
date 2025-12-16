import { Context, Hono } from "hono";
import { discord_auth_callback_handler } from "./routes/auth/callback";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { redirect_to_discord_oauth } from "./routes/auth/connect";

type AppBindings = { Bindings: Env };
const app = new Hono<AppBindings>();
export type AppContext = Context<AppBindings>;

const acceptable_origins = ["https://cms.kennan.dev", "https://kennan.dev"];

app.use(async (c, next) => {
  c.header("Vary", "Origin");
  await next();
});
app.use(
  cors({
    origin: (origin, c) => {
      if (origin && acceptable_origins.includes(origin)) {
        return origin;
      }

      if (
        origin &&
        (origin.startsWith("http://localhost") ||
          origin.startsWith("https://localhost"))
      ) {
        return origin;
      }

      return "";
    },
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(logger());

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/auth/callback", discord_auth_callback_handler);
app.get("/auth/connect", redirect_to_discord_oauth);

export default app;
