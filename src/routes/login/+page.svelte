<script lang="ts">
    import {signIn, signOut} from "@auth/sveltekit/client"
    import {page} from "$app/stores"
    import type {ModalSettings, ModalComponent} from "@skeletonlabs/skeleton";
    import {modalStore} from "@skeletonlabs/skeleton";
    import LoginModal from "$lib/components/LoginModal.svelte";

    const showModal = () => {
        const c: ModalComponent = {ref: LoginModal};
        const modal: ModalSettings = {
            type: 'component',
            component: c,
            title: 'Custom Form Component',
            body: 'Complete the form below and then press submit.',
            response: (r: any) => console.log('response:', r)
        };
        modalStore.trigger(modal);
    }
</script>

<h1>SvelteKit Auth Example</h1>
<p>
    {#if $page.data.session}
        {#if $page.data.session.user?.image}
            <span>{$page.data.session.user.image}</span>
        {/if}
        <span class="signedInText">
      <small>Signed in as</small><br/>
      <strong>{$page.data.session.user?.name ?? "User"}</strong>
    </span>
        <button on:click={() => signOut()} class="button">Sign out</button>
    {:else}
        <span class="notSignedInText">You are not signed in</span>
        <button on:click={() => signIn("credentials",{username:"admin",password:"admin"})}>Sign In with credentials
        </button>
    {/if}
    <button on:click={showModal}>modal</button>
</p>