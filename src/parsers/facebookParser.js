const BaseParser = require('./baseParser');
const axios = require('axios');

class FacebookParser extends BaseParser {
    constructor() {
        super('Facebook');
        this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    }

    async parse(topic) {
        console.log(`[${this.platformName}] Parsing for topic: ${topic}`);
        
        if (!this.accessToken) {
            console.log(`[${this.platformName}] No API Key found. Returning mock data.`);
            return this.getMockData(topic);
        }

        try {
            // Real API Call to Facebook Graph API
            // Note: Facebook requires public page access or specific app reviews to search public posts.
            // Using a generic search endpoint as an example.
            const response = await axios.get(`https://graph.facebook.com/v19.0/pages/search`, {
                params: {
                    q: topic,
                    fields: 'id,name,posts{message,created_time,likes.summary(true),comments.summary(true)}',
                    access_token: this.accessToken
                }
            });

            let results = [];
            
            // Flatten the complex Graph API response
            const pages = response.data.data || [];
            pages.forEach(page => {
                if (page.posts && page.posts.data) {
                    page.posts.data.forEach(post => {
                        results.push({
                            id: post.id,
                            author: page.name,
                            text: post.message || 'No text content',
                            likes: post.likes?.summary?.total_count || 0,
                            comments: post.comments?.summary?.total_count || 0,
                            timestamp: post.created_time
                        });
                    });
                }
            });

            return results.slice(0, 10);

        } catch (error) {
            console.error(`[${this.platformName}] API Error:`, error.response?.data || error.message);
            throw new Error('Failed to fetch from Facebook API');
        }
    }

    getMockData(topic) {
        return [
            {
                id: `fb-${Date.now()}-1`,
                author: 'Marketing Pros Group',
                text: `Have you seen the new ${topic} algorithm updates? Here's what you need to know.`,
                likes: 56,
                comments: 12,
                timestamp: new Date().toISOString()
            }
        ];
    }
}

module.exports = FacebookParser;
