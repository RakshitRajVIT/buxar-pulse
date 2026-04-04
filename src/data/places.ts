export interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  rating: number;
  reviews: number;
  isOpen: boolean;
  phone?: string;
  image?: string;
  googleMapsUrl?: string;
  lat: number;
  lng: number;
}

export const categories = [
  { id: 'tourism', label: '🏛 Tourism', color: '#4F46E5' },
  { id: 'plumbers', label: '🔧 Plumbers', color: '#06B6D4' },
  { id: 'electricians', label: '⚡ Electricians', color: '#FBBF24' },
  { id: 'doctors', label: '❤ Doctors', color: '#EC4899' },
  { id: 'food', label: '🍽 Food', color: '#F97316' },
  { id: 'hotels', label: '🏨 Hotels', color: '#A78BFA' },
];

export const places: Place[] = [
  { id: '1', name: 'Brahmeshwar Nath Temple', address: 'Near Ganges, Buxar', category: 'tourism', rating: 4.7, reviews: 312, isOpen: true, lat: 25.5645, lng: 83.9777, phone: '+91 9876543210' },
  { id: '2', name: 'Ramrekha Ghat', address: 'Ganges Riverside, Buxar', category: 'tourism', rating: 4.8, reviews: 289, isOpen: true, lat: 25.5640, lng: 83.9790, phone: '+91 9876543211' },
  { id: '3', name: 'Buxar Fort', address: 'Fort Road, Buxar', category: 'tourism', rating: 4.3, reviews: 198, isOpen: true, lat: 25.5650, lng: 83.9800, phone: '+91 9876543212' },
  { id: '4', name: 'Navaratna Garh', address: 'Historical Area, Buxar', category: 'tourism', rating: 4.1, reviews: 87, isOpen: false, lat: 25.5670, lng: 83.9750, phone: '+91 9876543213' },
  { id: '5', name: 'Raj Kumar Plumbing', address: 'Station Road, Buxar', category: 'plumbers', rating: 4.2, reviews: 56, isOpen: true, lat: 25.5660, lng: 83.9760, phone: '+91 9876543214' },
  { id: '6', name: 'Fast Fix Plumbers', address: 'Main Market, Buxar', category: 'plumbers', rating: 3.9, reviews: 34, isOpen: true, lat: 25.5680, lng: 83.9730, phone: '+91 9876543215' },
  { id: '7', name: 'Sharma Electric Works', address: 'Gandhi Chowk, Buxar', category: 'electricians', rating: 4.5, reviews: 78, isOpen: true, lat: 25.5655, lng: 83.9785, phone: '+91 9876543216' },
  { id: '8', name: 'PowerLine Solutions', address: 'Civil Lines, Buxar', category: 'electricians', rating: 4.0, reviews: 45, isOpen: false, lat: 25.5630, lng: 83.9810, phone: '+91 9876543217' },
  { id: '9', name: 'Dr. Mishra Clinic', address: 'Hospital Road, Buxar', category: 'doctors', rating: 4.6, reviews: 210, isOpen: true, lat: 25.5620, lng: 83.9820, phone: '+91 9876543218' },
  { id: '10', name: 'Buxar Medical Centre', address: 'Station Road, Buxar', category: 'doctors', rating: 4.4, reviews: 156, isOpen: true, lat: 25.5690, lng: 83.9740, phone: '+91 9876543219' },
  { id: '11', name: 'Ganga View Restaurant', address: 'Riverside, Buxar', category: 'food', rating: 4.3, reviews: 178, isOpen: true, lat: 25.5635, lng: 83.9795, phone: '+91 9876543220' },
  { id: '12', name: 'Buxar Biryani House', address: 'Main Bazar, Buxar', category: 'food', rating: 4.5, reviews: 234, isOpen: true, lat: 25.5665, lng: 83.9770, phone: '+91 9876543221' },
  { id: '13', name: 'Hotel Ganges Palace', address: 'NH-84, Buxar', category: 'hotels', rating: 4.1, reviews: 89, isOpen: true, lat: 25.5675, lng: 83.9755, phone: '+91 9876543222' },
  { id: '14', name: 'Shanti Guest House', address: 'Near Railway Station', category: 'hotels', rating: 3.8, reviews: 67, isOpen: true, lat: 25.5685, lng: 83.9745, phone: '+91 9876543223' },
];
