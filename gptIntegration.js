export async function fetchGPTInsights() {
    return new Promise((resolve) => {
        chrome.storage.local.get(null, async (data) => {
            const entries = Object.entries(data)
                .filter(([key]) => key.includes('.'))
                .slice(-5);
            if (entries.length === 0) {
                resolve('No carbon data available.');
                return;
            } 
            const siteData = entries.map(([site, carbon]) => `${site}: ${carbon} kg CO2`).join('\n');
            const prompt = `Here are the last 5 carbon data entries:\n${siteData}\nCan you provide insights on this data?`;

            try{
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer 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` 
                    },
                    body: JSON.stringify({
                        model: 'gpt-4.0',
                        messages: [
                            { role: 'system', content: 'You are a helpful assistant.' },
                            { role: 'user', content: `Here are the last 5 carbon data entries:\n${JSON.stringify(entries)}\nCan you provide insights on this data?` }
                        ],
                        temperature: 0.7,
                    })
                });
                const result = await response.json();
                const reply = result.choices?.[0]?.message?.content || 'No response from GPT.';
                resolve(reply);
            } catch (error) {
                console.error('Error fetching GPT insights:', error);
                resolve('Error fetching GPT insights. Please try again later.');
            }
        });
    });
}