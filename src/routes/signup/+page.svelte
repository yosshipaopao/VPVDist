<script lang='ts'>

	import type { ActionData } from './$types';
	import FormAlert from '$lib/component/FormAlert.svelte';
	import Base from '$lib/component/Base.svelte';
	import Form from '$lib/component/Form.svelte';
	import LabeledInput from '$lib/component/Form/LabeledInput.svelte';

	export let form: ActionData;
</script>
<Base breadcrumbs={["Home", "SignUp"]}>
	<Base mini>
		<FormAlert bind:form />
		<Form title='SignUp' footers={[{href:"/signin",text:"SignIn"}]}>
			<LabeledInput name='email' label='Email' type='email' />
			<LabeledInput name='password' label='Password' type='password' />
			<LabeledInput name='confirm-password' label='Confirm Password' type='password' />
		</Form>
	</Base>
</Base>
