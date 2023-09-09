/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},
	daisyui: {
		themes: [
			'light',
			{
				miku: {
					primary: '#65a44d',
					secondary: '#1d232a',
					accent: '#e12885',
					neutral: '#4b5563',
					'base-100': '#39C5BB',
					info: '#86cecb',
					success: '#60a5fa',
					warning: '#FFFF99',
					error: '#fb7185'
				}
			},
			'night',
			'dark',
			'cupcake',
			'bumblebee',
			'emerald',
			'corporate',
			'synthwave',
			'retro',
			'cyberpunk',
			'valentine',
			'halloween',
			'garden',
			'forest',
			'aqua',
			'lofi',
			'pastel',
			'fantasy',
			'wireframe',
			'black',
			'luxury',
			'dracula',
			'cmyk',
			'autumn',
			'business',
			'acid',
			'lemonade',
			'coffee',
			'winter'
		],
		darkTheme: false
	},

	plugins: [require('daisyui')]
};

module.exports = config;
