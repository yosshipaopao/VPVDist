<script lang='ts'>
	import type { ActionData } from './$types';
	import Base from '$lib/component/Base.svelte';
	import FormAlert from '$lib/component/FormAlert.svelte';
	import Form from '$lib/component/Form.svelte';

	export let form: ActionData;
</script>
<Base breadcrumbs={["Home", "Email Verification"]}>
	<Base mini>
		<h1 class='text-4xl font-bold text-center my-8'>Email verification</h1>
		<p class='text-xl font-bold text-center my-8'>
			Your email verification link was sent to your inbox.
		</p>
		<br />
		<FormAlert bind:form />
		<Form title='Resend verification link' submitText='ReSend'>
		</Form>
	</Base>
</Base>