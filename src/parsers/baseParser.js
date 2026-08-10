class BaseParser {
    constructor(platformName) {
        this.platformName = platformName;
    }

    async init() {
        // Initialize browser, APIs, or database connections
        console.log(`[${this.platformName}] Initializing parser...`);
    }

    async parse(topic) {
        throw new Error('parse(topic) must be implemented by subclasses');
    }

    async close() {
        // Cleanup resources
        console.log(`[${this.platformName}] Closing parser...`);
    }
}

module.exports = BaseParser;
