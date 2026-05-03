/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        '../shared/src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#0A0D0C',
                secondary: '#13171A',
                accent: '#5CF09E',
                textPrimary: '#F4F5F6',
            },
            fontFamily: {
                heading: ['Syne', 'sans-serif'],
                sans: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
