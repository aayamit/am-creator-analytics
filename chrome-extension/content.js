/**
 * Chrome Extension: LinkedIn Creator Discovery
 * Content script - scrapes profile data
 */

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SCRAPE_PROFILE') {
    const profileData = scrapeProfile();
    sendResponse({ success: true, data: profileData });
  }
  return true; // Keep channel open for async response
});

function scrapeProfile() {
  const data: any = {
    platform: 'LINKEDIN',
    url: window.location.href,
  };

  // Name
  const nameEl = document.querySelector('.text-heading-xlarge');
  data.name = nameEl?.textContent?.trim() || '';

  // Headline
  const headlineEl = document.querySelector('.text-body-medium');
  data.headline = headlineEl?.textContent?.trim() || '';

  // Location
  const locationEl = document.querySelector('.text-body-small.inline');
  data.location = locationEl?.textContent?.trim() || '';

  // Connections
  const connectionsEl = document.querySelector('.text-body-small.gray-70');
  const connectionsText = connectionsEl?.textContent || '';
  const match = connectionsText.match(/([\d,]+)\s+connections?/i);
  if (match) {
    data.followers = parseInt(match[1].replace(/,/g, ''), 10);
  }

  // About section
  const aboutEl = document.querySelector('#about ~ .display-flex .visually-hidden');
  data.bio = aboutEl?.textContent?.trim() || '';

  // Experience (first job)
  const experienceEl = document.querySelector('.experience-section .pv-entity__summary-info');
  data.currentRole = experienceEl?.textContent?.trim() || '';

  return data;
}

// Add "Save to AM Creator" button to profile
function addSaveButton() {
  if (document.getElementById('am-creator-save-btn')) return;

  const button = document.createElement('button');
  button.id = 'am-creator-save-btn';
  button.innerText = 'Save to AM Creator';
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: #1a1a2e;
    color: #F8F7F4;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;

  button.onclick = async () => {
    const profileData = scrapeProfile();
    
    // Send to AM Creator Analytics API
    try {
      const response = await fetch('http://localhost:3000/api/creators/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        button.innerText = 'Saved! ✓';
        button.style.background = '#16a34a';
        setTimeout(() => {
          button.innerText = 'Save to AM Creator';
          button.style.background = '#1a1a2e';
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to save creator:', error);
      button.innerText = 'Error!';
      button.style.background = '#DC2626';
    }
  };

  document.body.appendChild(button);
}

// Initialize
if (window.location.href.includes('/in/')) {
  setTimeout(addSaveButton, 2000); // Wait for page to load
}
