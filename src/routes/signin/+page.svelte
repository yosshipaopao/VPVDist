<script lang='ts'>
	import { signIn,signOut } from '@auth/sveltekit/client';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
</script>
<div class='hero min-h-screen -mt-24'>
	<div class='hero-content text-center'>
		<div class='max-w-md'>
			{#if $page.data.session?.user}
				<h1 class='mb-5 text-2xl font-bold'>
					Welcome {$page.data.session.user.name}
				</h1>
				<button class='btn btn-primary btn-block' on:click={signOut}>
					SignOut
				</button>
			{:else}
				<h1 class='mb-5 text-2xl font-bold'>
					Select a provider to sign in
				</h1>
				<button class='btn btn-primary btn-block' on:click={()=>signIn("google")}>
					<Icon icon='bxl:google' inline={true} />
					SignIn with Google
				</button>
			{/if}
		</div>
	</div>
</div>