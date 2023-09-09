<script lang='ts'>
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	export let data: PageData;
	let q = data.q ?? '';
	// eslint-disable-next-line no-undef
	let timeout: number | NodeJS.Timeout | undefined;
	let loading = false;
	const onInput = (q: string) => {
		loading = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (browser) goto(`/user/search?q=${q}`, { replaceState: true });
		}, 1000);
	};
	$: onInput(q);
	const onChangeResult = (r: typeof data.result) => {
		loading = false;
	};
	$:onChangeResult(data.result);
</script>

<div class='container mx-auto flex flex-col items-center max-w-4xl	'>
	<div class='breadcrumbs self-start'>
		<ul>
			<li><a href='/'>
				<Icon icon='ic:outline-home' class='inline' />
				Home</a></li>
			<li><a href='/user'>
				<Icon icon='mdi:user' class='inline' />
				User</a></li>
			<li class='text-gray-500'>Search</li>
		</ul>
	</div>
	<div class='mx-auto md:px-4 max-w-2xl'>
		<h1 class='text-4xl font-bold text-center my-8'>Search user</h1>
	</div>
	<div class='join'>
		<label for='search-input' class='h-12 join-item rounded-r-full box-border border'>
			<Icon icon='ic:baseline-search' class='w-full h-full' />
		</label>
		<input id='search-input' class='input input-bordered join-item w-96' placeholder='Search' bind:value={q}
					 autofocus />
	</div>
	<div class='w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 my-10 gap-2 md:gap-4'>
		{#if loading}
			<span class='loading loading-ring loading-lg'></span>
		{:else}
			{#each data.result as user}
				<a
					class='card shadow-xl hover:shadow-none bg-base-200 hover:bg-base-100/100 hover:border'
					href='/user/{user.uid}'>
					<div class='card-body flex flex-row p-2 h-30'>
						<figure><img src={user.image} alt='icon' class='h-24 w-24 object-cover'/></figure>
						<div>
							<h2 class='card-title'>{user.name}</h2>
							<p>info</p>
						</div>
					</div>
				</a>
			{/each}
		{/if}
	</div>
</div>