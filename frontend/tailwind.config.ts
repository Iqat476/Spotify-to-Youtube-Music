import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: { light: "#37d166", dark: "#2cbd58" },
				secondary: { light: "#df3053", dark: "#bd2946" },
				light: "#fafdf9",
				dark: "#1c1d1c",
			},
		},
	},
	darkMode: "class",
	plugins: [],
} satisfies Config;
