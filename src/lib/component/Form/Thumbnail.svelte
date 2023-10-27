<script lang="ts">
	import { PUBLIC_HOST } from '$env/static/public';

	export let label: string,
		value: string | null = null,
		name: string,
		id: string = name,
		required = false,
		running: boolean;

	let directURL = !!value;
	let files: FileList;
	let beforeFile: File;

	$: if (files && files[0] && files[0] !== beforeFile) {
		beforeFile = files[0];
		running = true;
		const resizedCanvas = document.createElement('canvas');
		resizedCanvas.width = 1280;
		resizedCanvas.height = 720;
		const image = new Image();
		const file = files[0];
		image.src = URL.createObjectURL(file);
		const ctx = resizedCanvas.getContext('2d') as CanvasRenderingContext2D;
		image.onload = async () => {
			const width = image.width;
			const height = image.height;
			const canvasAspect = resizedCanvas.width / resizedCanvas.height;
			let sx = 0;
			let sy = 0;
			if (width / height > canvasAspect) sx = (width - height * canvasAspect) / 2;
			else sy = (height - width / canvasAspect) / 2;
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
					value = `${PUBLIC_HOST}/api/image/${id}`;
					console.log('アップロード完了！');
					running = false;
					directURL = false;
				});
		};
	}
</script>

<div class="form-control">
	<label class="label" for={id}><span class="label-text text-xl">{label}</span></label>
	<label class="label cursor-pointer w-32">
		<span class="label-text">DirectURL</span>
		<input type="checkbox" class="toggle" bind:checked={directURL} />
	</label>
	{#if !directURL}
		<input type="file" class="file-input file-input-bordered w-full" bind:files />
		<input {id} type="hidden" {name} bind:value {required} />
	{:else}
		<input
			{id}
			type="url"
			name="thumbnail"
			placeholder="Thumbnail"
			class="input input-bordered w-full"
			bind:value
			{required}
		/>
	{/if}
	<div class="card w-full bg-base-200 shadow-xl my-5">
		<div class="card-body items-center text-center">
			<h2 class="card-title">Preview</h2>
			{#if !running}
				<img src={value} alt="preview" class="mt-4" />
			{:else}
				<div class="w-full h-64 bg-base-300 flex items-center justify-center">
					<span class="loading loading-spinner loading-lg" />
				</div>
			{/if}
		</div>
	</div>
</div>
