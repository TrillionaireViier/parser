const TwitterParser = require('../src/parsers/twitterParser');
const FacebookParser = require('../src/parsers/facebookParser');
const ThreadsParser = require('../src/parsers/threadsParser');

export default async function handler(request, response) {
    // Allow topic to be passed via query string ?topic=marketing
    const queryTopic = request.query.topic || 'marketing';
    const topics = [queryTopic]; // Process one topic at a time to avoid timeout
    
    const parsers = [
        new TwitterParser(),
        new FacebookParser(),
        new ThreadsParser()
    ];

    let results = {};

    try {
        // Initialize all parsers
        for (const parser of parsers) {
            await parser.init();
        }

        // Process topics across platforms
        for (const topic of topics) {
            results[topic] = {};
            for (const parser of parsers) {
                try {
                    const data = await parser.parse(topic);
                    results[topic][parser.platformName.toLowerCase()] = data || [];
                } catch (error) {
                    results[topic][parser.platformName.toLowerCase()] = { error: error.message };
                }
            }
        }
        
        response.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {
        response.status(500).json({ 
            success: false, 
            error: error.message 
        });
    } finally {
        // Cleanup all parsers
        for (const parser of parsers) {
            await parser.close();
        }
    }
}
