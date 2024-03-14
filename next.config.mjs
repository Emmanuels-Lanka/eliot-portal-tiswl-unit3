// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import withPlugins from 'next-compose-plugins';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const nextConfig = {};

export default withPlugins([
    [
        tailwindcss,
        autoprefixer,
    ],
], nextConfig);