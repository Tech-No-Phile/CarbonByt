import { estimateCarbonFootprint } from './carbonEstimator.js';
chrome.webNavigation.onCompleted.addListener(async (details) => {
    try {
      const tab = await chrome.tabs.get(details.tabId);
      const url = new URL(tab.url);
      const domain = url.hostname.replace(/^www\./, '');
  
      console.log(`Visited: ${domain}`);
  
      const carbon = await estimateCarbonFootprint(domain);
      console.log(`Carbon for ${domain}: ${carbon} kg CO2`);
  
      chrome.storage.local.get("carbonData", (data) => {
        const carbonData = data.carbonData || {};
        carbonData[domain] = carbon;
        chrome.storage.local.set({ carbonData }, () => {
          console.log(`Stored carbon data for ${domain}: ${carbon} kg CO2`)
        });
      });
    } catch (error) {
      console.error('Error in webNavigation:', error);
    }
  });
  