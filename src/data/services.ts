import { get, ref } from 'firebase/database';
import { places, type Place } from '@/data/places';
import { isFirebaseConfigured, realtimeDb } from '@/lib/firebase';

type FirebaseServiceRecord = {
  id?: string;
  name?: string;
  address?: string;
  category?: string;
  rating?: number | string;
  reviews?: number | string;
  reviewsCount?: number | string;
  isOpen?: boolean;
  phone?: string;
  image?: string;
  photoUrl?: string;
  lat?: number | string;
  lng?: number | string;
  googleMapsUrl?: string;
};

const allowedCategories = new Set(['tourism', 'plumbers', 'electricians', 'doctors', 'food', 'hotels']);

function normalizeCategory(value?: string): string {
  if (!value) return 'tourism';

  const input = value.trim().toLowerCase();
  const aliases: Record<string, string> = {
    plumber: 'plumbers',
    electrician: 'electricians',
    doctor: 'doctors',
    hotel: 'hotels',
  };

  const normalized = aliases[input] ?? input;
  return allowedCategories.has(normalized) ? normalized : 'tourism';
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function mapServiceRecord(record: FirebaseServiceRecord, fallbackId: string): Place {
  const lat = toNumber(record.lat, 25.5648);
  const lng = toNumber(record.lng, 83.9767);

  return {
    id: String(record.id ?? fallbackId),
    name: record.name?.trim() || 'Unnamed Service',
    address: record.address?.trim() || 'Buxar, Bihar',
    category: normalizeCategory(record.category),
    rating: toNumber(record.rating, 0),
    reviews: toNumber(record.reviewsCount ?? record.reviews, 0),
    isOpen: Boolean(record.isOpen),
    phone: record.phone?.trim() || undefined,
    image: record.photoUrl?.trim() || record.image?.trim() || undefined,
    lat,
    lng,
    googleMapsUrl: record.googleMapsUrl?.trim() || undefined,
  };
}

export async function fetchServices(): Promise<Place[]> {
  if (!isFirebaseConfigured || !realtimeDb) {
    return places;
  }

  try {
    const snapshot = await get(ref(realtimeDb, 'services'));
    if (!snapshot.exists()) {
      return places;
    }

    const raw = snapshot.val() as Record<string, FirebaseServiceRecord> | FirebaseServiceRecord[];
    const entries = Array.isArray(raw)
      ? raw
          .filter(Boolean)
          .map((item, index) => [String(index), item] as const)
      : Object.entries(raw);

    const mapped = entries
      .map(([id, item]) => mapServiceRecord({ ...item, id: item.id ?? id }, id))
      .filter((item) => item.name.length > 0);

    return mapped.length > 0 ? mapped : places;
  } catch (error) {
    console.error('Failed to load services from Firebase, using local fallback.', error);
    return places;
  }
}
