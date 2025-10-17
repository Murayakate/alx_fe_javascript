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
  // Use Set to automatically remove duplicates - Set only stores unique values
  const uniqueCategories = new Set();
  
  // Loop through each quote and add its category to the Set
  quotes.forEach((quote) => {
    uniqueCategories.add(quote.category);
  });

  // Convert Set back to Array and sort alphabetically for better UX
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
  sortedCategories.forEach((category) => {
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