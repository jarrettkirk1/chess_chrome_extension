function addAnalyzeButton() {
  const existingButton = document.getElementById("analyzePgnButton");
  if (existingButton) return; // Avoid adding multiple buttons

  const button = document.createElement("button");
  button.innerText = "Analyze PGN";
  button.id = "analyzePgnButton";
  button.style.position = "fixed";
  button.style.top = "10px";
  button.style.right = "10px";
  button.style.zIndex = "1000";
  button.style.padding = "10px";
  button.style.backgroundColor = "#4CAF50";
  button.style.color = "white";
  button.style.border = "none";
  button.style.cursor = "pointer";

  button.addEventListener("click", handleAnalyzePgn);
  document.body.appendChild(button);
}

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
      const interval = 100; // Poll every 100 ms
      let elapsed = 0;

      const poll = setInterval(() => {
          const element = document.querySelector(selector);
          if (element) {
              clearInterval(poll);
              resolve(element);
          }
          elapsed += interval;
          if (elapsed >= timeout) {
              clearInterval(poll);
              reject(new Error(`Element not found: ${selector}`));
          }
      }, interval);
  });
}


async function handleAnalyzePgn() {
  try {
      // Click the Share button when available
      const shareButton = await waitForElement(".icon-font-chess.share.live-game-buttons-button, .game-controls-secondary-button-button");
      shareButton.click();

      // Wait for the PGN button and click it
      const pgnButton = await waitForElement(".share-menu-tab-selector-tab span");
      pgnButton.click();

      // Wait for the PGN textarea to populate and grab its value
      const pgnElement = await waitForElement(".cc-textarea-component.cc-textarea-x-large.share-menu-tab-pgn-textarea");
      const pgnText = pgnElement.value;

      if (pgnText) {
          chrome.runtime.sendMessage({ action: "analyzePGN", pgn: pgnText });
          console.log("PGN:", pgnText);

          // Click the close button to close the share menu
          const closeButton = await waitForElement(".icon-font-chess.x.ui_outside-close-icon");
          closeButton.click();
      } else {
          alert("Failed to retrieve PGN data.");
      }
  } catch (error) {
      console.error(error.message);
  }
}

// Run the function to add the button
addAnalyzeButton();
