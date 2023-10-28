<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import {Base,FormAlert,Form,LabeledInput,Thumbnail,File} from '$lib/component';

	export let data: PageData;
	export let form: ActionData;
	let running = false;
</script>

<Base breadcrumbs={[['Home'], ['Post'], [data.post.title, `/post/${data.id}`], ['Edit']]}>
	<FormAlert bind:form />
	<Form title="Edit" action="?/edit" submitText="Save" bind:disabled={running} useEnhance={false}>
		<div class="w-full flex justify-end">
			<label for="delete" class="btn">削除</label>
		</div>
		<LabeledInput name="title" label="Title" bind:value={data.post.title} />
		<LabeledInput
			name="description"
			label="Description"
			value={data.post.description}
			el="textarea"
		/>
		<Thumbnail name="thumbnail" label="Thumbnail" bind:value={data.post.thumbnail} bind:running />
		<File name="file" label="File" bind:value={data.post.file} bind:running />
	</Form>
</Base>
<input type="checkbox" id="delete" class="modal-toggle" />
<div class="modal">
	<div class="modal-box">
		<Form title="Warning!" action="?/delete" submitText="OK">
			<p class="py-4">一度削除すると取り消すことはできません。<br />削除しますか？</p>
			<label for="delete" class="btn btn-secondary">Cancel</label>
		</Form>
	</div>
	<label class="modal-backdrop" for="delete">Close</label>
</div>
