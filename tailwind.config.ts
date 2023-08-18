import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        // "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            zIndex: {
                "60": "60",
                "70": "70",
                "80": "80",
                "90": "90",
                "100": "100",
                "110": "110",
                "9999": "9999",
            },
        },
    },
    plugins: [],
};
export default config
