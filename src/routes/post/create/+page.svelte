<script lang="ts">
	import type { ActionData } from './$types';
	import { Base, Thumbnail, LabeledInput, File, FormAlert, Form } from '$lib/component';

	export let form: ActionData;
	let running = false;
</script>

<Base breadcrumbs={[['Home'], ['Post'], ['Create']]}>
	<FormAlert bind:form />
	<Form title="Create" bind:disabled={running}>
		<noscript>
			<div class="alert alert-error max-w-sm mx-auto mt-4">
				<p class="text-center">Please enable JavaScript to use this page.</p>
			</div>
		</noscript>
		<LabeledInput name="title" label="Title" />
		<LabeledInput name="description" label="Description" el="textarea" />
		<Thumbnail name="thumbnail" label="Thumbnail" bind:running />
		<File name="file" label="File" bind:running />
	</Form>
</Base>
