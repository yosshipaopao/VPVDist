<script lang="ts">
	import type { PageData } from './$types';
	import { Base, PostCard } from '$lib/component';
	export let data: PageData;
</script>

<Base breadcrumbs={[['Home'], ['User'], [data.user.name]]}>
	<div class="w-full flex gap-6 my-10 items-center">
		<div class="w-1/2 h-48 flex items-center justify-center">
			<div class="avatar">
				<div class="h-48 rounded-full">
					<img src={data.user.image} alt={data.user.name} />
				</div>
			</div>
		</div>
		<div class="w-full">
			<h1 class="text-5xl font-bold mb-4">{data.user.name}</h1>
			<p>info</p>
		</div>
	</div>
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold mb-4">POSTS</h2>
		<a href="/user/{data.id}/post" class="btn btn-sm">detail</a>
	</div>

	<div class="w-full overflow-x-scroll">
		<div class="flex h-52">
			{#each data.post ?? [] as post}
				<PostCard id={post.id} title={post.title} thumbnail={post.thumbnail} />
			{/each}
		</div>
	</div>
</Base>
