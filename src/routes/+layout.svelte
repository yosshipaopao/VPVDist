<script lang="ts">
    import '@skeletonlabs/skeleton/themes/theme-modern.css';
    import '@skeletonlabs/skeleton/styles/skeleton.css';
    import '../app.postcss';
    import '../glocal.css'

    import {
        AppShell,
        AppBar,
        AppRail,
        AppRailAnchor,
        LightSwitch,
        popup,
        Avatar,
        Modal
    } from '@skeletonlabs/skeleton';
    import type {PopupSettings,ModalComponent} from '@skeletonlabs/skeleton';
    import {computePosition, autoUpdate, offset, shift, flip, arrow} from '@floating-ui/dom';
    import Icon from '@iconify/svelte';
    import {slide} from 'svelte/transition';

    import {storePopup} from '@skeletonlabs/skeleton';
    import {page} from "$app/stores";

    import {signOut} from "@auth/sveltekit/client"

    import LoginModal from "$lib/components/LoginModal.svelte";

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});
    let currentTile: number = 0;
    let sidebar: boolean = false;
    let sidebarDetail: boolean = false;
    const toggleSidebar = () => {
        if (sidebar) {
            sidebarDetail = false;
            sidebar = false;
        } else {
            sidebar = true;
        }
    }
    const modalComponentRegistry: Record<string, ModalComponent> = {
		loginModal: { ref: LoginModal },
	};


    const popupUser: PopupSettings = {
        event: 'click',
        target: 'popupUser'
    };
</script>

<Modal components={modalComponentRegistry}/>
<AppShell>
    <svelte:fragment slot="header">
        <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end"
                class="bg-surface-100-800-token">
            <svelte:fragment slot="lead">
                <button type="button" class="btn-icon btn-icon-sm bg-initial ml-2" on:click={toggleSidebar}>
                    <Icon icon="gg:menu" style="font-size: 32px;"/>
                </button>
            </svelte:fragment>
            (title)
            <svelte:fragment slot="trail">
                <LightSwitch/>
                <button class="btn-icon     hover:variant-soft-primary mr-2" use:popup={popupUser}>
                    <Icon icon="icon-park-solid:people" style="font-size: 32px;" class="mx-2"/>
                </button>
                <div class="card p-4 w-72 shadow-xl flex flex-col" style="opacity:0" data-popup="popupUser">
                    {#if $page.data.session}
                        <div class="flex justify-center">
                            {#if $page.data.session.user.image}
                                <Avatar src={$page.data.session.user.image}
                                        width="w-16" rounded="rounded-full"/>
                            {:else }
                                <Avatar initials="D" width="w-16" rounded="rounded-full"/>
                            {/if}
                        </div>
                        <div>
                            <h3 class="text-center text-2xl font-bold mt-2">
                                {$page.data.session.user.name}
                            </h3>
                            <p class="text-center text-sm text-gray-500">
                                {$page.data.session.user.email}
                            </p>
                        </div>
                        <div class="flex justify-center mt-4">
                            <button type="button" class="btn btn-primary" on:click={signOut}>
                                Sign Out
                            </button>
                        </div>
                    {:else }
                    {/if}
                </div>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <svelte:fragment slot="sidebarLeft">
        <div class="flex bg-surface-50-900-token" style="height: 100%">
            {#if sidebar}
                <div style="height: 100%" transition:slide={{axis: 'x'}}>
                    <AppRail background="bg-transparent" border="border-r">
                        <AppRailAnchor on:click={()=>sidebarDetail=false}>
                            <svelte:fragment slot="lead">(icon)</svelte:fragment>
                            <span>Tile 1</span>
                        </AppRailAnchor>
                        <AppRailAnchor on:click={()=>sidebarDetail=true}>
                            <svelte:fragment slot="lead">(icon)</svelte:fragment>
                            <span>Tile 2</span>
                        </AppRailAnchor>
                        <AppRailAnchor on:click={()=>sidebarDetail=true}>(icon)</AppRailAnchor>
                        <svelte:fragment slot="trail">
                            <AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
                        </svelte:fragment>
                    </AppRail>
                </div>
            {/if}
            {#if sidebarDetail}
                <section class="p-4 pb-20 space-y-4 overflow-y-auto border-r" transition:slide={{axis:'x'}}>
                    <p class="font-bold pl-4 text-2xl">title</p>
                    <nav class="list-nav">
                        <ul>
                            <li>
                                <a data-sveltekit-preload-data="hover">
                                    <span class="flex-auto">label</span>
                                    <span class="badge variant-filled-secondary">badge</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </section>
            {/if}
        </div>
    </svelte:fragment>
    <slot/>
    <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
</AppShell>
