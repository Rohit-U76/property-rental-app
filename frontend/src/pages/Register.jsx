import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import API from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        phone: '', 
        role: 'Tenant' 
    });
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // ... inside your Register component
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        // Logically: axios baseURL (/api) + this path (/auth/signup) 
        // Result: /api/auth/signup
        const { data } = await API.post('/auth/signup', formData); 
        
        login(data.user, data.token);
        
        alert("Account Created Successfully!"); // Confirmation

        setTimeout(() => {
            navigate(data.user.role === 'Property Owner' ? '/owner/dashboard' : '/tenant/dashboard');
        }, 500);
        
    } catch (err) {
        console.error("Full Error Object:", err);
        const message = err.response?.data?.message || "Route not found. Check server console.";
        alert(message);
    } finally {
        setIsLoading(false);
    }
};
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden py-10">
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000" 
                    className="w-full h-full object-cover opacity-30 grayscale-[0.5]"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black to-black" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-lg p-8 mx-4"
            >
                <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[3rem] p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-black text-white tracking-tighter">Create Account</h2>
                        <p className="text-gray-400 mt-2 font-medium">Join the premium rental network in Solapur</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {['Tenant', 'Property Owner'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: r })}
                                    className={`py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest border-2 transition-all ${
                                        formData.role === r 
                                        ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                                        : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400" size={18} />
                            <input 
                                type="text" 
                                required
                                placeholder="Full Name"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500"
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400" size={18} />
                            <input 
                                type="email" 
                                required
                                placeholder="Email Address"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400" size={18} />
                            <input 
                                type="text" 
                                required
                                placeholder="Phone Number"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500"
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400" size={18} />
                            <input 
                                type="password" 
                                required
                                placeholder="Create Password"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 mt-6 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? "CREATING PROFILE..." : (
                                <>GET STARTED <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Already have an account? 
                            <Link to="/login" className="text-white font-bold ml-2 hover:text-blue-400 underline decoration-blue-500/30 underline-offset-4 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;