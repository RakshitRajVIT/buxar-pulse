// import { useState, useEffect } from 'react';
// import { Search, X, Navigation, MapPin, Hospital, School, ShoppingBag, Building2, Train, Landmark } from 'lucide-react';

// interface SearchResult {
//   display_name: string;
//   lat: string;
//   lon: string;
//   type: string;
// }

// interface MarkerData {
//   position: [number, number];
//   name: string;
//   type: string;
// }

// interface Category {
//   id: string;
//   name: string;
//   query: string;
//   icon: React.ReactNode;
//   color: string;
// }

// const BUXAR_CENTER = { lat: 25.5648, lng: 83.9767 };
// const BUXAR_BOUNDS = {
//   sw: { lat: 25.400, lng: 83.800 },
//   ne: { lat: 25.750, lng: 84.150 },
// };

// const CATEGORIES: Category[] = [
//   { id: 'hospital', name: 'Hospitals', query: 'hospital', icon: <Hospital size={18} />, color: 'bg-red-500' },
//   { id: 'school', name: 'Schools', query: 'school', icon: <School size={18} />, color: 'bg-blue-500' },
//   { id: 'market', name: 'Markets', query: 'market', icon: <ShoppingBag size={18} />, color: 'bg-green-500' },
//   { id: 'bank', name: 'Banks', query: 'bank', icon: <Building2 size={18} />, color: 'bg-purple-500' },
//   { id: 'railway', name: 'Railway', query: 'railway station', icon: <Train size={18} />, color: 'bg-orange-500' },
//   { id: 'temple', name: 'Temples', query: 'temple', icon: <Landmark size={18} />, color: 'bg-yellow-600' },
// ];

// export default function MapExplorer() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [markers, setMarkers] = useState<MarkerData[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [mapLoaded, setMapLoaded] = useState(false);

//   useEffect(() => {
//     // Load Leaflet dynamically
//     const loadLeaflet = async () => {
//       try {
//         // Load CSS
//         const link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//         document.head.appendChild(link);

//         // Load JS
//         const script = document.createElement('script');
//         script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//         script.onload = () => {
//           setMapLoaded(true);
//           initializeMap();
//         };
//         document.body.appendChild(script);
//       } catch (error) {
//         console.error('Error loading Leaflet:', error);
//       }
//     };

//     loadLeaflet();
//   }, []);

//   const initializeMap = () => {
//     const L = (window as any).L;
//     if (!L) return;

//     const map = L.map('map').setView([BUXAR_CENTER.lat, BUXAR_CENTER.lng], 13);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//     }).addTo(map);

//     // Store map instance globally
//     (window as any).leafletMap = map;
//   };

//   const searchPlaces = async (query: string) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     setIsSearching(true);
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?` +
//         `format=json&` +
//         `q=${encodeURIComponent(query + ', Buxar, Bihar')}` +
//         `&bounded=1` +
//         `&viewbox=${BUXAR_BOUNDS.sw.lng},${BUXAR_BOUNDS.sw.lat},${BUXAR_BOUNDS.ne.lng},${BUXAR_BOUNDS.ne.lat}` +
//         `&limit=10`
//       );
//       const data = await response.json();
//       setSearchResults(data);
//     } catch (error) {
//       console.error('Search error:', error);
//       setSearchResults([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       searchPlaces(searchQuery);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   const handleResultClick = (result: SearchResult) => {
//     const L = (window as any).L;
//     const map = (window as any).leafletMap;
//     if (!L || !map) return;

//     const lat = parseFloat(result.lat);
//     const lon = parseFloat(result.lon);

//     map.flyTo([lat, lon], 16);

//     const marker = L.marker([lat, lon]).addTo(map);
//     marker.bindPopup(`<strong>${result.display_name.split(',')[0]}</strong><br/>${result.type}`).openPopup();

//     const newMarker: MarkerData = {
//       position: [lat, lon],
//       name: result.display_name,
//       type: result.type,
//     };
//     setMarkers([...markers, newMarker]);

//     setSearchQuery('');
//     setSearchResults([]);
//   };

//   const handleCategoryClick = async (category: Category) => {
//     setSelectedCategory(category.id);
//     setIsSearching(true);

//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?` +
//         `format=json&` +
//         `q=${encodeURIComponent(category.query + ', Buxar, Bihar')}` +
//         `&bounded=1` +
//         `&viewbox=${BUXAR_BOUNDS.sw.lng},${BUXAR_BOUNDS.sw.lat},${BUXAR_BOUNDS.ne.lng},${BUXAR_BOUNDS.ne.lat}` +
//         `&limit=20`
//       );
//       const data = await response.json();

//       const L = (window as any).L;
//       const map = (window as any).leafletMap;
//       if (!L || !map) return;

//       // Clear existing markers
//       map.eachLayer((layer: any) => {
//         if (layer instanceof L.Marker) {
//           map.removeLayer(layer);
//         }
//       });

//       // Add new markers
//       const newMarkers: MarkerData[] = [];
//       data.forEach((result: SearchResult) => {
//         const lat = parseFloat(result.lat);
//         const lon = parseFloat(result.lon);
//         const marker = L.marker([lat, lon]).addTo(map);
//         marker.bindPopup(`<strong>${result.display_name.split(',')[0]}</strong><br/>${category.name}`);
        
//         newMarkers.push({
//           position: [lat, lon],
//           name: result.display_name.split(',')[0],
//           type: category.name,
//         });
//       });

//       setMarkers(newMarkers);
//       map.setView([BUXAR_CENTER.lat, BUXAR_CENTER.lng], 13);
//     } catch (error) {
//       console.error('Category search error:', error);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           const L = (window as any).L;
//           const map = (window as any).leafletMap;
//           if (!L || !map) return;

//           map.flyTo([latitude, longitude], 15);
//           const marker = L.marker([latitude, longitude]).addTo(map);
//           marker.bindPopup('<strong>Your Location</strong>').openPopup();

//           setMarkers([{
//             position: [latitude, longitude],
//             name: 'Your Location',
//             type: 'current_location',
//           }]);
//         },
//         (error) => {
//           alert('Unable to get your location.');
//         }
//       );
//     }
//   };

//   const clearMarkers = () => {
//     const L = (window as any).L;
//     const map = (window as any).leafletMap;
//     if (!L || !map) return;

//     map.eachLayer((layer: any) => {
//       if (layer instanceof L.Marker) {
//         map.removeLayer(layer);
//       }
//     });

//     setMarkers([]);
//     setSelectedCategory(null);
//   };

//   return (
//     <div className="relative w-full h-[100dvh] overflow-hidden">
//       {/* Search Bar */}
//       <div className="absolute top-4 left-4 right-4 z-[1000] max-w-2xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg">
//           <div className="flex items-center gap-3 px-4 py-3 border-b">
//             <Search className="text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search places in Buxar..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="flex-1 outline-none text-sm text-gray-900"
//             />
//             {searchQuery && (
//               <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
//                 <X size={18} />
//               </button>
//             )}
//           </div>

//           {searchResults.length > 0 && (
//             <div className="max-h-64 overflow-y-auto">
//               {searchResults.map((result, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleResultClick(result)}
//                   className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
//                 >
//                   <div className="flex items-start gap-2">
//                     <MapPin className="text-blue-500 mt-1 flex-shrink-0" size={16} />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-900 truncate">
//                         {result.display_name.split(',')[0]}
//                       </p>
//                       <p className="text-xs text-gray-500 truncate">
//                         {result.display_name}
//                       </p>
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}

//           {isSearching && (
//             <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
//           )}
//         </div>
//       </div>

//       {/* Category Pills */}
//       <div className="absolute top-20 left-4 right-4 z-[1000] max-w-2xl mx-auto">
//         <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
//           {CATEGORIES.map((category) => (
//             <button
//               key={category.id}
//               onClick={() => handleCategoryClick(category)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
//                 selectedCategory === category.id
//                   ? `${category.color} text-white shadow-lg`
//                   : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               {category.icon}
//               {category.name}
//             </button>
//           ))}
//           {markers.length > 0 && (
//             <button
//               onClick={clearMarkers}
//               className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 whitespace-nowrap"
//             >
//               <X size={16} />
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <button
//         onClick={getCurrentLocation}
//         className="absolute bottom-24 right-4 z-[1000] bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
//         title="Get current location"
//       >
//         <Navigation className="text-blue-500" size={24} />
//       </button>

//       {/* Marker Counter */}
//       {markers.length > 0 && (
//         <div className="absolute bottom-24 left-4 z-[1000] bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-gray-900">
//           {markers.length} {markers.length === 1 ? 'location' : 'locations'}
//         </div>
//       )}

//       {/* Map Container */}
//       <div id="map" className="w-full h-full" />

//       {!mapLoaded && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading map...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
const MapExplorer = () => {
  return (
    <div className="w-full h-[100dvh]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16051.47740450715!2d83.9611624527454!3d25.565940852695707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399275985564a721%3A0x3c49a62eeb3d93be!2sBuxar%2C%20Bihar!5e1!3m2!1sen!2sin!4v1775291515374!5m2!1sen!2sin"
        title="Buxar map"
        className="w-full h-full border-0"
        allow="fullscreen"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}

export default MapExplorer