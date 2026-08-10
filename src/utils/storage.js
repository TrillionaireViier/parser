const fs = require('fs');
const path = require('path');

class Storage {
    constructor(outputDir = 'data') {
        this.outputDir = path.join(__dirname, '../../', outputDir);
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    save(platform, topic, data) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${platform}_${topic}_${timestamp}.json`;
        const filepath = path.join(this.outputDir, filename);

        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`[Storage] Saved ${data.length} records to ${filepath}`);
    }
}

module.exports = new Storage();
