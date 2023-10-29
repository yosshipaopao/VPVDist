<script lang="ts">
	import type { PageData } from './$types';
	import { Base, Title, PostCard } from '$lib/component';

	export let data: PageData;
</script>

<Base breadcrumbs={[['Home'], ['Post']]}>
	<Title center>Post</Title>
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold mb-4">Recent</h2>
		<a href="/post/recent" class="btn btn-sm">detail</a>
	</div>
	<div class="w-full overflow-x-scroll">
		<div class="flex h-52">
			{#each data.recent ?? [] as post}
				<PostCard id={post.id} title={post.title} thumbnail={post.thumbnail} />
			{/each}
		</div>
	</div>
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold mb-4">Popular</h2>
		<a href="/post/popular" class="btn btn-sm">detail</a>
	</div>
	<div class="w-full overflow-x-scroll">
		<div class="flex h-52">
			{#each data.popular ?? [] as post}
				<PostCard id={post.id} title={post.title} thumbnail={post.thumbnail} />
			{/each}
		</div>
	</div>
</Base>
