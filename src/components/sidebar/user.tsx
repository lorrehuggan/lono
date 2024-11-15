import { logout } from "~/lib/actions/logout"

export default function User() {
  return (
    <div class="sticky top-[calc(100vh_-_48px_-_16px)] flex h-16 items-center border-t-[1px] border-stone-200">
      <form class="w-full" action={logout} method="post">
        <button
          type="submit"
          class="flex w-full items-center gap-2 rounded-xl px-1.5 py-2 text-sm text-stone-600 transition-colors duration-200 ease-out hover:bg-stone-300 hover:text-stone-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-log-out"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          Log out
        </button>
      </form>
    </div>
  )
}
