import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Home, BarChart3, LogOut, LayoutDashboard, Clock, Power, 
    User, Loader, CheckCircle, Edit3, Trash2, MapPin, Mail, Phone 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
    const { user, logout, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        profilePicture: user?.profilePicture || ''
    });

    const handleUpdateProfile = async () => {
        try {
            setIsUpdating(true);
            const response = await API.put('/auth/profile', editForm);
            if (response.data.success) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setIsEditing(false);
                alert("Profile Updated!");
            }
        } catch (err) { 
            alert("Update failed"); 
        } finally { 
            setIsUpdating(false); 
        }
    };

    useEffect(() => {
        if (user) { 
            fetchOwnerData();
        }
    }, [user]);

    const fetchOwnerData = async () => {
        try {
            setLoading(true);
            const response = await API.get('/properties/my-properties');
            
            if (response.data && response.data.success) {
                setProperties(response.data.properties || []);
            }
            
            try {
                const bookRes = await API.get('/bookings/owner/requests');
                setBookings(bookRes.data.bookings || []);
            } catch (e) {
                console.log("No bookings found");
            }
            
        } catch (err) {
            console.error("Fetch error:", err);
            setProperties([]); 
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const { data } = await API.patch(`/properties/${id}/toggle-status`);
            setProperties(properties.map(p => 
                p._id === id ? { ...p, isAvailable: data.isAvailable, status: data.status } : p
            ));
        } catch (err) { alert("Status Update Failed"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this listing?")) {
            try {
                await API.delete(`/properties/${id}`);
                setProperties(properties.filter(p => p._id !== id));
            } catch (err) { alert("Delete Failed"); }
        }
    };

    if (loading) return (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-purple-500 gap-4">
            <Loader className="animate-spin" size={40} />
            <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">Updating Your Workspace...</p>
        </div>
    );

    const PropertyManagementCard = ({ prop }) => (
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-6 group hover:border-purple-500/30 transition-all shadow-2xl relative overflow-hidden mb-6">
            
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-xl z-10 ${
                prop.isAvailable ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
                {prop.status || (prop.isAvailable ? 'Available' : 'Rented')}
            </div>
            
            <img 
                src={prop.images?.[0] || 'https://via.placeholder.com/400'} 
                className="w-full md:w-40 h-40 rounded-3xl object-cover shadow-2xl cursor-pointer" 
                onClick={() => navigate(`/property/${prop._id}`)}
                alt="" 
            />
            
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="text-xl font-black mb-1 truncate cursor-pointer hover:text-purple-400 transition-colors" onClick={() => navigate(`/property/${prop._id}`)}>
                        {prop.title}
                    </h4>
                    <p className="text-gray-500 flex items-center gap-2 text-xs italic mb-2"><MapPin size={12}/> {prop.location?.city || prop.location || "Solapur"}</p>
                    <p className="text-xl font-black text-white">₹{prop.price?.toLocaleString()}<span className="text-[10px] text-gray-500 font-normal">/mo</span></p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleToggleStatus(prop._id)} 
                            className={`p-2.5 rounded-xl transition-all ${prop.isAvailable ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                        >
                            <Power size={16}/>
                        </button>
                        <button 
                            onClick={() => navigate(`/edit-property/${prop._id}`)}
                            className="p-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                            <Edit3 size={16}/>
                        </button>
                    </div>
                    <button 
                        onClick={() => handleDelete(prop._id)} 
                        className="p-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    >
                        <Trash2 size={16}/>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
            <aside className="w-72 bg-white/5 border-r border-white/10 flex flex-col p-8 backdrop-blur-xl">
                <div className="mb-12">
                    <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic tracking-tighter">PropHub.Owner</span>
                </div>
                <nav className="flex-1 space-y-3">
                    {[{ icon: LayoutDashboard, label: 'Overview' }, { icon: Home, label: 'Portfolio' }, { icon: Clock, label: 'Requests' }, { icon: User, label: 'Account Profile' }].map(item => (
                        <button key={item.label} onClick={() => setActiveTab(item.label)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === item.label ? 'bg-purple-600 shadow-xl shadow-purple-600/20 text-white' : 'text-gray-500 hover:bg-white/5'}`}>
                            <item.icon size={20} /> {item.label}
                        </button>
                    ))}
                </nav>
                <button onClick={logout} className="mt-auto flex items-center gap-4 px-6 py-4 text-red-500 font-bold hover:bg-red-500/10 rounded-2xl transition-all">
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            <main className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black">
                <header className="flex justify-between items-center mb-16">
                    <div>
                        <h2 className="text-5xl font-black tracking-tighter italic">{activeTab}</h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Owner: {user?.name || "Member"}</p>
                    </div>
                    {/* FIXED NAVIGATION PATH */}
                    <button 
                        onClick={() => navigate('/add-property')}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-2xl font-black text-xs tracking-widest shadow-2xl shadow-purple-600/30 active:scale-95 transition-all"
                    >
                        + LIST PROPERTY
                    </button>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'Overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
                                    <p className="text-gray-500 font-bold text-[10px] uppercase">Active Listings</p>
                                    <h3 className="text-6xl font-black mt-4 text-purple-400">{properties?.length || 0}</h3>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
                                    <p className="text-gray-500 font-bold text-[10px] uppercase">Total Requests</p>
                                    <h3 className="text-6xl font-black mt-4 text-blue-400">{bookings?.length || 0}</h3>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
                                    <p className="text-gray-500 font-bold text-[10px] uppercase">Est. Revenue</p>
                                    <h3 className="text-6xl font-black mt-4 text-green-500">₹42k</h3>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-black italic border-l-4 border-purple-600 pl-4 mb-8">Management Center</h3>
                                {properties.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {properties.map(prop => <PropertyManagementCard key={prop._id} prop={prop} />)}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem]">
                                        <p className="text-gray-600 font-bold uppercase">No Properties Listed Yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                    {/* ... rest of your tabs (Account Profile, Portfolio) ... */}
                    {activeTab === 'Account Profile' && (
                        <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl bg-white/5 border border-white/10 rounded-[3.5rem] p-16 relative overflow-hidden">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
                            <div className="flex items-center gap-10 mb-12">
                                <div className="w-32 h-32 bg-purple-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-2xl overflow-hidden">
                                    {user?.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : (user?.name ? user.name[0] : 'U')}
                                </div>
                                <div>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            className="bg-white/10 border border-purple-500 p-2 rounded-lg text-2xl font-black outline-none text-white w-full"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                        />
                                    ) : (
                                        <h3 className="text-4xl font-black mb-2">{user?.name}</h3>
                                    )}
                                    <div className="space-y-2 mt-4 text-left">
                                        <p className="flex items-center gap-3 text-gray-400 text-sm italic"><Mail size={16} className="text-purple-500"/> {user?.email}</p>
                                        <div className="flex items-center gap-3 text-gray-400 text-sm italic">
                                            <Phone size={16} className="text-green-500"/> 
                                            {isEditing ? (
                                                <input 
                                                    className="bg-white/10 border border-white/20 p-1 rounded outline-none text-white text-sm"
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                                />
                                            ) : (
                                                <span>{user?.phone || 'Not Provided'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleUpdateProfile} disabled={isUpdating} className="flex-1 bg-green-600 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest">{isUpdating ? 'Saving...' : 'Save Changes'}</button>
                                        <button onClick={() => setIsEditing(false)} className="px-6 bg-white/10 py-3 rounded-2xl font-bold text-[10px] uppercase">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                        <Edit3 size={14}/> Edit Profile
                                    </button>
                                )}
                            </div>
                            <div className="p-8 bg-green-500/5 border border-green-500/10 rounded-3xl flex items-center gap-4 mt-8">
                                <CheckCircle className="text-green-500" />
                                <p className="font-bold text-xs text-green-500 uppercase tracking-widest">Verified Solapur Partner</p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'Portfolio' && (
                        <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             {properties.map(prop => <PropertyManagementCard key={prop._id} prop={prop} />)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default OwnerDashboard;