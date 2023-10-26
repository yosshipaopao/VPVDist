<script lang="ts">
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;
</script>

<div class="mx-auto md:px-4 w-full max-w-4xl px-2">
	<div class="breadcrumbs">
		<ul>
			<li>
				<a href="/">
					<Icon icon="ic:outline-home" class="inline" />
					Home</a
				>
			</li>
			<li><a href="/post">Post</a></li>
			<li class="text-gray-500">{data.post.title}</li>
		</ul>
	</div>
	<figure class="w-full h-96 overflow-hidden">
		<img class="object-cover" src={data.post.thumbnail} alt={data.post.title} />
	</figure>
	<h1 class="text-4xl font-bold mt-4">{data.post.title}</h1>
	<div class="flex sm:flex-row flex-col items-center justify-between mt-4">
		{#if data.post.authorId === data.session?.user?.id}
			<div class="join">
				<a class="join-item btn btn-primary" href="/post/{data.id}/edit">
					<Icon icon="ic:baseline-edit" class="inline" />
					Edit
				</a>
				<a
					class="join-item btn btn-primary"
					href="/post/{data.id}/download?version={data.post.version}"
					target="_blank"
				>
					<Icon icon="ic:baseline-cloud-download" class="inline" />
					Download
				</a>
			</div>
		{:else}
			<a
				class="btn btn-primary"
				href="/post/{data.id}/download?version={data.post.version}"
				target="_blank"
			>
				<Icon icon="ic:baseline-cloud-download" class="inline" />
				Download
			</a>
		{/if}
		<div>
			<p>Downloads: {data.post.download} Version: {data.post.version}</p>
			<p>
				create: {new Date(data.post.createdAt).toLocaleDateString()} | last update: {new Date(
					data.post.updatedAt
				).toLocaleDateString()}
			</p>
		</div>
	</div>
	<a
		class="card shadow-xl bg-base-200 hover:shadow-none hover:bg-primary-content/20 transition-all hover:border max-w-sm h-20 mt-4"
		href="/user/{data.post.authorId}"
	>
		<div class="card-body flex flex-row p-2">
			<figure class="avatar rounded-full h-16">
				<img src={data.post.authorIcon} alt="icon" />
			</figure>
			<div>
				<h2 class="card-title">{data.post.author}</h2>
				<p>info</p>
			</div>
		</div>
	</a>
	<p class="mt-4">{data.post.description}</p>
</div>
