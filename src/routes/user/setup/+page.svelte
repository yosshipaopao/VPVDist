<script lang='ts'>
	import type { PageData, ActionData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	export let form: ActionData;

	let inputs = {
		uid: form?.uid ?? data.session?.user?.id ?? '',
		name: form?.name ?? data.session?.user?.name ?? ''
	};
	let iconSrc = data.session?.user?.image ?? '/noImage.jpg';
	let iconFile: File;

	async function onChangeHandler(e: Event) {
		const resizedCanvas = document.createElement('canvas');
		resizedCanvas.height = 300;
		resizedCanvas.width = 300;
		const image = new Image();
		const file = (e.target?.files as FileList)[0];
		image.src = URL.createObjectURL(file);
		const ctx = resizedCanvas.getContext('2d') as CanvasRenderingContext2D;
		image.onload = async () => {
			const width = image.width;
			const height = image.height;
			const minSize = Math.min(width, height);
			ctx.drawImage(image, (width - minSize) / 2, (height - minSize) / 2, minSize, minSize, 0, 0, 300, 300);
			iconSrc = URL.createObjectURL(await fetch(resizedCanvas.toDataURL('image/webp')).then(r => r.blob()).then(blob => {
				iconFile = new File([blob], 'icon.webp', { type: blob.type });
				return blob;
			}));
		};
	}

	const Submit = (e) => {
		const icon = document.createElement('input');
		icon.type = 'file';
		icon.name = 'icon';
		const dt = new DataTransfer();
		dt.items.add(iconFile);
		icon.files = dt.files;
		e.target.appendChild(icon);
	};
</script>

<div class='mx-auto md:px-4 max-w-2xl'>
	<div class='breadcrumbs'>
		<ul>
			<li><a href='/'>
				<Icon icon='ic:outline-home' class='inline' />
				Home</a></li>
			<li><a href='/user'>
				<Icon icon='mdi:user' class='inline' />
				User</a></li>
			<li class='text-gray-500'>Setup</li>
		</ul>
	</div>
	{#if data.session && data.session.user}
		{#if form?.success}
			<div class='alert alert-info max-w-sm mx-auto mt-4'>
				<p class='text-center'>
					<Icon icon='ic:outline-check-circle' class='inline-block mr-2' />
					Succeed
				</p>
			</div>
		{/if}
		{#if form?.error}
			<div class='alert alert-error max-w-sm mx-auto mt-4'>
				<p class='text-center'>{form.error}</p>
			</div>
		{/if}
		<div class='alert alert-info max-w-sm mx-auto mt-4'>
			<p class='text-center'>You are logged in as {data.session.user.name}</p>
		</div>
		<h1 class='text-4xl font-bold text-center my-8'>User Config</h1>
		<form method='post' class='w-full flex flex-col gap-4' on:submit={Submit}
					enctype='multipart/form-data'>
			<div class='form-control w-full'>
				<label class='label' for='uid-input'>
					<span class='label-text'>UID</span>
				</label>
				<input type='text' id='uid-input' placeholder='Type here' class='input input-bordered w-full max-w-full'
							 name='uid'
							 bind:value={inputs.uid} required />
			</div>
			<div class='form-control w-full'>
				<label class='label' for='name-input'>
					<span class='label-text'>Name</span>
				</label>
				<input type='text' id='name-input' placeholder='Type here' class='input input-bordered w-full max-w-full'
							 name='name'
							 bind:value={inputs.name} />
			</div>
			<div class='form-control w-full md:col-span-2'>
				<label class='label' for='name-input'>
					<span class='label-text'>Icon</span>
				</label>
				<div class='flex gap-4'>
					<figure><img src={iconSrc} alt='icon' class='w-32 h-32 mx-auto object-cover' /></figure>
					<input type='file' class='file-input file-input-bordered w-full max-w-xs' on:change={onChangeHandler} />
				</div>
			</div>
			<div class='w-full md:col-start-2 flex items-end'>
				<button type='submit' class='btn btn-primary w-full'>Save</button>
			</div>
		</form>
	{:else}
		<p class='text-center'>You are not logged in</p>
	{/if}
</div>