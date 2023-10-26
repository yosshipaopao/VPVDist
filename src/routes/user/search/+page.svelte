<script lang='ts'>
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Base from '$lib/component/Base.svelte';
	import Form from '$lib/component/Form.svelte';

	export let data: PageData;
	let q = data.q ?? '';
	let timeout: any;
	let loading = false;
	const onInput = (q: string) => {
		loading = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (browser) goto(`/user/search?q=${q}`, { replaceState: true });
		}, 1000);
	};
	$: onInput(q);
	const onChangeResult = (r: typeof data.result) => loading = false;
	$: onChangeResult(data.result);
</script>
<Base breadcrumbs={["Home", "User","Search"]}>
	<Base mini>
		<Form title='Search user' method='GET' keepFocus submitButton={false}>
			<div class='join mx-auto'>
				<label for='search-input' class='h-12 join-item rounded-r-full box-border border'>
					<Icon icon='ic:baseline-search' class='w-full h-full' />
				</label>
				<input
					id='search-input'
					class='input input-bordered join-item w-96'
					placeholder='Search'
					name='q'
					bind:value={q}
				/>
			</div>
		</Form>
	</Base>
		<div class='w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 my-10 gap-2 md:gap-4'>
		{#if loading}
			<span class='loading loading-ring loading-lg' />
		{:else}
			{#each data.result as user}
				<a
					class='card shadow-xl hover:shadow-none bg-base-200 hover:bg-base-100/100 hover:border'
					href='/user/{user.id}'
				>
					<div class='card-body flex flex-row p-2 h-30'>
						<figure><img src={user.image} alt='icon' class='h-24 w-24 object-cover' /></figure>
						<div>
							<h2 class='card-title'>{user.name}</h2>
							<p>info</p>
						</div>
					</div>
				</a>
			{/each}
		{/if}
	</div>
</Base>