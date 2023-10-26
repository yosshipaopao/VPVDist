<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	export let form: ActionData;
	let running = false;
	let thumbnailDirectURL = true;
	let fileDirectURL = true;
	let thumbnails: FileList;
	let thumbnailURL: string = data.post.thumbnail;
	let mainFiles: FileList;
	let mainFileURL: string = data.post.file;
	let beforeFile: File;
	let beforeThumbnail: File;

	$: if (thumbnails && thumbnails[0] && thumbnails[0] !== beforeThumbnail) {
		beforeThumbnail = thumbnails[0];
		running = true;
		const resizedCanvas = document.createElement('canvas');
		resizedCanvas.width = 1280;
		resizedCanvas.height = 720;
		const image = new Image();
		const file = thumbnails[0];
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
					const iconFile = new File([blob], 'thumbnail.webp', { type: blob.type });
					console.log('変換完了！');
					const id = 'thumbnail-' + crypto.randomUUID().replaceAll('-', '');
					await fetch('/api/image/' + id, {
						method: 'PUT',
						body: iconFile
					});
					thumbnailURL = new URL('/api/image/' + id, window.location.href).href;
					console.log('アップロード完了！');
					running = false;
					thumbnailDirectURL = false;
				});
		};
	}

	$: if (mainFiles && mainFiles[0] && mainFiles[0] !== beforeFile) {
		beforeFile = mainFiles[0];
		running = true;
		const id = crypto.randomUUID().replaceAll('-', '');
		console.log('changed');
		const xhr = new XMLHttpRequest();
		xhr.addEventListener('readystatechange', (e) => {
			if (xhr.readyState == 4) {
				console.log('uploaded');
				console.log(xhr.status);
				if (200 > xhr.status || xhr.status >= 300) {
					alert('アップロードに失敗しました。');
					return;
				}
				console.log(xhr.responseURL);
				mainFileURL = new URL('/api/file/' + id, window.location.href).href;
				running = false;
				fileDirectURL = false;
			}
		});
		xhr.open('PUT', '/api/file/' + id, true);
		xhr.send(mainFiles[0]);
	}
</script>

<div class="mx-auto md:px-4 w-full max-w-4xl px-2">
	<div class="breadcrumbs">
		<ul>
			<li>
				<a href="/">
					<Icon icon="ic:outline-home" class="inline" />
					Home</a
				>
			</li>
			<li><a href="/post">Post</a></li>
			<li><a href="/post/{data.id}">{data.post.title}</a></li>
			<li class="text-gray-500">Edit</li>
		</ul>
	</div>
	{#if form}
		{#each form.errors ?? [] as error}
			<div class="alert alert-error mt-10">
				<Icon icon="ic:sharp-error-outline" class="w-6 h-6" />
				<span>{error}</span>
			</div>
		{/each}
		{#if form.success && !form.delete}
			<a class="alert alert-success mt-10" href="/post/{form.id}">
				<Icon icon="ic:sharp-check-circle-outline" class="w-6 h-6" />
				<span>編集成功。</span>
			</a>
		{/if}
	{/if}
	{#if form && form.success && form.delete}
		<a class="alert alert-success mt-10" href="/post/{form.id}">
			<Icon icon="ic:sharp-check-circle-outline" class="w-6 h-6" />
			<span>削除成功。</span>
		</a>
	{:else if data.session}
		<h1 class="text-4xl font-bold mt-10">編集</h1>
		<div class="w-full flex justify-end">
			<label for="my_modal_7" class="btn">削除</label>
		</div>
		<input type="checkbox" id="my_modal_7" class="modal-toggle" />
		<div class="modal">
			<div class="modal-box">
				<h3 class="text-lg font-bold">Warning!</h3>
				<p class="py-4">一度削除すると取り消すことはできません。<br />削除しますか？</p>
				<form method="post" action="?/delete">
					<button class="btn"> 削除 </button>
				</form>
			</div>
			<label class="modal-backdrop" for="my_modal_7">Close</label>
		</div>
		<form method="post" class="flex flex-col gap-4" action="?/edit" enctype="multipart/form-data">
			<div class="form-control">
				<label class="label" for="title"><span class="label-text text-xl">Title</span></label>
				<input
					id="title"
					type="text"
					name="title"
					placeholder="Title"
					class="input input-bordered w-full"
					value={data.post.title}
				/>
			</div>
			<div class="form-control md:col-span-2">
				<label for="description" class="label"><span class="label-text">Description</span></label>
				<textarea
					id="description"
					class="textarea textarea-bordered h-24"
					placeholder="Description"
					name="description"
					value={data.post.description}
				/>
			</div>
			<div class="form-control">
				<label class="label" for="thumbnail"
					><span class="label-text text-xl">Thumbnail</span></label
				>
				<label class="label cursor-pointer w-32">
					<span class="label-text">DirectURL</span>
					<input type="checkbox" class="toggle" bind:checked={thumbnailDirectURL} />
				</label>
				{#if !thumbnailDirectURL}
					<input
						type="file"
						class="file-input file-input-bordered w-full max-w-xs"
						bind:files={thumbnails}
					/>
					<input
						id="thumbnail"
						type="hidden"
						name="thumbnail"
						class="input input-bordered w-full"
						bind:value={thumbnailURL}
						required
					/>
				{:else}
					<input
						id="thumbnail"
						type="url"
						name="thumbnail"
						placeholder="Thumbnail"
						class="input input-bordered w-full"
						bind:value={thumbnailURL}
						required
					/>
				{/if}
				<img src={thumbnailURL} alt="preview" class="mt-4" />
			</div>
			<div class="form-control">
				<label class="label" for="file"><span class="label-text text-xl">File</span></label>
				<label class="label cursor-pointer w-32">
					<span class="label-text">DirectURL</span>
					<input type="checkbox" class="toggle" bind:checked={fileDirectURL} />
				</label>
				{#if !fileDirectURL}
					<input
						type="file"
						class="file-input file-input-bordered w-full max-w-xs"
						bind:files={mainFiles}
					/>
					<input
						id="file"
						type="hidden"
						name="file"
						placeholder="File"
						class="input input-bordered w-full"
						bind:value={mainFileURL}
						required
					/>
				{:else}
					<input
						id="file"
						type="url"
						name="file"
						placeholder="File"
						class="input input-bordered w-full"
						bind:value={mainFileURL}
						required
					/>
				{/if}
			</div>
			<div class="form-control md:col-start-2 mt-10">
				<button type="submit" class="btn btn-primary w-full" disabled={running}>編集</button>
			</div>
		</form>
	{:else}
		<div class="alert alert-error mt-10">
			<Icon icon="ic:sharp-error-outline" class="w-6 h-6" />
			<span>ログインしてください。</span>
		</div>
	{/if}
</div>
