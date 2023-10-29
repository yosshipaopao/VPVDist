<script lang="ts">
	import type { ActionData } from './$types';
	import { LabeledInput, Form, FormAlert, Base } from '$lib/component';

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
