import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { client } from './client';

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function getImageUrl(source: SanityImageSource, width = 800, height = 1000): string {
  return urlFor(source)
    .width(width)
    .height(height)
    .fit('crop')
    .auto('format')
    .quality(85)
    .url();
}
