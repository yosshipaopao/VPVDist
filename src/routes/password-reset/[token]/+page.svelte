<script lang="ts">
	import type { ActionData } from './$types';
	import {Base,FormAlert,Form,LabeledInput} from '$lib/component';
	export let form: ActionData;
</script>

<Base breadcrumbs={[['Home'], ['Reset password']]}>
	<Base mini>
		<FormAlert bind:form />
		<Form title="Reset Password">
			<LabeledInput label="Password" type="password" name="password" />
			<LabeledInput label="Confirm Password" type="password" name="confirm-password" />
		</Form>
	</Base>
</Base>
