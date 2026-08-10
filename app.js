document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const topicInput = document.getElementById('topic-input');
    const resultsGrid = document.getElementById('results-grid');
    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('error-message');

    searchBtn.addEventListener('click', () => {
        const topic = topicInput.value.trim();
        if (topic) {
            fetchData(topic);
        }
    });

    topicInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const topic = topicInput.value.trim();
            if (topic) {
                fetchData(topic);
            }
        }
    });

    async function fetchData(topic) {
        // Reset UI
        resultsGrid.innerHTML = '';
        errorMsg.classList.add('hidden');
        loader.classList.remove('hidden');

        try {
            const response = await fetch(`/api/parse?topic=${encodeURIComponent(topic)}`);
            const json = await response.json();
            
            if (!response.ok || !json.success) {
                throw new Error(json.error || 'Failed to fetch data');
            }

            const data = json.data[topic];
            renderCards(data);

        } catch (err) {
            errorMsg.textContent = `Error: ${err.message}`;
            errorMsg.classList.remove('hidden');
        } finally {
            loader.classList.add('hidden');
        }
    }

    function renderCards(platformData) {
        let delay = 0;
        
        for (const [platform, items] of Object.entries(platformData)) {
            if (Array.isArray(items)) {
                items.forEach(item => {
                    const card = createCard(platform, item, delay);
                    resultsGrid.appendChild(card);
                    delay += 0.1; // Stagger animation
                });
            } else if (items.error) {
                console.warn(`[${platform}] Error: ${items.error}`);
            }
        }

        if (resultsGrid.innerHTML === '') {
            resultsGrid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--text-muted);">No results found for this topic.</p>';
        }
    }

    function createCard(platform, item, delay) {
        const div = document.createElement('div');
        div.className = 'card';
        div.style.animationDelay = `${delay}s`;

        let metricsHtml = '';
        if (platform === 'twitter') {
            metricsHtml = `
                <div class="metric"><span>${item.likes || 0}</span> Likes</div>
                <div class="metric"><span>${item.retweets || 0}</span> Retweets</div>
            `;
        } else if (platform === 'facebook') {
            metricsHtml = `
                <div class="metric"><span>${item.likes || 0}</span> Likes</div>
                <div class="metric"><span>${item.comments || 0}</span> Comments</div>
            `;
        } else if (platform === 'threads') {
            metricsHtml = `
                <div class="metric"><span>${item.likes || 0}</span> Likes</div>
                <div class="metric"><span>${item.replies || 0}</span> Replies</div>
            `;
        }

        const date = new Date(item.timestamp).toLocaleDateString(undefined, { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        div.innerHTML = `
            <div class="card-header">
                <span class="platform-badge ${platform}">${platform}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${date}</span>
            </div>
            <div class="author">${item.author}</div>
            <div class="content">${escapeHtml(item.text)}</div>
            <div class="metrics">
                ${metricsHtml}
            </div>
        `;
        
        return div;
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Initial load
    fetchData('marketing');
});
