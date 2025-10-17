// Initialize quotes array
let quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    category: "Inspiration",
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    category: "Life",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    category: "Dreams",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    category: "Perseverance",
  },
  {
    text: "Whoever is happy will make others happy too.",
    category: "Happiness",
  },
  {
    text: "You must be the change you wish to see in the world.",
    category: "Change",
  },
];

// Load quotes from local storage on initialization
function loadQuotesFromLocalStorage() {
  const savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    try {
      quotes = JSON.parse(savedQuotes);
      console.log("Quotes loaded from local storage");
    } catch (error) {
      console.error("Error loading quotes from local storage:", error);
    }
  }
}

// Save quotes to local storage
function saveQuotesToLocalStorage() {
  try {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    console.log("Quotes saved to local storage");
  } catch (error) {
    console.error("Error saving quotes to local storage:", error);
  }
}

// Store last viewed quote in session storage
function saveLastViewedQuote(quote) {
  try {
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
    console.log("Last viewed quote saved to session storage");
  } catch (error) {
    console.error("Error saving to session storage:", error);
  }
}

// Retrieve last viewed quote from session storage
function getLastViewedQuote() {
  try {
    const lastQuote = sessionStorage.getItem("lastViewedQuote");
    return lastQuote ? JSON.parse(lastQuote) : null;
  } catch (error) {
    console.error("Error retrieving from session storage:", error);
    return null;
  }
}

// Display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quote-display");

  // Clear previous content
  quoteDisplay.innerHTML = "";

  // Create quote text element
  const quoteText = document.createElement("p");
  quoteText.className = "quote-text-content";
  quoteText.textContent = `"${randomQuote.text}"`;

  // Create quote category element
  const quoteCategory = document.createElement("p");
  quoteCategory.className = "quote-category";
  quoteCategory.textContent = `— ${randomQuote.category}`;

  // Append elements to display
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  // Save to session storage
  saveLastViewedQuote(randomQuote);

  // Update quote count
  updateQuoteCount();
}

// Create the add quote form
function createAddQuoteForm() {
  const formContainer = document.querySelector("section:nth-of-type(3)");

  // Check if form already exists
  if (formContainer.querySelector("form")) {
    return;
  }

  const form = document.createElement("form");
  form.className = "add-quote-form";

  const textInput = document.createElement("input");
  textInput.id = "add-quote-text";
  textInput.type = "text";
  textInput.placeholder = "Enter a quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "add-quote-category";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";

  const submitBtn = document.createElement("button");
  submitBtn.className = "add-quote-btn";
  submitBtn.type = "button";
  submitBtn.textContent = "Add Quote";
  submitBtn.onclick = addQuote;

  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);

  formContainer.appendChild(form);
}

// Add a new quote to the array and DOM
function addQuote() {
  const quoteText = document.getElementById("add-quote-text").value.trim();
  const quoteCategory = document
    .getElementById("add-quote-category")
    .value.trim();

  // Validation
  if (!quoteText || !quoteCategory) {
    alert("Please enter both a quote and a category");
    return;
  }

  // Create new quote object
  const newQuote = {
    text: quoteText,
    category: quoteCategory,
  };

  // Add to quotes array
  quotes.push(newQuote);

  // Save to local storage
  saveQuotesToLocalStorage();

  // Update the category dropdown in case user added a new category
  // This ensures the dropdown always shows all available categories
  populateCategories();

  // Clear input fields
  document.getElementById("add-quote-text").value = "";
  document.getElementById("add-quote-category").value = "";

  // Show success message
  showSuccessMessage();

  // Display the newly added quote
  // Use filterQuotes instead of showRandomQuote to respect current filter selection
  filterQuotes();
}

// Show success feedback when quote is added
function showSuccessMessage() {
  const container = document.querySelector(".container1");
  const message = document.createElement("div");
  message.className = "success-message";
  message.textContent = "✓ Quote added successfully!";

  container.insertBefore(message, container.firstChild);

  // Remove message after 3 seconds
  setTimeout(() => {
    message.remove();
  }, 3000);
}

// Update quote count display
function updateQuoteCount() {
  const countElement = document.getElementById("quote-count");
  if (countElement) {
    countElement.textContent = quotes.length;
  }
}

// ==================== FILTERING FUNCTIONALITY ====================

// Extract unique categories from quotes array
// This function loops through all quotes and collects all unique categories
// For example: if quotes have "Inspiration", "Life", "Inspiration" - it returns ["Inspiration", "Life"]
function populateCategories() {
  // Use map() to extract all categories from quotes array
  // map() transforms each quote object into just its category string
  // For example: [{text: "...", category: "Life"}, ...] becomes ["Life", ...]
  const allCategories = quotes.map((quote) => quote.category);

  // Use Set to automatically remove duplicates - Set only stores unique values
  // new Set(["Life", "Inspiration", "Life"]) becomes Set { "Life", "Inspiration" }
  const uniqueCategories = new Set(allCategories);

  // Convert Set back to Array and sort alphabetically for better UX
  // Array.from converts Set to Array, then sort() arranges them A-Z
  const sortedCategories = Array.from(uniqueCategories).sort();

  // Get the dropdown element from HTML
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  // Store the current selected value so we don't lose user's choice
  const currentValue = categoryFilter.value;

  // Clear all existing options except the first one (All Categories)
  // We keep the first option because it's the "All Categories" default
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add each unique category as a new option in the dropdown
  // map() creates option elements for each category
  sortedCategories.map((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the user's previous selection if it still exists in the new list
  if (currentValue !== "all" && sortedCategories.includes(currentValue)) {
    categoryFilter.value = currentValue;
  }
}

// Filter and display quotes based on selected category
// This function is called whenever the user changes the category dropdown
function filterQuotes() {
  // Get the dropdown element and find what category user selected
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;

  // Save the user's selected category to local storage
  // This way, when they visit again, we remember their choice
  try {
    localStorage.setItem("selectedCategory", selectedCategory);
    console.log(`Category filter saved to local storage: ${selectedCategory}`);
  } catch (error) {
    console.error("Error saving category filter to local storage:", error);
  }

  // Filter quotes based on selection
  // If user selected "all", show all quotes; otherwise show only matching category
  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(
      (quote) => quote.category === selectedCategory
    );
  }

  // Display the filtered quotes
  // We show a message if no quotes match the selected category
  if (filteredQuotes.length === 0) {
    const quoteDisplay = document.getElementById("quote-display");
    quoteDisplay.innerHTML =
      '<p style="color: #999;">No quotes available for this category.</p>';
    return;
  }

  // Pick a random quote from the filtered list and display it
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  // Display the selected quote
  displayQuote(randomQuote);
}

// Helper function to display a specific quote on the page
// This keeps our code organized and prevents repetition
function displayQuote(quote) {
  const quoteDisplay = document.getElementById("quote-display");

  // Clear previous content
  quoteDisplay.innerHTML = "";

  // Create paragraph for quote text
  const quoteText = document.createElement("p");
  quoteText.className = "quote-text-content";
  quoteText.textContent = `"${quote.text}"`;

  // Create paragraph for category attribution
  const quoteCategory = document.createElement("p");
  quoteCategory.className = "quote-category";
  quoteCategory.textContent = `— ${quote.category}`;

  // Add both elements to the page
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  // Save this quote to session storage so we remember what user just viewed
  saveLastViewedQuote(quote);
}

// Load the user's last selected category filter from local storage
// This function runs when the page loads
function loadSavedCategoryFilter() {
  try {
    // Try to get the saved category from local storage
    const savedCategory = localStorage.getItem("selectedCategory");

    // If a category was saved previously
    if (savedCategory) {
      // Set the dropdown to that category
      const categoryFilter = document.getElementById("categoryFilter");
      if (categoryFilter) {
        categoryFilter.value = savedCategory;
        console.log(`Category filter restored from local storage: ${savedCategory}`);
      }
    }
  } catch (error) {
    console.error("Error loading category filter from local storage:", error);
  }
}

// ==================== SERVER SYNC & CONFLICT RESOLUTION ====================

// Simulate fetching quotes from a server using JSONPlaceholder API
// This demonstrates how to interact with a real API endpoint
// We use JSONPlaceholder's /posts endpoint and convert it to quote format
async function fetchQuotesFromServer() {
  try {
    console.log("Fetching quotes from server...");
    
    // Fetch data from JSONPlaceholder API (a free mock API service)
    // Limit to 5 posts to simulate fetching new quotes from server
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    
    // Check if the request was successful (status 200-299)
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Convert the response to JSON format
    const serverPosts = await response.json();

    // Transform server posts into our quote format
    // This converts posts from server format to our local quote format
    // Each post becomes: { text: post.title, category: "Server" }
    const serverQuotes = serverPosts.map((post) => ({
      text: post.title,
      category: "Server", // Mark these as coming from the server
    }));

    console.log(`Fetched ${serverQuotes.length} quotes from server`);
    return serverQuotes;
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return []; // Return empty array if fetch fails
  }
}

// Post local quotes to server for backup/syncing
// This simulates sending local data to a server
async function sendQuotesToServer(quotesToSync) {
  try {
    console.log(`Sending ${quotesToSync.length} quotes to server...`);

    // Send quotes to server using POST request
    // This simulates uploading local data to a backend
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST", // Use POST to send data to server
      headers: {
        "Content-Type": "application/json", // Tell server we're sending JSON
      },
      // Convert quotes array to JSON string
      body: JSON.stringify({
        quotes: quotesToSync,
        timestamp: new Date().toISOString(), // Include when sync happened
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Quotes sent to server successfully");
    return result;
  } catch (error) {
    console.error("Error sending quotes to server:", error);
    return null;
  }
}

// Check if two quotes are identical
// This helper function compares quotes to detect duplicates
function areQuotesEqual(quote1, quote2) {
  // Compare text and category of both quotes
  // Trim() removes whitespace, toLowerCase() makes comparison case-insensitive
  return (
    quote1.text.trim().toLowerCase() === quote2.text.trim().toLowerCase() &&
    quote1.category.trim().toLowerCase() === quote2.category.trim().toLowerCase()
  );
}

// Merge server quotes with local quotes using conflict resolution
// Strategy: Server data takes precedence, avoid duplicates
function mergeQuotesWithConflictResolution(serverQuotes) {
  let mergedCount = 0;
  let conflictCount = 0;
  let duplicateCount = 0;

  // Loop through each server quote
  serverQuotes.forEach((serverQuote) => {
    // Check if this quote already exists in local quotes
    // some() returns true if any local quote matches the server quote
    const isDuplicate = quotes.some((localQuote) =>
      areQuotesEqual(localQuote, serverQuote)
    );

    if (isDuplicate) {
      // Quote already exists locally, no need to add it
      duplicateCount++;
      console.log(`Duplicate found: "${serverQuote.text.substring(0, 30)}..."`);
    } else {
      // New quote from server, add it to local quotes
      quotes.push(serverQuote);
      mergedCount++;
      console.log(`New quote added from server: "${serverQuote.text.substring(0, 30)}..."`);
    }
  });

  // Calculate conflict count (would increase if we had different merge strategies)
  conflictCount = 0;

  // Return summary of what happened during merge
  return {
    mergedCount,
    duplicateCount,
    conflictCount,
    totalLocalQuotes: quotes.length,
  };
}

// Sync data with server and handle any conflicts
// This is the main function that orchestrates the sync process
// Periodically checks for new quotes from the server and updates local storage
// Also handles conflict resolution when discrepancies are found
async function syncQuotes() {
  try {
    console.log("Starting data sync with server...");

    // Step 1: Fetch new quotes from server
    // This retrieves any quotes that have been added/updated on the server
    const serverQuotes = await fetchQuotesFromServer();

    if (serverQuotes.length === 0) {
      console.log("No new quotes from server");
      return;
    }

    // Step 2: Merge server quotes with local quotes using conflict resolution
    // Server data takes precedence in our strategy
    // This function checks for duplicates and only adds new quotes
    const syncResult = mergeQuotesWithConflictResolution(serverQuotes);

    // Step 3: Save updated local data to storage
    // Update local storage with the merged quotes
    if (syncResult.mergedCount > 0) {
      saveQuotesToLocalStorage();
      console.log("Local storage updated after sync");
    }

    // Step 4: Update UI elements to reflect new data
    // Refresh the category dropdown in case new categories were added
    populateCategories(); // Refresh category dropdown
    updateQuoteCount(); // Update quote counter

    // Step 5: Show notification to user about sync results
    // Display feedback about what was synced and any conflicts resolved
    showSyncNotification(syncResult);

    // Step 6: Send local quotes back to server for backup
    // This ensures server has latest data too (bidirectional sync)
    await sendQuotesToServer(quotes);
  } catch (error) {
    console.error("Error during data sync:", error);
    showErrorNotification("Sync failed. Please try again later.");
  }
}

// Display notification to user about sync results
// This provides feedback so user knows what happened
function showSyncNotification(syncResult) {
  const container = document.querySelector(".container1");
  const notification = document.createElement("div");
  notification.className = "sync-notification";

  // Build message based on sync results
  let message = "📡 Sync Complete! ";
  if (syncResult.mergedCount > 0) {
    message += `Added ${syncResult.mergedCount} new quote(s). `;
  }
  if (syncResult.duplicateCount > 0) {
    message += `${syncResult.duplicateCount} duplicate(s) skipped. `;
  }
  message += `Total: ${syncResult.totalLocalQuotes} quotes.`;

  notification.textContent = message;
  notification.style.cssText = `
    background: #4caf50;
    color: white;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    animation: slideIn 0.3s ease-out;
  `;

  container.insertBefore(notification, container.firstChild);

  // Remove notification after 5 seconds so it doesn't clutter the screen
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Display error notification to user
function showErrorNotification(message) {
  const container = document.querySelector(".container1");
  const notification = document.createElement("div");
  notification.className = "error-notification";
  notification.textContent = "❌ " + message;
  notification.style.cssText = `
    background: #f44336;
    color: white;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    animation: slideIn 0.3s ease-out;
  `;

  container.insertBefore(notification, container.firstChild);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Enable periodic syncing at set intervals
// This automatically syncs data without user action
// Periodically checks for new quotes from the server
function startPeriodicSync(intervalMs = 30000) {
  // Default: sync every 30 seconds
  // In production, this would be much longer (e.g., every 5 minutes)

  console.log(`Periodic sync enabled. Will sync every ${intervalMs}ms`);

  // Use setInterval to run sync function repeatedly
  // setInterval returns an ID we can use to stop it later
  // This ensures data stays fresh by checking server at regular intervals
  const syncIntervalId = setInterval(() => {
    syncQuotes(); // Call the syncQuotes function repeatedly
  }, intervalMs);

  // Store the interval ID so it can be cleared later if needed
  // For example: clearInterval(window.syncIntervalId)
  window.syncIntervalId = syncIntervalId;
}

// Export quotes to JSON file
function exportQuotesAsJSON() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quotes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log("Quotes exported successfully");
  } catch (error) {
    console.error("Error exporting quotes:", error);
    alert("Error exporting quotes");
  }
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      // Validate imported data
      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format. Expected an array of quotes.");
        return;
      }

      // Validate each quote has required fields
      const validQuotes = importedQuotes.filter(
        (q) => q.text && q.category
      );

      if (validQuotes.length === 0) {
        alert("No valid quotes found in the file.");
        return;
      }

      // Add imported quotes to the array
      quotes.push(...validQuotes);

      // Save to local storage
      saveQuotesToLocalStorage();

      // Update UI
      updateQuoteCount();
      showSuccessMessage();
      showRandomQuote();

      // Reset file input
      event.target.value = "";

      alert(`${validQuotes.length} quote(s) imported successfully!`);
    } catch (error) {
      console.error("Error importing quotes:", error);
      alert("Error importing quotes. Please check the file format.");
    }
  };

  fileReader.onerror = function () {
    alert("Error reading file");
  };

  fileReader.readAsText(file);
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Load quotes from local storage on page load
  loadQuotesFromLocalStorage();

  // Create the add quote form
  createAddQuoteForm();

  // Populate the category dropdown with all unique categories from quotes
  // This must happen after loading quotes from storage
  populateCategories();

  // Load the user's previously selected category filter
  loadSavedCategoryFilter();

  // Display initial quote based on current filter
  // If user had selected a category before, this will show a quote from that category
  filterQuotes();

  // Add click event to "Show New Quote" button
  const newQuoteBtn = document.getElementById("new-quote-btn");
  newQuoteBtn.addEventListener("click", () => {
    // When user clicks "Show New Quote", respect the current filter selection
    filterQuotes();
  });

  // Add click event to export button
  const exportBtn = document.getElementById("export-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportQuotesAsJSON);
  }

  // Add change event to import file input
  const importFile = document.getElementById("importFile");
  if (importFile) {
    importFile.addEventListener("change", (event) => {
      importFromJsonFile(event);
      // After importing quotes, refresh the category list
      // This ensures any new categories from imported quotes appear in dropdown
      populateCategories();
      // Restore the saved filter preference
      loadSavedCategoryFilter();
      // Display quote based on restored filter
      filterQuotes();
    });
  }

  // Start periodic syncing with server
  // Sync every 30 seconds (adjust as needed for your use case)
  // In production, you'd typically use longer intervals (5-10 minutes)
  startPeriodicSync(30000);

  // Add a manual sync button if you want users to sync on demand
  // This gives users control over when syncing happens
  // Users can click to manually trigger a sync with the server
  const syncBtn = document.getElementById("sync-btn");
  if (syncBtn) {
    syncBtn.addEventListener("click", syncQuotes);
  }

  // Add Enter key functionality to input fields for better UX
  const quoteTextInput = document.getElementById("add-quote-text");
  const quoteCategoryInput = document.getElementById("add-quote-category");

  if (quoteTextInput) {
    quoteTextInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addQuote();
    });
  }

  if (quoteCategoryInput) {
    quoteCategoryInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addQuote();
    });
  }
});