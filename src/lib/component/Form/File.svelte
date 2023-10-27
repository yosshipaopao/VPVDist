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
		const id = crypto.randomUUID().replaceAll('-', '');
		console.log('changed');
		const xhr = new XMLHttpRequest();
		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState == 4) {
				console.log('uploaded');
				console.log(xhr.status);
				if (200 > xhr.status || xhr.status >= 300) {
					alert('アップロードに失敗しました。');
					return;
				}
				console.log(xhr.responseURL);
				value = `${PUBLIC_HOST}/api/file/${id}`;
				running = false;
				directURL = false;
			}
		});
		xhr.open('PUT', '/api/file/' + id, true);
		xhr.send(files[0]);
	}
</script>

<div class="form-control">
	<label class="label" for={id}><span class="label-text text-xl">{label}</span></label>
	<label class="label cursor-pointer w-32">
		<span class="label-text">DirectURL</span>
		<input type="checkbox" class="toggle" bind:checked={directURL} />
	</label>
	{#if running}
		<span class="loading loading-spinner loading-lg" />
	{/if}

	{#if !directURL}
		<input type="file" class="file-input file-input-bordered w-full max-w-xs" bind:files />
		<input {id} type="hidden" {name} bind:value {required} />
	{:else}
		<input
			{id}
			type="url"
			{name}
			placeholder="Type direct URL"
			class="input input-bordered w-full"
			bind:value
			{required}
		/>
	{/if}
</div>
