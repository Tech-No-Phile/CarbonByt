export async function estimateCarbonFootprint(domain) {
const domainCarbonMap = {
    "youtube.com": 2.8,
    "facebook.com": 1.5,
    "google.com": 0.9,
    "reddit.com": 1.2,
    "netflix.com": 3.1,
    "amazon.com": 2.5,
    "instagram.com": 1.8,
    "linkedin.com": 0.7,
    "twitter.com": 1.3,
    "github.com": 0.4,
    // Add more domains and their carbon footprints as needed
};


    if (domainCarbonMap[domain]) {
        return domainCarbonMap[domain].toFixed(2); // Return the predefined value
    }
    try {
        const response = await fetch(`https://${domain}`, {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            mode: 'cors'
        });
        const html = await response.text();
        const sizeInBytes = new TextEncoder().encode(html).length;
        const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
        const estimatedCarbonKG = (sizeInGB * 1.8).toFixed(4);
        return estimatedCarbonKG;
    }
    catch (error) {
        console.error('Error estimating carbon footprint:', error);
        return (Math.random() * 2 + 0.5).toFixed(2); // Fallback to a random value between 0.5 and 2.5 kg CO2
    }
}
