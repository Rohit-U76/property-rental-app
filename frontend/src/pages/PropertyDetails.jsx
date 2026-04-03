import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Loader, ChevronLeft, Phone, Mail, Bath, Bed, Square, CheckCircle2, ShieldCheck } from 'lucide-react';
import API from '../api/axios';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingStatus, setBookingStatus] = useState('idle'); // idle, loading, success

    // Replace your fetchDetails useEffect with this robust version:
            useEffect(() => {
                const fetchDetails = async () => {
                    try {
                        setLoading(true);
                        const { data } = await API.get(`/properties/${id}`);
                        // This handles the new 'populate' structure
                        setProperty(data.property); 
                    } catch (err) {
                        console.error("Error fetching details:", err);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchDetails();
            }, [id]);

    const handleBooking = async () => {
    setBookingStatus('loading');
    try {
        const { data } = await API.post('/bookings', { propertyId: id });
        
        if (data.success) {
            setBookingStatus('success');
            // Reset to idle after 3 seconds so they can see the success state
            setTimeout(() => {
                setBookingStatus('idle');
                navigate('/tenant/dashboard'); // Dynamically move to their dashboard to see the request
            }, 2000);
        }
    } catch (err) {
        alert(err.response?.data?.message || "Please login as a Tenant to book.");
        setBookingStatus('idle');
    }
};

// Update your Button JSX:
<button 
    onClick={handleBooking}
    disabled={bookingStatus !== 'idle'}
    className={`w-full font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${
        bookingStatus === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
    }`}
>
    {bookingStatus === 'loading' && <Loader className="animate-spin" size={20} />}
    {bookingStatus === 'success' && <CheckCircle2 size={20} />}
    {bookingStatus === 'idle' && "REQUEST BOOKING"}
    {bookingStatus === 'loading' && "PROCESSING..."}
    {bookingStatus === 'success' && "REQUEST SENT!"}
</button>

    if (loading) return (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-blue-500 gap-4">
            <Loader className="animate-spin" size={40} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Property...</p>
        </div>
    );

    if (!property) return <div className="h-screen bg-black text-white flex items-center justify-center">Property Not Found</div>;

    return (
        <div className="bg-black min-h-screen text-white pb-20 font-sans">
            {/* HERO SECTION */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img src={property.images?.[0]} className="w-full h-full object-cover opacity-50" alt={property.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <button onClick={() => navigate(-1)} className="absolute top-10 left-10 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 border border-white/10 transition-all"><ChevronLeft /></button>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
                <div className="grid lg:grid-cols-3 gap-10">
                    
                    {/* LEFT COLUMN: FEATURES */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
                                    {property.propertyType} • {property.bhk} BHK
                                </span>
                                <span className="bg-green-600/20 text-green-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/30">
                                    Verified Listing
                                </span>
                            </div>

                            <h1 className="text-5xl font-black mb-4 tracking-tighter leading-tight">{property.title}</h1>
                            <div className="flex items-center gap-2 text-gray-400 mb-10">
                                <MapPin size={20} className="text-blue-500" />
                                <span className="text-lg">{property.address}</span>
                            </div>

                            {/* CORE SPECS */}
                            <div className="grid grid-cols-3 gap-6 p-8 bg-white/5 rounded-3xl border border-white/5 mb-10 text-center">
                                <div className="space-y-2"><Bed className="mx-auto text-blue-400"/><p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Beds</p><p className="font-black text-xl">{property.bedrooms || '2'}</p></div>
                                <div className="space-y-2"><Bath className="mx-auto text-purple-400"/><p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Baths</p><p className="font-black text-xl">{property.bathrooms || '2'}</p></div>
                                <div className="space-y-2"><Square className="mx-auto text-green-400"/><p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Sq. Ft.</p><p className="font-black text-xl">{property.area || '950'}</p></div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-black italic">Key Amenities</h3>
                                <div className="flex flex-wrap gap-3">
                                    {property.amenities?.map(item => (
                                        <div key={item} className="flex items-center gap-2 bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-sm text-gray-300">
                                            <CheckCircle2 size={14} className="text-blue-500" /> {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 pt-12 border-t border-white/10">
                                <h3 className="text-xl font-black italic mb-4">The Space</h3>
                                <p className="text-gray-400 leading-relaxed text-lg italic">{property.description}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: BOOKING & OWNER */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* PRICE CARD */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl sticky top-28">
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-1">Monthly Cost</p>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-6xl font-black text-white">₹{property.price?.toLocaleString()}</span>
                                <span className="text-gray-500">/mo</span>
                            </div>

                            <button 
                                onClick={handleBooking}
                                disabled={bookingStatus !== 'idle'}
                                className={`w-full font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-xs ${
                                    bookingStatus === 'success' ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                                }`}
                            >
                                {bookingStatus === 'loading' ? 'Processing...' : bookingStatus === 'success' ? 'Request Sent!' : 'Request Booking'}
                            </button>

                            {/* OWNER DETAILS SECTION */}
                            <div className="mt-10 pt-10 border-t border-white/10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center font-black text-blue-400 border border-blue-500/30">
                                        {property.owner?.name?.charAt(0) || 'O'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Listed By</p>
                                        <p className="font-bold text-white text-lg flex items-center gap-2">
                                            {property.owner?.name || 'Private Owner'} <ShieldCheck size={16} className="text-blue-500" />
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                        <Phone size={18} className="text-green-500" />
                                        <p className="text-sm font-bold text-gray-300">{property.owner?.phone || '+91 98905 11256'}</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                        <Mail size={18} className="text-purple-500" />
                                        <p className="text-sm font-bold text-gray-300">{property.owner?.email || 'owner@prophub.com'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;