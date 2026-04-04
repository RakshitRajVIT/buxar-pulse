import { useEffect, useState } from 'react';
import { User, LogOut, Plus, Trash2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, logout, observeAuthState, isAdminEmail } from '@/lib/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import AdminServiceForm from '@/components/AdminServiceForm';

export default function Profile() {
	const navigate = useNavigate();
	const [user, setUser] = useState<FirebaseUser | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isSigningIn, setIsSigningIn] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const unsubscribe = observeAuthState((authUser) => {
			setUser(authUser);
			setIsAdmin(authUser ? isAdminEmail(authUser.email) : false);
		});

		return unsubscribe;
	}, []);

	const handleSignIn = async () => {
		setError('');
		setIsSigningIn(true);
		try {
			await signInWithGoogle();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to sign in');
		} finally {
			setIsSigningIn(false);
		}
	};

	const handleLogout = async () => {
		setError('');
		try {
			await logout();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to sign out');
		}
	};

	return (
		<div className="min-h-screen pb-32" style={{ background: '#07071A' }}>
			{/* Header */}
			<div
				className="flex items-center gap-3 h-[72px] px-4 mb-6"
				style={{
					background: 'rgba(7,7,26,0.85)',
					backdropFilter: 'blur(20px)',
					borderBottom: '1px solid rgba(255,255,255,0.06)',
				}}
			>
				<User size={24} className="text-indigo-400" />
				<div>
					<h1 className="text-[22px] font-bold text-foreground">Profile</h1>
					<p className="text-[13px] text-muted-foreground">Account & Admin</p>
				</div>
			</div>

			<div className="px-4 space-y-4">
				{/* Auth Section */}
				<div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
					{!user ? (
						<>
							<p className="text-sm text-muted-foreground mb-4">Sign in with Google to continue</p>
							<button
								onClick={handleSignIn}
								disabled={isSigningIn}
								className="w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
								style={{
									background: 'linear-gradient(135deg, #4F46E5, #A78BFA)',
									color: 'white',
									opacity: isSigningIn ? 0.6 : 1,
									cursor: isSigningIn ? 'not-allowed' : 'pointer',
								}}
							>
								{isSigningIn ? 'Signing in...' : '🔐 Sign in with Google'}
							</button>
						</>
					) : (
						<>
							<div className="flex items-center gap-3 mb-4">
								{user.photoURL && (
									<img
										src={user.photoURL}
										alt="Profile"
										className="w-12 h-12 rounded-full"
									/>
								)}
								<div className="flex-1">
									<p className="text-sm font-semibold text-foreground">{user.displayName}</p>
									<p className="text-xs text-muted-foreground">{user.email}</p>
									{isAdmin && (
										<span
											className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium"
											style={{ background: '#f97316', color: 'white' }}
										>
											🔑 Admin
										</span>
									)}
								</div>
							</div>
							<button
								onClick={handleLogout}
								className="w-full h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-80"
								style={{
									background: 'rgba(239,68,68,0.1)',
									border: '1px solid rgba(239,68,68,0.3)',
									color: '#ef4444',
								}}
							>
								<LogOut size={14} /> Sign Out
							</button>
						</>
					)}
					{error && <p className="text-xs text-red-400 mt-2">{error}</p>}
				</div>

				{/* Admin Panel */}
				{isAdmin && user && (
					<div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
						<div className="flex items-center justify-between mb-4">
							<div>
								<h2 className="text-lg font-bold text-foreground">Manage Services</h2>
								<p className="text-xs text-muted-foreground">Add or update local services</p>
							</div>
							<button
								onClick={() => setShowForm(!showForm)}
								className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-105"
								style={{
									background: showForm ? 'rgba(239,68,68,0.2)' : 'rgba(74,146,196,0.2)',
									color: showForm ? '#ef4444' : '#4a92c4',
								}}
							>
								{showForm ? '✕' : <Plus size={18} />}
							</button>
						</div>

						{showForm && <AdminServiceForm onClose={() => setShowForm(false)} />}

						<div className="mt-6 pt-6 border-t border-foreground/10">
							<h3 className="text-sm font-semibold text-foreground mb-3">Admin Tips</h3>
							<ul className="space-y-2 text-xs text-muted-foreground">
								<li className="flex gap-2">
									<Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
									<span>Services are stored in Firebase Realtime Database</span>
								</li>
								<li className="flex gap-2">
									<Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
									<span>Add image URLs from external services (Cloudinary, etc.)</span>
								</li>
								<li className="flex gap-2">
									<Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
									<span>Changes appear live on Services page after refresh</span>
								</li>
								<li className="flex gap-2">
									<Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
									<span>To add more admin accounts, ask the owner</span>
								</li>
							</ul>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
