<script lang="ts">
    // Your selected Skeleton theme:
    import '@skeletonlabs/skeleton/themes/theme-modern.css';
    // This contains the bulk of Skeletons required styles:
    import '@skeletonlabs/skeleton/styles/skeleton.css';
    // Finally, your application's global stylesheet (sometimes labeled 'app.css')
    import '../app.postcss';
    import '../glocal.css'

    import {
        AppShell,
        AppBar,
        AppRail,
        AppRailTile,
        AppRailAnchor,
        LightSwitch,
        popup,
        Avatar
    } from '@skeletonlabs/skeleton';
    import type {PopupSettings} from '@skeletonlabs/skeleton';
    import {computePosition, autoUpdate, offset, shift, flip, arrow} from '@floating-ui/dom';
    import Icon from '@iconify/svelte';
    import {slide} from 'svelte/transition';

    import {storePopup} from '@skeletonlabs/skeleton';
    import {page} from "$app/stores";

      import { signOut } from "@auth/sveltekit/client"

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});
    let currentTile: number = 0;
    let sidebar: boolean = true;
    const toggleSidebar = () => sidebar = !sidebar;

    const popupUser: PopupSettings = {
        event: 'click',
        target: 'popupUser'
    };
</script>

<AppShell>
    <svelte:fragment slot="header">
        <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
            <svelte:fragment slot="lead">
                <button type="button" class="btn-icon btn-icon-sm bg-initial ml-2" on:click={toggleSidebar}>
                    <Icon icon="gg:menu" style="font-size: 32px;"/>
                </button>
            </svelte:fragment>
            (title)
            <svelte:fragment slot="trail">
                <LightSwitch/>
                <button type="button" class="btn-icon bg-initial mr-2" use:popup={popupUser}>
                    <Icon icon="icon-park-solid:people" style="font-size: 32px;" class="mx-2"/>
                </button>
                <div class="card p-4 w-72 shadow-xl flex flex-col" data-popup="popupUser">
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
        {#if sidebar}
            <div style="height: 100%" transition:slide={{axis: 'x'}}>
                <AppRail>
                    <svelte:fragment slot="lead">
                        <AppRailAnchor href="/">(icon)</AppRailAnchor>
                    </svelte:fragment>
                    <AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
                        <svelte:fragment slot="lead">(icon)</svelte:fragment>
                        <span>Tile 1</span>
                    </AppRailTile>
                    <AppRailTile bind:group={currentTile} name="tile-2" value={1} title="tile-2">
                        <svelte:fragment slot="lead">(icon)</svelte:fragment>
                        <span>Tile 2</span>
                    </AppRailTile>
                    <AppRailTile bind:group={currentTile} name="tile-3" value={2} title="tile-3">
                        <svelte:fragment slot="lead">(icon)</svelte:fragment>
                        <span>Tile 3</span>
                    </AppRailTile>
                    <svelte:fragment slot="trail">
                        <AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
                    </svelte:fragment>
                </AppRail>
            </div>
        {/if}
    </svelte:fragment>
    <slot/>
    <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
</AppShell>
