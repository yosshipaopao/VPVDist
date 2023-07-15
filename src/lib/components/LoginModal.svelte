<script lang="ts">
    // Props
    /** Exposes parent props to this component. */
    export let parent: any;

    // Stores
    import {modalStore} from '@skeletonlabs/skeleton';

    // Form Data
    const formData = {
        uid: "",
        password: ""
    };

    // We've created a custom submit function to pass the response and close the modal.
    function onFormSubmit(): void {
        if ($modalStore[0].response) $modalStore[0].response(formData);
        modalStore.close();
    }
</script>

{#if $modalStore[0]}
    <div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
        <header class="text-2xl font-bold">{$modalStore[0].title ?? '(title missing)'}</header>
        <article>{$modalStore[0].body ?? '(body missing)'}</article>
        <!-- Enable for debugging: -->
        <form class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token">
            <label class="label">
                <span>Email</span>
                <input class="input" type="text" bind:value={formData.uid} placeholder="Enter uid or email address..."/>
            </label>
            <label class="label">
                <span>Name</span>
                <input class="input" type="password" bind:value={formData.password} placeholder="Enter Password..."/>
            </label>
        </form>
        <!-- prettier-ignore -->
        <footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
            <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
        </footer>
    </div>
{/if}