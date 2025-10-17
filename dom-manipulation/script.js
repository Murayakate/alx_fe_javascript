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

  // Clear input fields
  document.getElementById("add-quote-text").value = "";
  document.getElementById("add-quote-category").value = "";

  // Show success message
  showSuccessMessage();

  // Display the newly added quote
  showRandomQuote();
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

// Export quotes to JSON file
function exportQuotesAsJSON() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quotes-${new Date().toISOString().split("T")[0]}.json`;
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
      const validQuotes = importedQuotes.filter((q) => q.text && q.category);

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

  // Display initial quote on page load
  showRandomQuote();

  // Add click event to "Show New Quote" button
  const newQuoteBtn = document.getElementById("new-quote-btn");
  newQuoteBtn.addEventListener("click", showRandomQuote);

  // Add click event to export button
  const exportBtn = document.getElementById("export-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportQuotesAsJSON);
  }

  // Add change event to import file input
  const importFile = document.getElementById("importFile");
  if (importFile) {
    importFile.addEventListener("change", importFromJsonFile);
  }

  // Add Enter key functionality to input fields
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
