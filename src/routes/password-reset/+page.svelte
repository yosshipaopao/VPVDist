<script lang="ts">
	import type { ActionData } from './$types';
	import {Base,FormAlert,Form,LabeledInput} from '$lib/component';

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
