/**
 * Enhanced Offer Detection Engine
 * 
 * Analyzes Instagram post captions to detect travel offers and extract structured data.
 * Supports both INBOUND (to Egypt) and OUTBOUND (from Egypt) travel offers.
 * Detects: destinations, prices, hotels, durations, offer types, and booking contacts.
 */

// =============================================================================
// DESTINATIONS
// =============================================================================

// Egyptian destinations (INBOUND tourism)
export const EGYPT_DESTINATIONS: Record<string, string[]> = {
    'Sharm El Sheikh': ['sharm', 'شرم الشيخ', 'شرم', 'sharm el sheikh', 'sharm elsheikh'],
    'Hurghada': ['hurghada', 'الغردقة', 'غردقة'],
    'Dahab': ['dahab', 'دهب'],
    'Ain Sokhna': ['ain sokhna', 'العين السخنة', 'عين السخنة', 'sokhna'],
    'Aswan': ['aswan', 'أسوان', 'اسوان'],
    'Luxor': ['luxor', 'الأقصر', 'الاقصر'],
    'Siwa': ['siwa', 'سيوة', 'واحة سيوة'],
    'Cairo': ['cairo', 'القاهرة', 'قاهرة'],
    'Alexandria': ['alexandria', 'الإسكندرية', 'اسكندرية', 'alex'],
    'Marsa Alam': ['marsa alam', 'مرسى علم'],
    'El Gouna': ['el gouna', 'الجونة', 'gouna'],
    'Ras Sudr': ['ras sudr', 'رأس سدر'],
    'Nuweiba': ['nuweiba', 'نويبع'],
    'Taba': ['taba', 'طابا'],
    'Fayoum': ['fayoum', 'الفيوم', 'فيوم'],
    'Nile Cruise': ['nile cruise', 'كروز النيل', 'رحلة النيل', 'باخرة'],
};

// International destinations (OUTBOUND tourism from Egypt)
export const INTERNATIONAL_DESTINATIONS: Record<string, string[]> = {
    // Middle East & Gulf
    'Dubai': ['dubai', 'دبي', 'دبى', 'الإمارات', 'uae'],
    'Abu Dhabi': ['abu dhabi', 'ابو ظبي', 'أبوظبي'],
    'Saudi Arabia': ['saudi', 'السعودية', 'jeddah', 'جدة', 'riyadh', 'الرياض'],
    'Makkah': ['makkah', 'mecca', 'مكة', 'المكرمة'],
    'Madinah': ['madinah', 'medina', 'المدينة', 'المنورة'],
    'Qatar': ['qatar', 'قطر', 'doha', 'الدوحة'],
    'Bahrain': ['bahrain', 'البحرين'],
    'Oman': ['oman', 'عمان', 'muscat', 'مسقط'],
    'Kuwait': ['kuwait', 'الكويت'],
    'Jordan': ['jordan', 'الأردن', 'amman', 'عمان', 'petra', 'البتراء'],
    'Lebanon': ['lebanon', 'لبنان', 'beirut', 'بيروت'],

    // Turkey & Eastern Europe
    'Turkey': ['turkey', 'تركيا', 'تركى', 'istanbul', 'اسطنبول', 'إسطنبول', 'antalya', 'انطاليا', 'bodrum', 'بودروم', 'trabzon', 'طرابزون', 'cappadocia', 'كابادوكيا'],
    'Georgia': ['georgia', 'جورجيا', 'tbilisi', 'تبليسي'],
    'Azerbaijan': ['azerbaijan', 'أذربيجان', 'baku', 'باكو'],
    'Greece': ['greece', 'اليونان', 'athens', 'أثينا', 'santorini', 'سانتوريني', 'mykonos'],
    'Cyprus': ['cyprus', 'قبرص'],

    // Europe
    'France': ['france', 'فرنسا', 'paris', 'باريس'],
    'Italy': ['italy', 'إيطاليا', 'rome', 'روما', 'milan', 'ميلان', 'venice', 'البندقية'],
    'Spain': ['spain', 'إسبانيا', 'barcelona', 'برشلونة', 'madrid', 'مدريد'],
    'Germany': ['germany', 'ألمانيا', 'munich', 'ميونخ', 'berlin', 'برلين'],
    'UK': ['uk', 'england', 'بريطانيا', 'انجلترا', 'london', 'لندن'],
    'Switzerland': ['switzerland', 'سويسرا', 'zurich', 'زيورخ', 'geneva', 'جنيف'],
    'Austria': ['austria', 'النمسا', 'vienna', 'فيينا'],
    'Netherlands': ['netherlands', 'هولندا', 'amsterdam', 'أمستردام'],
    'Czech Republic': ['czech', 'التشيك', 'prague', 'براغ'],

    // Asia
    'Thailand': ['thailand', 'تايلاند', 'تايلند', 'bangkok', 'بانكوك', 'phuket', 'بوكيت', 'pattaya', 'باتايا'],
    'Malaysia': ['malaysia', 'ماليزيا', 'kuala lumpur', 'كوالالمبور'],
    'Indonesia': ['indonesia', 'إندونيسيا', 'bali', 'بالي', 'jakarta'],
    'Maldives': ['maldives', 'المالديف', 'جزر المالديف'],
    'Singapore': ['singapore', 'سنغافورة'],
    'India': ['india', 'الهند', 'delhi', 'دلهي', 'mumbai', 'مومباي', 'goa', 'جوا'],
    'Sri Lanka': ['sri lanka', 'سريلانكا'],
    'Vietnam': ['vietnam', 'فيتنام'],
    'Japan': ['japan', 'اليابان', 'tokyo', 'طوكيو'],
    'China': ['china', 'الصين', 'beijing', 'بكين', 'shanghai', 'شنغهاي'],
    'South Korea': ['korea', 'كوريا', 'seoul', 'سيول'],

    // Africa
    'Morocco': ['morocco', 'المغرب', 'marrakech', 'مراكش', 'casablanca', 'الدار البيضاء'],
    'Tunisia': ['tunisia', 'تونس'],
    'Kenya': ['kenya', 'كينيا', 'nairobi', 'نيروبي', 'mombasa'],
    'Tanzania': ['tanzania', 'تنزانيا', 'zanzibar', 'زنجبار'],
    'South Africa': ['south africa', 'جنوب أفريقيا', 'cape town', 'كيب تاون'],
    'Mauritius': ['mauritius', 'موريشيوس'],
    'Seychelles': ['seychelles', 'سيشل'],

    // Americas
    'USA': ['usa', 'أمريكا', 'america', 'new york', 'نيويورك', 'los angeles', 'لوس أنجلوس', 'miami', 'ميامي', 'las vegas', 'لاس فيغاس', 'orlando', 'أورلاندو'],
    'Canada': ['canada', 'كندا', 'toronto', 'تورنتو', 'vancouver'],
    'Mexico': ['mexico', 'المكسيك', 'cancun', 'كانكون'],
    'Brazil': ['brazil', 'البرازيل', 'rio', 'ريو'],
};

// Combine all destinations
export const ALL_DESTINATIONS = { ...EGYPT_DESTINATIONS, ...INTERNATIONAL_DESTINATIONS };

// =============================================================================
// HOTELS
// =============================================================================

// International hotel chains
export const HOTEL_CHAINS: Record<string, string[]> = {
    // Luxury
    'Marriott': ['marriott', 'ماريوت', 'jw marriott', 'ritz carlton', 'ريتز كارلتون', 'st regis', 'w hotel'],
    'Hilton': ['hilton', 'هيلتون', 'doubletree', 'دبل تري', 'conrad', 'waldorf'],
    'Hyatt': ['hyatt', 'هايات', 'park hyatt', 'grand hyatt'],
    'Four Seasons': ['four seasons', 'فورسيزونز', 'فور سيزونز'],
    'Sheraton': ['sheraton', 'شيراتون'],
    'Intercontinental': ['intercontinental', 'انتركونتيننتال', 'ihg', 'crowne plaza', 'holiday inn', 'هوليداي ان'],
    'Kempinski': ['kempinski', 'كمبنسكي'],
    'Fairmont': ['fairmont', 'فيرمونت'],
    'Sofitel': ['sofitel', 'سوفيتيل'],
    'Movenpick': ['movenpick', 'موفنبيك'],
    'Steigenberger': ['steigenberger', 'شتايجنبرجر'],
    'Rixos': ['rixos', 'ريكسوس'],
    'Rotana': ['rotana', 'روتانا'],
    'Radisson': ['radisson', 'راديسون'],
    'Accor': ['accor', 'pullman', 'novotel', 'نوفوتيل', 'ibis'],

    // Egypt-specific popular hotels
    'Baron': ['baron', 'بارون'],
    'Sunrise': ['sunrise', 'صنرايز'],
    'Jaz': ['jaz hotel', 'جاز'],
    'Albatros': ['albatros', 'البتروس'],
    'Cleopatra': ['cleopatra', 'كليوباترا'],
    'Tropitel': ['tropitel', 'تروبيتيل'],
    'Titanic': ['titanic', 'تيتانيك'],
    'Savoy': ['savoy', 'سافوي'],
    'Oberoi': ['oberoi', 'أوبيروي'],
    'Sonesta': ['sonesta', 'سونستا'],
};

// Hotel star ratings
export const STAR_RATINGS: Record<string, string[]> = {
    '5-star': ['5 star', '5 stars', '5*', '٥ نجوم', 'خمس نجوم', 'five star', 'luxury'],
    '4-star': ['4 star', '4 stars', '4*', '٤ نجوم', 'أربع نجوم', 'four star'],
    '3-star': ['3 star', '3 stars', '3*', '٣ نجوم', 'ثلاث نجوم', 'three star'],
};

// Board types
export const BOARD_TYPES: Record<string, string[]> = {
    'All Inclusive': ['all inclusive', 'all-inclusive', 'ai', 'شامل', 'اول انكلوسيف', 'ultra all inclusive'],
    'Full Board': ['full board', 'fb', 'فول بورد', 'إفطار غداء عشاء'],
    'Half Board': ['half board', 'hb', 'هاف بورد', 'إفطار عشاء'],
    'Bed & Breakfast': ['bed and breakfast', 'bb', 'b&b', 'إفطار فقط', 'room only'],
};

// =============================================================================
// OFFER TYPES
// =============================================================================

export const OFFER_TYPE_KEYWORDS: Record<string, string[]> = {
    hotel: ['hotel', 'فندق', 'resort', 'منتجع', 'accommodation', 'إقامة'],
    flight: ['flight', 'طيران', 'رحلة جوية', 'airline', 'airport', 'مطار'],
    package: ['package', 'باكيدج', 'باكج', 'شاملة', 'all inclusive', 'full board'],
    nile_cruise: ['cruise', 'كروز', 'باخرة', 'نيلية', 'nile cruise', 'dahabiya'],
    day_trip: ['day trip', 'رحلة يومية', 'excursion', 'tour', 'جولة', 'safari', 'سفاري'],
    visa: ['visa', 'فيزا', 'تأشيرة', 'schengen', 'شنغن'],
    transport: ['transfer', 'توصيل', 'transport', 'bus', 'limousine', 'ليموزين'],
    hajj_umrah: ['hajj', 'حج', 'عمرة', 'umrah', 'umra', 'الحرم', 'المسجد الحرام'],
    honeymoon: ['honeymoon', 'شهر عسل', 'شهر العسل', 'عرسان', 'زفاف', 'wedding'],
    group_tour: ['group', 'مجموعة', 'group tour', 'رحلة جماعية'],
    adventure: ['adventure', 'مغامرة', 'diving', 'غوص', 'snorkeling', 'hiking', 'camping'],
    medical: ['medical tourism', 'سياحة علاجية', 'treatment', 'علاج'],
    business: ['business', 'أعمال', 'conference', 'مؤتمر', 'corporate'],
};

// =============================================================================
// KEYWORDS & PATTERNS
// =============================================================================

export const OFFER_KEYWORDS = [
    // English
    'offer', 'discount', 'sale', 'limited', 'book now', 'special', 'deal',
    'price', 'per person', 'pp', 'rate', 'starting from', 'from only',
    'promotion', 'promo', 'save', 'hot deal', 'best price', 'early bird',
    // Arabic
    'عرض', 'خصم', 'تخفيض', 'حجز', 'سعر', 'شامل', 'للفرد', 'ابتداء من',
    'احجز الآن', 'فرصة', 'محدود', 'عروض', 'أفضل سعر', 'حصري', 'مميز'
];

// Price patterns
const PRICE_PATTERNS = [
    // EGP patterns
    /([\d,]+(?:\.\d{2})?)\s*(?:جنيه|egp|le|ج\.م|جم)/gi,
    /(?:egp|جنيه|le)\s*([\d,]+(?:\.\d{2})?)/gi,
    // USD patterns
    /\$\s*([\d,]+(?:\.\d{2})?)/g,
    /([\d,]+(?:\.\d{2})?)\s*(?:usd|dollars?)/gi,
    // EUR patterns
    /€\s*([\d,]+(?:\.\d{2})?)/g,
    /([\d,]+(?:\.\d{2})?)\s*(?:eur|euros?)/gi,
    // SAR patterns (Saudi Riyal for Hajj/Umrah)
    /([\d,]+(?:\.\d{2})?)\s*(?:sar|ريال|ر\.س)/gi,
    // AED patterns (UAE Dirham)
    /([\d,]+(?:\.\d{2})?)\s*(?:aed|درهم)/gi,
    // Generic number that might be a price (4-6 digits)
    /([\d]{4,6})\s*(?:per|للفرد|\/person)/gi,
];

// Duration patterns
const DURATION_PATTERNS = [
    /(\d+)\s*(?:nights?|n)[\s\/]*(\d+)\s*(?:days?|d)/gi,
    /(\d+)\s*(?:ليالي|ليلة)[\s\/]*(\d+)\s*(?:أيام|يوم)/gi,
    /(\d+)n\/?(\d+)d/gi,
    /(\d+)\s*(?:days?|أيام|يوم)/gi,
    /weekend/gi,
    /week\b/gi,
];

// Contact patterns
const CONTACT_PATTERNS = [
    // Phone numbers (Egypt)
    /(?:\+?20|0)?1[0-9]{9}/g,
    /(?:\+?20|0)?2[0-9]{8}/g,
    // WhatsApp
    /whatsapp|واتس|واتساب/gi,
    // Link in bio
    /link\s*(?:in\s*)?bio|الرابط في البايو/gi,
];

// =============================================================================
// DETECTION RESULT INTERFACE
// =============================================================================

export interface DetectionResult {
    isOffer: boolean;
    offerType: string | null;
    destinationDetected: string | null;
    destinationType: 'inbound' | 'outbound' | null; // NEW: travel direction
    priceDetected: number | null;
    currencyDetected: string | null;
    durationDetected: string | null;
    hotelDetected: string | null;        // NEW: hotel chain
    starRating: string | null;           // NEW: hotel star rating
    boardType: string | null;            // NEW: meal plan
    bookingContact: string | null;
    flightIncluded?: boolean; // NEW: flight inclusion flag
    keywordsDetected: string[];
    confidenceScore: number;
}

// =============================================================================
// MAIN DETECTION FUNCTION
// =============================================================================

export function detectOffer(captionText: string | null): DetectionResult {
    const result: DetectionResult = {
        isOffer: false,
        offerType: null,
        destinationDetected: null,
        destinationType: null,
        priceDetected: null,
        currencyDetected: null,
        durationDetected: null,
        hotelDetected: null,
        starRating: null,
        boardType: null,
        bookingContact: null,
        flightIncluded: false,
        keywordsDetected: [],
        confidenceScore: 0,
    };

    if (!captionText) return result;

    const text = captionText.toLowerCase();
    let confidencePoints = 0;

    // 1. Detect offer keywords
    for (const keyword of OFFER_KEYWORDS) {
        if (text.includes(keyword.toLowerCase())) {
            result.keywordsDetected.push(keyword);
            confidencePoints += 10;
        }
    }

    // 2. Detect destination (check Egypt first, then international)
    for (const [destination, variants] of Object.entries(EGYPT_DESTINATIONS)) {
        for (const variant of variants) {
            if (text.includes(variant.toLowerCase())) {
                result.destinationDetected = destination;
                result.destinationType = 'inbound';
                confidencePoints += 15;
                break;
            }
        }
        if (result.destinationDetected) break;
    }

    // If no Egypt destination, check international
    if (!result.destinationDetected) {
        for (const [destination, variants] of Object.entries(INTERNATIONAL_DESTINATIONS)) {
            for (const variant of variants) {
                if (text.includes(variant.toLowerCase())) {
                    result.destinationDetected = destination;
                    result.destinationType = 'outbound';
                    confidencePoints += 15;
                    break;
                }
            }
            if (result.destinationDetected) break;
        }
    }

    // 3. Detect offer type
    for (const [type, keywords] of Object.entries(OFFER_TYPE_KEYWORDS)) {
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) {
                result.offerType = type;
                confidencePoints += 10;
                break;
            }
        }
        if (result.offerType) break;
    }

    // 4. Detect hotel chain
    for (const [hotel, variants] of Object.entries(HOTEL_CHAINS)) {
        for (const variant of variants) {
            if (text.includes(variant.toLowerCase())) {
                result.hotelDetected = hotel;
                confidencePoints += 10;
                break;
            }
        }
        if (result.hotelDetected) break;
    }

    // 5. Detect star rating
    for (const [rating, variants] of Object.entries(STAR_RATINGS)) {
        for (const variant of variants) {
            if (text.includes(variant.toLowerCase())) {
                result.starRating = rating;
                confidencePoints += 5;
                break;
            }
        }
        if (result.starRating) break;
    }

    // 6. Detect board type
    for (const [board, variants] of Object.entries(BOARD_TYPES)) {
        for (const variant of variants) {
            if (text.includes(variant.toLowerCase())) {
                result.boardType = board;
                confidencePoints += 5;
                break;
            }
        }
        if (result.boardType) break;
    }

    // 7. Detect price
    for (const pattern of PRICE_PATTERNS) {
        const match = pattern.exec(captionText);
        if (match) {
            const priceStr = match[1].replace(/,/g, '');
            const price = parseFloat(priceStr);
            if (price >= 100 && price <= 500000) {
                result.priceDetected = price;

                // Determine currency
                const matchText = match[0].toLowerCase();
                if (matchText.includes('$') || matchText.includes('usd') || matchText.includes('dollar')) {
                    result.currencyDetected = 'USD';
                } else if (matchText.includes('€') || matchText.includes('eur')) {
                    result.currencyDetected = 'EUR';
                } else if (matchText.includes('sar') || matchText.includes('ريال')) {
                    result.currencyDetected = 'SAR';
                } else if (matchText.includes('aed') || matchText.includes('درهم')) {
                    result.currencyDetected = 'AED';
                } else {
                    result.currencyDetected = 'EGP';
                }

                confidencePoints += 20;
                break;
            }
        }
        pattern.lastIndex = 0;
    }

    // 8. Detect duration
    for (const pattern of DURATION_PATTERNS) {
        const match = pattern.exec(captionText);
        if (match) {
            if (match[2]) {
                result.durationDetected = `${match[1]}N/${match[2]}D`;
            } else if (match[0].toLowerCase().includes('weekend')) {
                result.durationDetected = 'Weekend';
            } else if (match[0].toLowerCase().includes('week')) {
                result.durationDetected = '1 Week';
            } else {
                result.durationDetected = `${match[1]} days`;
            }
            confidencePoints += 10;
            break;
        }
        pattern.lastIndex = 0;
    }

    // 9. Detect booking contact
    for (const pattern of CONTACT_PATTERNS) {
        const match = pattern.exec(captionText);
        if (match) {
            result.bookingContact = match[0];
            confidencePoints += 5;
            break;
        }
        pattern.lastIndex = 0;
    }

    // Calculate final confidence score (0.0 - 1.0)
    result.confidenceScore = Math.min(confidencePoints / 70, 1.0);

    // UNLOCKED: System now saves ALL posts as offers
    // Keep detecting attributes, but always return true for isOffer
    result.isOffer = true;

    // If no type detected, default to 'general'
    if (!result.offerType) {
        result.offerType = 'general';
    }

    // Ensure at least a baseline confidence for visibility
    if (result.confidenceScore < 0.3) {
        result.confidenceScore = 0.3;
    }

    // 10. Detect flight inclusion (New)
    const FLIGHT_KEYWORDS = ['flight', 'flights', 'airline', 'ticket', 'fly', 'طيران', 'تذاكر', 'تذكرة', 'شامل الطيران', 'الرحلة تشمل الطيران'];
    for (const keyword of FLIGHT_KEYWORDS) {
        if (text.includes(keyword)) {
            result.flightIncluded = true;
            confidencePoints += 5;
            break;
        }
    }

    // Default confidence point boost if it's explicitly an offer type of "flight"
    if (result.offerType === 'flight') {
        result.flightIncluded = true;
    }

    return result;
}

export function detectOffersBatch(posts: Array<{ id: string; captionText: string | null }>) {
    return posts.map(post => ({
        postId: post.id,
        ...detectOffer(post.captionText),
    }));
}

/**
 * Enhanced offer detection that merges caption analysis with vision analysis
 * Vision data takes priority for prices, dates, and visual elements
 */
export function mergeDetectionWithVision(
    captionResult: DetectionResult,
    visionData: {
        prices?: Array<{ amount: number; currency: string; type: string }>;
        dates?: { departure: string | null; return: string | null } | null;
        duration?: { nights: number; days: number } | null;
        destination?: string | null;
        destinationType?: 'inbound' | 'outbound' | null;
        hotel?: string | null;
        starRating?: string | null;
        boardType?: string | null;
        phone?: string | null;
        whatsapp?: string | null;
        agency?: string | null;
        offerType?: string | null;
        confidence?: number;
    } | null
): DetectionResult & { priceSource: 'caption' | 'image' | 'none' } {

    if (!visionData) {
        return { ...captionResult, priceSource: captionResult.priceDetected ? 'caption' : 'none' };
    }

    // Use vision price if available (more reliable from images)
    let priceDetected = captionResult.priceDetected;
    let currencyDetected = captionResult.currencyDetected;
    let priceSource: 'caption' | 'image' | 'none' = captionResult.priceDetected ? 'caption' : 'none';

    if (visionData.prices && visionData.prices.length > 0) {
        priceDetected = visionData.prices[0].amount;
        currencyDetected = visionData.prices[0].currency;
        priceSource = 'image';
    }

    // Merge duration
    let durationDetected = captionResult.durationDetected;
    if (visionData.duration) {
        durationDetected = `${visionData.duration.nights}N/${visionData.duration.days}D`;
    }

    // Calculate combined confidence (boost if we have both sources)
    let confidence = captionResult.confidenceScore;
    if (visionData.confidence) {
        confidence = Math.min((confidence + visionData.confidence) / 1.5, 1.0);
    }
    if (priceSource === 'image') {
        confidence = Math.min(confidence + 0.15, 1.0);
    }

    return {
        isOffer: true,
        offerType: visionData.offerType || captionResult.offerType,
        destinationDetected: visionData.destination || captionResult.destinationDetected,
        destinationType: visionData.destinationType || captionResult.destinationType,
        priceDetected,
        currencyDetected,
        durationDetected,
        hotelDetected: visionData.hotel || captionResult.hotelDetected,
        starRating: visionData.starRating || captionResult.starRating,
        boardType: visionData.boardType || captionResult.boardType,
        bookingContact: visionData.phone || visionData.whatsapp || captionResult.bookingContact,
        flightIncluded: captionResult.flightIncluded,
        keywordsDetected: captionResult.keywordsDetected,
        confidenceScore: confidence,
        priceSource,
    };
}

