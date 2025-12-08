import axios from 'axios';
import * as cheerio from 'cheerio';

// Version: 2.0.0 - X Community API with 200+ Accounts & Smart Categorization
// Deployed: 2025-12-08

// ============ ACCOUNT CATEGORIES ============
const ACCOUNT_CATEGORIES = {
    ELITE_ANALYST: 'Elite Analyst',
    TECHNICAL_TRADER: 'Technical',
    FUNDAMENTAL: 'Fundamental',
    MARKET_NEWS: 'News',
    TRADING_SIGNALS: 'Signals',
    INFLUENCER: 'Influencer',
    EDUCATOR: 'Educator',
    CHART_MASTER: 'Charts'
};

// ============ ALL TARGET ACCOUNTS (200+) ============
const TARGET_ACCOUNTS = [
    // Original 10 Elite Accounts
    { username: 'THEWOLFOFTASI', displayName: 'The Wolf of TASI', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Anas_S_Alrajhi', displayName: 'Anas Al-Rajhi', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'RiadhAlhumaidan', displayName: 'Riyadh Al-Humaidan', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'ahmadammar1993', displayName: 'Ahmad Ammar', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 1 },
    { username: 'FutrueGlimpse', displayName: 'Future Glimpse', category: ACCOUNT_CATEGORIES.MARKET_NEWS, tier: 1 },
    { username: 'AlsagriCapital', displayName: 'Alsagri Capital', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },
    { username: 'Reda_Alidarous', displayName: 'Reda Alidarous', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Ezzo_Khrais', displayName: 'Ezzo Khrais', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'King_night90', displayName: 'King Night', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 1 },
    { username: 'ABU_KHALED2021', displayName: 'Abu Khaled', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 1 },

    // New Accounts - Elite Analysts
    { username: 'malmuqti', displayName: 'M. Al-Muqti', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'SenseiFund', displayName: 'Sensei Fund', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },
    { username: 'fahadmutadawul', displayName: 'Fahad Mutadawul', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Drfaresalotaibi', displayName: 'Dr. Fares Al-Otaibi', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Dr_Hachimi', displayName: 'Dr. Hachimi', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'DrAlhamdan1', displayName: 'Dr. Al-Hamdan', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },

    // Technical Traders & Chart Masters
    { username: 'oqo888', displayName: 'OQO', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'Saad1100110', displayName: 'Saad', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: '29_shg', displayName: '29 SHG', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: 'ssaaeedd91', displayName: 'Saeed 91', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'sadoon72', displayName: 'Sadoon', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'AhmedAllshehri', displayName: 'Ahmed Al-Shehri', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'Saeed_AJ', displayName: 'Saeed AJ', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'saud_almutair', displayName: 'Saud Al-Mutair', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'LAMMMAH', displayName: 'LAMMMAH', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: '_doje_', displayName: 'Doje', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'S3Dwave', displayName: 'S3D Wave', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: 'alomar66664', displayName: 'Al-Omar', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'mokhrepashom', displayName: 'Mokhrepashom', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'khabeer999', displayName: 'Khabeer', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 2 },
    { username: 'ssahm07', displayName: 'SSAHM', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'Mohammed_Torab', displayName: 'Mohammed Torab', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'HlIIHII', displayName: 'HLIIHII', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: 'Mufarre7', displayName: 'Mufarre7', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'Analysis2020', displayName: 'Analysis 2020', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: 'ezdallaf', displayName: 'Ezdallaf', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'kmsh9', displayName: 'KMSH', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'vip9tasi', displayName: 'VIP TASI', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 2 },
    { username: 'Musaad_Mutairi1', displayName: 'Musaad Mutairi', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'pro_chart', displayName: 'Pro Chart', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 1 },
    { username: 'Joker_Chart', displayName: 'Joker Chart', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 1 },
    { username: 'Chart511', displayName: 'Chart 511', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: 'TasiElite', displayName: 'TASI Elite', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },

    // Fundamental Analysts
    { username: 'BinSolaiman', displayName: 'Bin Solaiman', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 2 },
    { username: 'Abdullah_Fin', displayName: 'Abdullah Finance', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 2 },
    { username: 'Equity_Data', displayName: 'Equity Data', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },
    { username: 'asemecono', displayName: 'Asem Econo', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 2 },
    { username: 'stocksinvest1', displayName: 'Stocks Invest', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 2 },
    { username: 'Stock_Awax', displayName: 'Stock Awax', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 2 },
    { username: 'Investment_corn', displayName: 'Investment Corn', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 2 },
    { username: 'SalmanAlhawawi', displayName: 'Salman Alhawawi', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 2 },
    { username: 'UsCapitall', displayName: 'US Capital', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 2 },

    // Trading Signals & Influencers
    { username: 'hamdjy2479', displayName: 'Hamdjy', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'ADEL7i', displayName: 'Adel 7i', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'haddaj11', displayName: 'Haddaj', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'fnfefn', displayName: 'FNFEFN', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'moshaks1111', displayName: 'Moshaks', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'amerALshehri6', displayName: 'Amer Al-Shehri', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'm_alalwan', displayName: 'M. Al-Alwan', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'mesfhel', displayName: 'Mesfhel', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'Mohmed123654', displayName: 'Mohammed', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'm0ajed', displayName: 'M0ajed', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 2 },
    { username: 'eafggy', displayName: 'Eafggy', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'AbuHusssain', displayName: 'Abu Hussain', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 2 },
    { username: 'fsawadi', displayName: 'F. Sawadi', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'Albasatah2030', displayName: 'Al-Basatah 2030', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'ph_moklaf', displayName: 'PH Moklaf', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 2 },
    { username: 'moath9419', displayName: 'Moath', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'falolayan1', displayName: 'Falolayan', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'll2020ll2', displayName: 'LL2020', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'Luqman14001400', displayName: 'Luqman', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'HMMH11111', displayName: 'HMMH', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'jjookkr', displayName: 'JJookkr', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'abolmes140', displayName: 'Abolmes', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'ghalii2222', displayName: 'Ghalii', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'vip_2000_vip', displayName: 'VIP 2000', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'Sahmm404', displayName: 'Sahmm 404', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'Hlk_7', displayName: 'HLK 7', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'kag1388', displayName: 'KAG 1388', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'Diver1s', displayName: 'Diver1s', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 3 },
    { username: 'albadah64', displayName: 'Al-Badah', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 3 },
    { username: 'c1m2p', displayName: 'C1M2P', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 3 },
    { username: 'saudsend', displayName: 'Saud Send', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'MsaratSa', displayName: 'Msarat SA', category: ACCOUNT_CATEGORIES.MARKET_NEWS, tier: 2 },
    { username: 'mesk_tdl', displayName: 'Mesk TDL', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'cheef_sonson', displayName: 'Cheef Sonson', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'obunawaf2', displayName: 'Obunawaf', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'abu_khalid111', displayName: 'Abu Khalid 111', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'kh_alkhayari', displayName: 'KH Al-Khayari', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'al3a9ef', displayName: 'Al3a9ef', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'Jamalaa11', displayName: 'Jamalaa', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'alghaziw', displayName: 'Al-Ghazi', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'el2aham', displayName: 'El2aham', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'alnagem60', displayName: 'Al-Nagem 60', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'heshamnaser2012', displayName: 'Hesham Naser', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'WaelAlmutlaq', displayName: 'Wael Al-Mutlaq', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'ADEL_ALHOMYANI', displayName: 'Adel Al-Homyani', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'mard400', displayName: 'Mard 400', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'binfrihan', displayName: 'Bin Frihan', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'althrwat', displayName: 'Al-Thrwat', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'gchartt', displayName: 'G Chart', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: 'BBanderhhq', displayName: 'B. Bander', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'alomisi111', displayName: 'Al-Omisi', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'abunjooood', displayName: 'Abu Njood', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'AL_AJDL', displayName: 'AL AJDL', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'm55900m1', displayName: 'M55900M', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'Aboohaif', displayName: 'Abu Haif', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'Majed_2042', displayName: 'Majed 2042', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'khh2266', displayName: 'KHH 2266', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'ALQARNI140', displayName: 'Al-Qarni', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'majed852000', displayName: 'Majed 85', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'ShamAaKh0', displayName: 'ShamAaKh', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'abusultan2005', displayName: 'Abu Sultan', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'Abdrhman_Saud', displayName: 'Abdrhman Saud', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'eng_asm76', displayName: 'Eng ASM', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 3 },
    { username: 'Abezmomn', displayName: 'Abezmomn', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'ayedhum', displayName: 'Ayedhum', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'Eng_M_Y_Zahrani', displayName: 'Eng. Zahrani', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 3 },
    { username: 'm7med_67', displayName: 'M7med 67', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'a_swaji', displayName: 'A. Swaji', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'mohamd_mogheri', displayName: 'Mohammed Mogheri', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'MrSultanAbdulla', displayName: 'Sultan Abdullah', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'YasserAlofi', displayName: 'Yasser Alofi', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'abdulsalam1428', displayName: 'Abdul Salam', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'fah_oxo', displayName: 'Fah OXO', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'albatti', displayName: 'Al-Batti', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'naif_alghamdi20', displayName: 'Naif Al-Ghamdi', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'FUAD7333', displayName: 'Fuad', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'twweetr', displayName: 'Twweetr', category: ACCOUNT_CATEGORIES.MARKET_NEWS, tier: 3 },
    { username: 'alsebeeh', displayName: 'Al-Sebeeh', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'aber_sabel3', displayName: 'Aber Sabel', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'MR_Stock10', displayName: 'MR Stock', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 2 },
    { username: 'THEONEKSA', displayName: 'The One KSA', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'Omar_Hisham1978', displayName: 'Omar Hisham', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'magedhail', displayName: 'Majed Hail', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'faisalalassiri3', displayName: 'Faisal Al-Assiri', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'ss12355', displayName: 'SS 12355', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'coontr', displayName: 'Coontr', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'mohdak2011', displayName: 'Mohdak', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'omaralmania', displayName: 'Omar Al-Mania', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'boholaiga', displayName: 'Boholaiga', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'ammarshata', displayName: 'Ammar Shata', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'telmisany', displayName: 'Telmisany', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'robaawi', displayName: 'Robaawi', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'r_alfowzan', displayName: 'R. Al-Fowzan', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 2 },
    { username: 'saud264', displayName: 'Saud 264', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'bawardik', displayName: 'Bawardik', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'M7mdAlkhamis', displayName: 'M7md Alkhamis', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'FahdAlbogami', displayName: 'Fahd Al-Bogami', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'Barjasbh', displayName: 'Barjasbh', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'f_m_binjumah', displayName: 'F. Bin Jumah', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'abamri', displayName: 'Abu Amri', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'bandghamd', displayName: 'Bandghamd', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'alfarhan', displayName: 'Al-Farhan', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'Mohakhu', displayName: 'Mohakhu', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'farooi', displayName: 'Farooi', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'AlalawiAlZhrani', displayName: 'Alalawi Al-Zahrani', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'wballaa', displayName: 'Wballaa', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'akuwaiz', displayName: 'Akuwaiz', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'MrOmarCrypto', displayName: 'MrOmar Crypto', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'abdul_almustafa', displayName: 'Abdul Almustafa', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'mo_alsuwayed', displayName: 'Mo Al-Suwayed', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'nkoshak', displayName: 'N. Koshak', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'm333mz', displayName: 'M333MZ', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'ociechart', displayName: 'OCIE Chart', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: 'abindawood88', displayName: 'Abu Indawood', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'misstadawl', displayName: 'Miss Tadawul', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 2 },
    { username: 'badralbuluwi', displayName: 'Badr Al-Buluwi', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'adelalmzyad', displayName: 'Adel Almzyad', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'Ambitiousman0', displayName: 'Ambitious Man', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'basmatadawul', displayName: 'Basma Tadawul', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 2 },
    { username: 'Dawoodsa117', displayName: 'Dawood SA', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'albashrish', displayName: 'Al-Bashrish', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'alrasheedemad', displayName: 'Al-Rasheed Emad', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'amalamri_1983', displayName: 'Amal Amri', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'nssar1409', displayName: 'Nssar', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'alhubaishihs3', displayName: 'Al-Hubaishi', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'stocktrad1', displayName: 'Stock Trad', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 3 },
    { username: 'ksa_leader', displayName: 'KSA Leader', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'binhamdan62', displayName: 'Bin Hamdan', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'AlmutairiFawaz', displayName: 'Fawaz Almutairi', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'omaromo2', displayName: 'Omar Omo', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: '0mar_alzamil', displayName: 'Omar Al-Zamil', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'apyrayan', displayName: 'Apyrayan', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'sfaz79', displayName: 'SFAZ 79', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'abobadur', displayName: 'Abu Badur', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'chartsniper666', displayName: 'Chart Sniper', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: 'n_shamnmari', displayName: 'N. Shamnmari', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'Maydaytweet', displayName: 'Mayday Tweet', category: ACCOUNT_CATEGORIES.MARKET_NEWS, tier: 3 },
    { username: 'AbuAhmad1822016', displayName: 'Abu Ahmad', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: '2030_aaa056986', displayName: '2030 AAA', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'dcmn_f', displayName: 'DCMN F', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'LaBeeH', displayName: 'LaBeeH', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'value077', displayName: 'Value 077', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 3 },
    { username: 'Abdulmohsin344', displayName: 'Abdul Mohsin', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'Espreso_10', displayName: 'Espreso 10', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'abo_jana_tasi', displayName: 'Abu Jana TASI', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'emi_m_b', displayName: 'EMI MB', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 }
];

// Get unique accounts (some might be duplicated)
const uniqueAccounts = TARGET_ACCOUNTS.filter((acc, idx, self) =>
    idx === self.findIndex(a => a.username.toLowerCase() === acc.username.toLowerCase())
);

// ============ IN-MEMORY CACHE ============
const tweetsCache = {
    data: null,
    timestamp: 0,
    perUser: {},
    byCategory: {},
    rankings: null
};
const CACHE_TTL = 5 * 60 * 1000;
const PER_USER_CACHE_TTL = 3 * 60 * 1000;

// ============ HELPER FUNCTIONS ============

// Check if text contains Arabic
function isArabic(text) {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

// Translate text
async function translateText(text, targetLang = 'en') {
    if (!text || text.length < 3) return text;
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
        if (response.data && response.data[0]) {
            return response.data[0].map(part => part[0]).filter(Boolean).join('') || text;
        }
        return text;
    } catch { return text; }
}

// Translate tweet content
async function translateTweetContent(tweet) {
    if (!isArabic(tweet.content)) {
        return { ...tweet, originalLang: 'en', isTranslated: false };
    }
    try {
        const translatedContent = await translateText(tweet.content, 'en');
        return { ...tweet, content: translatedContent, originalContent: tweet.content, originalLang: 'ar', isTranslated: true };
    } catch {
        return { ...tweet, originalLang: 'ar', isTranslated: false };
    }
}

// Calculate relative time
function getRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Calculate engagement score
function calculateEngagementScore(tweet) {
    const likes = tweet.likes || 0;
    const retweets = tweet.retweets || 0;
    const replies = tweet.replies || 0;
    // Weighted score: likes (1x) + retweets (2x) + replies (1.5x)
    return likes + (retweets * 2) + (replies * 1.5);
}

// Fetch from Twitter Syndication API
async function fetchFromSyndication(username) {
    const USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
    ];
    const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

    try {
        const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': randomUA,
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 10000 // Reduced timeout to fail faster
        });

        const $ = cheerio.load(response.data);
        const nextDataScript = $('#__NEXT_DATA__').html();
        if (!nextDataScript) return null;

        const data = JSON.parse(nextDataScript);
        const timeline = data?.props?.pageProps?.timeline;
        if (!timeline?.entries?.length) return null;

        const account = uniqueAccounts.find(a => a.username.toLowerCase() === username.toLowerCase());
        const tweets = [];

        for (const entry of timeline.entries) {
            if (entry.type !== 'tweet') continue;
            const tweet = entry.content?.tweet;
            if (!tweet) continue;

            const images = [];
            const mediaSource = tweet.extended_entities?.media || tweet.entities?.media || [];
            for (const media of mediaSource) {
                if (media.type === 'photo' && media.media_url_https) {
                    images.push(media.media_url_https);
                }
            }

            const text = tweet.full_text || tweet.text || '';
            if (text.startsWith('RT @')) continue;

            const createdAt = tweet.created_at ? new Date(tweet.created_at) : new Date();
            const tweetObj = {
                id: tweet.id_str || `${username}_${Date.now()}`,
                username,
                displayName: account?.displayName || tweet.user?.name || username,
                category: account?.category || 'Influencer',
                tier: account?.tier || 3,
                profileImage: tweet.user?.profile_image_url_https?.replace('_normal', '_400x400') || null,
                content: text.replace(/https:\/\/t\.co\/\w+$/g, '').trim(),
                images,
                timestamp: createdAt.toISOString(),
                relativeTime: getRelativeTime(createdAt),
                url: `https://x.com/${username}/status/${tweet.id_str}`,
                likes: tweet.favorite_count || 0,
                retweets: tweet.retweet_count || 0,
                replies: tweet.reply_count || 0,
                source: 'syndication'
            };
            tweetObj.engagementScore = calculateEngagementScore(tweetObj);
            tweets.push(tweetObj);
        }
        return tweets;
    } catch {
        return null;
    }
}

// Fetch user tweets with cache
async function fetchUserTweets(account) {
    const { username } = account;
    const cached = tweetsCache.perUser[username];
    if (cached && (Date.now() - cached.timestamp) < PER_USER_CACHE_TTL) {
        return cached.data;
    }

    const tweets = await fetchFromSyndication(username);
    if (tweets?.length) {
        tweetsCache.perUser[username] = { data: tweets, timestamp: Date.now() };
        return tweets;
    }
    return cached?.data || [];
}

// Fetch all tweets with smart batching
async function fetchAllTweets(options = {}) {
    const { tier = null, limit = 50 } = options;
    console.log('🐦 Fetching X Community tweets...');

    // Filter accounts by tier if specified
    let filteredAccounts = uniqueAccounts;
    if (tier) {
        filteredAccounts = uniqueAccounts.filter(a => a.tier <= tier);
    }

    // SMART SAMPLING STRATEGY:
    // We have 200+ accounts. Fetching all at once causes Vercel timeouts.
    // Instead, we shuffle the list and pick 80 random accounts each time.
    // This ensures that over a few refreshes, we cover the entire community.

    // Fisher-Yates Shuffle
    for (let i = filteredAccounts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredAccounts[i], filteredAccounts[j]] = [filteredAccounts[j], filteredAccounts[i]];
    }

    // Limit to 80 random accounts per request for optimal performance/coverage balance
    const accountsToFetch = filteredAccounts.slice(0, 80);

    const allTweets = [];
    const batchSize = 10; // Parallel batch size

    for (let i = 0; i < accountsToFetch.length; i += batchSize) {
        const batch = accountsToFetch.slice(i, i + batchSize);
        // Fire requests in parallel with jitter
        const results = await Promise.allSettled(batch.map(async (account) => {
            try {
                // Add slight random delay to avoid burst detection
                await new Promise(r => setTimeout(r, Math.random() * 800));
                return await fetchUserTweets(account);
            } catch (e) {
                return [];
            }
        }));

        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                allTweets.push(...result.value);
            }
        });
    }

    // Sort by timestamp
    allTweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Unique tweets only
    const uniqueTweetIds = new Set();
    const uniqueTweets = [];
    for (const t of allTweets) {
        if (!uniqueTweetIds.has(t.id)) {
            uniqueTweetIds.add(t.id);
            uniqueTweets.push(t);
        }
    }

    // Translate content (limit to top 50 to save time)
    console.log(`🌐 Translating ${Math.min(uniqueTweets.length, 50)} tweets...`);
    const translatedTweets = [];
    for (let i = 0; i < Math.min(uniqueTweets.length, 50); i += 10) {
        const batch = uniqueTweets.slice(i, i + 10);
        const translated = await Promise.all(batch.map(t => translateTweetContent(t)));
        translatedTweets.push(...translated);
    }

    console.log(`✅ Total: ${translatedTweets.length} tweets`);
    return translatedTweets;
}

// Get trending tweets (highest engagement in last 24h)
function getTrendingTweets(tweets, limit = 20) {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return tweets
        .filter(t => new Date(t.timestamp).getTime() > oneDayAgo)
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, limit);
}

// Get top analyst tweets
function getTopAnalystTweets(tweets, limit = 20) {
    return tweets
        .filter(t => t.tier === 1 || t.category === 'Elite Analyst')
        .slice(0, limit);
}

// Get most engaged tweets (all time)
function getMostEngagedTweets(tweets, limit = 20) {
    return [...tweets]
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, limit);
}

// Get fresh tweets
function getFreshTweets(tweets, limit = 20) {
    return tweets.slice(0, limit);
}

// Get leaderboard stats
function getLeaderboardStats(tweets) {
    const userStats = {};
    tweets.forEach(tweet => {
        if (!userStats[tweet.username]) {
            userStats[tweet.username] = {
                username: tweet.username,
                displayName: tweet.displayName,
                profileImage: tweet.profileImage,
                category: tweet.category,
                tier: tweet.tier,
                totalPosts: 0,
                totalEngagement: 0,
                avgEngagement: 0
            };
        }
        userStats[tweet.username].totalPosts++;
        userStats[tweet.username].totalEngagement += tweet.engagementScore;
    });

    Object.values(userStats).forEach(stat => {
        stat.avgEngagement = Math.round(stat.totalEngagement / stat.totalPosts);
    });

    return Object.values(userStats)
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 10);
}

// ============ API HANDLER ============
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { tab = 'fresh', refresh } = req.query;
    const now = Date.now();

    try {
        // Check cache
        if (!refresh && tweetsCache.data && (now - tweetsCache.timestamp) < CACHE_TTL) {
            const cachedData = tweetsCache.data;
            let tweets;

            switch (tab) {
                case 'trending':
                    tweets = getTrendingTweets(cachedData);
                    break;
                case 'top-analysts':
                    tweets = getTopAnalystTweets(cachedData);
                    break;
                case 'most-engaged':
                    tweets = getMostEngagedTweets(cachedData);
                    break;
                default:
                    tweets = getFreshTweets(cachedData);
            }

            return res.status(200).json({
                success: true,
                tab,
                tweets,
                leaderboard: getLeaderboardStats(cachedData),
                accounts: uniqueAccounts.length,
                totalTweets: cachedData.length,
                cached: true,
                fetchedAt: new Date(tweetsCache.timestamp).toISOString()
            });
        }

        // Fetch fresh data
        const tweets = await fetchAllTweets({ limit: 100 });

        // Update cache
        tweetsCache.data = tweets;
        tweetsCache.timestamp = now;

        let filteredTweets;
        switch (tab) {
            case 'trending':
                filteredTweets = getTrendingTweets(tweets);
                break;
            case 'top-analysts':
                filteredTweets = getTopAnalystTweets(tweets);
                break;
            case 'most-engaged':
                filteredTweets = getMostEngagedTweets(tweets);
                break;
            default:
                filteredTweets = getFreshTweets(tweets);
        }

        return res.status(200).json({
            success: true,
            tab,
            tweets: filteredTweets,
            leaderboard: getLeaderboardStats(tweets),
            accounts: uniqueAccounts.length,
            totalTweets: tweets.length,
            cached: false,
            fetchedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ X Community API Error:', error.message);
        return res.status(500).json({
            success: false,
            error: error.message,
            tweets: [],
            accounts: uniqueAccounts.length
        });
    }
}
