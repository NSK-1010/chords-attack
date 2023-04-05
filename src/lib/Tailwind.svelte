<style global>
    @tailwind utilities;
    @tailwind components;
    @tailwind base;

    :root, html, body {
        @apply font-sans text-center text-base tracking-normal text-neutral-800 bg-white w-full h-full;
    }

    header {
        @apply w-full flex gap-3 px-4 py-3 bg-teal-600 text-white font-medium text-xl;
    }

    main {
        @apply w-11/12 mx-auto py-2;
    }
</style>