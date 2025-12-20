'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Lock, Mail, ArrowRight, ShieldCheck, Loader2, Plane, MapPin, BarChart3, PieChart, TrendingUp, Compass, Activity, Database, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Login failed');
            }

            // Success
            router.push('/');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid credentials');
            setLoading(false);
        }
    };

    // Configuration for floating background vectors - LEFT SIDE (MASSIVE)
    const floatingIcons = [
        // Layer 1: Close to center, medium size
        { Icon: Plane, delay: 0, x: -100, y: -50, size: 48, className: "text-blue-500/30" },
        { Icon: MapPin, delay: 0.5, x: 100, y: 100, size: 56, className: "text-emerald-500/30" },
        { Icon: BarChart3, delay: 1, x: -50, y: 150, size: 64, className: "text-indigo-500/30" },
        { Icon: PieChart, delay: 1.5, x: 120, y: -80, size: 40, className: "text-rose-500/30" },
        { Icon: TrendingUp, delay: 2, x: -120, y: 80, size: 52, className: "text-amber-500/30" },
        { Icon: Compass, delay: 2.5, x: 80, y: -120, size: 44, className: "text-cyan-500/30" },
        { Icon: Globe, delay: 3, x: -150, y: -100, size: 36, className: "text-purple-500/30" },
        { Icon: Activity, delay: 3.5, x: 150, y: 50, size: 42, className: "text-teal-500/30" },
        // Layer 2: Further out, larger
        { Icon: Database, delay: 0.2, x: -200, y: 200, size: 80, className: "text-white/10" },
        { Icon: Server, delay: 0.7, x: 200, y: -200, size: 70, className: "text-white/10" },
        { Icon: Plane, delay: 1.2, x: 180, y: 180, size: 60, className: "text-sky-500/20" },
        { Icon: MapPin, delay: 1.7, x: -180, y: -180, size: 55, className: "text-pink-500/20" },
        { Icon: BarChart3, delay: 2.2, x: -220, y: 50, size: 65, className: "text-violet-500/20" },
        { Icon: PieChart, delay: 2.7, x: 220, y: -50, size: 50, className: "text-orange-500/20" },
        // Layer 3: Deep background, very large, very faint
        { Icon: Globe, delay: 0.4, x: -250, y: -250, size: 120, className: "text-white/5 blur-sm" },
        { Icon: Compass, delay: 0.9, x: 250, y: 250, size: 110, className: "text-white/5 blur-sm" },
        { Icon: TrendingUp, delay: 1.4, x: 280, y: -100, size: 100, className: "text-white/5 blur-sm" },
        { Icon: Activity, delay: 1.9, x: -280, y: 100, size: 95, className: "text-white/5 blur-sm" },
        // Layer 4: Scattered extras
        { Icon: Database, delay: 4, x: 50, y: -220, size: 45, className: "text-lime-500/20" },
        { Icon: Server, delay: 4.5, x: -50, y: 220, size: 50, className: "text-red-500/20" },
        { Icon: Plane, delay: 5, x: -300, y: 0, size: 75, className: "text-blue-400/15" },
        { Icon: MapPin, delay: 5.5, x: 300, y: 0, size: 70, className: "text-emerald-400/15" },
        { Icon: BarChart3, delay: 6, x: 0, y: -280, size: 85, className: "text-indigo-400/15" },
        { Icon: PieChart, delay: 6.5, x: 0, y: 280, size: 80, className: "text-rose-400/15" },
    ];

    // Right Side Vectors - INCREASED
    const subtleVectors = [
        // Primary layer
        { Icon: Plane, delay: 0, x: 80, y: 80, size: 50, className: "text-slate-300/60" },
        { Icon: MapPin, delay: 0.8, x: -70, y: 120, size: 55, className: "text-slate-300/60" },
        { Icon: TrendingUp, delay: 1.6, x: 100, y: -80, size: 45, className: "text-slate-300/60" },
        { Icon: Globe, delay: 2.4, x: -90, y: -100, size: 60, className: "text-slate-300/60" },
        { Icon: Compass, delay: 3.2, x: 40, y: 150, size: 40, className: "text-slate-300/60" },
        { Icon: BarChart3, delay: 4, x: -120, y: 60, size: 48, className: "text-slate-300/60" },
        { Icon: PieChart, delay: 4.8, x: 130, y: -130, size: 52, className: "text-slate-300/60" },
        // Secondary layer - larger, further
        { Icon: Activity, delay: 0.5, x: -150, y: -150, size: 70, className: "text-slate-200/40" },
        { Icon: Database, delay: 1.5, x: 160, y: 160, size: 65, className: "text-slate-200/40" },
        { Icon: Server, delay: 2.5, x: -170, y: 100, size: 60, className: "text-slate-200/40" },
        { Icon: Plane, delay: 3.5, x: 180, y: -80, size: 55, className: "text-slate-200/40" },
        { Icon: MapPin, delay: 4.5, x: -60, y: 180, size: 50, className: "text-slate-200/40" },
        // Deep background layer
        { Icon: Globe, delay: 1, x: 200, y: 50, size: 90, className: "text-slate-100/30" },
        { Icon: Compass, delay: 2, x: -200, y: -50, size: 85, className: "text-slate-100/30" },
        { Icon: TrendingUp, delay: 3, x: 100, y: 200, size: 80, className: "text-slate-100/30" },
    ];

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 overflow-hidden">
            {/* Left Side: Branding & Immersive Visuals */}
            <div className="relative hidden lg:flex flex-col items-center justify-center p-12 bg-slate-900 overflow-hidden text-center text-white">
                {/* 1. Deep Space Background */}
                <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
                </div>

                {/* 2. Animated Mesh Gradients (Blobs) - Intensified */}
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, 90, 180, 270, 360],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-30%] right-[-30%] w-[1000px] h-[1000px] bg-gradient-to-br from-indigo-600/30 to-blue-600/30 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, -180, -270, -360],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] left-[-20%] w-[800px] h-[800px] bg-gradient-to-tr from-emerald-600/20 to-teal-600/20 rounded-full blur-[100px]"
                />

                {/* 3. Floating Vector Icons - Slow Random Movement Across Whole Area */}
                <div className="absolute inset-0 overflow-hidden">
                    {floatingIcons.map(({ Icon, delay, x, y, size, className }, i) => {
                        // Generate positions covering the FULL area with SLOWER movement
                        const startX = (i * 19 + 5) % 95; // 0-100% width
                        const startY = (i * 13 + 5) % 95; // 0-100% height
                        const midX = ((i * 43 + 50) % 90) + 5;
                        const midY = ((i * 37 + 60) % 85) + 5;
                        const endX = ((i * 29 + 70) % 95);
                        const endY = ((i * 41 + 40) % 90) + 5;
                        const duration = 60 + (i * 8) % 60; // 60-120 seconds per cycle (MUCH SLOWER)
                        const iconDelay = i * 2; // More staggered starts

                        return (
                            <motion.div
                                key={i}
                                initial={{
                                    left: `${startX}%`,
                                    top: `${startY}%`,
                                    opacity: 0
                                }}
                                animate={{
                                    left: [`${startX}%`, `${midX}%`, `${endX}%`, `${startX}%`],
                                    top: [`${startY}%`, `${endY}%`, `${midY}%`, `${startY}%`],
                                    opacity: [0.3, 0.7, 0.5, 0.3],
                                    rotate: [0, 20, -15, 10, 0]
                                }}
                                transition={{
                                    duration: duration,
                                    delay: iconDelay,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className={`absolute ${className}`}
                            >
                                <Icon size={size} />
                            </motion.div>
                        );
                    })}
                    {/* Ambient particles - slower and more spread out */}
                    {[...Array(30)].map((_, i) => {
                        const startX = (i * 31 + 2) % 96;
                        const startY = (i * 29 + 2) % 96;
                        const endX = ((i * 43 + 50) % 94) + 3;
                        const endY = ((i * 37 + 45) % 92) + 4;
                        const particleSize = 2 + (i % 4);
                        const duration = 50 + (i * 3) % 40; // 50-90 seconds (slower particles)

                        return (
                            <motion.div
                                key={`particle-${i}`}
                                className="absolute bg-white rounded-full"
                                initial={{
                                    left: `${startX}%`,
                                    top: `${startY}%`,
                                    opacity: 0
                                }}
                                animate={{
                                    left: [`${startX}%`, `${endX}%`, `${startX}%`],
                                    top: [`${startY}%`, `${endY}%`, `${startY}%`],
                                    opacity: [0, 0.4, 0]
                                }}
                                transition={{
                                    duration: duration,
                                    repeat: Infinity,
                                    delay: i * 0.5
                                }}
                                style={{
                                    width: particleSize,
                                    height: particleSize
                                }}
                            />
                        );
                    })}
                </div>

                {/* 4. Glassmorph Digital Grid Overlay */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>

                {/* Content Container */}
                <div className="relative z-10 max-w-lg backdrop-blur-sm bg-slate-900/40 p-10 rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 opacity-50"></div>
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-28 h-28 mx-auto bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-[28px] flex items-center justify-center shadow-lg shadow-indigo-500/40 mb-8 border border-white/20 relative group"
                    >
                        <Globe className="w-14 h-14 text-white group-hover:animate-[spin_4s_linear_infinite]" />
                        <div className="absolute -inset-2 bg-indigo-500/50 rounded-[32px] blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400 drop-shadow-sm"
                    >
                        ATLAS<span className="text-emerald-400">INTEL</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-slate-300 leading-relaxed font-medium"
                    >
                        Access the world's most advanced travel intelligence.
                        <br />
                        <span className="text-indigo-400 font-bold tracking-wide">Monitor. Analyze. Dominate.</span>
                    </motion.p>
                </div>
            </div>

            {/* Right Side: Login Form with Floating Elements */}
            <div className="flex items-center justify-center p-6 lg:p-12 relative bg-slate-50">
                {/* Right Side - Slow Random Floating Vectors Covering Whole Area */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Slow, randomly drifting vectors across the entire area */}
                    {[
                        { Icon: Plane, color: "text-indigo-300/70", size: 55 },
                        { Icon: Globe, color: "text-emerald-300/70", size: 50 },
                        { Icon: BarChart3, color: "text-rose-300/70", size: 48 },
                        { Icon: Compass, color: "text-amber-300/70", size: 45 },
                        { Icon: TrendingUp, color: "text-violet-300/70", size: 52 },
                        { Icon: MapPin, color: "text-cyan-300/70", size: 50 },
                        { Icon: PieChart, color: "text-pink-300/70", size: 46 },
                        { Icon: Activity, color: "text-blue-300/70", size: 44 },
                        { Icon: Database, color: "text-teal-300/70", size: 48 },
                        { Icon: Server, color: "text-orange-300/70", size: 42 },
                        { Icon: Globe, color: "text-slate-300/50", size: 80 },
                        { Icon: Compass, color: "text-slate-300/50", size: 75 },
                        { Icon: Plane, color: "text-indigo-200/50", size: 60 },
                        { Icon: MapPin, color: "text-emerald-200/50", size: 55 },
                    ].map(({ Icon, color, size }, i) => {
                        // Generate positions covering FULL viewport with SLOW movement
                        const startX = (i * 17 + 2) % 96; // Full 0-100% width
                        const startY = (i * 23 + 3) % 94; // Full 0-100% height
                        const endX = ((i * 31 + 55) % 92) + 4; // Move across large distance
                        const endY = ((i * 29 + 60) % 88) + 6;
                        const midX = ((i * 41 + 35) % 90) + 5;
                        const midY = ((i * 37 + 45) % 86) + 7;
                        const duration = 60 + (i * 6) % 50; // 60-110 seconds per cycle (MUCH SLOWER)
                        const delay = i * 2.5; // More staggered starts

                        return (
                            <motion.div
                                key={`right-vector-${i}`}
                                initial={{
                                    left: `${startX}%`,
                                    top: `${startY}%`,
                                    rotate: 0
                                }}
                                animate={{
                                    left: [`${startX}%`, `${midX}%`, `${endX}%`, `${startX}%`],
                                    top: [`${startY}%`, `${endY}%`, `${midY}%`, `${startY}%`],
                                    rotate: [0, 15, -10, 5, 0]
                                }}
                                transition={{
                                    duration: duration,
                                    delay: delay,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className={`absolute ${color}`}
                            >
                                <Icon size={size} />
                            </motion.div>
                        );
                    })}
                </div>

                <div className="w-full max-w-md relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white p-8 lg:p-12 relative overflow-hidden group hover:shadow-[0_30px_70px_-15px_rgba(99,102,241,0.2)] transition-shadow duration-500"
                    >
                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                        <div className="mb-10 text-center relative">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-slate-900/20 transform group-hover:rotate-12 transition-transform duration-500">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
                            <p className="text-slate-500 font-medium">Secure Entry Point</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Account Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 hover:bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 font-medium outline-none shadow-inner"
                                            placeholder="admin@atlas.io"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 hover:bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 font-medium outline-none shadow-inner"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm"
                                    >
                                        <div className="p-1 bg-white rounded-full shadow-sm">
                                            <ShieldCheck className="w-3 h-3 text-rose-500" />
                                        </div>
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={loading}
                                className={cn(
                                    "w-full flex items-center justify-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4 group relative overflow-hidden",
                                    loading ? "cursor-wait" : ""
                                )}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-6 relative">
                            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-500 transition-colors cursor-default">
                                Powered by Bhidy
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
