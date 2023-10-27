<script lang="ts">
	import type { PageData } from './$types';
	import Base from '$lib/component/Base.svelte';
	import Title from '$lib/component/Title.svelte';
	import PostCard from '$lib/component/PostCard.svelte';

	export let data: PageData;
</script>

<Base breadcrumbs={[['Home'], ['User'], [data.user.name, `/user/${data.id}`], ['post']]}>
	<Title center>{data.user.name}'s Posts</Title>
	<div class="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-12">
		{#each data.post ?? [] as post}
			<PostCard id={post.id} title={post.title} thumbnail={post.thumbnail} />
		{/each}
	</div>
</Base>
