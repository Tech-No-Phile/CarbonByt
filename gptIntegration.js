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
                        'Authorization': `Bearer ${CONFIG.GPT_API_KEY}` // Ensure you have your OpenAI API key set in your environment variables
                    },
                    body: JSON.stringify({
                        model: 'gpt-4.0',
                        messages: [
                            { role: 'system', content: 'You are a sustainability assistant. Help users reduce their carbon footprint.'},
                            { role: 'user', content: prompt }
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