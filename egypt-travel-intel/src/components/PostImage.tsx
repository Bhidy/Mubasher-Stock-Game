
'use client';

import { useState, useEffect } from 'react';
import { Activity, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostImageProps {
    src: string | null;
    alt: string;
    className?: string;
    fill?: boolean;
}

// Check if URL is from Instagram CDN (which blocks direct browser requests)
function isInstagramCdn(url: string): boolean {
    return url.includes('cdninstagram.com') ||
        url.includes('instagram.com') ||
        url.includes('fbcdn.net') ||
        url.includes('scontent');
}

export function PostImage({ src, alt, className, fill = false }: PostImageProps) {
    // Use proxy immediately for Instagram URLs
    const getInitialSrc = (url: string | null) => {
        if (!url) return null;
        // Always use proxy for Instagram CDN images
        if (isInstagramCdn(url)) {
            return `/api/image-proxy?url=${encodeURIComponent(url)}`;
        }
        return url;
    };

    const [imageSrc, setImageSrc] = useState<string | null>(() => getInitialSrc(src));
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setImageSrc(getInitialSrc(src));
        setError(false);
        setLoaded(false);
    }, [src]);

    const handleError = () => {
        // Proxy already used (or direct URL failed), show error state
        console.error('Image load failed:', src);
        setError(true);
    };

    if (!src || error) {
        return (
            <div className={cn("flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400 p-4 text-center w-full h-full", className)}>
                <Activity className="w-8 h-8 text-slate-300" />
                <span className="text-xs font-medium">Untitled Media</span>
            </div>
        );
    }

    return (
        <div className={cn("relative overflow-hidden bg-slate-100", className, fill ? "w-full h-full" : "")}>
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-100">
                    <Activity className="w-6 h-6 text-slate-300 animate-pulse" />
                </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={imageSrc!}
                alt={alt}
                className={cn(
                    "transition-all duration-700",
                    fill ? "w-full h-full object-cover" : "",
                    loaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setLoaded(true)}
                onError={handleError}
            />
        </div>
    );
}
