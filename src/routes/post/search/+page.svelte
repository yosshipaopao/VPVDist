<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Base, Form, Select } from '$lib/component';

	export let data: PageData;
	let q = data.q;
	let orderBy = data.orderBy;
	let order = data.order;
	let timeout: any;
	let loading = false;
	const onInput = (q: string, orderBy: string, order: string) => {
		loading = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (browser) {
				const url = new URL(location.href);
				url.searchParams.set('q', q);
				url.searchParams.set('orderBy', orderBy);
				url.searchParams.set('order', order);
				goto(url.href, { replaceState: true });
			}
		}, 1000);
	};
	$: onInput(q, orderBy, order);
	const onChangeResult = (r: any[]) => (loading = false);
	$: onChangeResult(data.result);
</script>

<Base breadcrumbs={[['Home'], ['Post'], ['Search']]}>
	<Base mini>
		<Form title="Search post" method="GET" keepFocus submitButton={false}>
			<div class="join">
				<label for="search-input" class="h-12 join-item rounded-r-full box-border border">
					<Icon icon="ic:baseline-search" class="w-full h-full" />
				</label>
				<input
					id="search-input"
					class="input input-bordered join-item w-96"
					placeholder="Search"
					bind:value={q}
					name="q"
				/>
				<Select
					name="orderBy"
					join
					bind:value={orderBy}
					options={[
						{ value: 'createdAt', label: 'CreatedAt' },
						{ value: 'updatedAt', label: 'UpdatedAt' },
						{ value: 'download', label: 'Download' }
					]}
				/>
				<Select
					name="order"
					join
					bind:value={order}
					options={[
						{ value: 'desc', label: 'DESC' },
						{ value: 'asc', label: 'ASC' }
					]}
				/>
			</div>
		</Form>
		<div class="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 my-10 gap-2 md:gap-4">
			{#if loading}
				<span class="loading loading-ring loading-lg" />
			{:else}
				{#each data.result as post}
					<a
						class="card card-side shadow-xl bg-base-200 hover:shadow-none hover:bg-primary-content/20 transition-all hover:border"
						href="/post/{post.id}"
					>
						<figure><img src={post.thumbnail} alt={post.title} class="object-cover w-32" /></figure>
						<div class="card-body">
							<h2 class="card-title">{post.title}</h2>
							<p>version:{post.version}</p>
						</div>
					</a>
				{/each}
			{/if}
		</div>
	</Base>
</Base>
