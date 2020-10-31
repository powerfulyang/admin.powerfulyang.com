import { isSupportWebp } from '@powerfulyang/utils';

export const styles = {
  thumbnail: '&imageMogr2/thumbnail/300x/interlace/1',
  thumbnail_webp: '&imageMogr2/thumbnail/300x/format/webp/interlace/1/quality/100',
  webp: '&imageMogr2/format/webp/interlace/1/quality/100',
  origin: '',
};

export const getCosObjectThumbnailUrl = (objectUrl: string) => {
  return `${objectUrl}${(isSupportWebp() && styles.thumbnail_webp) || styles.thumbnail}`;
};

export const getCosObjectUrl = (objectUrl: string) => {
  return `${objectUrl}${(isSupportWebp() && styles.webp) || styles.origin}`;
};
