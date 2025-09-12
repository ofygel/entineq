/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
'./app/**/*.{ts,tsx}',
'./components/**/*.{ts,tsx}',
],
theme: {
extend: {
colors: {
grayGlass: 'rgba(30,30,35,0.55)',
grayGlassStrong: 'rgba(30,30,35,0.75)',
accent: '#E7A6C9',
accent2: '#9EC5FF',
},
boxShadow: {
glass: '0 10px 30px rgba(0,0,0,0.25)',
},
screens: { xs: '360px' },
},
},
plugins: [],
};
