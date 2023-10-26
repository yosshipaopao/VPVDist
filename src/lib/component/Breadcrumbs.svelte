<script context='module' lang='ts'>
	export type BreadcrumbProps = {
		name: string;
		href?: string;
		icon?: string;
	};
	export type BreadcrumbsProps = BreadcrumbProps[];

	const definedBreadcrumbs: { [key: string]: BreadcrumbProps } = {
		'Home': {
			name: 'Home',
			href: '/',
			icon: 'ic:outline-home'
		},
		"User":{
			name: 'User',
			href: '/user',
			icon: 'ic:outline-person'
		},
		"Post":{
			name: 'Post',
			href: '/post'
		},
		"Setting":{
			name: 'Setting',
			href: '/setting',
			icon: 'ic:outline-settings'
		},
	};
	export const BreadcrumbsMixin = (BreadcrumbsStrings: string[]):BreadcrumbsProps => BreadcrumbsStrings.map((i: string) =>  definedBreadcrumbs[i]??{name: i});
</script>

<script lang='ts'>
	import Icon from '@iconify/svelte';

	export let breadcrumbs: string[];
	const BreadCrumbs = BreadcrumbsMixin(breadcrumbs);
</script>

<div class='breadcrumbs'>
	<ul>
		{#each BreadCrumbs as breadcrumb}
			<li>
				{#if breadcrumb.href}
					<a href={breadcrumb.href}>
						{#if breadcrumb.icon}
							<Icon icon={breadcrumb.icon} class='inline' />
						{/if}
						{breadcrumb.name}
					</a>
				{:else}
					<li class='text-gray-500'>{breadcrumb.name}</li>
				{/if}
			</li>
		{/each}
	</ul>
</div>