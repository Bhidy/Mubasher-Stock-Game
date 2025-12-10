import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Users, TrendingUp, TrendingDown, Sparkles, Info, Flame, Shield, Zap } from 'lucide-react';

// 20 Saudi Stocks with local logo paths
export const SAUDI_STOCKS = {
    '2222': { name: 'Saudi Aramco', initials: 'AR', color: '#00a651', tag: 'safe', users: 4291, logo: '/assets/logos/2222.png' },
    '1120': { name: 'Al Rajhi Bank', initials: 'ARB', color: '#004c97', tag: 'safe', users: 3847, logo: '/assets/logos/1120.png' },
    '2010': { name: 'SABIC', initials: 'SAB', color: '#0072bc', tag: 'trending', users: 2156, logo: '/assets/logos/2010.png' },
    '7010': { name: 'STC', initials: 'STC', color: '#4f2d7f', tag: 'safe', users: 1892, logo: '/assets/logos/7010.png' },
    '2082': { name: 'ACWA Power', initials: 'ACW', color: '#00a3e0', tag: 'volatile', users: 1534, logo: '/assets/logos/2082.png' },
    '1180': { name: 'SNB', initials: 'SNB', color: '#00573f', tag: 'safe', users: 1423, logo: '/assets/logos/1180.png' },
    '2380': { name: 'Petro Rabigh', initials: 'PR', color: '#e31937', tag: 'volatile', users: 1287, logo: '/assets/logos/2380.png' },
    '4030': { name: 'Al Babtain', initials: 'BAB', color: '#1a75cf', tag: 'trending', users: 1156, logo: '/assets/logos/4030.png' },
    '2350': { name: 'SIDC', initials: 'SID', color: '#f7941d', tag: 'volatile', users: 1089, logo: '/assets/logos/2350.png' },
    '4200': { name: 'Aldrees', initials: 'ALD', color: '#cc0000', tag: 'trending', users: 998, logo: '/assets/logos/4200.png' },
    '1211': { name: 'Alinma Bank', initials: 'ALI', color: '#7ab41d', tag: 'safe', users: 934, logo: '/assets/logos/1211.png' },
    '4001': { name: 'Abdullah Al-Othaim', initials: 'OTH', color: '#e4002b', tag: 'trending', users: 876, logo: '/assets/logos/4001.png' },
    '2310': { name: 'Sipchem', initials: 'SIP', color: '#00468b', tag: 'volatile', users: 823, logo: '/assets/logos/2310.png' },
    '4003': { name: 'Extra', initials: 'EXT', color: '#ff6600', tag: 'trending', users: 789, logo: '/assets/logos/4003.png' },
    '2050': { name: 'Savola', initials: 'SAV', color: '#ed1c24', tag: 'safe', users: 756, logo: '/assets/logos/2050.png' },
    '1150': { name: 'Amlak', initials: 'AML', color: '#0066b3', tag: 'volatile', users: 712, logo: '/assets/logos/1150.png' },
    '4190': { name: 'Jarir', initials: 'JAR', color: '#ffc20e', tag: 'trending', users: 689, logo: '/assets/logos/4190.png' },
    '2290': { name: 'Yanbu Cement', initials: 'YAN', color: '#003366', tag: 'safe', users: 645, logo: '/assets/logos/2290.png' },
    '4002': { name: 'Mouwasat', initials: 'MOU', color: '#009639', tag: 'safe', users: 612, logo: '/assets/logos/4002.png' },
    '1010': { name: 'Riyad Bank', initials: 'RYD', color: '#003087', tag: 'safe', users: 578, logo: '/assets/logos/1010.png' },
};

// Tag configurations for filtering
const TAG_CONFIG = {
    trending: { icon: Flame, label: 'Trending', color: '#f59e0b', bg: '#fef3c7' },
    safe: { icon: Shield, label: 'Safe', color: '#10b981', bg: '#dcfce7' },
    volatile: { icon: Zap, label: 'Volatile', color: '#ef4444', bg: '#fee2e2' },
};

// US Stocks Mapping (Major Tech & Popular) - Using reliable Clearbit logos
// US Stocks Mapping (Major Tech & Popular) - Using High Quality Wikimedia/Official SVGs
export const US_STOCKS = {
    'AAPL': { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', color: '#000000', initials: 'AP' },
    'TSLA': { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png', color: '#cc0000', initials: 'TS' },
    'NVDA': { name: 'Nvidia', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', color: '#76b900', initials: 'NV' },
    'AMZN': { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', color: '#ff9900', initials: 'AZ' },
    'MSFT': { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', color: '#00a4ef', initials: 'MS' },
    'GOOGL': { name: 'Alphabet', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', color: '#4285f4', initials: 'GO' },
    'META': { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', color: '#0081fb', initials: 'MT' },
    'AMD': { name: 'AMD', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg', color: '#ED1C24', initials: 'AMD' },
    'NFLX': { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', color: '#E50914', initials: 'NF' },
    'INTC': { name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg', color: '#0071C5', initials: 'IN' },
};

// Egypt Stocks Mapping
// Egypt Stocks Mapping
export const EGYPT_STOCKS = {
    'COMI': { name: 'CIB Egypt', initials: 'CIB', color: '#0055a5', tag: 'safe', logo: 'https://companiesmarketcap.com/img/company-logos/64/COMI.CA.png' },
    'EAST': { name: 'Eastern Company', initials: 'EC', color: '#2e7d32', tag: 'safe', logo: 'https://companiesmarketcap.com/img/company-logos/64/EAST.CA.png' },
    'HRHO': { name: 'EFG Hermes', initials: 'EFG', color: '#e53935', tag: 'trending', logo: 'https://companiesmarketcap.com/img/company-logos/64/HRHO.CA.png' },
    'TMGH': { name: 'TMG Holding', initials: 'TMG', color: '#1e88e5', tag: 'trending', logo: 'https://companiesmarketcap.com/img/company-logos/64/TMGH.CA.png' },
    'SWDY': { name: 'Elsewedy Electric', initials: 'SE', color: '#d32f2f', tag: 'volatile', logo: 'https://companiesmarketcap.com/img/company-logos/64/SWDY.CA.png' },
    'ETEL': { name: 'Telecom Egypt', initials: 'TE', color: '#6a1b9a', tag: 'safe', logo: 'https://companiesmarketcap.com/img/company-logos/64/ETEL.CA.png' },
    'ESRS': { name: 'Ezz Steel', initials: 'EZZ', color: '#455a64', tag: 'volatile', logo: 'https://companiesmarketcap.com/img/company-logos/64/ESRS.CA.png' },
    'EKHO': { name: 'Egypt Kuwait Holding', initials: 'EK', color: '#5c6bc0', tag: 'trending', logo: 'https://companiesmarketcap.com/img/company-logos/64/EKHO.CA.png' },
    'OCDI': { name: 'Orascom Dev', initials: 'ODH', color: '#00838f', tag: 'volatile', logo: 'https://logo.clearbit.com/orascomdh.com' },
    'CLHO': { name: 'Cleopatra Hospitals', initials: 'CH', color: '#00acc1', tag: 'safe', logo: 'https://logo.clearbit.com/cleopatrahospitals.com' },
    'SKPC': { name: 'Sidi Kerir Petro', initials: 'SK', color: '#f57c00', tag: 'volatile' },
    'PHDC': { name: 'Palm Hills Dev', initials: 'PHD', color: '#43a047', tag: 'trending', logo: 'https://logo.clearbit.com/palmhillsdevelopments.com' },
    'MNHD': { name: 'Madinet Nasr', initials: 'MN', color: '#1565c0', tag: 'trending', logo: 'https://logo.clearbit.com/mnhd.com' },
    'ABUK': { name: 'Abu Qir Fertilizers', initials: 'AQ', color: '#558b2f', tag: 'safe' },
    'ORWE': { name: 'Obour Land', initials: 'OL', color: '#f9a825', tag: 'safe', logo: 'https://logo.clearbit.com/obourland.com' },
    'HELI': { name: 'Heliopolis Housing', initials: 'HH', color: '#6d4c41', tag: 'safe' },
};

// ========== NEW MARKETS ==========

// 🇮🇳 INDIA - NSE Stocks (Top 20)
export const INDIA_STOCKS = {
    'RELIANCE': { name: 'Reliance Industries', initials: 'RIL', color: '#0055a4', tag: 'safe', logo: 'https://logo.clearbit.com/ril.com' },
    'TCS': { name: 'Tata Consultancy', initials: 'TCS', color: '#1a73e8', tag: 'safe', logo: 'https://logo.clearbit.com/tcs.com' },
    'HDFCBANK': { name: 'HDFC Bank', initials: 'HDB', color: '#004c8f', tag: 'safe', logo: 'https://logo.clearbit.com/hdfcbank.com' },
    'INFY': { name: 'Infosys', initials: 'INF', color: '#007cc3', tag: 'safe', logo: 'https://logo.clearbit.com/infosys.com' },
    'ICICIBANK': { name: 'ICICI Bank', initials: 'ICI', color: '#f58220', tag: 'safe', logo: 'https://logo.clearbit.com/icicibank.com' },
    'HINDUNILVR': { name: 'Hindustan Unilever', initials: 'HUL', color: '#1f36c7', tag: 'safe' },
    'SBIN': { name: 'State Bank of India', initials: 'SBI', color: '#22409a', tag: 'safe' },
    'BHARTIARTL': { name: 'Bharti Airtel', initials: 'AIR', color: '#ed1c24', tag: 'trending' },
    'KOTAKBANK': { name: 'Kotak Mahindra', initials: 'KMB', color: '#ed1c24', tag: 'safe' },
    'ITC': { name: 'ITC Limited', initials: 'ITC', color: '#003d7c', tag: 'safe' },
    'LT': { name: 'Larsen & Toubro', initials: 'L&T', color: '#0066b3', tag: 'trending' },
    'AXISBANK': { name: 'Axis Bank', initials: 'AXS', color: '#97144d', tag: 'trending' },
    'WIPRO': { name: 'Wipro', initials: 'WIP', color: '#431d7b', tag: 'safe' },
    'SUNPHARMA': { name: 'Sun Pharma', initials: 'SUN', color: '#f7941d', tag: 'safe' },
    'MARUTI': { name: 'Maruti Suzuki', initials: 'MRU', color: '#e31837', tag: 'trending' },
    'TATAMOTORS': { name: 'Tata Motors', initials: 'TAT', color: '#486baf', tag: 'volatile' },
    'HCLTECH': { name: 'HCL Technologies', initials: 'HCL', color: '#0073cf', tag: 'safe' },
    'BAJFINANCE': { name: 'Bajaj Finance', initials: 'BJF', color: '#00529b', tag: 'trending' },
    'ASIANPAINT': { name: 'Asian Paints', initials: 'ASN', color: '#ed1c24', tag: 'safe' },
    'ADANIGREEN': { name: 'Adani Green', initials: 'ADG', color: '#003087', tag: 'volatile' },
};

// 🇬🇧 UK - LSE Stocks (Top 20)
export const UK_STOCKS = {
    'BP': { name: 'BP plc', initials: 'BP', color: '#009a4e', tag: 'safe', logo: 'https://logo.clearbit.com/bp.com' },
    'HSBA': { name: 'HSBC Holdings', initials: 'HSB', color: '#db0011', tag: 'safe', logo: 'https://logo.clearbit.com/hsbc.com' },
    'SHEL': { name: 'Shell plc', initials: 'SHL', color: '#ffcd00', tag: 'safe', logo: 'https://logo.clearbit.com/shell.com' },
    'AZN': { name: 'AstraZeneca', initials: 'AZN', color: '#830051', tag: 'safe', logo: 'https://logo.clearbit.com/astrazeneca.com' },
    'ULVR': { name: 'Unilever', initials: 'ULV', color: '#1f36c7', tag: 'safe', logo: 'https://logo.clearbit.com/unilever.com' },
    'GSK': { name: 'GSK plc', initials: 'GSK', color: '#f36633', tag: 'safe', logo: 'https://logo.clearbit.com/gsk.com' },
    'RIO': { name: 'Rio Tinto', initials: 'RIO', color: '#e4002b', tag: 'trending', logo: 'https://logo.clearbit.com/riotinto.com' },
    'DGE': { name: 'Diageo', initials: 'DGE', color: '#004b87', tag: 'safe', logo: 'https://logo.clearbit.com/diageo.com' },
    'LSEG': { name: 'London Stock Exchange', initials: 'LSE', color: '#004b87', tag: 'safe' },
    'BATS': { name: 'British American Tobacco', initials: 'BAT', color: '#002f6c', tag: 'safe' },
    'LLOY': { name: 'Lloyds Banking', initials: 'LBG', color: '#006a4d', tag: 'trending' },
    'VOD': { name: 'Vodafone', initials: 'VOD', color: '#e60000', tag: 'volatile', logo: 'https://logo.clearbit.com/vodafone.com' },
    'BARC': { name: 'Barclays', initials: 'BAR', color: '#00aeef', tag: 'trending', logo: 'https://logo.clearbit.com/barclays.com' },
    'NWG': { name: 'NatWest Group', initials: 'NWG', color: '#42145f', tag: 'trending' },
    'REL': { name: 'RELX', initials: 'REL', color: '#ff6600', tag: 'safe' },
    'GLEN': { name: 'Glencore', initials: 'GLE', color: '#00263a', tag: 'volatile' },
    'NG': { name: 'National Grid', initials: 'NG', color: '#00a3e0', tag: 'safe' },
    'PRU': { name: 'Prudential', initials: 'PRU', color: '#e4002b', tag: 'safe' },
    'CPG': { name: 'Compass Group', initials: 'CPG', color: '#00263a', tag: 'safe' },
    'AAL': { name: 'Anglo American', initials: 'AAL', color: '#004b87', tag: 'volatile' },
};

// 🇨🇦 CANADA - TSX Stocks (Top 20)
export const CANADA_STOCKS = {
    'SHOP': { name: 'Shopify', initials: 'SHP', color: '#96bf48', tag: 'volatile', logo: 'https://logo.clearbit.com/shopify.com' },
    'RY': { name: 'Royal Bank of Canada', initials: 'RBC', color: '#0051a5', tag: 'safe', logo: 'https://logo.clearbit.com/rbc.com' },
    'TD': { name: 'TD Bank', initials: 'TD', color: '#54b848', tag: 'safe', logo: 'https://logo.clearbit.com/td.com' },
    'ENB': { name: 'Enbridge', initials: 'ENB', color: '#fdb913', tag: 'safe', logo: 'https://logo.clearbit.com/enbridge.com' },
    'CNR': { name: 'Canadian National Railway', initials: 'CNR', color: '#e31837', tag: 'safe' },
    'BNS': { name: 'Bank of Nova Scotia', initials: 'BNS', color: '#ec111a', tag: 'safe' },
    'BMO': { name: 'Bank of Montreal', initials: 'BMO', color: '#0079c1', tag: 'safe' },
    'CP': { name: 'Canadian Pacific Kansas', initials: 'CP', color: '#e21836', tag: 'safe' },
    'SU': { name: 'Suncor Energy', initials: 'SU', color: '#ff0000', tag: 'volatile' },
    'TRP': { name: 'TC Energy', initials: 'TC', color: '#0095da', tag: 'safe' },
    'BCE': { name: 'BCE Inc', initials: 'BCE', color: '#4285f4', tag: 'safe' },
    'CNQ': { name: 'Canadian Natural Res', initials: 'CNQ', color: '#0072bc', tag: 'volatile' },
    'MFC': { name: 'Manulife Financial', initials: 'MFC', color: '#00a758', tag: 'safe' },
    'ATD': { name: 'Alimentation Couche-Tard', initials: 'ATD', color: '#e31837', tag: 'trending' },
    'CSU': { name: 'Constellation Software', initials: 'CSU', color: '#1e3a5f', tag: 'trending' },
    'CM': { name: 'CIBC', initials: 'CM', color: '#bb1e10', tag: 'safe' },
    'ABX': { name: 'Barrick Gold', initials: 'ABX', color: '#ffd700', tag: 'volatile' },
    'T': { name: 'TELUS', initials: 'TEL', color: '#4b286d', tag: 'safe' },
    'WCN': { name: 'Waste Connections', initials: 'WCN', color: '#00843d', tag: 'safe' },
    'L': { name: 'Loblaw Companies', initials: 'LBL', color: '#e31837', tag: 'safe' },
};

// 🇦🇺 AUSTRALIA - ASX Stocks (Top 20)
export const AUSTRALIA_STOCKS = {
    'BHP': { name: 'BHP Group', initials: 'BHP', color: '#f05a28', tag: 'safe', logo: 'https://logo.clearbit.com/bhp.com' },
    'CBA': { name: 'Commonwealth Bank', initials: 'CBA', color: '#ffcc00', tag: 'safe', logo: 'https://logo.clearbit.com/commbank.com.au' },
    'CSL': { name: 'CSL Limited', initials: 'CSL', color: '#00468b', tag: 'safe', logo: 'https://logo.clearbit.com/csl.com' },
    'WBC': { name: 'Westpac Banking', initials: 'WBC', color: '#d5002b', tag: 'safe' },
    'NAB': { name: 'National Australia Bank', initials: 'NAB', color: '#c90016', tag: 'safe' },
    'ANZ': { name: 'ANZ Banking Group', initials: 'ANZ', color: '#007dba', tag: 'safe' },
    'WES': { name: 'Wesfarmers', initials: 'WES', color: '#e4002b', tag: 'safe' },
    'MQG': { name: 'Macquarie Group', initials: 'MQG', color: '#000000', tag: 'trending' },
    'FMG': { name: 'Fortescue Metals', initials: 'FMG', color: '#004c97', tag: 'volatile' },
    'WOW': { name: 'Woolworths Group', initials: 'WOW', color: '#00843d', tag: 'safe' },
    'TLS': { name: 'Telstra', initials: 'TLS', color: '#0077c8', tag: 'safe', logo: 'https://logo.clearbit.com/telstra.com.au' },
    'RIO': { name: 'Rio Tinto (AU)', initials: 'RIO', color: '#e4002b', tag: 'trending' },
    'GMG': { name: 'Goodman Group', initials: 'GMG', color: '#00263a', tag: 'trending' },
    'ALL': { name: 'Aristocrat Leisure', initials: 'ALL', color: '#e31837', tag: 'trending' },
    'TCL': { name: 'Transurban', initials: 'TCL', color: '#004c97', tag: 'safe' },
    'SQ2': { name: 'Block Inc (AU)', initials: 'BLK', color: '#000000', tag: 'volatile' },
    'COL': { name: 'Coles Group', initials: 'COL', color: '#ed1c24', tag: 'safe' },
    'REA': { name: 'REA Group', initials: 'REA', color: '#e4002b', tag: 'trending' },
    'JHX': { name: 'James Hardie', initials: 'JHX', color: '#0072bc', tag: 'safe' },
    'STO': { name: 'Santos', initials: 'STO', color: '#e4002b', tag: 'volatile' },
};

// 🇭🇰 HONG KONG - HKEX Stocks (Top 20)
export const HONGKONG_STOCKS = {
    '0700': { name: 'Tencent', initials: 'TEN', color: '#25aae1', tag: 'trending', logo: 'https://logo.clearbit.com/tencent.com' },
    '9988': { name: 'Alibaba Group', initials: 'BABA', color: '#ff6a00', tag: 'volatile', logo: 'https://logo.clearbit.com/alibaba.com' },
    '0005': { name: 'HSBC Holdings', initials: 'HSB', color: '#db0011', tag: 'safe' },
    '0941': { name: 'China Mobile', initials: 'CHM', color: '#0066b3', tag: 'safe' },
    '1299': { name: 'AIA Group', initials: 'AIA', color: '#b91c1c', tag: 'safe' },
    '0883': { name: 'CNOOC', initials: 'CNO', color: '#0072bc', tag: 'volatile' },
    '2318': { name: 'Ping An Insurance', initials: 'PAI', color: '#ff8200', tag: 'trending' },
    '0939': { name: 'CCB', initials: 'CCB', color: '#003087', tag: 'safe' },
    '1398': { name: 'ICBC', initials: 'ICB', color: '#c90016', tag: 'safe' },
    '3988': { name: 'Bank of China', initials: 'BOC', color: '#c90016', tag: 'safe' },
    '0011': { name: 'Hang Seng Bank', initials: 'HSB', color: '#00563f', tag: 'safe' },
    '0016': { name: 'Sun Hung Kai', initials: 'SHK', color: '#1e3a5f', tag: 'safe' },
    '0001': { name: 'CK Hutchison', initials: 'CKH', color: '#003087', tag: 'safe' },
    '0027': { name: 'Galaxy Entertainment', initials: 'GEG', color: '#ffd700', tag: 'trending' },
    '1810': { name: 'Xiaomi', initials: 'XMI', color: '#ff6900', tag: 'volatile', logo: 'https://logo.clearbit.com/mi.com' },
    '9618': { name: 'JD.com', initials: 'JD', color: '#c90016', tag: 'trending', logo: 'https://logo.clearbit.com/jd.com' },
    '3690': { name: 'Meituan', initials: 'MT', color: '#ffc300', tag: 'volatile' },
    '0066': { name: 'MTR Corporation', initials: 'MTR', color: '#c90016', tag: 'safe' },
    '0002': { name: 'CLP Holdings', initials: 'CLP', color: '#00a651', tag: 'safe' },
    '1928': { name: 'Sands China', initials: 'SND', color: '#c90016', tag: 'volatile' },
};

// 🇩🇪 GERMANY - XETRA Stocks (Top 20)
export const GERMANY_STOCKS = {
    'SAP': { name: 'SAP SE', initials: 'SAP', color: '#0072bc', tag: 'safe', logo: 'https://logo.clearbit.com/sap.com' },
    'SIE': { name: 'Siemens', initials: 'SIE', color: '#009999', tag: 'safe', logo: 'https://logo.clearbit.com/siemens.com' },
    'ALV': { name: 'Allianz', initials: 'ALV', color: '#003781', tag: 'safe', logo: 'https://logo.clearbit.com/allianz.com' },
    'DTE': { name: 'Deutsche Telekom', initials: 'DTE', color: '#e20074', tag: 'safe', logo: 'https://logo.clearbit.com/telekom.de' },
    'MBG': { name: 'Mercedes-Benz', initials: 'MBG', color: '#333333', tag: 'safe', logo: 'https://logo.clearbit.com/mercedes-benz.com' },
    'BMW': { name: 'BMW', initials: 'BMW', color: '#0066b1', tag: 'safe', logo: 'https://logo.clearbit.com/bmw.com' },
    'BAS': { name: 'BASF', initials: 'BAS', color: '#21336a', tag: 'safe', logo: 'https://logo.clearbit.com/basf.com' },
    'DBK': { name: 'Deutsche Bank', initials: 'DBK', color: '#0018a8', tag: 'volatile', logo: 'https://logo.clearbit.com/db.com' },
    'VOW3': { name: 'Volkswagen', initials: 'VW', color: '#001e50', tag: 'safe', logo: 'https://logo.clearbit.com/volkswagen.com' },
    'ADS': { name: 'Adidas', initials: 'ADS', color: '#000000', tag: 'trending', logo: 'https://logo.clearbit.com/adidas.com' },
    'MRK': { name: 'Merck KGaA', initials: 'MRK', color: '#003366', tag: 'safe' },
    'DPW': { name: 'Deutsche Post DHL', initials: 'DHL', color: '#ffcc00', tag: 'safe', logo: 'https://logo.clearbit.com/dhl.com' },
    'IFX': { name: 'Infineon', initials: 'IFX', color: '#0063a3', tag: 'trending' },
    'RWE': { name: 'RWE', initials: 'RWE', color: '#1e3888', tag: 'safe' },
    'ENR': { name: 'Siemens Energy', initials: 'ENR', color: '#009999', tag: 'volatile' },
    'HEN3': { name: 'Henkel', initials: 'HEN', color: '#ff0000', tag: 'safe' },
    'MUV2': { name: 'Munich Re', initials: 'MUV', color: '#006fc0', tag: 'safe' },
    'CON': { name: 'Continental', initials: 'CON', color: '#ffa500', tag: 'volatile' },
    'FRE': { name: 'Fresenius', initials: 'FRE', color: '#003c71', tag: 'safe' },
    'HEI': { name: 'HeidelbergCement', initials: 'HEI', color: '#004990', tag: 'safe' },
};

// 🇯🇵 JAPAN - TSE Stocks (Top 20)
export const JAPAN_STOCKS = {
    '7203': { name: 'Toyota Motor', initials: 'TYT', color: '#eb0a1e', tag: 'safe', logo: 'https://logo.clearbit.com/toyota.com' },
    '6758': { name: 'Sony Group', initials: 'SNE', color: '#000000', tag: 'safe', logo: 'https://logo.clearbit.com/sony.com' },
    '9984': { name: 'SoftBank Group', initials: 'SBG', color: '#eb0a1e', tag: 'volatile' },
    '6861': { name: 'Keyence', initials: 'KEY', color: '#e60012', tag: 'safe' },
    '9432': { name: 'NTT', initials: 'NTT', color: '#00a0e9', tag: 'safe' },
    '8306': { name: 'Mitsubishi UFJ', initials: 'MUF', color: '#cc0000', tag: 'safe' },
    '6098': { name: 'Recruit Holdings', initials: 'REC', color: '#000000', tag: 'trending' },
    '7974': { name: 'Nintendo', initials: 'NTD', color: '#e60012', tag: 'safe', logo: 'https://logo.clearbit.com/nintendo.com' },
    '4502': { name: 'Takeda Pharma', initials: 'TKD', color: '#e60012', tag: 'safe' },
    '8035': { name: 'Tokyo Electron', initials: 'TEL', color: '#003399', tag: 'trending' },
    '6501': { name: 'Hitachi', initials: 'HIT', color: '#e60012', tag: 'safe', logo: 'https://logo.clearbit.com/hitachi.com' },
    '4063': { name: 'Shin-Etsu Chemical', initials: 'SEC', color: '#005bac', tag: 'safe' },
    '7267': { name: 'Honda Motor', initials: 'HMC', color: '#cc0000', tag: 'safe', logo: 'https://logo.clearbit.com/honda.com' },
    '9433': { name: 'KDDI', initials: 'KDD', color: '#ff8200', tag: 'safe' },
    '8766': { name: 'Tokio Marine', initials: 'TKM', color: '#e60012', tag: 'safe' },
    '6902': { name: 'Denso', initials: 'DEN', color: '#000000', tag: 'safe' },
    '4661': { name: 'Oriental Land', initials: 'OLC', color: '#004990', tag: 'trending' },
    '7751': { name: 'Canon', initials: 'CAN', color: '#cc0000', tag: 'safe', logo: 'https://logo.clearbit.com/canon.com' },
    '4503': { name: 'Astellas Pharma', initials: 'AST', color: '#00529b', tag: 'safe' },
    '9983': { name: 'Fast Retailing', initials: 'FR', color: '#ff0000', tag: 'trending' },
};

// 🇦🇪 UAE - ADX/DFM Stocks (Top 15)
export const UAE_STOCKS = {
    'EMAAR': { name: 'Emaar Properties', initials: 'EMR', color: '#c8a45c', tag: 'safe' },
    'FAB': { name: 'First Abu Dhabi Bank', initials: 'FAB', color: '#0072ce', tag: 'safe' },
    'ADNOCDIST': { name: 'ADNOC Distribution', initials: 'ADN', color: '#00a651', tag: 'safe' },
    'ETISALAT': { name: 'e& (Etisalat)', initials: 'E&', color: '#5e9f2b', tag: 'safe' },
    'DIB': { name: 'Dubai Islamic Bank', initials: 'DIB', color: '#003087', tag: 'safe' },
    'ADIB': { name: 'Abu Dhabi Islamic Bank', initials: 'ADB', color: '#0072ce', tag: 'safe' },
    'DU': { name: 'Emirates Integrated', initials: 'DU', color: '#00a0d2', tag: 'safe' },
    'DAMAC': { name: 'Damac Properties', initials: 'DAM', color: '#1e3a5f', tag: 'volatile' },
    'ALDAR': { name: 'Aldar Properties', initials: 'ALD', color: '#8c1d40', tag: 'trending' },
    'EMIRATES': { name: 'Emirates NBD', initials: 'NBD', color: '#004c6d', tag: 'safe' },
    'DEWA': { name: 'Dubai Electricity', initials: 'DEW', color: '#00a651', tag: 'safe' },
    'SALIK': { name: 'Salik Company', initials: 'SLK', color: '#ffc72c', tag: 'trending' },
    'ADPORTS': { name: 'AD Ports Group', initials: 'ADP', color: '#0072ce', tag: 'trending' },
    'IHC': { name: 'International Holding', initials: 'IHC', color: '#1e3a5f', tag: 'volatile' },
    'TAQA': { name: 'Abu Dhabi Natl Energy', initials: 'TAQ', color: '#00a651', tag: 'safe' },
};

// 🇿🇦 SOUTH AFRICA - JSE Stocks (Top 15)
export const SOUTHAFRICA_STOCKS = {
    'NPN': { name: 'Naspers', initials: 'NPN', color: '#003087', tag: 'volatile' },
    'SOL': { name: 'Sasol', initials: 'SOL', color: '#00843d', tag: 'volatile' },
    'BTI': { name: 'British American Tobacco', initials: 'BAT', color: '#002f6c', tag: 'safe' },
    'SBK': { name: 'Standard Bank', initials: 'SBK', color: '#0033a0', tag: 'safe' },
    'FSR': { name: 'FirstRand', initials: 'FSR', color: '#a71930', tag: 'safe' },
    'AGL': { name: 'Anglo American Plat', initials: 'AGL', color: '#d71920', tag: 'volatile' },
    'MTN': { name: 'MTN Group', initials: 'MTN', color: '#ffcc00', tag: 'trending' },
    'ABG': { name: 'Absa Group', initials: 'ABG', color: '#af0b24', tag: 'safe' },
    'CFR': { name: 'Compagnie Richemont', initials: 'CFR', color: '#1e3a5f', tag: 'safe' },
    'BID': { name: 'Bid Corporation', initials: 'BID', color: '#003087', tag: 'safe' },
    'VOD': { name: 'Vodacom Group', initials: 'VOD', color: '#e60000', tag: 'safe' },
    'SHP': { name: 'Shoprite Holdings', initials: 'SHP', color: '#eb1c24', tag: 'safe' },
    'AMS': { name: 'Anglo American', initials: 'AMS', color: '#004b87', tag: 'volatile' },
    'IMP': { name: 'Impala Platinum', initials: 'IMP', color: '#1e3a5f', tag: 'volatile' },
    'NED': { name: 'Nedbank Group', initials: 'NED', color: '#006341', tag: 'safe' },
};

// 🇶🇦 QATAR - QSE Stocks (Top 12)
export const QATAR_STOCKS = {
    'QNBK': { name: 'QNB Group', initials: 'QNB', color: '#7b2d7d', tag: 'safe' },
    'QEWS': { name: 'Qatar Electricity', initials: 'QEW', color: '#00a651', tag: 'safe' },
    'QGTS': { name: 'Qatar Gas Transport', initials: 'QGT', color: '#0072bc', tag: 'safe' },
    'QIBK': { name: 'Qatar Islamic Bank', initials: 'QIB', color: '#00573f', tag: 'safe' },
    'IQCD': { name: 'Industries Qatar', initials: 'IQ', color: '#003087', tag: 'safe' },
    'MARK': { name: 'Masraf Al Rayan', initials: 'MAR', color: '#005030', tag: 'safe' },
    'BRES': { name: 'Barwa Real Estate', initials: 'BRE', color: '#c8a45c', tag: 'trending' },
    'CBQK': { name: 'Commercial Bank', initials: 'CBQ', color: '#0072ce', tag: 'safe' },
    'ORDS': { name: 'Ooredoo', initials: 'ORD', color: '#e60012', tag: 'trending' },
    'QFLS': { name: 'Qatar Fuel', initials: 'QFL', color: '#00a651', tag: 'safe' },
    'UDCD': { name: 'United Development', initials: 'UDC', color: '#1e3a5f', tag: 'trending' },
    'DHBK': { name: 'Doha Bank', initials: 'DHB', color: '#003087', tag: 'safe' },
};

// Unified function to get stock data from any market
export function getStockData(ticker) {
    const cleanTicker = ticker?.split('.')[0] || ticker;
    return SAUDI_STOCKS[cleanTicker]
        || US_STOCKS[cleanTicker]
        || EGYPT_STOCKS[cleanTicker]
        || INDIA_STOCKS[cleanTicker]
        || UK_STOCKS[cleanTicker]
        || CANADA_STOCKS[cleanTicker]
        || AUSTRALIA_STOCKS[cleanTicker]
        || HONGKONG_STOCKS[cleanTicker]
        || GERMANY_STOCKS[cleanTicker]
        || JAPAN_STOCKS[cleanTicker]
        || UAE_STOCKS[cleanTicker]
        || SOUTHAFRICA_STOCKS[cleanTicker]
        || QATAR_STOCKS[cleanTicker]
        || null;
}



// Stock Logo component with robust multi-source fallback
function StockLogo({ ticker, size = 56, logoUrl = null }) {
    // Resolve stock data to get metadata (color, initials, standard logo)
    const cleanTicker = ticker?.split('.')[0] || ticker;
    const mappedStock = getStockData(cleanTicker);

    // Determine the initial source: prop > mapped > null
    const initialSrc = logoUrl || (mappedStock?.logo || null);

    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [fallbackIndex, setFallbackIndex] = useState(0);
    const [hasError, setHasError] = useState(false);

    // Reset state when ticker or url changes
    useEffect(() => {
        setImgSrc(logoUrl || (mappedStock?.logo || null));
        setFallbackIndex(0);
        setHasError(false);
    }, [ticker, logoUrl, mappedStock?.logo]);

    // Handle Image Load Error - Try multiple fallback sources
    const handleError = () => {
        const fallbacks = [
            // Fallback 1: CompaniesMarketCap (High Quality)
            `https://companiesmarketcap.com/img/company-logos/64/${cleanTicker.toUpperCase()}.png`,
            // Fallback 2: General Google
            mappedStock?.website ? `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${mappedStock.website}&size=128` : null,
            // Fallback 3: TradingView (Reliable but sometimes generic)
            `https://s3-symbol-logo.tradingview.com/${cleanTicker.toLowerCase()}--big.svg`,
            // Fallback 4: Clearbit (often blocked but good)
            mappedStock?.website ? `https://logo.clearbit.com/${mappedStock.website}` : null,
        ].filter(Boolean);

        if (fallbackIndex < fallbacks.length) {
            setImgSrc(fallbacks[fallbackIndex]);
            setFallbackIndex(prev => prev + 1);
        } else {
            // All fallbacks exhausted, show initials
            setHasError(true);
        }
    };

    // Fallback constants - Use gradient colors for better visual appeal
    const color = mappedStock?.color || '#6366f1';
    const secondaryColor = adjustColor(color, -20); // Slightly darker for gradient
    const initials = mappedStock?.initials || cleanTicker?.slice(0, 2).toUpperCase() || '??';

    // RENDER: Fancy Initials (Fallback) - Much improved design
    if (hasError || !imgSrc) {
        return (
            <div style={{
                width: size,
                height: size,
                borderRadius: size * 0.25,
                background: `linear-gradient(145deg, ${color} 0%, ${secondaryColor} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: size * 0.32,
                letterSpacing: '-0.5px',
                boxShadow: `0 4px 14px ${color}50`,
                position: 'relative',
                overflow: 'hidden',
                border: `2px solid ${color}20`
            }}>
                {/* Glass shine effect */}
                <div style={{
                    position: 'absolute',
                    top: '0', left: '-50%', right: '0',
                    height: '50%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)',
                    borderRadius: '50%',
                    transform: 'scale(2)'
                }} />
                <span style={{ position: 'relative', zIndex: 1, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                    {initials}
                </span>
            </div>
        );
    }

    // RENDER: Image
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: size * 0.25,
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
            <img
                src={imgSrc}
                alt={ticker}
                style={{
                    width: '85%',
                    height: '85%',
                    objectFit: 'contain'
                }}
                onError={handleError}
                loading="lazy"
                referrerPolicy="no-referrer"
            />
        </div>
    );
}

// Helper: Adjust color brightness
function adjustColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

export default function StockCard({ stock, isSelected, onToggle }) {
    const navigate = useNavigate();
    const isAramco = stock.ticker === '2222';
    const stockData = SAUDI_STOCKS[stock.ticker]; // Local metadata

    const rarityColors = {
        common: { border: '#94a3b8', bg: '#f1f5f9', glow: 'rgba(148, 163, 184, 0.1)' },
        rare: { border: '#3b82f6', bg: '#dbeafe', glow: 'rgba(59, 130, 246, 0.15)' },
        epic: { border: '#a855f7', bg: '#f3e8ff', glow: 'rgba(168, 85, 247, 0.15)' },
        legendary: { border: '#f59e0b', bg: '#fef3c7', glow: 'rgba(245, 158, 11, 0.2)' }
    };

    const rarity = rarityColors[stock.rarity] || rarityColors.common;

    const handleViewClick = (e) => {
        e.stopPropagation();
        navigate(`/company/${stock.ticker}`);
    };

    const pickedUsers = stockData?.users || 0;

    // Get tag config
    const tag = stock.tag ? TAG_CONFIG[stock.tag] : (stockData?.tag ? TAG_CONFIG[stockData.tag] : null);
    const TagIcon = tag?.icon;

    // Format price with 2 decimals
    const formatPrice = (price) => {
        return `${Number(price).toFixed(2)}`;
    };

    return (
        <div
            onClick={onToggle}
            style={{
                position: 'relative',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                border: isSelected ? `3px solid var(--primary)` : `2px solid ${rarity.border}`,
                boxShadow: isSelected
                    ? '0 8px 24px rgba(99, 102, 241, 0.25)'
                    : `0 4px 12px ${rarity.glow}`,
            }}
        >
            {/* Top row: Tag on left, View button on right (Aramco only) */}
            <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                {/* Tag badge (Trending/Safe/Volatile) */}
                {tag && (
                    <div style={{
                        background: tag.bg,
                        padding: '0.25rem 0.625rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        color: tag.color,
                        textTransform: 'uppercase',
                        border: `1px solid ${tag.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <TagIcon size={10} />
                        {tag.label}
                    </div>
                )}
                {!tag && <div />}

                {/* View button - For all stocks */}
                <button
                    onClick={handleViewClick}
                    style={{
                        background: 'var(--gradient-info)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.375rem 0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(6, 182, 212, 0.35)',
                        transition: 'all 0.2s'
                    }}
                >
                    <Info size={14} />
                    View
                </button>
            </div>

            <div className="flex-between">
                <div className="flex-center" style={{ gap: '1rem', flex: 1 }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${rarity.border}`,
                        boxShadow: `0 4px 12px ${rarity.glow}`,
                        overflow: 'hidden'
                    }}>
                        <StockLogo ticker={stock.ticker} logoUrl={stock.logo} size={52} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start', marginBottom: '0.25rem' }}>
                            <h3 className="h3" style={{ fontSize: '1.125rem' }}>{stock.ticker}</h3>
                            {stock.isTrending && (
                                <span style={{
                                    fontSize: '0.875rem',
                                    background: '#fef3c7',
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 700,
                                    color: '#f59e0b',
                                    border: '1px solid #fde68a'
                                }}>
                                    🔥 HOT
                                </span>
                            )}
                        </div>
                        <p className="caption" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{stock.name || stockData?.name}</p>
                        <div className="flex-center" style={{ gap: '0.375rem' }}>
                            <Users size={12} color="var(--text-muted)" />
                            <span className="caption">{pickedUsers.toLocaleString()} users picked</span>
                        </div>
                    </div>
                </div>

                <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                        {formatPrice(stock.price)}
                    </span>
                    <div className="flex-center" style={{
                        gap: '0.375rem',
                        background: (stock.change || 0) >= 0 ? '#dcfce7' : '#fee2e2',
                        padding: '0.25rem 0.625rem',
                        borderRadius: 'var(--radius-full)',
                        border: (stock.change || 0) >= 0 ? '1px solid #bbf7d0' : '1px solid #fecaca'
                    }}>
                        {(stock.change || 0) >= 0 ? <TrendingUp size={14} color="var(--success)" /> : <TrendingDown size={14} color="var(--danger)" />}
                        <span style={{
                            color: (stock.change || 0) >= 0 ? 'var(--success)' : 'var(--danger)',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                        }}>
                            {(stock.change || 0) >= 0 ? '+' : ''}{Number(stock.change || 0).toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Selection indicator - checkmark badge */}
            {isSelected && (
                <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                    border: '3px solid white'
                }}>
                    <Check size={18} strokeWidth={3} />
                </div>
            )}
        </div>
    );
}

// Export StockLogo and SAUDI_STOCKS for use in other components
export { StockLogo };
