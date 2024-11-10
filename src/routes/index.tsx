export default function Home() {
	function login() {
		window.location.replace("/login/spotify/auth");
	}

	return (
		<main class="">
			<div class="flex items-center gap-2">
				<button class="p-1 bg-rose-300" onClick={login}>
					Spotify Login
				</button>
			</div>
		</main>
	);
}
