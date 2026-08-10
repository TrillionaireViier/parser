const BaseParser = require('./baseParser');
const axios = require('axios');

class ThreadsParser extends BaseParser {
    constructor() {
        super('Threads');
        this.apiKey = process.env.THREADS_API_KEY;
    }

    async parse(topic) {
        console.log(`[${this.platformName}] Parsing for topic: ${topic}`);
        
        if (!this.apiKey) {
            console.log(`[${this.platformName}] No API Key found. Returning mock data.`);
            return this.getMockData(topic);
        }

        try {
            // Real API Call to Threads API
            // Note: Threads API is in beta/restricted access.
            const response = await axios.get('https://graph.threads.net/v1.0/search', {
                params: {
                    q: topic,
                    access_token: this.apiKey
                }
            });

            // Map the Threads API response
            return response.data.data.map(thread => ({
                id: thread.id,
                author: thread.username || 'unknown_user',
                text: thread.text,
                likes: thread.like_count || 0,
                replies: thread.reply_count || 0,
                timestamp: thread.timestamp
            })).slice(0, 10);

        } catch (error) {
            console.error(`[${this.platformName}] API Error:`, error.response?.data || error.message);
            throw new Error('Failed to fetch from Threads API');
        }
    }

    getMockData(topic) {
        return [
            {
                id: `th-${Date.now()}-1`,
                author: 'tech_insider',
                text: `Just deep dived into ${topic}. The ecosystem is growing faster than expected. 🚀`,
                likes: 890,
                replies: 45,
                timestamp: new Date().toISOString()
            }
        ];
    }
}

module.exports = ThreadsParser;
