import { createEffect, createSignal } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import { decodeJwt } from "jose";

function isJwtExpired(token: string): boolean {
  try {
    const payload = decodeJwt(token);

    // exp is seconds since epoch
    if (typeof payload.exp !== "number") return true;

    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export type User = {
  name: string;
  jwt_token: string;
  image?: string;
};

const [user, setUser] = makePersisted(createSignal<User | null>(null), {
  name: "user",
});

export function useAuth() {
  createEffect(() => {
    const u = user();

    if (u && isJwtExpired(u.jwt_token)) {
      console.log("JWT expired, logging out");
      setUser(null);
    }
  });

  return { user, setUser };
}
