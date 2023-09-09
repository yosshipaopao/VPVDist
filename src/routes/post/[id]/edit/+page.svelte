<script lang='ts'>
	import type { PageData, ActionData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	export let form: ActionData;
	let thumbnailDirectURL = true;
	let fileDirectURL = true;
</script>
<div class='mx-auto md:px-4 w-full max-w-4xl px-2'>
	<div class='breadcrumbs'>
		<ul>
			<li><a href='/'>
				<Icon icon='ic:outline-home' class='inline' />
				Home</a></li>
			<li><a href='/post'>Post</a></li>
			<li><a href='/post/{data.id}'>{data.post.title}</a></li>
			<li class='text-gray-500'>Edit</li>
		</ul>
	</div>
	{#if form}
		{#each form.errors ?? [] as error}
			<div class='alert alert-error mt-10'>
				<Icon icon='ic:sharp-error-outline' class='w-6 h-6'></Icon>
				<span>{error}</span>
			</div>
		{/each}
		{#if form.success && !form.delete}
			<a class='alert alert-success mt-10' href='/post/{form.id}'>
				<Icon icon='ic:sharp-check-circle-outline' class='w-6 h-6'></Icon>
				<span>編集成功。</span>
			</a>
		{/if}
	{/if}
	{#if form && form.success && form.delete}
		<a class='alert alert-success mt-10' href='/post/{form.id}'>
			<Icon icon='ic:sharp-check-circle-outline' class='w-6 h-6'></Icon>
			<span>削除成功。</span>
		</a>
	{:else}
		{#if data.session}
			<h1 class='text-4xl font-bold mt-10'>編集</h1>
			<div class='w-full flex justify-end'>
				<label for='my_modal_7' class='btn'>削除</label>
			</div>
			<input type='checkbox' id='my_modal_7' class='modal-toggle' />
			<div class='modal'>
				<div class='modal-box'>
					<h3 class='text-lg font-bold'>Warning!</h3>
					<p class='py-4'>一度削除すると取り消すことはできません。<br />削除しますか？</p>
					<form method='post' action='?/delete'>
						<button class='btn'>
							削除
						</button>
					</form>
				</div>
				<label class='modal-backdrop' for='my_modal_7'>Close</label>
			</div>
			<form method='post' class='flex flex-col gap-4' action='?/edit' enctype='multipart/form-data'>
				<div class='form-control'>
					<label class='label' for='title'><span class='label-text text-xl'>Title</span></label>
					<input id='title' type='text' name='title' placeholder='Title' class='input input-bordered w-full'
								 value={data.post.title} />
				</div>
				<div class='form-control md:col-span-2'>
					<label for='description' class='label'><span class='label-text'>Description</span></label>
					<textarea id='description' class='textarea textarea-bordered h-24' placeholder='Description'
										name='description'
										value={data.post.description}></textarea>
				</div>
				<div class='form-control'>
					<label class='label' for='thumbnail'><span class='label-text text-xl'>Thumbnail</span></label>
					<label class='label cursor-pointer w-32'>
						<span class='label-text'>DirectURL</span>
						<input type='checkbox' class='toggle' bind:checked={thumbnailDirectURL} name='thumbnailDirectURL' />
					</label>
					{#if thumbnailDirectURL}
						<input id='thumbnail' type='url' name='thumbnail' placeholder='Thumbnail'
									 class='input input-bordered w-full' value={data.post.thumbnail} />
					{:else}
						<input type='file' name='thumbnail' required class='file-input file-input-bordered w-full max-w-xs' />
					{/if}
				</div>
				<div class='form-control'>
					<label class='label' for='file'><span class='label-text text-xl'>File</span></label>
					<label class='label cursor-pointer w-32'>
						<span class='label-text'>DirectURL</span>
						<input type='checkbox' class='toggle' bind:checked={fileDirectURL} name='fileDirectURL' />
					</label>
					{#if fileDirectURL}
						<input id='file' type='text' name='file' placeholder='File' class='input input-bordered w-full' required />
					{:else}
						<input type='file' name='file' class='file-input file-input-bordered w-full max-w-xs' required />
					{/if}
				</div>
				<div class='form-control'>
					<label class='label' for='file'><span class='label-text text-xl'>File</span></label>
					<input id='file' type='url' name='file' placeholder='File' class='input input-bordered w-full'
								 value={data.post.file} />
				</div>
				<div class='form-control md:col-start-2 mt-10'>
					<button type='submit' class='btn btn-primary w-full'>編集</button>
				</div>
			</form>
		{:else}
			<div class='alert alert-error mt-10'>
				<Icon icon='ic:sharp-error-outline' class='w-6 h-6'></Icon>
				<span>ログインしてください。</span>
			</div>
		{/if}
	{/if}
</div>