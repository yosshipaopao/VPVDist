<script lang="ts">
	import '../app.postcss';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	$: url = $page.url.pathname;
	$: onNavigate(url);
	const onNavigate = (url: string) => (openMenu = false);
	const themes = [
		'light',
		'dark',
		'miku',
		'night',
		'cupcake',
		'bumblebee',
		'emerald',
		'corporate',
		'synthwave',
		'retro',
		'cyberpunk',
		'valentine',
		'halloween',
		'garden',
		'forest',
		'aqua',
		'lofi',
		'pastel',
		'fantasy',
		'wireframe',
		'black',
		'luxury',
		'dracula',
		'cmyk',
		'autumn',
		'business',
		'acid',
		'lemonade',
		'coffee',
		'winter'
	];

	onMount(() => {
		if (!document.documentElement.dataset.theme) {
			const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'light';
			changeTheme(theme);
		}
	});
	const changeTheme = (theme: string) => {
		document.documentElement.dataset.theme = theme;
		document.cookie = `theme=${theme};path=/;max-age=31536000`;
	};

	let openMenu = false;
</script>

<div class="drawer">
	<input id="menu-drawer" type="checkbox" class="drawer-toggle" bind:checked={openMenu} />
	<div class="drawer-content flex flex-col">
		<div
			class="w-full navbar backdrop-blur-3xl shadow border-b border-b-primary px-6 sticky top-0 z-40"
		>
			<div class="flex-none lg:hidden">
				<label for="menu-drawer" class="btn btn-square btn-ghost p-1.5">
					<Icon icon="ic:round-menu" class="h-full w-full" />
				</label>
			</div>
			<div class="flex-1 px-2 mx-2"><a href="/">VPVDist</a></div>
			<div class="flex-none hidden lg:block">
				<ul class="menu menu-horizontal gap-2">
					<li>
						<a href="/">Home</a>
					</li>
					<li class="dropdown dropdown-end">
						<label tabindex="0"
							>Post
							<Icon icon="ic:outline-keyboard-arrow-down" />
						</label>
						<ul
							tabindex="0"
							class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl rounded-box w-52 bg-base-300"
						>
							<li><a href="/post">post</a></li>
							{#if $page.data.session?.user}
								<li><a href="/post/create">create</a></li>
							{/if}
							<li><a href="/post/search">Search</a></li>
						</ul>
					</li>
					<li class="dropdown dropdown-end">
						<label tabindex="0"
							>User
							<Icon icon="ic:outline-keyboard-arrow-down" />
						</label>
						<ul
							tabindex="0"
							class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl rounded-box w-52 bg-base-300"
						>
							<li><a href="/user">user</a></li>
							<li><a href="/user/search">search</a></li>
						</ul>
					</li>
					<li class="dropdown dropdown-end">
						<label tabindex="0">
							<Icon icon="mdi:theme-light-dark" />
							theme
							<Icon icon="ic:outline-keyboard-arrow-down" />
						</label>
						<ul
							tabindex="0"
							class="menu menu-sm dropdown-content mt-3 z-[1] rounded-box w-52 p-4 bg-base-300 max-h-96 overflow-y-scroll flex-nowrap gap-2"
						>
							{#each themes as theme}
								<li data-theme={theme} class="rounded-box">
									<button on:click={() => changeTheme(theme)}>{theme}</button>
								</li>
							{/each}
						</ul>
					</li>
				</ul>
			</div>
			<div class="dropdown dropdown-end">
				<label tabindex="0" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						{#if $page.data.session?.user?.image}
							<img src={$page.data.session.user.image} alt="user icon" />
						{:else}
							<Icon icon="mdi:user" class="h-full w-full" />
						{/if}
					</div>
				</label>
				<ul
					tabindex="0"
					class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl rounded-box w-52 bg-base-300"
				>
					{#if $page.data.session?.user}
						<img
							src={$page.data.session.user.image}
							alt="user icon"
							class="w-20 h-20 rounded-full mx-auto"
						/>
						<div class="text-center mb-4">
							<p class="text-xl">{$page.data.session.user.name}</p>
							<p class="text-sm">{$page.data.session.user.email}</p>
						</div>
						<li><a href="/setting/user">Setup</a></li>
						<li><a href="/user/{$page.data.session.user.userId}">My Profile</a></li>
						<li>
							<form action="/?signout">
								<button type="submit">SignOut</button>
							</form>
						</li>
					{:else}
						<li><a href="/signin">SignIn</a></li>
					{/if}
				</ul>
			</div>
		</div>
		<!-- Page content here -->
		<main class="min-h-screen">
			<slot />
		</main>
		<footer class="footer items-center p-4 bg-neutral text-neutral-content">
			<div class="items-center grid-flow-col">
				<svg
					width="36"
					height="36"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					fill-rule="evenodd"
					clip-rule="evenodd"
					class="fill-current"
				>
					<path
						d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"
					/>
				</svg>
				<p>Copyright © 2023 - All right reserved</p>
			</div>
			<div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
				<a href="https://x.com/vpvdist" target="_blank">
					<Icon icon="bxl:twitter" class="fill-current h-10 w-10" />
				</a>
				<a href="https://github.com/yosshipaopao/vpvdist" target="_blank">
					<Icon icon="bxl:github" class="fill-current h-10 w-10" />
				</a>
			</div>
		</footer>
	</div>
	<div class="drawer-side z-50">
		<label for="menu-drawer" class="drawer-overlay" />
		<ul class="menu p-4 w-80 min-h-full bg-base-200 gap-1">
			<!-- Sidebar content here -->
			<li>
				<a href="/">Home</a>
			</li>
			<li>
				<details class="collapse collapse-arrow">
					<summary class="collapse-title !min-h-0">Post</summary>
					<ul class="collapse-content">
						<li><a href="/post">post</a></li>
						{#if $page.data.session?.user}
							<li><a href="/post/create">create</a></li>
						{/if}
						<li><a href="/post/search">Search</a></li>
					</ul>
				</details>
			</li>
			<li>
				<details class="collapse collapse-arrow">
					<summary class="collapse-title !min-h-0">User</summary>
					<ul class="collapse-content">
						<li><a href="/user">user</a></li>
						<li><a href="/user/search">Search</a></li>
					</ul>
				</details>
			</li>
			<li>
				<details class="collapse collapse-arrow">
					<summary class="collapse-title !min-h-0">
						<span><Icon icon="mdi:theme-light-dark" class="inline mr-2" />theme</span>
					</summary>
					<ul class="collapse-content mt-2">
						{#each themes as theme}
							<li data-theme={theme} class="rounded-box">
								<button on:click={() => changeTheme(theme)}>{theme}</button>
							</li>
						{/each}
					</ul>
				</details>
			</li>
		</ul>
	</div>
</div>
