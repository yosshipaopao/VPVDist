<script lang='ts'>
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;
</script>

<div class='mx-auto md:px-4 w-full max-w-4xl px-2'>
	<div class='breadcrumbs'>
		<ul>
			<li><a href='/'>
				<Icon icon='ic:outline-home' class='inline' />
				Home</a></li>
			<li class='text-gray-500'>Post</li>
		</ul>
	</div>

	<h1 class='text-5xl font-bold mb-4'>Post</h1>

	<div class='w-full flex flex-col mt-12'>
		<div class='flex items-center justify-between'>
			<h2 class='text-3xl font-bold mb-4'>Recent</h2>
			<a href='/post/recent' class='btn btn-sm'>detail</a>
		</div>
		<div class='w-full overflow-x-scroll'>
			<div class='flex h-52'>
				{#each data.recent ?? [] as p}
					<a
						class='card h-48 w-36 bg-base-200 inline-block mr-2 hover:shadow-none hover:bg-primary-content/20 transition-all hover:border'
						href='/post/{p.id}'>
						<figure class='h-20 object-cover'><img src={p.thumbnail} alt={p.title} /></figure>
						<div class='card-body p-4'>
							<h3 class='card-title text-xl font-bold'>{p.title}</h3>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>

	<div class='w-full flex flex-col mt-12'>
		<div class='flex items-center justify-between'>
			<h2 class='text-3xl font-bold mb-4'>Popular</h2>
			<a href='/post/popular' class='btn btn-sm'>detail</a>
		</div>
		<div class='w-full overflow-x-scroll'>
			<div class='flex h-52'>
				{#each data.popular ?? [] as p}
					<a
						class='card h-48 w-36 bg-base-200 inline-block mr-2 hover:shadow-none hover:bg-primary-content/20 transition-all hover:border'
						href='/post/{p.id}'>
						<figure class='h-20 object-cover'><img src={p.thumbnail} alt={p.title} /></figure>
						<div class='card-body p-4'>
							<h3 class='card-title text-xl font-bold'>{p.title}</h3>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>