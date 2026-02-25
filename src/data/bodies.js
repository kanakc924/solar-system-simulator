export const celestialBodies = [
    {
        name: 'Sun',
        type: 'star',
        radius: 696340, // km (will scale down for visualization)
        distance: 0,
        orbitPeriod: 0, // days
        texture: '/assets/textures/sun.jpg',
        color: 0xffff00,
        tilt: 7.25,
        rotationPeriod: 609.12, // ~25.38 days
        orbitalElements: { // Sun is static relative to solar system center
            a: 0, e: 0, i: 0, M: 0, w: 0, N: 0
        },
        facts: [
            "The Sun accounts for 99.86% of the mass in the solar system.",
            "Over one million Earths could fit inside the Sun."
        ],
        images: ['/assets/textures/sun.jpg']
    },
    {
        name: 'Mercury',
        type: 'planet',
        radius: 2439.7,
        distance: 57900000,
        orbitPeriod: 88,
        texture: '/assets/textures/mercury.jpg',
        color: 0xaaaaaa,
        tilt: 0.034,
        rotationPeriod: 1407.6, // 58.65 days
        orbitalElements: {
            a: 0.387098, e: 0.205630, i: 7.005, M: 174.796, w: 29.124, N: 48.331
        },
        facts: [
            "Mercury is the smallest planet in our solar system.",
            "Despite being closest to the Sun, Venus is hotter."
        ],
        images: ['/assets/textures/mercury.jpg']
    },
    {
        name: 'Venus',
        type: 'planet',
        radius: 6051.8,
        distance: 108200000,
        orbitPeriod: 225,
        texture: '/assets/textures/venus.jpg',
        color: 0xe3bb76,
        tilt: 177.3, // Retrograde
        rotationPeriod: -5832.5, // 243 days (retrograde)
        orbitalElements: {
            a: 0.723332, e: 0.006772, i: 3.394, M: 50.416, w: 54.884, N: 76.680
        },
        atmosphere: {
            color: 0xffaa33, // Thick yellowish
            opacity: 0.8,
            scale: 1.02
        },
        facts: [
            "Venus spins in the opposite direction to most planets.",
            "It is the hottest planet in our solar system due to its greenhouse effect."
        ],
        images: ['/assets/textures/venus.jpg']
    },
    {
        name: 'Earth',
        type: 'planet',
        radius: 6371,
        distance: 149600000,
        orbitPeriod: 365.25,
        texture: '/assets/textures/earth.jpg',
        color: 0x2233ff,
        tilt: 23.44,
        rotationPeriod: 23.93,
        orbitalElements: {
            a: 1.000000, e: 0.016708, i: 0.000, M: 357.517, w: 288.064, N: 174.873
        },
        atmosphere: {
            color: 0x00aaff, // Blue
            opacity: 0.5,
            scale: 1.025
        },
        clouds: {
            texture: '/assets/textures/clouds.jpg',
            opacity: 0.9,
            scale: 1.01
        },
        facts: [
            "Earth is the only planet not named after a god.",
            "Earth is the densest planet in the Solar System."
        ],
        images: ['/assets/textures/earth.jpg']
    },
    {
        name: 'Mars',
        type: 'planet',
        radius: 3389.5,
        distance: 227900000,
        orbitPeriod: 687,
        texture: '/assets/textures/mars.jpg',
        color: 0xdd4422,
        tilt: 25.19,
        rotationPeriod: 24.62,
        orbitalElements: {
            a: 1.523679, e: 0.093405, i: 1.850, M: 19.412, w: 286.502, N: 49.578
        },
        atmosphere: {
            color: 0xffccaa, // Thin dusty
            opacity: 0.3,
            scale: 1.015
        },
        facts: [
            "Mars is home to Olympus Mons, the tallest mountain in the solar system.",
            "Mars has the largest dust storms in the solar system."
        ],
        images: ['/assets/textures/mars.jpg']
    },
    {
        name: 'Jupiter',
        type: 'planet',
        radius: 69911,
        distance: 778500000,
        orbitPeriod: 4333,
        texture: '/assets/textures/jupiter.jpg',
        color: 0xd8ca9d,
        tilt: 3.13,
        rotationPeriod: 9.93,
        orbitalElements: {
            a: 5.2044, e: 0.0489, i: 1.304, M: 20.020, w: 273.867, N: 100.464
        },
        facts: [
            "Jupiter is the fastest spinning planet in our solar system.",
            "The Great Red Spot is a storm that has been raging for hundreds of years."
        ],
        images: ['/assets/textures/jupiter.jpg']
    },
    {
        name: 'Saturn',
        type: 'planet',
        radius: 58232,
        distance: 1434000000,
        orbitPeriod: 10759,
        texture: '/assets/textures/saturn.jpg',
        color: 0xc5ab6e,
        ringTexture: '/assets/textures/saturn_ring.png',
        ringRadius: [1.4, 2.3],
        tilt: 26.73,
        rotationPeriod: 10.7,
        orbitalElements: {
            a: 9.5826, e: 0.0565, i: 2.485, M: 317.020, w: 339.392, N: 113.665
        },
        facts: [
            "Saturn is the least dense planet; it would float in water.",
            "Its rings are made mostly of ice and rock."
        ],
        images: ['/assets/textures/saturn.jpg']
    },
    {
        name: 'Uranus',
        type: 'planet',
        radius: 25362,
        distance: 2871000000,
        orbitPeriod: 30687,
        texture: '/assets/textures/uranus.jpg',
        color: 0xacf5f5,
        tilt: 97.77, // Rolling on side
        rotationPeriod: -17.24, // Retrograde
        orbitalElements: {
            a: 19.2184, e: 0.046381, i: 0.773, M: 142.2386, w: 98.998, N: 74.006
        },
        facts: [
            "Uranus rotates on its side, rolling like a ball around the Sun.",
            "It is the coldest planet in the solar system."
        ],
        images: ['/assets/textures/uranus.jpg']
    },
    {
        name: 'Neptune',
        type: 'planet',
        radius: 24622,
        distance: 4495000000,
        orbitPeriod: 60190,
        texture: '/assets/textures/neptune.jpg',
        color: 0x5b5ddf,
        tilt: 28.32,
        rotationPeriod: 16.11,
        orbitalElements: {
            a: 30.11, e: 0.009456, i: 1.767, M: 256.228, w: 276.336, N: 131.784
        },
        facts: [
            "Neptune has the strongest winds in the solar system.",
            "It was the first planet located through mathematical calculations."
        ],
        images: ['/assets/textures/neptune.jpg']
    },
    {
        name: 'Pluto',
        type: 'dwarf-planet',
        radius: 1188,
        distance: 5906380000,
        orbitPeriod: 90560,
        texture: '/assets/textures/pluto.jpg',
        color: 0xddddaa,
        tilt: 122.53,
        rotationPeriod: -153.3,
        orbitalElements: {
            a: 39.482, e: 0.2488, i: 17.16, M: 14.86, w: 113.834, N: 110.30
        },
        facts: [
            "Pluto is smaller than Russia.",
            "It was reclassified as a dwarf planet in 2006."
        ],
        images: ['/assets/textures/pluto.jpg']
    },
    {
        name: 'Ceres',
        type: 'dwarf-planet',
        radius: 473,
        distance: 414000000,
        orbitPeriod: 1680,
        texture: '/assets/textures/ceres.jpg',
        color: 0x888888,
        tilt: 4.0,
        rotationPeriod: 9.07,
        orbitalElements: {
            a: 2.767, e: 0.0758, i: 10.59, M: 77.37, w: 73.59, N: 80.32
        }
    },
    {
        name: 'Eris',
        type: 'dwarf-planet',
        radius: 1163,
        distance: 10123000000,
        orbitPeriod: 203600,
        texture: '/assets/textures/eris.jpg',
        color: 0xeeeeee,
        tilt: 78.0, // speculative/approx
        rotationPeriod: 25.9,
        orbitalElements: {
            a: 67.781, e: 0.440, i: 44.04, M: 197.63, w: 151.65, N: 35.87
        }
    },
    {
        name: 'Haumea',
        type: 'dwarf-planet',
        radius: 816,
        distance: 6452000000,
        orbitPeriod: 104100,
        texture: '/assets/textures/haumea.jpg',
        color: 0xaaaaaa,
        tilt: 28,
        rotationPeriod: 3.9,
        orbitalElements: { a: 43.116, e: 0.1981, i: 28.21, M: 213.1, w: 239.18, N: 122.02 },
        facts: ["Haumea is shaped like a football due to its extremely fast rotation."]
    },
    {
        name: 'Makemake',
        type: 'dwarf-planet',
        radius: 715,
        distance: 6850000000,
        orbitPeriod: 112897,
        texture: '/assets/textures/makemake.jpg',
        color: 0xc1a171,
        tilt: 29,
        rotationPeriod: 22.8,
        orbitalElements: { a: 45.43, e: 0.161, i: 29.01, M: 160.4, w: 294.8, N: 79.6 },
        facts: ["Makemake is the second-brightest known dwarf planet in the outer solar system after Pluto."]
    },
    // Moons (simplified elements relative to parent for now, circular/coplanar approximation remains for Moons in V1 or update them?)
    // Let's use simple circular elements for Moons for now to avoid complexity of local frames relative to parent inclination
    // OR we can just use 0 inclination relative to parent's equator?
    // Let's add placeholders.
    {
        name: 'Moon',
        type: 'moon',
        parent: 'Earth',
        radius: 1737,
        distance: 384400,
        orbitPeriod: 27.3,
        texture: '/assets/textures/moon.jpg',
        color: 0xdddddd,
        orbitalElements: { a: 0.00257, e: 0.0549, i: 5.145, M: 0, w: 0, N: 0 }, // a in AU
        facts: [
            "The Moon is slowly drifting away from Earth.",
            "It is the fifth largest moon in the Solar System."
        ]
    },
    {
        name: 'Io',
        type: 'moon',
        parent: 'Jupiter',
        radius: 1821,
        distance: 421700,
        orbitPeriod: 1.77,
        texture: '/assets/textures/io.jpg',
        color: 0xffffaa,
        orbitalElements: { a: 0.0028, e: 0.0041, i: 0.036, M: 0, w: 0, N: 0 }
    },
    {
        name: 'Europa',
        type: 'moon',
        parent: 'Jupiter',
        radius: 1560,
        distance: 671000,
        orbitPeriod: 3.55,
        texture: '/assets/textures/europa.jpg',
        color: 0xaaddff,
        orbitalElements: { a: 0.0045, e: 0.0094, i: 0.471, M: 0, w: 0, N: 0 }
    },
    {
        name: 'Ganymede',
        type: 'moon',
        parent: 'Jupiter',
        radius: 2634,
        distance: 1070400,
        orbitPeriod: 7.15,
        texture: '/assets/textures/ganymede.jpg',
        color: 0x888888,
        orbitalElements: { a: 0.00715, e: 0.0013, i: 0.204, M: 0, w: 0, N: 0 }
    },
    {
        name: 'Callisto',
        type: 'moon',
        parent: 'Jupiter',
        radius: 2410,
        distance: 1882700,
        orbitPeriod: 16.69,
        texture: '/assets/textures/callisto.jpg',
        color: 0x555555,
        orbitalElements: { a: 0.01258, e: 0.0074, i: 0.205, M: 0, w: 0, N: 0 }
    },
    {
        name: 'Titan',
        type: 'moon',
        parent: 'Saturn',
        radius: 2574,
        distance: 1221870,
        orbitPeriod: 15.95,
        texture: '/assets/textures/titan.jpg',
        color: 0xffaa00,
        orbitalElements: { a: 0.00816, e: 0.0288, i: 0.3485, M: 0, w: 0, N: 0 },
        atmosphere: {
            color: 0xffaa00, // Thick orange
            opacity: 0.9,
            scale: 1.05
        }
    },
    {
        name: 'Enceladus',
        type: 'moon',
        parent: 'Saturn',
        radius: 252,
        distance: 237948,
        orbitPeriod: 1.37,
        texture: '/assets/textures/enceladus.jpg',
        color: 0xffffff,
        orbitalElements: { a: 0.00159, e: 0.0047, i: 0.019, M: 0, w: 0, N: 0 }
    },
    {
        name: 'Triton',
        type: 'moon',
        parent: 'Neptune',
        radius: 1353,
        distance: 354759,
        orbitPeriod: -5.877,
        texture: '/assets/textures/triton.jpg',
        color: 0x999999,
        orbitalElements: { a: 0.00237, e: 0.000016, i: 157, M: 0, w: 0, N: 0 }
    },
    {
        name: 'Charon',
        type: 'moon',
        parent: 'Pluto',
        radius: 606,
        distance: 19591,
        orbitPeriod: 6.387,
        texture: '/assets/textures/charon.jpg',
        color: 0x888888,
        orbitalElements: { a: 0.00013, e: 0.00022, i: 0, M: 0, w: 0, N: 0 }
    }
];
