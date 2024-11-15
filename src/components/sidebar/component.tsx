import Logo from "./logo";
import Menu from "./menu";
import User from "./user";

export default function Sidebar() {
  return (
    <div class="">
      <div class="sticky top-4 h-[calc(100vh-32px-48px)] overflow-y-scroll">
        <Logo />
        <Menu />
      </div>
      <User />
    </div>
  );
}
