<script lang="ts">
	import type { ActionData } from './$types';
	import LabeledInput from '$lib/component/Form/LabeledInput.svelte';
	import Form from '$lib/component/Form.svelte';
	import FormAlert from '$lib/component/FormAlert.svelte';
	import Base from '$lib/component/Base.svelte';

	export let form: ActionData;
</script>

<Base breadcrumbs={[['Home'], ['SignIn']]}>
	<Base mini>
		<FormAlert bind:form />
		<Form
			title="SignIn"
			footers={[
				{ href: '/signup', text: 'Create an account' },
				{ href: '/password-reset', text: 'Reset Password' }
			]}
			footerJustify="between"
		>
			<LabeledInput name="userId" label="userId or email" />
			<LabeledInput name="password" label="Password" type="password" />
		</Form>
	</Base>
</Base>
