const BaseParser = require('./baseParser');
const axios = require('axios');

class TwitterParser extends BaseParser {
    constructor() {
        super('Twitter');
        this.apiKey = process.env.TWITTER_BEARER_TOKEN;
    }

    async parse(topic) {
        console.log(`[${this.platformName}] Parsing for topic: ${topic}`);
        
        if (!this.apiKey) {
            console.log(`[${this.platformName}] No API Key found. Returning mock data.`);
            return this.getMockData(topic);
        }

        try {
            // Real API Call to X (Twitter) API v2
            // Endpoint: GET /2/tweets/search/recent
            const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                params: {
                    query: topic,
                    'tweet.fields': 'public_metrics,created_at,author_id',
                    max_results: 10
                }
            });

            // Map the Twitter API response to our app's data structure
            return response.data.data.map(tweet => ({
                id: tweet.id,
                author: tweet.author_id, // Would need user lookup to get handle
                text: tweet.text,
                likes: tweet.public_metrics?.like_count || 0,
                retweets: tweet.public_metrics?.retweet_count || 0,
                timestamp: tweet.created_at
            }));

        } catch (error) {
            console.error(`[${this.platformName}] API Error:`, error.response?.data || error.message);
            throw new Error('Failed to fetch from Twitter API');
        }
    }

    getMockData(topic) {
        return [
            {
                id: `tw-${Date.now()}-1`,
                author: '@crypto_guru',
                text: `Just found an amazing ${topic} opportunity. Don't miss out! #gem #moon`,
                likes: 120,
                retweets: 45,
                timestamp: new Date().toISOString()
            },
            {
                id: `tw-${Date.now()}-2`,
                author: '@dev_marketer',
                text: `How ${topic} is changing the landscape of software engineering in 2024. Thread 🧵`,
                likes: 3400,
                retweets: 890,
                timestamp: new Date(Date.now() - 3600000).toISOString()
            }
        ];
    }
}

module.exports = TwitterParser;
