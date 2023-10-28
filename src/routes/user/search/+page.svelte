<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import {Base,Form,UserCard} from '$lib/component';
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
	const onChangeResult = (r: typeof data.result) => (loading = false);
	$: onChangeResult(data.result);
</script>

<Base breadcrumbs={[['Home'], ['User'], ['Search']]}>
	<Base mini>
		<Form title="Search user" method="GET" keepFocus submitButton={false}>
			<div class="join mx-auto">
				<label for="search-input" class="h-12 join-item rounded-r-full box-border border">
					<Icon icon="ic:baseline-search" class="w-full h-full" />
				</label>
				<input
					id="search-input"
					class="input input-bordered join-item w-96"
					placeholder="Search"
					name="q"
					bind:value={q}
				/>
			</div>
		</Form>
	</Base>
	<div class="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 my-10 gap-2 md:gap-4">
		{#if loading}
			<span class="loading loading-ring loading-lg" />
		{:else}
			{#each data.result as user}
				<UserCard userId={user.id} icon={user.image} name={user.name} big />
			{/each}
		{/if}
	</div>
</Base>
