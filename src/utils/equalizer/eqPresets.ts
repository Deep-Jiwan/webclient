/**
 * Equalizer preset configurations
 * 8 bands: 60Hz, 150Hz, 400Hz, 1kHz, 2.4kHz, 6kHz, 12kHz, 15kHz
 * Values in dB (-12 to +12)
 */

export const EQ_FREQUENCIES = [60, 150, 400, 1000, 2400, 6000, 12000, 15000]

export interface EQPreset {
    name: string
    gains: number[] // 8 values, -12 to +12 dB
}

export const EQ_PRESETS: EQPreset[] = [
    {
        name: 'Flat',
        gains: [0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
        name: 'Rock',
        gains: [5, 3, -1, -2, 0, 2, 4, 5],
    },
    {
        name: 'Jazz',
        gains: [4, 3, 1, 1, -1, -1, 0, 2],
    },
    {
        name: 'Pop',
        gains: [-1, 2, 4, 4, 2, -1, -2, -2],
    },
    {
        name: 'Classical',
        gains: [5, 3, -1, -2, -2, 0, 2, 3],
    },
    {
        name: 'Electronic',
        gains: [4, 3, 0, -2, 1, 0, 3, 5],
    },
    {
        name: 'Podcast',
        gains: [-2, 0, 3, 5, 5, 3, 0, -2],
    },
    {
        name: 'Acoustic',
        gains: [5, 2, 0, 1, 2, 2, 3, 1],
    },
    {
        name: 'Bass Boost',
        gains: [8, 6, 4, 0, 0, 0, 0, 0],
    },
    {
        name: 'Treble Boost',
        gains: [0, 0, 0, 0, 0, 4, 6, 8],
    },
]

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
