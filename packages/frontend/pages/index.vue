<script lang="ts" setup>
useNonAuthGuard();
const homeSection = ref<HTMLElement | null>(null);
const aboutSection = ref<HTMLElement | null>(null);
const signupSection = ref<HTMLElement | null>(null);

useNavbar({
  logoAction: {
    to: { name: "index" },
  },
  items: [
    {
      name: "Home",
      onClick() {
        homeSection.value?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      },
    },
    {
      name: "About",
      onClick() {
        aboutSection.value?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      },
    },
    {
      name: "Sign Up",
      to: { name: "register" },
      button: "primary",
    },
  ],
});
</script>

<template>
  <main>
    <section id="home" ref="homeSection" class="container py-32">
      <img
        src="~/assets/images/background.jpg"
        class="absolute top-0 left-1/2 -z-20 -translate-x-1/2"
        loading="lazy"
      />
      <div class="flex flex-wrap items-center">
        <div
          class="order-2 flex flex-1 flex-col items-center gap-4 py-6 text-center lg:items-start lg:text-start"
        >
          <h1
            class="font-display text-4xl font-bold leading-normal text-white lg:text-5xl"
          >
            A true
            <span class="text-shadow-solid4 text-primary">hunter</span> never
            rests
          </h1>
          <p class="font-body text-xl text-white lg:text-2xl">
            Welcome to CyberCamp's treasure hunt. The fun is just beginning.
          </p>
          <PrimaryButton class="mt-12" :to="{ name: 'register' }"
            >Get Hunting</PrimaryButton
          >
        </div>
        <div class="order-1 basis-full lg:order-3 lg:flex-1">
          <img
            src="~/assets/images/neonmap.png"
            class="mx-auto w-full max-w-sm lg:max-w-2xl"
          />
        </div>
      </div>
    </section>
    <section
      id="about"
      ref="aboutSection"
      class="container flex flex-col items-center gap-4 pb-32 text-center"
    >
      <img
        src="~/assets/images/texture-plus-vertical.svg"
        class="absolute translate-x-[-520px] translate-y-36"
        loading="lazy"
      />
      <img
        src="~/assets/images/texture-plus-horizontal.svg"
        class="absolute translate-x-[515px] translate-y-64"
        loading="lazy"
      />
      <h2 class="font-display text-4xl font-bold text-white">
        What is treasure hunt?
      </h2>
      <img src="~/assets/images/texture-construction-sign.svg" class="mb-4" />
      <p class="max-w-2xl font-body text-lg text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        faucibus gravida commodo. Aliquam varius quam felis, ac pharetra risus
        condimentum sed. Nullam pharetra enim lacus, eu rhoncus lorem euismod
        at. Phasellus blandit eget metus in rutrum. Nulla eget tellus luctus,
        commodo ex eget, rutrum est. Curabitur tristique laoreet varius. Nullam
        in sapien lacinia, blandit mi in, aliquam turpis. Vestibulum ut massa
        posuere, accumsan odio ut, commodo metus. Donec eget tincidunt mauris.
        Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas. Integer fringilla sapien eget finibus rutrum.
      </p>
    </section>
    <PrimarySection id="signup" ref="signupSection" class="mt-5 mb-28">
      <div
        class="flex flex-wrap items-stretch gap-5 py-5 text-center lg:text-start"
      >
        <div class="flex flex-1 flex-col gap-4">
          <h2 class="font-display text-4xl font-bold leading-normal text-black">
            Enough Talk. Let's get hunting!
          </h2>
          <p class="font-body text-lg text-black">
            Fasten your seatbelt. You're in for a bumpy ride.
          </p>
        </div>
        <div
          class="flex basis-full items-center justify-center lg:flex-[1.5] lg:basis-0"
        >
          <SecondaryButton :to="{ name: 'register' }">
            Sign Up
          </SecondaryButton>
        </div>
      </div>
    </PrimarySection>
  </main>
</template>
