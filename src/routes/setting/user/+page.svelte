<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import {Base,Form,FormAlert,LabeledInput} from '$lib/component';

	export let form: ActionData;
	export let data: PageData;

	let iconFiles: FileList;
	let iconURL = data.image;

	$: if (iconFiles) {
		const resizedCanvas = document.createElement('canvas');
		resizedCanvas.width = 300;
		resizedCanvas.height = 300;
		const image = new Image();
		image.src = URL.createObjectURL(iconFiles[0]);
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

<Base breadcrumbs={[['Home'], ['Setting'], ['user']]}>
	<Base mini>
		<FormAlert bind:form />
		<Form title="User Setting">
			<LabeledInput label="userId" name="userId" value={data.userId} />
			<LabeledInput label="username" name="username" value={data.name} />
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
		</Form>
	</Base>
</Base>
