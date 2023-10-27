<script lang="ts">
	import type { ActionData } from './$types';
	import Base from '$lib/component/Base.svelte';
	import FormAlert from '$lib/component/FormAlert.svelte';
	import Form from '$lib/component/Form.svelte';
	import LabeledInput from '$lib/component/Form/LabeledInput.svelte';

	export let form: ActionData;
</script>

<Base breadcrumbs={[['Home'], ['Reset password']]}>
	<Base mini>
		<FormAlert bind:form />
		<Form title="Reset password" footers={[{ href: '/signin', text: 'SignIn' }]}>
			<LabeledInput name="email" label="Email" type="email" />
		</Form>
	</Base>
</Base>
