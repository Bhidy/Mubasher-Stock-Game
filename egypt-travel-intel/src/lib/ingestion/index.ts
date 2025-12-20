export { runIngestion, getLatestIngestionLog, getIngestionStats } from './ingest';
export { detectOffer, detectOffersBatch, EGYPT_DESTINATIONS, OFFER_KEYWORDS } from './detector';
export { scrapeInstagramProfile, transformInstagramPost } from './instagram-scraper';
export type { IngestionResult, IngestionOptions } from './ingest';
export type { DetectionResult } from './detector';
export type { InstagramPost, InstagramProfile, ScrapeResult } from './instagram-scraper';
