<template>
    <div class="eq-popup">
        <div class="eq-controls">
            <button class="eq-toggle" :class="{ active: eq.enabled }" @click="eq.toggleEnabled">
                {{ eq.enabled ? 'ON' : 'OFF' }}
            </button>
            <select v-model="selectedPreset" @change="onPresetChange" class="eq-preset">
                <option v-for="preset in eq.availablePresets" :key="preset" :value="preset">
                    {{ preset }}
                </option>
            </select>
        </div>
        <div class="eq-sliders">
            <div class="db-scale">
                <span class="db-label">+12</span>
                <span class="db-label">0</span>
                <span class="db-label">-12</span>
            </div>
            <div v-for="(gain, index) in eq.bands" :key="index" class="eq-slider-wrap" @wheel="(e) => handleBandWheel(index, e)">
                <div class="gain-value">{{ displayBands[index] > 0 ? '+' : '' }}{{ displayBands[index].toFixed(1) }}</div>
                <input
                    type="range"
                    :value="displayBands[index]"
                    min="-12"
                    max="12"
                    step="0.1"
                    @input="(e) => changeBandGain(index, e)"
                    class="eq-slider"
                    :style="{
                        background: `linear-gradient(to top, #ffffff ${((displayBands[index] + 12) / 24) * 100}%, rgba(255, 255, 255, 0.1) ${((displayBands[index] + 12) / 24) * 100}%)`
                    }"
                />
                <div class="freq-label">{{ formatFreq(frequencies[index]) }}</div>
            </div>
            <div class="db-scale">
                <span class="db-label">+12</span>
                <span class="db-label">0</span>
                <span class="db-label">-12</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import useEqualizer from '@/stores/equalizer'
import { EQ_FREQUENCIES } from '@/utils/equalizer/eqPresets'

const eq = useEqualizer()
const selectedPreset = ref(eq.currentPreset)
const frequencies = EQ_FREQUENCIES
const animatedBands = ref<number[]>([0, 0, 0, 0, 0, 0, 0, 0])
const isAnimating = ref(false)
const displayBands = ref<number[]>([...eq.bands])

// Load saved settings on mount
onMounted(() => {
    eq.loadFromLocalStorage()
    selectedPreset.value = eq.currentPreset
    displayBands.value = [...eq.bands]
})

// Watch for external preset changes
watch(() => eq.currentPreset, (newPreset) => {
    selectedPreset.value = newPreset
})

const changeBandGain = (index: number, event: Event) => {
    const target = event.target as HTMLInputElement
    const value = parseFloat(target.value)
    eq.setBandGain(index, value)
    displayBands.value[index] = value
}

const onPresetChange = () => {
    eq.loadPreset(selectedPreset.value)
    startAnimation()
}

const startAnimation = () => {
    if (isAnimating.value) return
    
    isAnimating.value = true
    animatedBands.value = [0, 0, 0, 0, 0, 0, 0, 0]
    
    const startTime = performance.now()
    const duration = 1000
    const targetBands = [...eq.bands]
    
    const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        
        animatedBands.value = targetBands.map(target => target * easeProgress)
        displayBands.value = [...animatedBands.value]
        
        if (progress < 1) {
            requestAnimationFrame(animate)
        } else {
            isAnimating.value = false
            displayBands.value = [...eq.bands]
        }
    }
    
    requestAnimationFrame(animate)
}

const handleBandWheel = (index: number, event: WheelEvent) => {
    event.preventDefault()
    const delta = event.deltaY / 1000
    const currentGain = eq.bands[index]
    
    let newGain = currentGain - delta * 8
    newGain = Math.max(-12, Math.min(12, newGain))
    
    eq.setBandGain(index, newGain)
    displayBands.value[index] = newGain
}

const formatFreq = (freq: number): string => {
    if (freq >= 1000) {
        const kHz = freq / 1000
        return kHz % 1 === 0 ? `${kHz}k` : `${kHz.toFixed(1)}k`
    }
    return `${freq}`
}

defineExpose({
    startAnimation
})
</script>

<style lang="scss">
.eq-popup {
    background-color: $gray;
    padding: 25px 15px;
    border-top: 1px solid $gray3;
    border-bottom: 1px solid $gray3;
    border-right: 1px solid $gray3;
    border-left: 1px solid $gray3;
    border-radius: 0.5rem;
    -webkit-font-smoothing: antialiased;

    .eq-controls {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);

        .eq-toggle {
            padding: 6px 16px;
            background: $gray;
            border: 1.5px solid rgba(255, 255, 255, 0.15);
            border-radius: 0.5rem;
            color: #af3131ff;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                color: #ffffff;
                border-color: $gray;
                background: $gray;
            }

            &.active {
                color : #ffffff;
                background: #f5f5f5;
                border-color: #f5f5f5;
                color: #000000;

                &:hover {
                    background: #ffffff;
                    border-color: #ffffff;
                    color: #000000;
                }
            }
        }

        .eq-preset {
            flex: 1;
            padding: 6px 16px;
            background: $gray5;
            border: 1.5px solid $gray3;
            border-radius: 0.5rem;
            color: rgba(255, 255, 255, 0.9);
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            outline: none;
            transition: all 0.2s;

            &:hover {
                border-color: white;
                background: $gray5;
            }

            &:focus {
                background: $gray5;
                border-color: white;
            }
            option {                 
                background: $gray5;
            }
        }
    }

    .eq-sliders {
        display: flex;
        gap: 15px;
        align-items: flex-end;

        .db-scale {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 300px;
            padding-right: 8px;
            padding-left: 8px;
            margin-bottom: 24px;

            .db-label {
                font-size: 9px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.4);
                font-family: 'Courier New', monospace;
                line-height: 1;
            }
        }

        .eq-slider-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;

            .gain-value {
                font-size: 10px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.6);
                min-width: 32px;
                text-align: center;
                font-family: 'Courier New', monospace;
            }

            .eq-slider {
                -webkit-appearance: none;
                appearance: none;
                writing-mode: vertical-lr;
                direction: rtl;
                width: 3px;
                height: 300px;
                border-radius: 1px;
                outline: none;
                cursor: pointer;
                position: relative;
                transition: none;

                &:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 1rem;
                    height: 1rem;
                    background: #ffffff;
                    border: none;
                    border-radius: 50%;
                    cursor: grab;
                    box-shadow: none;
                    transition: all 0.2s;

                    &:hover {
                        transform: scale(1.15);
                    }

                    &:active {
                        cursor: grabbing;
                        transform: scale(1.05);
                    }
                }

                &::-moz-range-thumb {
                    width: 1rem;
                    height: 1rem;
                    background: #ffffff;
                    border: none;
                    border-radius: 50%;
                    cursor: grab;
                    box-shadow: none;
                    transition: all 0.2s;

                    &:hover {
                        transform: scale(1.15);
                    }

                    &:active {
                        cursor: grabbing;
                        transform: scale(1.05);
                    }
                }
            }

            .freq-label {
                font-size: 10px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.5);
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
        }
    }
}
</style>
