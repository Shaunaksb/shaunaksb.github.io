/**
 * Canonical blog post index metadata used by /blog/index.html.
 */
export const blogPosts = Object.freeze([
    {
        slug: 'orbital-edge-intelligence',
        url: '/blog/orbital-edge-intelligence/',
        title: 'Orbital Edge Intelligence: TinyML on Sub-Watt Space Microcontrollers',
        summary:
            'How AstroTinyML uses SNR-weighted Quantization-Aware Training, mixed INT4/INT8/FP16 execution, and deterministic 73.4 KB static SRAM scheduling to detect faint astrophysical and Earth-observation transients in orbit.',
        publishedAt: '2026-11-17',
        readingTime: '8 min read',
        tags: ['TinyML', 'Orbital Edge Computing', 'Quantization', 'Embedded C++', 'Astrophysics']
    }
]);
