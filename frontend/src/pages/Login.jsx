import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
import API from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await API.post('/auth/login', { email, password });
            login(data.user, data.token);
            
            // Smart Redirect based on role
            if (data.user.role === 'Property Owner') {
                navigate('/owner/dashboard');
            } else {
                navigate('/tenant/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed. Check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* 1. ANIMATED BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000" 
                    className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
                    alt="Premium Property"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-black/80 to-purple-900/40" />
            </div>

            {/* 2. LOGIN CARD */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-md p-8 mx-4"
            >
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="text-center mb-10">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                        >
                            <ShieldCheck size={32} className="text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
                        <p className="text-gray-400 mt-2 font-medium">Enter your details to access PropHub</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-blue-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input 
                                    type="email" 
                                    required
                                    placeholder="name@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-widest text-blue-400 ml-1">Password</label>
                                <button type="button" className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-tighter transition-colors">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:shadow-blue-500/20 transition-all disabled:opacity-50"
                        >
                            {isLoading ? "AUTHENTICATING..." : (
                                <>
                                    LOGIN TO PORTAL <ArrowRight size={20} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Don't have an account? 
                            <Link to="/register" className="text-white font-bold ml-2 hover:text-blue-400 transition-colors underline decoration-blue-500/30 underline-offset-4">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 3. DECORATIVE ELEMENTS */}
            <div className="absolute bottom-10 left-10 hidden lg:block">
                <p className="text-white/20 text-[8rem] font-black leading-none pointer-events-none">SOLAPUR</p>
            </div>
        </div>
    );
};

export default Login;