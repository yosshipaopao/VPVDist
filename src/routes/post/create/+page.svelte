<script lang='ts'>
	import type { PageData, ActionData } from './$types';
	import Icon from '@iconify/svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	export let data: PageData;
	export let form: ActionData;
	let thumbnailDirectURL = true;
	let fileDirectURL = true;
	let thumbnails: FileList;
	let mainFiles: FileList;

	$:if(thumbnails){
		console.log("changed");
	}

	$:if(mainFiles){
		const id= crypto.randomUUID().replaceAll('-', '');
		console.log("changed");
		const xhr = new XMLHttpRequest();
		xhr.addEventListener('progress', e => {
			console.log(e);
		});
		xhr.upload.addEventListener('loadend', (e) => {
			console.log(e);
		});
		xhr.addEventListener('readystatechange', (e) => {
			if (xhr.readyState == 4) {
				console.log(xhr.response);
			}
		});
		xhr.open('POST', '/api/file/'+id);
		const formData = new FormData();
		formData.append('file', mainFiles[0]);
		console.log(mainFiles[0]);
		xhr.send(formData);
	};
</script>
<div class='mx-auto md:px-4 w-full max-w-4xl px-2'>
	<div class='breadcrumbs'>
		<ul>
			<li><a href='/'>
				<Icon icon='ic:outline-home' class='inline' />
				Home</a></li>
			<li><a href='/post'>Post</a></li>
			<li class='text-gray-500'>Create</li>
		</ul>
	</div>
	{#if form}
		{#each form.errors ?? [] as error}
			<div class='alert alert-error mt-10'>
				<Icon icon='ic:sharp-error-outline' class='w-6 h-6'></Icon>
				<span>{error}</span>
			</div>
		{/each}
		{#if form.success}
			<a class='alert alert-success mt-10' href='/post/{form.id}'>
				<Icon icon='ic:sharp-check-circle-outline' class='w-6 h-6'></Icon>
				<span>投稿しました。</span>
			</a>
		{/if}
	{/if}
	{#if data.session}
		<h1 class='text-4xl font-bold mt-10'>PFを投稿する</h1>
		<form method='post' class='flex flex-col gap-4' enctype='multipart/form-data'>
			<div class='form-control'>
				<label class='label' for='title'><span class='label-text text-xl'>Title</span></label>
				<input id='title' type='text' name='title' placeholder='Title' class='input input-bordered w-full' />
			</div>
			<div class='form-control md:col-span-2'>
				<label for='description' class='label'><span class='label-text'>Description</span></label>
				<textarea id='description' class='textarea textarea-bordered h-24' placeholder='Description'
									name='description'></textarea>
			</div>
			<div class='form-control'>
				<label class='label' for='thumbnail'><span class='label-text text-xl'>Thumbnail</span></label>
				<label class='label cursor-pointer w-32'>
					<span class='label-text'>DirectURL</span>
					<input type='checkbox' class='toggle' bind:checked={thumbnailDirectURL} name='thumbnailDirectURL' />
				</label>
				{#if thumbnailDirectURL}
					<input id='thumbnail' type='text' name='thumbnail' placeholder='Thumbnail'
								 class='input input-bordered w-full' />
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
			<div class='form-control md:col-start-2 mt-10'>
				<button type='submit' class='btn btn-primary w-full'>投稿</button>
			</div>
		</form>

		<input type='file' name='file' class='file-input file-input-bordered w-full max-w-xs' required
					 bind:files={mainFiles} />
	{:else }
		<div class='alert alert-error mt-10'>
			<Icon icon='ic:sharp-error-outline' class='w-6 h-6'></Icon>
			<span>ログインしてください。</span>
		</div>
	{/if}
</div>