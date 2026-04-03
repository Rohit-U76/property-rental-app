import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Mail, Phone, Camera, Trash2, ArrowLeft, Edit3, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [wishlist, setWishlist] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        profilePicture: user?.profilePicture || ''
    });

    useEffect(() => {
        if (user) {
            setEditForm({ name: user.name, phone: user.phone, profilePicture: user.profilePicture });
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [wishRes, bookRes] = await Promise.all([
                API.get('/wishlist'),
                API.get('/bookings/tenant/my-bookings').catch(() => ({ data: { bookings: [] } }))
            ]);
            // Logic fix: Ensure we set the array correctly
            setWishlist(wishRes.data.wishlist || []);
            setBookings(bookRes.data.bookings || []);
        } catch (err) { console.error("Sync Error", err); }
    };

    const handleUpdateProfile = async () => {
        try {
            setIsUpdating(true);
            const res = await API.put('/auth/profile', editForm);
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setIsEditing(false);
                alert("Profile successfully updated!");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Error saving profile");
        } finally { setIsUpdating(false); }
    };

    const handleRemoveFavorite = async (propertyId) => {
        try {
            // This calls the toggle route to physically delete from MongoDB
            const res = await API.post('/wishlist/toggle', { propertyId });
            if (res.data.success) {
                // Update local state so it disappears instantly
                setWishlist(prev => prev.filter(p => p._id !== propertyId));
            }
        } catch (err) { alert("Delete failed on server"); }
    };

    if (!user) return <div className="h-screen bg-black flex items-center justify-center text-blue-500 font-black italic">LOADING...</div>;

    return (
        <div className="min-h-screen bg-black pt-32 px-6 pb-20 text-white font-sans text-left">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-widest mb-10 transition-all"><ArrowLeft size={16}/> Back</button>
                
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* PROFILE CARD */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 backdrop-blur-xl sticky top-32 shadow-2xl">
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black border-2 border-white/10 overflow-hidden">
                                    {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : user.name[0]}
                                </div>
                            </div>
                            <div className="text-center mb-10">
                                {isEditing ? <input className="w-full bg-white/5 border border-blue-500/30 p-3 rounded-xl text-center font-bold text-white outline-none" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} /> : <h1 className="text-3xl font-black italic tracking-tighter">{user.name}</h1>}
                                <span className="inline-block bg-blue-600/10 text-blue-400 px-4 py-1 rounded-full text-[10px] font-black uppercase mt-2 border border-blue-500/20">Tenant Member</span>
                            </div>
                            <div className="space-y-4 border-t border-white/5 pt-10">
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5"><Mail size={18} className="text-blue-500"/><p className="text-sm truncate opacity-60">{user.email}</p></div>
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5"><Phone size={18} className="text-green-500"/><p className="font-bold">{user.phone || "No Phone"}</p></div>
                            </div>
                            <button onClick={() => setIsEditing(!isEditing)} className="w-full mt-10 bg-white/5 border border-white/10 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
                                {isEditing ? "Cancel" : <><Edit3 size={14}/> Edit Profile</>}
                            </button>
                            {isEditing && <button onClick={handleUpdateProfile} className="w-full mt-2 bg-blue-600 py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl">Save Changes</button>}
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-12">
                        {/* ACTIVITY LOG */}
                        <section>
                            <h3 className="text-2xl font-black italic mb-8 text-blue-400 flex items-center gap-4 uppercase tracking-tighter">Activity Log <div className="h-px flex-1 bg-white/5" /></h3>
                            {bookings.map(book => (
                                <Link key={book._id} to={`/property/${book.property?._id}`} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] flex justify-between items-center mb-4 border-l-4 border-l-blue-600 shadow-xl hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 font-black">{book.property?.title?.[0]}</div>
                                        <p className="font-bold text-white text-lg">{book.property?.title}</p>
                                    </div>
                                    <span className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase">{book.status}</span>
                                </Link>
                            ))}
                        </section>

                        {/* SAVED PROPERTIES */}
                        <section>
                            <h3 className="text-2xl font-black italic mb-8 text-red-500 flex items-center gap-4 uppercase tracking-tighter">Saved Properties <div className="h-px flex-1 bg-white/5" /></h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                {wishlist.map(prop => (
                                    <div key={prop._id} className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] overflow-hidden group relative hover:border-red-500/30 transition-all shadow-2xl">
                                        <button 
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveFavorite(prop._id); }} 
                                            className="absolute top-6 right-6 z-50 bg-red-600 p-3 rounded-2xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <Trash2 size={18}/>
                                        </button>
                                        <Link to={`/property/${prop._id}`} className="block text-left">
                                            <div className="h-48 overflow-hidden">
                                                <img src={prop.images?.[0] || 'https://via.placeholder.com/600'} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700" alt=""/>
                                            </div>
                                            <div className="p-8">
                                                <h4 className="font-black text-xl truncate text-white group-hover:text-red-400 transition-colors italic">{prop.title}</h4>
                                                <p className="text-gray-500 text-[10px] font-black mt-2 uppercase tracking-widest italic">₹{prop.price?.toLocaleString()}/mo</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            {wishlist.length === 0 && <p className="text-gray-600 font-bold uppercase tracking-widest text-xs py-10">No saved properties yet.</p>}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;