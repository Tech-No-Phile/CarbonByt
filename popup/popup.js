document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('carbon-list');
    chrome.storage.local.get("carbonData", (data) => {
      const carbonData = data.carbonData || {};
      if (Object.keys(carbonData).length === 0) {
        container.innerHTML = '<p>No carbon data available.</p>';
        return;
      }

      let html = "<ul>";
      for (const [domain, carbon] of Object.entries(carbonData)) {
        html += `<li>${domain}: ${carbonData[domain]} kg CO2</li>`;
      }
        html += "</ul>";
        container.innerHTML = html;
    });
  });
  