
import axios from 'axios';

async function createBlob() {
    console.log('Creating new Blob...');
    try {
        const INITIAL_DATA = {
            lessons: [
                { id: 'lesson-1', title: 'Introduction to Stocks', description: 'Learn what stocks are and why people invest in them', category: 'basics', difficulty: 'beginner', duration: 5, xpReward: 50, coinReward: 25, icon: '📈', isPublished: true, order: 1, content: 'Stocks represent ownership in a company...', createdAt: new Date().toISOString() },
            ],
            challenges: [],
            achievements: [],
            shopItems: [],
            news: [],
            announcements: [],
            contests: []
        };

        const res = await axios.post('https://jsonblob.com/api/jsonBlob', INITIAL_DATA, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log('Blob Created!');
        // Location header contains the URL to the new blob
        const location = res.headers['location'] || res.headers['Location'];
        console.log('Location:', location);

        // Extract ID
        const parts = location.split('/');
        const newId = parts[parts.length - 1];
        console.log('NEW_BLOB_ID:', newId);

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.error('Response data:', e.response.data);
        }
    }
}

createBlob();
