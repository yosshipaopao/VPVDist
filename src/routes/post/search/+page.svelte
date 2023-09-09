<script lang='ts'>
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	export let data: PageData;
	let q = data.q ?? '';
	let orderBy = data.orderBy ?? "cratedAt";
	let order = data.order ?? "desc";
	let timeout: any;
	let loading = false;
	const onInput = (q: string,orderBy:string|null,order:string|null) => {
		loading = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			console.log(q);
			if (browser) {
				const url = new URL(location.href);
				url.searchParams.set('q', q);
				if (orderBy) url.searchParams.set('orderBy', orderBy);
				if (order) url.searchParams.set('order', order);
				console.log(url);
				goto(url.href, { replaceState: true });
			}
		}, 1000);
	};
	$: onInput(q,orderBy,order);
	const onChangeResult = (r: typeof data.result) => {
		loading = false;
	};
	$:onChangeResult(data.result);
</script>

<div class='container mx-auto flex flex-col items-center max-w-4xl'>
	<div class='breadcrumbs self-start'>
		<ul>
			<li><a href='/'>
				<Icon icon='ic:outline-home' class='inline' />
				Home</a></li>
			<li><a href='/post'>Post</a></li>
			<li class='text-gray-500'>Search</li>
		</ul>
	</div>
	<div class='mx-auto md:px-4 max-w-2xl'>
		<h1 class='text-4xl font-bold text-center my-8'>Search post</h1>
	</div>
	<div class='join'>
		<label for='search-input' class='h-12 join-item rounded-r-full box-border border'>
			<Icon icon='ic:baseline-search' class='w-full h-full' />
		</label>
		<input id='search-input' class='input input-bordered join-item w-96' placeholder='Search' bind:value={q}
					 autofocus />
		<select class='join-item select select-bordered w-30' bind:value={orderBy}>
			<option value='cratedAt' selected>CreatedAt</option>
			<option value='download'>Download</option>
		</select>
		<select class='join-item select select-bordered w-30' bind:value={order}>
			<option value='desc' selected>DESC</option>
			<option value='asc'>ASC</option>
		</select>
	</div>
	<div class='w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 my-10 gap-2 md:gap-4'>
		{#if loading}
			<span class='loading loading-ring loading-lg'></span>
		{:else}
			{#each data.result as post}
				<a
					class='card card-side shadow-xl bg-base-200 hover:shadow-none hover:bg-primary-content/20 transition-all hover:border'
					href='/post/{post.id}'>
					<figure><img src={post.thumbnail} alt={post.title} class='object-cover w-32' /></figure>
					<div class='card-body'>
						<h2 class='card-title'>{post.title}</h2>
						<p>version:{post.version}</p>
					</div>
				</a>
			{/each}
		{/if}
	</div>
</div>