<script lang="ts">
	import type { PageData } from './$types';
	import { PostCard, Base, Title } from '$lib/component';

	export let data: PageData;
</script>

<Base breadcrumbs={[['Home'], ['Post'], ['Recent']]}>
	<Title center>Recent</Title>
	<div class="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-12">
		{#each data.recent ?? [] as post}
			<PostCard id={post.id} title={post.title} thumbnail={post.thumbnail} />
		{/each}
	</div>
</Base>
