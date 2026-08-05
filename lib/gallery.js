/*
  AQUA HAUL GALLERY CONFIGURATION

  To add a photo or video:

  1. Upload the file into:
       public/gallery/

  2. Add one entry to the correct service below.

  Image example:
    { type: 'image', src: '/gallery/foam-wash-3.webp', alt: 'Foam wash on a white car' }

  Video example:
    {
      type: 'video',
      src: '/gallery/foam-wash-video-1.mp4',
      poster: '/gallery/foam-wash-video-cover.webp',
      alt: 'Foam wash demonstration'
    }

  Recommended:
  - Photos: WebP or JPG, under 1 MB when possible
  - Videos: MP4 (H.264), 10–30 seconds, under 20 MB when possible
  - Use lowercase filenames without spaces
*/

export const GALLERY_SERVICES = [
  {
    key: 'foam',
    label: 'Foam Wash',
    description: 'Thick foam lifts road dirt before a careful exterior rinse.',
    media: [
      {
        type: 'image',
        src: '/gallery/foam-wash-1.webp',
        alt: 'Aqua Haul foam wash service',
      },
      {
        type: 'image',
        src: '/gallery/foam-wash-2.webp',
        alt: 'Car covered with cleaning foam',
      },
    ],
  },
  {
    key: 'steam',
    label: 'Steam Wash',
    description: 'Focused steam reaches tight areas while using less water.',
    media: [
      {
        type: 'image',
        src: '/gallery/steam-wash-1.webp',
        alt: 'Aqua Haul steam wash service',
      },
      {
        type: 'image',
        src: '/gallery/steam-wash-2.webp',
        alt: 'Steam cleaning work',
      },
    ],
  },
  {
    key: 'engine',
    label: 'Engine Cleaning',
    description: 'Careful cleaning around the engine bay for a fresher finish.',
    media: [
      {
        type: 'image',
        src: '/gallery/engine-cleaning-1.webp',
        alt: 'Engine bay cleaning',
      },
      {
        type: 'image',
        src: '/gallery/engine-cleaning-2.webp',
        alt: 'Detailed engine cleaning work',
      },
    ],
  },
  {
    key: 'interior',
    label: 'Interior Detailing',
    description: 'Seats, mats, dashboard and hard-to-reach cabin areas refreshed.',
    media: [
      {
        type: 'image',
        src: '/gallery/interior-detailing-1.webp',
        alt: 'Car interior detailing',
      },
      {
        type: 'image',
        src: '/gallery/interior-detailing-2.webp',
        alt: 'Interior cleaning work',
      },
      {
        type: 'image',
        src: '/gallery/interior-detailing-3.webp',
        alt: 'Detailed car cabin cleaning',
      },
    ],
  },
  {
    key: 'ac',
    label: 'AC & Interior Steaming',
    description: 'Steam treatment around vents and cabin touchpoints.',
    media: [
      {
        type: 'image',
        src: '/gallery/ac-interior-1.webp',
        alt: 'AC and interior steam cleaning',
      },
      {
        type: 'image',
        src: '/gallery/ac-interior-2.webp',
        alt: 'Interior steaming service',
      },
    ],
  },
  {
    key: 'heavy',
    label: 'Heavy Vehicle Wash',
    description: 'Mobile exterior and cabin cleaning for larger vehicles.',
    media: [
      {
        type: 'image',
        src: '/gallery/heavy-vehicle-1.webp',
        alt: 'Heavy vehicle wash',
      },
      {
        type: 'image',
        src: '/gallery/heavy-vehicle-2.webp',
        alt: 'Aqua Haul heavy vehicle cleaning',
      },
    ],
  },
];
