'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, User, Bell, Shield, Palette, Database, Globe, ArrowLeft, Camera, Mail, Lock, Moon, Sun, Monitor, Smartphone, Check, ChevronRight, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load saved avatar from localStorage on mount
    useEffect(() => {
        const savedAvatar = localStorage.getItem('user_avatar');
        if (savedAvatar) {
            setAvatarUrl(savedAvatar);
        }
    }, []);

    // Handle file selection and upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        setUploading(true);

        try {
            // Convert to base64 and store in localStorage
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                setAvatarUrl(base64);
                localStorage.setItem('user_avatar', base64);
                setUploading(false);
            };
            reader.onerror = () => {
                alert('Failed to read image');
                setUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Upload error:', error);
            setUploading(false);
        }
    };

    // Mock User Data
    const [user, setUser] = useState({
        name: 'Bhidy',
        email: 'mohamedbhidy@gmail.com',
        role: 'Administrator',
        bio: 'Managing global travel intelligence for Atlas Suite.',
        notifications: {
            emailReports: true,
            pushAlerts: false,
            weeklyDigest: true,
            marketing: false
        },
        security: {
            twoFactor: true,
            sessionTimeout: '30m'
        },
        appearance: {
            theme: 'light', // light, dark, system
            accent: 'indigo'
        }
    });

    const sections = [
        {
            id: 'profile',
            title: 'Profile Information',
            description: 'Update your personal details and public profile.',
            icon: User,
            color: 'indigo',
            gradient: 'from-indigo-500 to-violet-500',
            bg: 'bg-indigo-50',
            text: 'text-indigo-600'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Configure how and when you want to be alerted.',
            icon: Bell,
            color: 'rose',
            gradient: 'from-rose-500 to-pink-500',
            bg: 'bg-rose-50',
            text: 'text-rose-600'
        },
        {
            id: 'security',
            title: 'Security',
            description: 'Password, 2FA, and session management.',
            icon: Shield,
            color: 'emerald',
            gradient: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600'
        },
        {
            id: 'appearance',
            title: 'Appearance',
            description: 'Customize the look and feel of your dashboard.',
            icon: Palette,
            color: 'amber',
            gradient: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-50',
            text: 'text-amber-600'
        }
    ];

    const currentSection = sections.find(s => s.id === activeSection);

    return (
        <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8 min-h-screen">
            {/* Header */}
            <motion.div
                layout
                className="flex items-end justify-between bg-white/60 backdrop-blur-xl p-8 rounded-[40px] border border-white/60 shadow-lg shadow-slate-200/50"
            >
                <div className="flex items-center gap-6">
                    {activeSection && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setActiveSection(null)}
                            className="p-3 bg-white rounded-2xl shadow-md border border-slate-100 hover:bg-slate-50 transition-colors group"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
                        </motion.button>
                    )}
                    <div>
                        <motion.h1
                            layout="position"
                            key={activeSection ? 'sub' : 'main'}
                            className="text-4xl font-black text-slate-900 tracking-tight"
                        >
                            {activeSection ? currentSection?.title : 'Account Settings'}
                        </motion.h1>
                        <motion.p
                            layout="position"
                            className="text-slate-500 font-bold mt-2"
                        >
                            {activeSection ? currentSection?.description : 'Manage your preferences and system configurations'}
                        </motion.p>
                    </div>
                </div>
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/20">
                    <Settings className="w-7 h-7 text-white animate-spin-slow" />
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {!activeSection ? (
                    /* Grid View */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {sections.map((section) => (
                            <motion.div
                                key={section.id}
                                layoutId={`card-${section.id}`}
                                onClick={() => setActiveSection(section.id)}
                                className="group relative overflow-hidden bg-white rounded-[40px] p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                            >
                                {/* Background Vector */}
                                <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 pointer-events-none">
                                    <section.icon className={`w-72 h-72 text-${section.color}-600`} />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent z-0" />

                                <div className="relative z-10">
                                    <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 duration-300", section.bg)}>
                                        <section.icon className={cn("w-8 h-8", section.text)} />
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{section.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-8 pr-8">{section.description}</p>
                                    <div className={cn("inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-colors", section.bg, section.text)}>
                                        Open Settings <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* Detail Views */
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-white rounded-[48px] border border-slate-100 shadow-2xl overflow-hidden min-h-[600px] relative"
                    >
                        {/* Background Decor */}
                        <div className={cn("absolute top-0 right-0 w-[500px] h-[500px] rounded-bl-[200px] opacity-[0.03] pointer-events-none", currentSection?.bg.replace('50', '500'))} />

                        {/* Profile Section Content */}
                        {activeSection === 'profile' && (
                            <div className="p-12 max-w-4xl">
                                <div className="flex items-start gap-12">
                                    <div className="relative group">
                                        {/* Hidden File Input */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />

                                        <div className="w-40 h-40 rounded-[40px] bg-slate-100 overflow-hidden border-4 border-white shadow-2xl">
                                            {avatarUrl ? (
                                                <img
                                                    src={avatarUrl}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-4xl font-black text-white">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="absolute -bottom-4 -right-4 p-3 bg-white rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all text-slate-600 disabled:opacity-50"
                                        >
                                            {uploading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Camera className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-8">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={user.name}
                                                    onChange={e => setUser({ ...user, name: e.target.value })}
                                                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all border border-transparent focus:border-indigo-200"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</label>
                                                <div className="w-full px-5 py-4 bg-slate-50/50 rounded-2xl font-bold text-slate-500 border border-slate-100 flex items-center gap-2 cursor-not-allowed">
                                                    <Shield className="w-4 h-4" /> {user.role}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={user.email}
                                                    onChange={e => setUser({ ...user, email: e.target.value })}
                                                    className="w-full pl-14 pr-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all border border-transparent focus:border-indigo-200"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                                            <textarea
                                                value={user.bio}
                                                onChange={e => setUser({ ...user, bio: e.target.value })}
                                                rows={4}
                                                className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all border border-transparent focus:border-indigo-200 resize-none"
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Content */}
                        {activeSection === 'notifications' && (
                            <div className="p-12 max-w-3xl">
                                <div className="space-y-6">
                                    {[
                                        { key: 'emailReports', label: 'Email Reports', desc: 'Receive daily monitoring summaries', icon: Mail },
                                        { key: 'pushAlerts', label: 'Push Notifications', desc: 'Real-time alerts for price drops', icon: Smartphone },
                                        { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly performance analytics overview', icon: Database },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-600">
                                                    <item.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900">{item.label}</h4>
                                                    <p className="text-slate-500 font-medium text-sm">{item.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setUser({ ...user, notifications: { ...user.notifications, [item.key]: !user.notifications[item.key as keyof typeof user.notifications] } })}
                                                className={cn("w-16 h-9 rounded-full relative transition-colors duration-300",
                                                    user.notifications[item.key as keyof typeof user.notifications] ? "bg-rose-500" : "bg-slate-200"
                                                )}
                                            >
                                                <div className={cn("absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-all duration-300",
                                                    user.notifications[item.key as keyof typeof user.notifications] ? "left-8" : "left-1"
                                                )} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Content */}
                        {activeSection === 'security' && (
                            <div className="p-12 max-w-3xl space-y-10">
                                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-start gap-4">
                                    <Shield className="w-8 h-8 text-emerald-600 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-emerald-900 text-lg">Your account is secure</h4>
                                        <p className="text-emerald-700/80 font-medium">You haven't had any suspicious login attempts in the last 30 days.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900">Login Security</h3>

                                    <div className="p-8 border border-slate-200 rounded-[32px] space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">Two-Factor Authentication</h4>
                                                <p className="text-slate-500 font-medium">Add an extra layer of security to your account.</p>
                                            </div>
                                            <div className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-xl text-sm">Enabled</div>
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">Change Password</h4>
                                                <p className="text-slate-500 font-medium">Last changed 3 months ago</p>
                                            </div>
                                            <button className="px-5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-colors">
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Content */}
                        {activeSection === 'appearance' && (
                            <div className="p-12 max-w-4xl">
                                <h3 className="text-xl font-bold text-slate-900 mb-8">Interface Theme</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                    {[
                                        { id: 'light', label: 'Light Mode', icon: Sun },
                                        { id: 'dark', label: 'Dark Mode', icon: Moon },
                                        { id: 'system', label: 'System', icon: Monitor },
                                    ].map((theme) => (
                                        <div
                                            key={theme.id}
                                            onClick={() => setUser({ ...user, appearance: { ...user.appearance, theme: theme.id } })}
                                            className={cn(
                                                "cursor-pointer group relative p-6 rounded-[32px] border-2 transition-all duration-300",
                                                user.appearance.theme === theme.id
                                                    ? "border-amber-500 bg-amber-50"
                                                    : "border-slate-100 hover:border-slate-200"
                                            )}
                                        >
                                            <div className="aspect-video bg-white rounded-2xl mb-4 shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden border border-slate-100">
                                                {/* Mock UI in theme card */}
                                                <div className={cn("absolute top-0 left-0 w-full h-full p-3", theme.id === 'dark' ? "bg-slate-900" : "bg-white")}>
                                                    <div className={cn("w-1/3 h-2 rounded-full mb-3", theme.id === 'dark' ? "bg-slate-700" : "bg-slate-200")} />
                                                    <div className="space-y-2">
                                                        <div className={cn("w-full h-8 rounded-lg opacity-20", theme.id === 'dark' ? "bg-indigo-500" : "bg-indigo-500")} />
                                                        <div className={cn("w-full h-8 rounded-lg opacity-10", theme.id === 'dark' ? "bg-slate-500" : "bg-slate-300")} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("p-2 rounded-full", user.appearance.theme === theme.id ? "bg-white text-amber-600" : "bg-slate-100 text-slate-500")}>
                                                        <theme.icon className="w-5 h-5" />
                                                    </div>
                                                    <span className={cn("font-bold", user.appearance.theme === theme.id ? "text-amber-900" : "text-slate-600")}>
                                                        {theme.label}
                                                    </span>
                                                </div>
                                                {user.appearance.theme === theme.id && (
                                                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-white stroke-[4]" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
