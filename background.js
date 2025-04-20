import { estimateCarbonFootprint } from './carbonEstimator.js';
chrome.webNavigation.onCompleted.addListener(async (details) => {
    try {
        const tab = await chrome.tabs.get(details.tabId);
        const url = new URL(tab.url);
        const domain = url.hostname.replace(/^www\./, '');

        console.log(`Visited: ${domain}`);

        chrome.storage.local.get([domain], async (result) => {
            if (!result[domain]) {
                const carbon = await estimateCarbonFootprint(domain);
                console.log(`Carbon for ${domain}: ${carbon} kg CO2`);

                chrome.storage.local.set({ [domain]: carbon });
                console.log(`Stored carbon data for ${domain}: ${carbon} kg CO2`);
            } else {
                console.log(`Carbon data for ${domain} already exists: ${result[domain]} kg CO2`);
            }
        });
    } catch (error) {
        console.error('Error in webNavigation:', error);
    }
});
