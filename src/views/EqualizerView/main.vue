<template>
  <div class="equalizerview content-page">
    <div class="eq-fullpage content-page">
      <div class="eq-header">
        <h1>Equalizer</h1>
      </div>

      <div class="eq-content-wrapper">
        <EqualizerContent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useEqualizer from '@/stores/equalizer'
import EqualizerContent from '@/components/BottomBar/EqualizerContent.vue'

const eq = useEqualizer()

onMounted(() => {
  eq.loadFromLocalStorage()
})
</script>

<style lang="scss">
.equalizerview {
  height: 100%;
  padding-bottom: 1rem;
}

.eq-fullpage {
  padding: 2rem 3rem;
  height: 100%;
  overflow-y: auto;
  @include hideScrollbars;

  .eq-header {
    margin-bottom: 2rem;

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
  }

  .eq-content-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 2rem;

    // Make the embedded equalizer content larger and always visible
    :deep(.eq-popup) {
      position: static !important;
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      padding: 30px 20px;
      transform: scale(1.2);
      transform-origin: top center;
    }
  }
}
</style>
