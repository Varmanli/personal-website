/** Image-bearing fields shared by project cards and case-study views. */
export interface ProjectImageFields {
  coverImageUrl?: string | null;
  galleryImages?: string[] | null;
  media?: string[] | null;
  previewImageUrl?: string | null;
  thumbnailUrl?: string | null;
}

function isLikelyImageUrl(value: string): boolean {
  // `media` is a legacy mixed image/video list. Keep extensionless object
  // storage image URLs, but never hand known video assets to next/image.
  return !/\.(mp4|webm|mov|m4v|avi)(?:$|[?#])/i.test(value);
}

/** Returns project images in display-quality order. */
export function getProjectImageSources(project: ProjectImageFields): string[] {
  const values = [
    project.coverImageUrl,
    ...(project.galleryImages ?? []),
    ...(project.media ?? []).filter(isLikelyImageUrl),
    project.previewImageUrl,
    project.thumbnailUrl,
  ].filter((value): value is string => Boolean(value?.trim()));

  return Array.from(new Set(values));
}

/** Highest-quality available project image for cards and metadata. */
export function getProjectPrimaryImage(project: ProjectImageFields): string | null {
  return getProjectImageSources(project)[0] ?? null;
}
