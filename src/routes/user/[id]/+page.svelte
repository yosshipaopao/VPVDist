<script lang='ts'>
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;
</script>

<div class='mx-auto md:px-4 w-full max-w-4xl'>
	{#if data.user}
		<div class='breadcrumbs self-start'>
			<ul>
				<li><a href='/'>
					<Icon icon='ic:outline-home' class='inline' />
					Home</a></li>
				<li><a href='/user'>
					<Icon icon='mdi:user' class='inline' />
					User</a></li>
				<li class='text-gray-500'>{data.user.name}</li>
			</ul>
		</div>
		<div class='w-full flex gap-6 mt-10 items-center'>
			<div class='w-1/2 h-48 flex items-center justify-center'>
				<div class='avatar'>
					<div class='h-48 rounded-full'>
						<img src={data.user.image} alt={data.user.name} />
					</div>
				</div>
			</div>
			<div class='w-full'>
				<h1 class='text-5xl font-bold mb-4'>{data.user?.name}</h1>
				<p>info</p>
			</div>
		</div>
		<div class='w-full flex flex-col mt-24'>
			<div class='flex items-center justify-between'>
				<h2 class='text-3xl font-bold mb-4'>POSTS</h2>
				<a href='/user/{data.user.id}/post' class='btn btn-sm'>detail</a>
			</div>
			<div class='w-full overflow-x-scroll'>
				<div class='flex h-52'>
					{#each data.post ?? [] as p}
						<a class='card h-48 w-36 bg-base-200 inline-block mr-2 hover:shadow-none hover:bg-primary-content/20 transition-all hover:border' href='/post/{p.id}'>
							<figure class='h-20 object-cover'><img src={p.thumbnail} alt={p.title} /></figure>
							<div class='card-body p-4'>
								<h3 class='card-title text-xl font-bold'>{p.title}</h3>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>