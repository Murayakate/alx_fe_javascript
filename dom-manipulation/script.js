const quotes = [
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
}

// Create the add quote form (satisfies project requirements)
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
  textInput.placeholder = "Shame is a Mindset";
  
  const categoryInput = document.createElement("input");
  categoryInput.id = "add-quote-category";
  categoryInput.type = "text";
  categoryInput.placeholder = "Life";
  
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
  const quoteCategory = document.getElementById("add-quote-category").value.trim();
  
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

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Create the add quote form
  createAddQuoteForm();
  
  // Display initial quote on page load
  showRandomQuote();
  
  // Add click event to "Show New Quote" button
  const newQuoteBtn = document.getElementById("new-quote-btn");
  newQuoteBtn.addEventListener("click", showRandomQuote);
  
  // Add Enter key functionality to input fields
  const quoteTextInput = document.getElementById("add-quote-text");
  const quoteCategoryInput = document.getElementById("add-quote-category");
  
  quoteTextInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addQuote();
  });
  
  quoteCategoryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addQuote();
  });
});