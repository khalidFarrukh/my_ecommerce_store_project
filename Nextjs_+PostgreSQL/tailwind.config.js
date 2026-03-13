/** @type {import('tailwindcss').Config} */

import scrollbarHide from 'tailwind-scrollbar-hide'

export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}", // App Router
        "./pages/**/*.{js,ts,jsx,tsx}", // Pages Router
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        scrollbarHide,
    ],
};