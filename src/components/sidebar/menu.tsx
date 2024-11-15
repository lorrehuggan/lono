import { A, useLocation } from "@solidjs/router";
import clsx from "clsx";
import { For, type JSX } from "solid-js";
import { routes } from "./routes";

interface RouteProps {
  route: string;
  icon: JSX.Element;
  path: string;
}

function Route(props: RouteProps) {
  const location = useLocation();
  const selected =
    location.pathname === `/${props.path.length ? props.path : "create"}`;
  return (
    <A
      href={`${props.path.length ? `/${props.path}` : "/create"}`}
      class={clsx(
        "group flex items-center gap-2 rounded-lg px-1 py-1.5 transition-all duration-300 ease-out hover:bg-stone-300",
        {
          "bg-white shadow": selected,
        },
      )}
    >
      <span
        class={clsx(
          "text-stone-600 transition-colors duration-300 ease-out group-hover:text-stone-800",
          {
            // "text-stone-400": !selected,
            "text-violet-400": selected,
          },
        )}
      >
        {props.icon}
      </span>
      <span
        class={clsx(
          "text-sm capitalize text-stone-600 transition-colors duration-300 ease-out group-hover:text-stone-800",
          {
            "text-violet-400": selected,
          },
        )}
      >
        {props.route}
      </span>
    </A>
  );
}

export default function Menu() {
  return (
    <div class="space-y-1">
      <For each={routes}>{(route) => <Route {...route} />}</For>
    </div>
  );
}
