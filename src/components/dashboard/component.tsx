import type { JSX } from "solid-js";
import TopBar from "./topBar";

interface Props {
  children: JSX.Element;
}
export default function Dashboard(props: Props) {
  return (
    <div class="relative mb-4 h-[200vh] rounded-lg bg-white shadow">
      <TopBar />
      <div class="p-4">{props.children}</div>
    </div>
  );
}
