const BaseParser = require('./baseParser');

class ThreadsParser extends BaseParser {
    constructor() {
        super('Threads');
    }

    async parse(topic) {
        console.log(`[${this.platformName}] Simulating parsing for topic: ${topic}`);
        
        // Mocking the result
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
