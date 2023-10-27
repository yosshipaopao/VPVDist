<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import Base from '$lib/component/Base.svelte';
	import Thumbnail from '$lib/component/Form/Thumbnail.svelte';
	import LabeledInput from '$lib/component/Form/LabeledInput.svelte';
	import File from '$lib/component/Form/File.svelte';
	import FormAlert from '$lib/component/FormAlert.svelte';
	import Form from '$lib/component/Form.svelte';

	export let form: ActionData;
	let running = false;
</script>

<Base breadcrumbs={[['Home'], ['Post'], ['Create']]}>
	<FormAlert bind:form />
	<Form title="Create" bind:disabled={running}>
		<LabeledInput name="title" label="Title" />
		<LabeledInput name="description" label="Description" el="textarea" />
		<Thumbnail name="thumbnail" label="Thumbnail" bind:running />
		<File name="file" label="File" bind:running />
	</Form>
</Base>
