<script context="module" lang="ts">
	export type BreadcrumbProps = {
		name: string;
		href?: string;
		icon?: string;
	};
	export type BreadcrumbsProps = BreadcrumbProps[];

	const definedBreadcrumbs: { [key: string]: { name?: string; icon?: string; href?: string } } = {
		Home: {
			icon: 'ic:outline-home',
			href: '/'
		},
		User: {
			icon: 'ic:outline-person',
			href: '/user'
		},
		Post: {
			href: '/post'
		},
		Setting: {
			icon: 'ic:outline-settings',
			href: '/setting'
		}
	};
	export const BreadcrumbsMixin = (BreadcrumbsStrings: string[][]): BreadcrumbsProps =>
		BreadcrumbsStrings.map((i: string[]) => ({
			name: i[0],
			href: i[1],
			...definedBreadcrumbs[i[0]]
		}));
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';

	export let breadcrumbs: string[][];
	const BreadCrumbs = BreadcrumbsMixin(breadcrumbs);
</script>

<div class="breadcrumbs">
	<ul>
		{#each BreadCrumbs as breadcrumb}
			<li>
				{#if breadcrumb.href}
					<a href={breadcrumb.href}>
						{#if breadcrumb.icon}
							<Icon icon={breadcrumb.icon} class="inline" />
						{/if}
						{breadcrumb.name}
					</a>
				{:else}
					<li class="text-gray-500">{breadcrumb.name}</li>
				{/if}
			</li>
		{/each}
	</ul>
</div>
