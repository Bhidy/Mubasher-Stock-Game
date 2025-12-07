const Buffer = require('buffer').Buffer;

function decodeGoogleId() {
    const id = 'CBMipgFBVV95cUxPeEhRYlR1cURlZjhmQ3d5NHNxWm11b0lYU3R2Z2JacnRUd19wNnZKczdOeXV1OUdVNmlwV0VzNTRZYVpESEUwa2QxVVI5N3R3Y09WakkxNFhZT1hKbjc1NU9ZUGx0WDhtSl9ZYXBNbFpFWVAyeWRGN1Ytd29VeG8xUWFqbWRiOFhIdm52bW03cEJZNEVFTG52d05mUHdJX1Awd2xKZl9B';

    try {
        const decoded = Buffer.from(id, 'base64').toString('utf8');
        console.log('--- Decoded (UTF-8) ---');
        console.log(decoded);

        // Try regex to find http links
        const match = decoded.match(/https?:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?/);
        if (match) {
            console.log('\n✅ FOUND URL:', match[0]);
        } else {
            // Sometimes it's not standard base64 or has a prefix
            // Try slicing
            const sliced = Buffer.from(id.substring(4), 'base64').toString('utf8');
            console.log('\n--- Decoded Sliced (UTF-8) ---');
            console.log(sliced);
            const match2 = sliced.match(/https?:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?/);
            if (match2) console.log('\n✅ FOUND URL in sliced:', match2[0]);
        }

    } catch (e) {
        console.log('Decode error:', e);
    }
}

decodeGoogleId();
