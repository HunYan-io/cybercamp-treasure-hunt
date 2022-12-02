<script lang="ts" setup>
import { Chip, chips } from "~~/data/chips";

const isSignoutModalOpen = ref(false);
const isBuyChipModalOpen = ref(false);
const boughtChip = ref<Chip | null>(null);
const isEnabled = useEnabledChips();

useNavbar({
  logoAction: { to: { name: "overview" } },
  items: [
    {
      name: "Overview",
      to: { name: "overview" },
    },
    {
      name: "Chips",
      to: { name: "chips" },
      active: true,
    },
    {
      name: "Sign Out",
      onClick: () => {
        isSignoutModalOpen.value = true;
      },
    },
  ],
});

function onBuy(chip: Chip) {
  boughtChip.value = chip;
  isBuyChipModalOpen.value = true;
}
</script>

<template>
  <main
    class="container flex flex-1 flex-col items-center justify-center gap-14 py-32"
  >
    <h2 class="text-center font-display text-4xl font-bold text-white">
      Chips Store
    </h2>
    <div class="flex flex-wrap items-stretch justify-center gap-10">
      <ChipBox
        v-for="chip in chips"
        :key="chip.id"
        :chip="chip"
        :disabled="!isEnabled[chip.id]"
        @buy="onBuy(chip)"
      />
    </div>
    <BuyChipModal
      v-model="isBuyChipModalOpen"
      modal-id="buy-chip"
      :chip="boughtChip!"
    />
    <SignoutModal v-model="isSignoutModalOpen" modal-id="signout" />
    <HintModal modal-id="hint" />
  </main>
</template>
