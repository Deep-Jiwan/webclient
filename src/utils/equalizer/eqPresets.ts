/**
 * Equalizer preset configurations
 * 8 bands: 60Hz, 150Hz, 400Hz, 1kHz, 2.4kHz, 6kHz, 12kHz, 15kHz
 * Values in dB (-12 to +12)
 */

import presetsData from './presets.json'

export const EQ_FREQUENCIES = [60, 150, 400, 1000, 2400, 6000, 12000, 15000]

export interface EQPreset {
    name: string
    gains: number[] // 8 values, -12 to +12 dB
}

export const EQ_PRESETS: EQPreset[] = presetsData.presets

/**
 * Get preset by name
 */
export function getPreset(name: string): EQPreset {
    return EQ_PRESETS.find(p => p.name === name) || EQ_PRESETS[0]
}

/**
 * Format frequency for display (e.g., 1000 -> "1kHz")
 */
export function formatFrequency(freq: number): string {
    if (freq >= 1000) {
        return `${freq / 1000}${freq % 1000 === 0 ? 'k' : 'k'}`
    }
    return `${freq}`
}
