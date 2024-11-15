chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzePGN") {
      const pgnText = request.pgn;
  
      // Open a new tab for the analysis site
      chrome.tabs.create({ url: "https://chess.wintrcat.uk/", active: false }, (tab) => {
        // Wait for the new tab to load
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            // Remove the listener after it's executed
            chrome.tabs.onUpdated.removeListener(listener);
  
            // Execute the script to paste PGN and click Analyze
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              func: (pgn) => {
                // Paste the PGN into the textarea
                const pgnTextarea = document.getElementById("pgn");
                if (pgnTextarea) {
                  pgnTextarea.value = pgn; // Set the PGN text
                }

                 // Set the depth slider to the maximum value
                const depthSlider = document.getElementById("depth-slider");
                if (depthSlider) {
                  depthSlider.value = depthSlider.max; // Set the slider to the maximum value
                  // Optionally trigger an input event if needed by the page
                  depthSlider.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                  console.error("Depth slider not found.");
                }
  
                // Click the Analyze button
                const analyzeButton = document.getElementById("review-button");
                if (analyzeButton) {
                  analyzeButton.click();
                } else {
                  console.error("Analyze button not found.");
                }
              },
              args: [pgnText], // Pass the PGN text to the function
            });
          }
        });
      });
    }
  });
  