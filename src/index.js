const TwitterParser = require('./parsers/twitterParser');
const FacebookParser = require('./parsers/facebookParser');
const ThreadsParser = require('./parsers/threadsParser');
const storage = require('./utils/storage');

async function main() {
    const topics = ['marketing', 'programming', 'crypto-block'];
    
    const parsers = [
        new TwitterParser(),
        new FacebookParser(),
        new ThreadsParser()
    ];

    try {
        // Initialize all parsers
        for (const parser of parsers) {
            await parser.init();
        }

        // Process topics across platforms
        for (const topic of topics) {
            console.log(`\n--- Starting collection for topic: ${topic} ---`);
            
            for (const parser of parsers) {
                try {
                    const data = await parser.parse(topic);
                    
                    if (data && data.length > 0) {
                        storage.save(parser.platformName.toLowerCase(), topic, data);
                    } else {
                        console.log(`[${parser.platformName}] No data found for topic: ${topic}`);
                    }
                } catch (error) {
                    console.error(`[${parser.platformName}] Error parsing topic ${topic}:`, error.message);
                }
            }
        }

    } catch (error) {
        console.error('Fatal error during parsing sequence:', error);
    } finally {
        // Cleanup all parsers
        console.log('\n--- Cleaning up resources ---');
        for (const parser of parsers) {
            await parser.close();
        }
    }
}

main().then(() => console.log('Parsing job completed.'));
