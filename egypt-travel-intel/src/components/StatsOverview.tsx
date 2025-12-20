import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export interface StatCardItem {
    title: string;
    value: string | number;
    subValue?: string | React.ReactNode;
    icon: LucideIcon;
    colorClass: string; // e.g., "text-blue-600", "bg-blue-100"
    trend?: 'up' | 'down' | 'neutral';
}

interface StatsOverviewProps {
    cards: StatCardItem[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export function StatsOverview({ cards }: StatsOverviewProps) {
    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    variants={item}
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                >
                    {/* Big Vector Background */}
                    <div className="absolute -bottom-6 -right-6 opacity-[0.05] group-hover:opacity-[0.12] transition-all duration-500 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 pointer-events-none">
                        <card.icon className={`w-48 h-48 ${card.colorClass}`} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.colorClass.replace('text-', 'bg-').replace('600', '50').replace('500', '50')} ${card.colorClass}`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            {card.trend && (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.trend === 'up' ? 'text-green-600 bg-green-50' :
                                    card.trend === 'down' ? 'text-red-600 bg-red-50' : 'text-slate-600 bg-slate-50'
                                    }`}>
                                    {card.trend === 'up' ? '↗' : card.trend === 'down' ? '↘' : '—'}
                                </span>
                            )}
                        </div>

                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{card.title}</h3>
                        <div className="text-4xl font-black text-slate-800 tracking-tighter mb-2">
                            {typeof card.value === 'string' && card.value.includes('EGP') ? (
                                <span className="text-3xl">{card.value}</span>
                            ) : (
                                card.value
                            )}
                        </div>

                        {card.subValue && (
                            <div className="text-xs font-bold text-slate-400">
                                {card.subValue}
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
