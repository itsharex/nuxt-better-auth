<template>
  <div class="min-h-screen w-full dark:bg-black bg-white relative flex justify-center">
    <!-- Grid background -->
    <div class="absolute inset-0 bg-grid-small text-black/5 dark:text-white/5 pointer-events-none" />
    <div class="absolute pointer-events-none inset-0 items-center justify-center bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_40%,white)] dark:[mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]" />

    <!-- Header -->
    <div class="bg-white dark:bg-black border-b py-2 flex justify-between items-center border-border absolute z-50 w-full px-4">
      <NuxtLink to="/">
        <div class="flex items-center gap-2">
          <svg width="60" height="45" viewBox="0 0 60 45" fill="none" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H15V15H30V30H15V45H0V30V15V0ZM45 30V15H30V0H45H60V15V30V45H45H30V30H45Z" class="fill-black dark:fill-white" />
          </svg>
          <p class="select-none font-medium">BETTER-AUTH.</p>
        </div>
      </NuxtLink>
      <div class="z-50 flex items-center">
        <UColorModeButton />
      </div>
    </div>

    <!-- Content -->
    <div class="mt-20 lg:w-7/12 w-full relative z-10">
      <slot />
    </div>
  </div>
</template>
