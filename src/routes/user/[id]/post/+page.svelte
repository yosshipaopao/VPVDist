<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="mx-auto md:px-4 w-full max-w-4xl">
	<div class="breadcrumbs self-start">
		<ul>
			<li>
				<a href="/">
					<Icon icon="ic:outline-home" class="inline" />
					Home</a
				>
			</li>
			<li>
				<a href="/user">
					<Icon icon="mdi:user" class="inline" />
					User</a
				>
			</li>
			<li><a href="/user/{data.uid}">{data.user?.name}</a></li>
			<li class="text-gray-500">post</li>
		</ul>
	</div>
	<div class="w-full mt-10">
		{#each data.post ?? [] as p}
			<a
				class="card h-48 w-36 bg-base-200 inline-block mr-2 hover:shadow-none hover:bg-primary-content/20 transition-all hover:border"
				href="/post/{p.id}"
			>
				<figure class="h-20 object-cover"><img src={p.thumbnail} alt={p.title} /></figure>
				<div class="card-body p-4">
					<h3 class="card-title text-xl font-bold">{p.title}</h3>
				</div>
			</a>
		{/each}
	</div>
</div>
