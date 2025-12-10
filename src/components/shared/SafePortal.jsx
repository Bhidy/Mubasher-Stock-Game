import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

/**
 * A safe wrapper around ReactDOM.createPortal that ensures the document body exists
 * and prevents crashes during initialization phases or SSR-like environments.
 */
export default function SafePortal({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Only render if mounted and body exists
    if (!mounted || typeof document === 'undefined' || !document.body) {
        return null;
    }

    return createPortal(children, document.body);
}
