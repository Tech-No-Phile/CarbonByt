import { fetchGPTInsights } from './gptIntegration.js';
document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('carbonList');
    const clearBtn = document.getElementById('clearBtn');
    const gptBtn = document.getElementById('gptInsightsBtn');
    const gptOutput = document.getElementById('gptOutput');

    chrome.storage.local.get(null, (data) => {
        const entries = Object.entries(data)
            .filter(([key]) => key.includes('.'))
            .slice(-5)
            .reverse();
        if (entries.length === 0) {
            list.innerHTML = '<p>No carbon data available.</p>';
        }
        else {
            entries.forEach(([domain, carbon]) => {
                const div = document.createElement('div');
                div.textContent = `${domain}: ${carbon} kg CO2`;
                list.appendChild(div);
            });
        }

    });
    clearBtn.addEventListener('click', () => {
        chrome.storage.local.clear(() => {
            list.innerHTML = '<p>No carbon data available.</p>';
        });
    });
    gptBtn.addEventListener('click', async () => {
        gptOutput.textContent = "Thinking...";
        const result = await fetchGPTInsights();
        gptOutput.textContent = result;
    });
});
