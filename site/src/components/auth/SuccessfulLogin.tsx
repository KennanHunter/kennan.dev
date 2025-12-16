import { createEffect, createSignal, onMount } from "solid-js";
import { useAuth } from "../../store/auth";
import { SITE_URL } from "../../consts";

export default function SuccessfulLogin() {
  const { user, setUser } = useAuth();
  const [error, setError] = createSignal<string | null>(null);

  onMount(() => {
    let params = new URLSearchParams(window.location.search);

    let user = params.get("username");
    let access_token = params.get("access_token");
    let image_uri = params.get("image_uri");

    if (!user || !access_token) {
      console.error("Missing username or access_token in URL parameters");

      setError("Missing username or access_token in URL parameters");

      return;
    }

    setError(null);

    setUser({
      name: user,
      jwt_token: access_token,
      image: image_uri || undefined,
    });
  });

  if (error()) {
    return <h1>Error: {error()}</h1>;
  }

  return (
    <div class="bg-black">
      {user() ? (
        <div class="">
          <h1>Login Successful!</h1>
          <a href={SITE_URL}>Go to site</a>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
