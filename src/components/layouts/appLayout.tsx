import type { JSX } from "solid-js";
import { cn } from "~/lib/utils";
import Dahsboard from "../dashboard/component";
import Sidebar from "../sidebar/component";

interface Props {
	children: JSX.Element;
	title?: string;
	class?: string;
}
export default function AppLayout(props: Props) {
	return (
		<main
			class={cn("grid h-screen grid-cols-[220px,_1fr] gap-4 p-4", props.class)}
		>
			<Sidebar />
			<Dahsboard>{props.children}</Dahsboard>
		</main>
	);
}
