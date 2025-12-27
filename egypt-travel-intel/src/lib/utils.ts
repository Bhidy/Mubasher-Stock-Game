import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Valid ISO 4217 currency codes mapping for common abbreviations
const CURRENCY_FIXES: Record<string, string> = {
    'KD': 'KWD',    // Kuwait Dinar
    'AED': 'AED',   // Valid
    'SAR': 'SAR',   // Valid
    'EGP': 'EGP',   // Valid
    'USD': 'USD',   // Valid
    'EUR': 'EUR',   // Valid
    'GBP': 'GBP',   // Valid
};

export function formatPrice(price: number | null, currency: string | null): string {
    if (price === null) return 'N/A';

    // Normalize and fix common currency code issues
    let cur = (currency || 'EGP').toUpperCase().trim();

    // Fix known invalid codes
    if (CURRENCY_FIXES[cur]) {
        cur = CURRENCY_FIXES[cur];
    }

    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: cur,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    } catch (error) {
        // Fallback for invalid currency codes - format as EGP
        console.warn(`Invalid currency code "${currency}", falling back to EGP`);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    }
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

export function getOfferTypeIcon(type: string | null): string {
    const icons: Record<string, string> = {
        hotel: '🏨',
        flight: '✈️',
        package: '📦',
        nile_cruise: '🚢',
        day_trip: '🗺️',
        visa: '📋',
        transport: '🚗',
        mixed: '🎯',
    };
    return icons[type || ''] || '📍';
}

export function getDestinationEmoji(destination: string | null): string {
    const lower = (destination || '').toLowerCase();
    // Egypt
    if (lower.includes('sharm')) return '🏖️';
    if (lower.includes('hurghada') || lower.includes('gouna') || lower.includes('soma')) return '🌊';
    if (lower.includes('luxor') || lower.includes('aswan')) return '🏛️';
    if (lower.includes('cairo')) return '🏙️';
    if (lower.includes('alexandria')) return '⚓';
    if (lower.includes('siwa') || lower.includes('fayoum')) return '🏜️';
    if (lower.includes('dahab') || lower.includes('nuweiba') || lower.includes('taba')) return '🤿';
    if (lower.includes('marsa alam')) return '🐠';
    if (lower.includes('north coast') || lower.includes('sahel')) return '🏖️';
    if (lower.includes('sokhna')) return '☀️';

    // GCC & Middle East
    if (lower.includes('saudi') || lower.includes('ksa') || lower.includes('ryadh') || lower.includes('jeddah') || lower.includes('makkah') || lower.includes('madinah')) return '🇸🇦';
    if (lower.includes('dubai') || lower.includes('uae') || lower.includes('abu dhabi')) return '🇦🇪';
    if (lower.includes('qatar') || lower.includes('doha')) return '🇶🇦';
    if (lower.includes('kuwait')) return '🇰🇼';
    if (lower.includes('bahrain')) return '🇧🇭';
    if (lower.includes('oman') || lower.includes('muscat')) return '🇴🇲';
    if (lower.includes('lebanon') || lower.includes('beirut')) return '🇱🇧';
    if (lower.includes('jordan') || lower.includes('petra') || lower.includes('amman')) return '🇯🇴';
    if (lower.includes('turkey') || lower.includes('istanbul') || lower.includes('antalya')) return '🇹🇷';

    // Europe
    if (lower.includes('london') || lower.includes('uk') || lower.includes('scotland')) return '🇬🇧';
    if (lower.includes('paris') || lower.includes('france')) return '🇫🇷';
    if (lower.includes('italy') || lower.includes('rome') || lower.includes('milan')) return '🇮🇹';
    if (lower.includes('spain') || lower.includes('barcelona') || lower.includes('madrid')) return '🇪🇸';
    if (lower.includes('greece') || lower.includes('athens') || lower.includes('santorini')) return '🇬🇷';
    if (lower.includes('germany') || lower.includes('berlin')) return '🇩🇪';
    if (lower.includes('netherlands') || lower.includes('amsterdam')) return '🇳🇱';
    if (lower.includes('switzerland') || lower.includes('swiss')) return '🇨🇭';
    if (lower.includes('austria') || lower.includes('vienna')) return '🇦🇹';
    if (lower.includes('georgia') || lower.includes('tbilisi')) return '🇬🇪';
    if (lower.includes('azerbaijan') || lower.includes('baku')) return '🇦🇿';
    if (lower.includes('albania')) return '🇦🇱';
    if (lower.includes('montenegro')) return '🇲🇪';

    // Asia
    if (lower.includes('thailand') || lower.includes('bangkok') || lower.includes('phuket')) return '🇹🇭';
    if (lower.includes('malaysia') || lower.includes('kuala')) return '🇲🇾';
    if (lower.includes('indonesia') || lower.includes('bali')) return '🇮🇩';
    if (lower.includes('vietnam') || lower.includes('hanoi')) return '🇻🇳';
    if (lower.includes('maldives')) return '🏝️';
    if (lower.includes('sri lanka')) return '🇱🇰';
    if (lower.includes('india')) return '🇮🇳';
    if (lower.includes('japan') || lower.includes('tokyo')) return '🇯🇵';
    if (lower.includes('korea')) return '🇰🇷';
    if (lower.includes('china')) return '🇨🇳';
    if (lower.includes('singapore')) return '🇸🇬';

    // Africa
    if (lower.includes('tanzania') || lower.includes('zanzibar')) return '🇹🇿';
    if (lower.includes('kenya') || lower.includes('nairobi')) return '🇰🇪';
    if (lower.includes('south africa') || lower.includes('capetown')) return '🇿🇦';
    if (lower.includes('morocco') || lower.includes('marrakech')) return '🇲🇦';
    if (lower.includes('tunisia')) return '🇹🇳';

    // Americas
    if (lower.includes('usa') || lower.includes('america') || lower.includes('new york')) return '🇺🇸';
    if (lower.includes('brazil')) return '🇧🇷';
    if (lower.includes('canada')) return '🇨🇦';

    // Default
    if (lower.includes('egypt')) return '🇪🇬';
    return '🌍';
}
