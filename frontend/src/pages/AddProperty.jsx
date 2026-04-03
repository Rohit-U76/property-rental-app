import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, Loader2, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AddProperty = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [stage, setStage] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    
    // Updated to match your Backend Model exactly
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        propertyType: 'Apartment', // Matches backend Enum
        bhk: '1',
        location: 'Solapur', // Matches backend 'location' field
        address: '',
        images: [],
        amenities: [],
        price: '',
        bedrooms: 1,
        bathrooms: 1,
        area: '',
    });
    
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    const amenitiesData = {
        Safety: ['Security Guard', 'Gated Entry', 'Fire Extinguisher'],
        Comfort: ['AC', 'WiFi', 'Water Supply', 'Parking', 'Power Backup'],
        Luxury: ['Gym', 'Swimming Pool', 'Elevator', 'Smart Home'],
    };

    const validateStage = () => {
        const newErrors = {};
        if (stage === 1) {
            if (!formData.title) newErrors.title = 'Title is required';
            if (!formData.description) newErrors.description = 'Description is required';
            if (!formData.address) newErrors.address = 'Address is required';
        }
        if (stage === 2 && formData.images.length === 0) newErrors.images = 'Upload at least one image';
        if (stage === 3 && formData.amenities.length === 0) newErrors.amenities = 'Select at least one amenity';
        if (stage === 4 && !formData.price) newErrors.price = 'Rent price is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStage()) setStage(stage + 1);
    };

    // --- CLOUDINARY UPLOAD LOGIC ---
    const handleFileUpload = async (files) => {
        setIsUploading(true);
        const uploadedUrls = [];

        for (const file of files) {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "solapur_rentals"); // Default preset or yours
            
            try {
                // REPLACE 'demo' with your Cloudinary Cloud Name
                const res = await fetch("https://api.cloudinary.com/v1_1/dzth7zvc9/image/upload", {
                method: "POST",
                body: data
                });
                const fileData = await res.json();
                if(fileData.secure_url) uploadedUrls.push(fileData.secure_url);
            } catch (err) {
                console.error("Upload error", err);
            }
        }
        setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
        setIsUploading(false);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
        handleFileUpload(files);
    }, []);

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        if (validateStage()) {
            try {
                // Ensure numbers are sent as numbers
                const finalData = {
                    ...formData,
                    price: Number(formData.price),
                    area: Number(formData.area),
                    bedrooms: Number(formData.bhk === '1RK' ? 0 : formData.bhk),
                };

                const response = await API.post('/properties', finalData);
                if (response.data.success) {
                    setShowSuccess(true);
                    setTimeout(() => navigate('/owner/dashboard'), 2000);
                }
            } catch (err) {
                setErrors({ submit: err.response?.data?.message || "Failed to list property" });
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans">
            <div className="max-w-3xl mx-auto pt-16">
                
                {/* Progress Visual */}
                <div className="flex gap-2 mb-12">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= stage ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-white/10'}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* STAGE 1: INFO */}
                    {stage === 1 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                            <h2 className="text-4xl font-black tracking-tighter mb-8 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Basic Details</h2>
                            
                            <div className="space-y-4">
                                <input type="text" placeholder="Property Title (e.g. Modern 2BHK near WIT)" 
                                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 transition-all"
                                    onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title} />
                                
                                <textarea placeholder="Description (Tell us about the space...)" 
                                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-32 outline-none focus:border-blue-500"
                                    onChange={(e) => setFormData({...formData, description: e.target.value})} value={formData.description} />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <select className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none" 
                                        onChange={(e) => setFormData({...formData, propertyType: e.target.value})} value={formData.propertyType}>
                                        <option className="bg-black" value="Apartment">Apartment</option>
                                        <option className="bg-black" value="House">Independent House</option>
                                        <option className="bg-black" value="PG">PG / Hostel</option>
                                        <option className="bg-black" value="Flat">Flat</option>
                                    </select>
                                    <select className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none" 
                                        onChange={(e) => setFormData({...formData, bhk: e.target.value})} value={formData.bhk}>
                                        <option className="bg-black" value="1RK">1 RK</option>
                                        <option className="bg-black" value="1">1 BHK</option>
                                        <option className="bg-black" value="2">2 BHK</option>
                                        <option className="bg-black" value="3">3 BHK</option>
                                    </select>
                                </div>

                                <input type="text" placeholder="Full Address in Solapur" 
                                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500"
                                    onChange={(e) => setFormData({...formData, address: e.target.value})} value={formData.address} />
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE 2: IMAGES */}
                    {stage === 2 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                            <h2 className="text-4xl font-black tracking-tighter mb-8">Property Media</h2>
                            <div 
                                onClick={() => fileInputRef.current.click()}
                                onDrop={handleDrop} 
                                onDragOver={(e) => e.preventDefault()} 
                                className="group border-2 border-dashed border-white/10 rounded-[2.5rem] p-16 text-center hover:bg-white/5 hover:border-blue-500/50 transition-all cursor-pointer relative"
                            >
                                <input type="file" multiple hidden ref={fileInputRef} onChange={(e) => handleFileUpload(e.target.files)} accept="image/*" />
                                {isUploading ? (
                                    <Loader2 className="mx-auto animate-spin text-blue-500" size={50} />
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                            <Upload className="text-blue-500" size={30} />
                                        </div>
                                        <p className="text-xl font-bold">Drop high-quality photos</p>
                                        <p className="text-gray-500 text-sm">Upload at least 1 photo to continue</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                {formData.images.map((url, i) => (
                                    <div key={i} className="relative group rounded-2xl overflow-hidden aspect-video border border-white/10">
                                        <img src={url} className="h-full w-full object-cover" alt="Upload" />
                                        <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {formData.images.length > 0 && (
                                    <button onClick={() => fileInputRef.current.click()} className="border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-white/5 transition-all">
                                        <Plus size={20} /> <span className="text-[10px] font-bold">ADD MORE</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE 3: AMENITIES */}
                    {stage === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <h2 className="text-4xl font-black tracking-tighter mb-8">Features & Amenities</h2>
                            {Object.entries(amenitiesData).map(([cat, items]) => (
                                <div key={cat} className="space-y-4">
                                    <h3 className="text-blue-500 font-black text-xs uppercase tracking-[0.2em]">{cat}</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {items.map(item => (
                                            <button key={item} 
                                                onClick={() => setFormData(prev => ({
                                                    ...prev, 
                                                    amenities: prev.amenities.includes(item) ? prev.amenities.filter(a => a !== item) : [...prev.amenities, item]
                                                }))} 
                                                className={`p-4 rounded-2xl border text-sm font-bold transition-all ${formData.amenities.includes(item) ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20'}`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* STAGE 4: PRICE */}
                    {stage === 4 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <h2 className="text-4xl font-black tracking-tighter mb-8">Final Pricing</h2>
                            <div className="space-y-6">
                                <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-blue-500 font-black text-[10px] uppercase tracking-widest ml-1">Monthly Rent (₹)</label>
                                        <input type="number" placeholder="Enter amount..." 
                                            className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-2xl font-black outline-none focus:border-green-500 transition-all"
                                            onChange={(e) => setFormData({...formData, price: e.target.value})} value={formData.price} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-500 font-black text-[10px] uppercase tracking-widest ml-1">Area (Sq. Ft.)</label>
                                        <input type="number" placeholder="Total area..." 
                                            className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500"
                                            onChange={(e) => setFormData({...formData, area: e.target.value})} value={formData.area} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ERROR DISPLAY */}
                {Object.keys(errors).length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                        <AlertCircle size={18} />
                        <p className="text-sm font-bold">{Object.values(errors)[0]}</p>
                    </motion.div>
                )}

                {/* NAVIGATION */}
                <div className="flex gap-4 mt-12 mb-20">
                    {stage > 1 && (
                        <button onClick={() => setStage(stage - 1)} className="flex-1 p-5 rounded-2xl border border-white/10 font-bold hover:bg-white/5 transition-all">
                            Back
                        </button>
                    )}
                    <button 
                        onClick={stage === 4 ? handleSubmit : handleNext} 
                        className="flex-[2] p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all active:scale-95 disabled:opacity-50"
                        disabled={isUploading}
                    >
                        {stage === 4 ? 'Confirm & List Property' : 'Next Step'}
                    </button>
                </div>
            </div>

            {/* SUCCESS OVERLAY */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200] backdrop-blur-xl">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                            <CheckCircle size={50} className="text-green-500" />
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter mb-4">SUCCESS!</h2>
                        <p className="text-gray-400 font-medium">Your luxury listing is being processed.</p>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AddProperty;