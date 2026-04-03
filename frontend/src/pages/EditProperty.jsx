import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, Loader2, X, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [stage, setStage] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    
    const [formData, setFormData] = useState({
        title: '', description: '', propertyType: 'Apartment', bhk: '1',
        location: 'Solapur', address: '', images: [], amenities: [],
        price: '', area: '',
    });
    
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    const amenitiesData = {
        Safety: ['Security Guard', 'Gated Entry', 'Fire Extinguisher'],
        Comfort: ['AC', 'WiFi', 'Water Supply', 'Parking', 'Power Backup'],
        Luxury: ['Gym', 'Swimming Pool', 'Elevator', 'Smart Home'],
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoadingData(true);
                const { data } = await API.get(`/properties/${id}`);
                if (data.success) {
                    const p = data.property;
                    setFormData({
                        title: p.title || '',
                        description: p.description || '',
                        propertyType: p.propertyType || 'Apartment',
                        bhk: p.bedrooms === 0 ? '1RK' : p.bedrooms?.toString() || '1',
                        location: p.location || 'Solapur',
                        address: p.address || '',
                        images: p.images || [],
                        amenities: p.amenities || [],
                        price: p.price || '',
                        area: p.area || '',
                    });
                }
            } catch (err) { 
                setErrors({ fetch: "Could not load property data" }); 
            } finally { 
                setLoadingData(false); 
            }
        };
        fetchDetails();
    }, [id]);

    const handleFileUpload = async (files) => {
        setIsUploading(true);
        const uploadedUrls = [];
        for (const file of files) {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "solapur_rentals");
            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/dzth7zvc9/image/upload", { method: "POST", body: data });
                const fileData = await res.json();
                if(fileData.secure_url) uploadedUrls.push(fileData.secure_url);
            } catch (err) { console.error(err); }
        }
        setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
        setIsUploading(false);
    };

    const handleNext = () => { setStage(stage + 1); };

    const handleSubmit = async () => {
        try {
            const finalData = {
                ...formData,
                price: Number(formData.price),
                area: Number(formData.area),
                bedrooms: Number(formData.bhk === '1RK' ? 0 : formData.bhk),
            };
            const response = await API.put(`/properties/${id}`, finalData);
            if (response.data.success) {
                setShowSuccess(true);
                setTimeout(() => navigate('/owner/dashboard'), 2000);
            }
        } catch (err) { 
            setErrors({ submit: err.response?.data?.message || "Update Failed" }); 
        }
    };

    if (loadingData) return (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-blue-500 gap-4">
            <Loader2 className="animate-spin" size={40} />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Syncing Property Data...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24 font-sans">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20}/> Back to Dashboard
                </button>
                
                <h2 className="text-4xl font-black mb-2 italic">Edit Listing</h2>
                <p className="text-purple-500 mb-12 uppercase text-[10px] tracking-widest font-bold">Modifying: {formData.title}</p>

                <div className="flex gap-2 mb-12">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= stage ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-white/10'}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* STAGE 1: BASIC INFO */}
                    {stage === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            <input type="text" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 transition-all"
                                onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title} placeholder="Title" />
                            <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-32 outline-none focus:border-blue-500 transition-all"
                                onChange={(e) => setFormData({...formData, description: e.target.value})} value={formData.description} placeholder="Description" />
                            <div className="grid grid-cols-2 gap-4">
                                <select className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none" 
                                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})} value={formData.propertyType}>
                                    <option className="bg-black" value="Apartment">Apartment</option>
                                    <option className="bg-black" value="House">House</option>
                                    <option className="bg-black" value="PG">PG</option>
                                </select>
                                <select className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none" 
                                    onChange={(e) => setFormData({...formData, bhk: e.target.value})} value={formData.bhk}>
                                    <option className="bg-black" value="1RK">1 RK</option>
                                    <option className="bg-black" value="1">1 BHK</option>
                                    <option className="bg-black" value="2">2 BHK</option>
                                    <option className="bg-black" value="3">3 BHK</option>
                                </select>
                            </div>
                            <input type="text" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 transition-all"
                                onChange={(e) => setFormData({...formData, address: e.target.value})} value={formData.address} placeholder="Address" />
                        </motion.div>
                    )}

                    {/* STAGE 2: MEDIA (With Existing Images) */}
                    {stage === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center hover:bg-white/5 cursor-pointer">
                                <input type="file" multiple hidden ref={fileInputRef} onChange={(e) => handleFileUpload(e.target.files)} />
                                {isUploading ? <Loader2 className="mx-auto animate-spin text-blue-500" /> : <p className="font-bold uppercase text-xs tracking-widest">Click to add more photos</p>}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {formData.images.map((url, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden aspect-video border border-white/10">
                                        <img src={url} className="w-full h-full object-cover" alt="" />
                                        <button onClick={() => setFormData(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}))} className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full"><X size={12}/></button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE 3: AMENITIES (With Selected Items) */}
                    {stage === 3 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                             {Object.entries(amenitiesData).map(([cat, items]) => (
                                <div key={cat} className="space-y-4">
                                    <h3 className="text-blue-500 font-black text-xs uppercase tracking-widest">{cat}</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {items.map(item => (
                                            <button key={item} onClick={() => setFormData(prev => ({
                                                ...prev, amenities: prev.amenities.includes(item) ? prev.amenities.filter(a => a !== item) : [...prev.amenities, item]
                                            }))} className={`p-4 rounded-xl border text-sm font-bold transition-all ${formData.amenities.includes(item) ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 bg-white/5 text-gray-500'}`}>{item}</button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* STAGE 4: PRICING (With Existing Values) */}
                    {stage === 4 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-blue-500 ml-1">Monthly Rent (₹)</label>
                                    <input type="number" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-2xl font-black outline-none focus:border-green-500 transition-all"
                                        onChange={(e) => setFormData({...formData, price: e.target.value})} value={formData.price} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Area (Sq. Ft.)</label>
                                    <input type="number" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 transition-all"
                                        onChange={(e) => setFormData({...formData, area: e.target.value})} value={formData.area} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-4 mt-12 mb-20">
                    {stage > 1 && <button onClick={() => setStage(stage - 1)} className="flex-1 p-5 rounded-2xl border border-white/10 font-bold hover:bg-white/5 transition-all">Back</button>}
                    <button onClick={stage === 4 ? handleSubmit : handleNext} className="flex-[2] p-5 rounded-2xl bg-blue-600 font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-600/20">
                        {stage === 4 ? 'Save Changes' : 'Next Step'}
                    </button>
                </div>
            </div>

            {showSuccess && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200] backdrop-blur-xl">
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-4xl font-black italic">UPDATE SUCCESSFUL</h2>
                        <p className="text-gray-500 mt-2">Redirecting to your dashboard...</p>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default EditProperty;