import { CustomPageSlide } from '../types';

/**
 * Sanitizes an array of slides ensuring:
 * 1. Every slide has a valid unique ID.
 * 2. No undefined values exist (which would crash Firestore setDoc).
 * 3. Empty image URLs are given a reliable default or cleaned.
 * 4. Whitespace in title and caption is trimmed.
 */
export function sanitizeSlides(slides?: Partial<CustomPageSlide>[]): CustomPageSlide[] {
  if (!slides || !Array.isArray(slides)) return [];

  return slides.map((s, idx) => {
    const rawUrl = (s.image_url || '').trim();
    return {
      id: s.id && s.id.trim() ? s.id.trim() : `sl-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      image_url: rawUrl || 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
      title: (s.title || '').trim(),
      caption: (s.caption || '').trim(),
    };
  });
}

/**
 * Moves a slide within the slides array up or down.
 */
export function moveSlide(
  slides: CustomPageSlide[],
  index: number,
  direction: 'up' | 'down'
): CustomPageSlide[] {
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= slides.length) {
    return slides;
  }
  const updated = [...slides];
  const [removed] = updated.splice(index, 1);
  updated.splice(targetIndex, 0, removed);
  return updated;
}

/**
 * Deep-cleans an object by removing or replacing undefined fields so Firestore setDoc never throws.
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === undefined) return null as unknown as T;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value !== undefined) {
      clean[key] = sanitizeForFirestore(value);
    }
  }
  return clean as T;
}
