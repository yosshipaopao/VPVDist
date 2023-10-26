<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData, PageData } from './$types';
	import Icon from '@iconify/svelte';

	export let form: ActionData;
	export let data: PageData;

	let iconFiles: FileList;
	let iconURL = data.image;

	$: if (iconFiles) {
		const resizedCanvas = document.createElement('canvas');
		resizedCanvas.width = 300;
		resizedCanvas.height = 300;
		const image = new Image();
		const file = iconFiles[0];
		image.src = URL.createObjectURL(file);
		const ctx = resizedCanvas.getContext('2d') as CanvasRenderingContext2D;
		image.onload = async () => {
			const width = image.width;
			const height = image.height;
			const canvasAspect = resizedCanvas.width / resizedCanvas.height;
			let sx = 0;
			let sy = 0;
			if (width / height > canvasAspect) {
				sx = (width - height * canvasAspect) / 2;
			} else {
				sy = (height - width / canvasAspect) / 2;
			}
			ctx.drawImage(
				image,
				sx,
				sy,
				width - sx * 2,
				height - sy * 2,
				0,
				0,
				resizedCanvas.width,
				resizedCanvas.height
			);
			fetch(resizedCanvas.toDataURL('image/webp'))
				.then((r) => r.blob())
				.then(async (blob) => {
					const iconFile = new File([blob], 'icon.webp', { type: blob.type });
					console.log('変換完了！');
					const id = 'icon-' + crypto.randomUUID().replaceAll('-', '');
					await fetch('/api/image/' + id, {
						method: 'PUT',
						body: iconFile
					});
					iconURL = new URL('/api/image/' + id, window.location.href).href;
					console.log('アップロード完了！');
				});
		};
	}
</script>

<div class="mx-auto md:px-4 max-w-4xl px-2">
	<div class="breadcrumbs">
		<ul>
			<li>
				<a href="/">
					<Icon icon="ic:outline-home" class="inline" />
					Home</a
				>
			</li>
			<li>
				<a href="/setting">
					<Icon icon="ic:outline-settings" class="inline" />
					Setting</a
				>
			</li>
			<li class="text-gray-500">User</li>
		</ul>
	</div>
	{#if form?.success}
		<div class="alert alert-info max-w-sm mx-auto mt-4">
			<p class="text-center">
				<Icon icon="ic:outline-check-circle" class="inline-block mr-2" />
				Succeed
			</p>
		</div>
	{/if}
	{#if form?.message}
		<div class="alert alert-error max-w-sm mx-auto mt-4">
			<p class="text-center">{form.message}</p>
		</div>
	{/if}

	<div class="mx-auto md:px-4 max-w-2xl">
		<h1 class="text-4xl font-bold text-center my-8">User Setting</h1>
		<form method="post" class="w-full flex flex-col gap-4" use:enhance>
			<div class="form-control w-full">
				<label class="label" for="userId">
					<span class="label-text">userId</span>
				</label>
				<input
					type="text"
					id="userId"
					placeholder="Type here"
					class="input input-bordered w-full max-w-full"
					name="userId"
					value={data.userId}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="username">
					<span class="label-text">username</span>
				</label>
				<input
					type="text"
					id="username"
					placeholder="Type here"
					class="input input-bordered w-full max-w-full"
					name="username"
					value={data.name}
				/>
			</div>
			<div class="form-control w-full md:col-span-2">
				<label class="label" for="name-input">
					<span class="label-text">Icon</span>
				</label>
				<div class="flex gap-4">
					<figure><img src={iconURL} alt="icon" class="w-32 h-32 mx-auto object-cover" /></figure>
					<input
						type="file"
						class="file-input file-input-bordered w-full max-w-xs"
						bind:files={iconFiles}
					/>
				</div>
			</div>
			<input type="hidden" name="image" value={iconURL} />

			<button type="submit" class="btn btn-primary">Submit</button>
		</form>
	</div>
</div>
