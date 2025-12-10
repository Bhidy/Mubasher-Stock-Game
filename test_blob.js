
import axios from 'axios';

const BLOB_ID = '1348767937380122624';
const BLOB_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

async function test() {
    console.log('Testing Blob Connection...');
    try {
        console.log('Reading...');
        const res = await axios.get(BLOB_URL);
        console.log('Read success. Data keys:', Object.keys(res.data));

        console.log('Writing...');
        // We will just append a timestamp to the description of the first shop item as a test, to not break structure
        const data = res.data;
        if (data.shopItems && data.shopItems.length > 0) {
            data.shopItems[0].description = `Updated at ${new Date().toISOString()}`;
        }

        const writeRes = await axios.put(BLOB_URL, data, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Write success:', writeRes.status);
    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.error('Response data:', e.response.data);
            console.error('Response status:', e.response.status);
        }
    }
}

test();
