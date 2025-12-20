
'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostImageProps {
    src: string | null;
    alt: string;
    className?: string;
    fill?: boolean;
}

export function PostImage({ src, alt, className, fill = false }: PostImageProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(src);
    const [usingProxy, setUsingProxy] = useState(false);
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setImageSrc(src);
        setUsingProxy(false);
        setError(false);
        setLoaded(false);
    }, [src]);

    const handleError = () => {
        if (!usingProxy && src) {
            // Try proxy
            console.log('Image load failed, retrying via proxy:', src);
            setUsingProxy(true);
            setImageSrc(`/api/image-proxy?url=${encodeURIComponent(src)}`);
            // Reset loaded state to show loading pulse again if desired, or keep it 
            // setLoaded(false); 
        } else {
            // Proxy also failed
            console.error('Image load failed even with proxy');
            setError(true);
        }
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
