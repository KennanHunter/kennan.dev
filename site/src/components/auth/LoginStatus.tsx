import { Show } from "solid-js";
import { useAuth } from "../../store/auth";
import { CMS_URL } from "../../consts";

export default function LoginStatus() {
  const { user } = useAuth();

  return (
    <div class="relative inline-block px-4 py-2 font-semibold text-white right-1 top-1">
      <Show
        when={user()}
        fallback={<a href={`${CMS_URL}/auth/connect`}>Login</a>}
      >
        <img
          class="inline-block w-12 h-12 mr-2"
          src={user()!.image + "?size=100"}
        />
        {user()!.name}
      </Show>
    </div>
  );
}
