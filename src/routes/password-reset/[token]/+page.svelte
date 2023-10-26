<script lang="ts">
	import type { ActionData } from './$types';
	import Base from '$lib/component/Base.svelte';
	import FormAlert from '$lib/component/FormAlert.svelte';
	import Form from '$lib/component/Form.svelte';
	import LabeledInput from '$lib/component/Form/LabeledInput.svelte';
	export let form: ActionData;
</script>
<Base breadcrumbs={["Home", "Reset password"]}>
	<Base mini>
		<FormAlert bind:form />
		<Form title='Reset Password'>
			<LabeledInput label='Password' type='password' name='password' />
			<LabeledInput label='Confirm Password' type='password' name='confirm-password' />
		</Form>
	</Base>
</Base>
