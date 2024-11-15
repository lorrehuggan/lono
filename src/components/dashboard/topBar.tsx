import { createAsync, redirect } from "@solidjs/router";
import { Show } from "solid-js";
import { getUser } from "~/lib/actions/user";

export default function TopBar() {
	const user = createAsync(() => getUser());
	if (!user()) {
		return redirect("/");
	}
	return (
		<div class="top-2 flex h-14 items-center justify-between border-b border-stone-200 px-4">
			<Show when={user()}>
				<div>
					<p class="text-sm font-bold">
						🤗 Hello <span>{user()?.name}</span>
					</p>
					<p class="text-xs text-stone-600">Welcome back to your dashboard</p>
				</div>
				<div>
					<img
						class="size-8 rounded-full object-cover"
						src={user()?.image!}
						alt={user()?.name!}
					/>
				</div>
			</Show>
		</div>
	);
}
