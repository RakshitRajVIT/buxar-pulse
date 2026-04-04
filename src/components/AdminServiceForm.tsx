import { useEffect, useState } from 'react';
import { ref, push, set, get, remove } from 'firebase/database';
import { realtimeDb } from '@/lib/firebase';
import { categories } from '@/data/places';

interface AdminServiceFormProps {
	onClose: () => void;
}

interface AdminServiceListItem {
	id: string;
	name?: string;
	category?: string;
	address?: string;
}

export default function AdminServiceForm({ onClose }: AdminServiceFormProps) {
	const [formData, setFormData] = useState({
		name: '',
		address: '',
		category: '',
		phone: '',
		photoUrl: '',
		rating: '',
		reviewsCount: '',
		isOpen: true,
		lat: '',
		lng: '',
		googleMapsUrl: '',
		description: '',
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState<string | null>(null);
	const [isLoadingList, setIsLoadingList] = useState(false);
	const [services, setServices] = useState<AdminServiceListItem[]>([]);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const loadServices = async () => {
		if (!realtimeDb) return;

		setIsLoadingList(true);
		try {
			const snapshot = await get(ref(realtimeDb, 'services'));
			if (!snapshot.exists()) {
				setServices([]);
				return;
			}

			const data = snapshot.val() as Record<string, Omit<AdminServiceListItem, 'id'>>;
			const list = Object.entries(data).map(([id, value]) => ({
				id,
				name: value?.name,
				category: value?.category,
				address: value?.address,
			}));

			setServices(list);
		} catch (loadError) {
			console.error('Failed to load services list for admin delete section.', loadError);
		} finally {
			setIsLoadingList(false);
		}
	};

	useEffect(() => {
		loadServices();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setIsSubmitting(true);

		try {
			if (!realtimeDb) {
				throw new Error('Database not available');
			}

			const serviceData = {
				name: formData.name.trim() || undefined,
				address: formData.address.trim() || undefined,
				category: formData.category || undefined,
				phone: formData.phone.trim() || undefined,
				photoUrl: formData.photoUrl.trim() || undefined,
				rating: formData.rating.trim() ? parseFloat(formData.rating) : undefined,
				reviewsCount: formData.reviewsCount.trim() ? parseInt(formData.reviewsCount) : undefined,
				isOpen: formData.isOpen,
				lat: formData.lat.trim() ? parseFloat(formData.lat) : undefined,
				lng: formData.lng.trim() ? parseFloat(formData.lng) : undefined,
				googleMapsUrl: formData.googleMapsUrl.trim() || undefined,
				description: formData.description.trim() || undefined,
				createdAt: new Date().toISOString(),
			};

			const servicesRef = ref(realtimeDb, 'services');
			const newServiceRef = push(servicesRef);
			await set(newServiceRef, serviceData);
			await loadServices();

			setSuccess('Service added successfully!');
			setFormData({
				name: '',
				address: '',
				category: '',
				phone: '',
				photoUrl: '',
				rating: '',
				reviewsCount: '',
				isOpen: true,
				lat: '',
				lng: '',
				googleMapsUrl: '',
				description: '',
			});

			setTimeout(() => {
				onClose();
			}, 1500);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to add service');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteService = async (serviceId: string) => {
		if (!realtimeDb) {
			setError('Database not available');
			return;
		}

		setError('');
		setSuccess('');
		setIsDeleting(serviceId);

		try {
			await remove(ref(realtimeDb, `services/${serviceId}`));
			setServices((prev) => prev.filter((item) => item.id !== serviceId));
			setSuccess('Service deleted successfully!');
		} catch (deleteError) {
			setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete service');
		} finally {
			setIsDeleting(null);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 mt-4">
			{/* Name */}
			<div>
				<label className="block text-xs font-semibold text-muted-foreground mb-1.5">
					Service Name
				</label>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="e.g., Hotel Grand Palace (optional)"
					className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:border-foreground/30"
				/>
			</div>

			{/* Category & Rating Row */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className="block text-xs font-semibold text-muted-foreground mb-1.5">
						Category
					</label>
					<select
						name="category"
						value={formData.category}
						onChange={handleChange}
						className="w-full px-3 py-2 rounded-lg bg-foreground/5 border  border-foreground/10 text-sm focus:outline-none focus:border-foreground/30"
					>
						<option value="" style={{ color: 'black' }}>
							Select category (optional)
						</option>
						{categories.map(cat => (
							<option key={cat.id} value={cat.id} style={{ color: 'black' }}>
								{cat.label}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-xs font-semibold text-muted-foreground mb-1.5">
						Rating
					</label>
					<input
						type="number"
						name="rating"
						value={formData.rating}
						onChange={handleChange}
						step="0.1"
						placeholder="e.g., 4.5"
						className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:border-foreground/30"
					/>
				</div>
			</div>

			{/* Address */}
			<div>
				<label className="block text-xs font-semibold text-muted-foreground mb-1.5">
					Address
				</label>
				<input
					type="text"
					name="address"
					value={formData.address}
					onChange={handleChange}
					placeholder="e.g., NH-84, Buxar"
					className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:border-foreground/30"
				/>
			</div>

			{/* Phone & Reviews Row */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className="block text-xs font-semibold text-muted-foreground mb-1.5">
						Phone
					</label>
					<input
						type="tel"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						placeholder="+91 9876543210"
						className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:border-foreground/30"
					/>
				</div>
				<div>
					<label className="block text-xs font-semibold text-muted-foreground mb-1.5">
						Review Count
					</label>
					<input
						type="number"
						name="reviewsCount"
						value={formData.reviewsCount}
						onChange={handleChange}
						placeholder="e.g., 120"
						className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:border-foreground/30"
					/>
				</div>
			</div>

			{/* Lat & Lng Row */}
			{/* <div className="grid grid-cols-2 gap-3">
				<div>
					<label className="block text-xs font-semibold text-muted-foreground mb-1.5">
						Latitude
					</label>
					<input
						type="number"
						name="lat"
						value={formData.lat}
						onChange={handleChange}
						step="0.0001"
						placeholder="25.5648"
						className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:border-foreground/30"
					/>
				</div>
				<div>
					<label className="block text-xs font-semibold text-muted-foreground mb-1.5">
						Longitude
					</label>
					<input
						type="number"
						name="lng"
						value={formData.lng}
						onChange={handleChange}
						step="0.0001"
						placeholder="83.9767"
						className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:border-foreground/30"
					/>
				</div>
			</div> */}

			{/* Photo URL */}
			<div>
				<label className="block text-xs font-semibold text-muted-foreground mb-1.5">
					Photo URL
				</label>
				<input
					type="text"
					name="photoUrl"
					value={formData.photoUrl}
					onChange={handleChange}
					placeholder="https://example.com/image.jpg"
					className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:border-foreground/30"
				/>
				<p className="text-xs text-muted-foreground mt-1">Use Cloudinary or similar free image host</p>
			</div>

			{/* Google Maps URL */}
			<div>
				<label className="block text-xs font-semibold text-muted-foreground mb-1.5">
					Google Maps URL (optional)
				</label>
				<input
					type="text"
					name="googleMapsUrl"
					value={formData.googleMapsUrl}
					onChange={handleChange}
					placeholder="https://maps.google.com/?q=..."
					className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:border-foreground/30"
				/>
			</div>

			{/* Description */}
			<div>
				<label className="block text-xs font-semibold text-muted-foreground mb-1.5">
					Description
				</label>
				<textarea
					name="description"
					value={formData.description}
					onChange={handleChange}
					placeholder="Brief summary of the service..."
					rows={3}
					className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:border-foreground/30 resize-none"
				/>
			</div>

			{/* Open Status */}
			<label className="flex items-center gap-2 cursor-pointer">
				<input
					type="checkbox"
					name="isOpen"
					checked={formData.isOpen}
					onChange={handleChange}
					className="w-4 h-4"
				/>
				<span className="text-xs text-muted-foreground">Currently open</span>
			</label>

			{/* Messages */}
			{error && (
				<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
					{error}
				</div>
			)}

			{success && (
				<div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
					{success}
				</div>
			)}

			{/* Submit Button */}
			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full h-10 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
				style={{
					background: 'linear-gradient(135deg, #4F46E5, #A78BFA)',
					color: 'white',
					opacity: isSubmitting ? 0.6 : 1,
					cursor: isSubmitting ? 'not-allowed' : 'pointer',
				}}
			>
				{isSubmitting ? 'Adding Service...' : '✓ Add Service'}
			</button>

			<div className="pt-5 mt-4 border-t border-foreground/10">
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-semibold text-foreground">Delete Existing Service</h3>
					<button
						type="button"
						onClick={loadServices}
						className="text-xs text-muted-foreground hover:text-foreground transition-colors"
					>
						Refresh
					</button>
				</div>

				{isLoadingList ? (
					<p className="text-xs text-muted-foreground">Loading services...</p>
				) : services.length === 0 ? (
					<p className="text-xs text-muted-foreground">No services found.</p>
				) : (
					<div className="space-y-2 max-h-64 overflow-y-auto pr-1">
						{services.map((service) => (
							<div
								key={service.id}
								className="flex items-center justify-between gap-2 p-2 rounded-lg border border-foreground/10 bg-foreground/[0.03]"
							>
								<div className="min-w-0">
									<p className="text-xs font-semibold text-foreground truncate">
										{service.name?.trim() || 'Unnamed Service'}
									</p>
									<p className="text-[11px] text-muted-foreground truncate">
										{service.category || 'no-category'}
										{service.address ? ` • ${service.address}` : ''}
									</p>
								</div>
								<button
									type="button"
									onClick={() => handleDeleteService(service.id)}
									disabled={isDeleting === service.id}
									className="px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all"
									style={{
										background: 'rgba(239,68,68,0.18)',
										color: '#ef4444',
										opacity: isDeleting === service.id ? 0.7 : 1,
										cursor: isDeleting === service.id ? 'not-allowed' : 'pointer',
									}}
								>
									{isDeleting === service.id ? 'Deleting...' : 'Delete'}
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</form>
	);
}
