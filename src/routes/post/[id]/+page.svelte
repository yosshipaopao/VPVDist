<script lang="ts">
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { Base, Button, UserCard, Title } from '$lib/component';
	export let data: PageData;
</script>

<Base breadcrumbs={[['Home'], ['Post'], [data.post.title]]}>
	<figure class="w-full h-96 overflow-hidden">
		<img class="object-cover" src={data.post.thumbnail} alt={data.post.title} />
	</figure>
	<Title>{data.post.title}</Title>
	<div class="flex sm:flex-row flex-col items-center justify-between mt-4">
		{#if data.post.authorId === data.session?.user.userId}
			<div class="join">
				<Button href="/post/{data.id}/edit" join>
					<Icon icon="ic:baseline-edit" class="inline" />
					Edit
				</Button>
				<Button href="/post/{data.id}/download?version={data.post.version}" target="_blank" join>
					<Icon icon="ic:baseline-cloud-download" class="inline" />
					Download
				</Button>
			</div>
		{:else}
			<Button href="/post/{data.id}/download?version={data.post.version}" target="_blank">
				<Icon icon="ic:baseline-cloud-download" class="inline" />
				Download
			</Button>
		{/if}
		<div>
			<p>Downloads: {data.post.download} Version: {data.post.version}</p>
			<p>
				create: {new Date(data.post.createdAt).toLocaleDateString()} | last update: {new Date(
					data.post.updatedAt ?? data.post.createdAt
				).toLocaleDateString()}
			</p>
		</div>
	</div>
	<UserCard userId={data.post.authorId} icon={data.post.authorIcon} name={data.post.author} />
	<p class="mt-4">{data.post.description}</p>
</Base>
