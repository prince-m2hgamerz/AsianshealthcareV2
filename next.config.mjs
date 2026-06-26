/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'www.vaidam.com',
      },
      {
        protocol: 'https',
        hostname: 'medanta.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'satyughealthcare.com',
      },
      {
        protocol: 'https',
        hostname: 'safartibbi.com',
      },
      {
        protocol: 'https',
        hostname: 'getwellgo.com',
      },
      {
        protocol: 'https',
        hostname: 'www.joonsquare.com',
      },
      {
        protocol: 'https',
        hostname: 'crossborderscare.com',
      },
      {
        protocol: 'https',
        hostname: 'www.globalcarehealth.com',
      },
      {
        protocol: 'https',
        hostname: 'medicircle.in',
      },
      {
        protocol: 'https',
        hostname: 'drupal-cdn-hfaeddcdbng5hfbg.a01.azurefd.net',
      },
      {
        protocol: 'https',
        hostname: 'd35oenyzp35321.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'max-website20-images.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'www.apollohospitals.com',
      },
      {
        protocol: 'https',
        hostname: 'parashospitals-web.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'www.artemishospitals.com',
      },
      {
        protocol: 'https',
        hostname: 'www.medicaltourismco.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.hexahealth.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
