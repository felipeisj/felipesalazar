export const imagePresets = {
  thumbnail: 'c_fill,g_auto,w_400,h_300,q_auto,f_auto',
  card: 'c_fill,g_auto,w_600,h_450,q_auto,f_auto',
  hero: 'c_fill,g_auto,w_1200,h_900,q_auto,f_auto',
  gallery: 'c_fill,g_auto,w_200,h_150,q_auto,f_auto',
  adminThumb: 'c_fill,g_auto,w_100,h_100,q_auto,f_auto',
  logo: 'c_pad,w_200,h_200,b_auto,q_auto,f_auto',
};

export function getCloudinaryUrl(publicId: string, preset: keyof typeof imagePresets = 'card') {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dqbmkjlze';

  if (!publicId) return '';
  if (publicId.startsWith('http')) return publicId;

  const transform = imagePresets[preset];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}
