document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
  const searchBar = document.getElementById("search-bar");
  const bookList = document.getElementById("book-list");
  const favoritesList = document.getElementById("favorites-list");
  const readList = document.getElementById("read-list");
  const homeSection = document.getElementById("home");
  const favoritesSection = document.getElementById("favorites");
  const readSection = document.getElementById("read");
  const modeToggle = document.getElementById("mode-toggle");
  const videoSection = document.getElementById("video-section");

  // Event listener for search input
  searchBar.addEventListener("input", debounce(handleSearch, 300));

  // Event listeners for navigation
  homeSection.addEventListener("click", showHome);
  favoritesSection.addEventListener("click", showFavorites);
  readSection.addEventListener("click", showRead);

  // Event listener for mode toggle
  modeToggle.addEventListener("click", toggleMode);

  // Function to handle search
  function handleSearch(event) {
    const query = event.target.value;
    fetchBooks(query);
  }

  // Function to fetch books from API
  async function fetchBooks(query) {
    try {
      const response = await fetch(`${BASE_URL}?q=${query}`);
      const data = await response.json();
      displayBooks(data.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Function to display books
  function displayBooks(books) {
    bookList.innerHTML = "";
    books.forEach((book) => {
      const volumeInfo = book.volumeInfo;
      const bookItem = document.createElement("div");
      bookItem.className = "book-item";
      const shortDescription = volumeInfo.description
        ? volumeInfo.description.substring(0, 100) + "..."
        : "No description available.";
      bookItem.innerHTML = `
        <img src="${volumeInfo.imageLinks?.thumbnail}" alt="Book Image">
        <h3>${volumeInfo.title}</h3>
        <p>${
          volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author"
        }</p>
        <p class="description">${shortDescription} <span class="read-more">Read more</span></p>
        <div class="buttons">
          <button class="add-favorite">Add to Favorites</button>
          <button class="mark-read">Mark as Read</button>
        </div>
      `;
      bookItem
        .querySelector(".read-more")
        .addEventListener("click", () =>
          showFullDescription(bookItem, volumeInfo.description)
        );
      bookItem
        .querySelector(".add-favorite")
        .addEventListener("click", () => addFavorite(volumeInfo));
      bookItem
        .querySelector(".mark-read")
        .addEventListener("click", () => markAsRead(volumeInfo));
      bookList.appendChild(bookItem);
    });
  }

  // Function to show full description
  function showFullDescription(bookItem, fullDescription) {
    bookItem.querySelector(".description").innerHTML = `
      ${fullDescription} <span class="read-less">Read less</span>
    `;
    bookItem
      .querySelector(".read-less")
      .addEventListener("click", () =>
        showShortDescription(bookItem, fullDescription)
      );
  }

  // Function to show short description
  function showShortDescription(bookItem, fullDescription) {
    const shortDescription = fullDescription
      ? fullDescription.substring(0, 100) + "..."
      : "No description available.";
    bookItem.querySelector(".description").innerHTML = `
      ${shortDescription} <span class="read-more">Read more</span>
    `;
    bookItem
      .querySelector(".read-more")
      .addEventListener("click", () =>
        showFullDescription(bookItem, fullDescription)
      );
  }

  // Function to add a book to favorites
  function addFavorite(book) {
    const favoriteItem = document.createElement("li");
    favoriteItem.className = "favorite-item";
    favoriteItem.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.authors ? book.authors.join(", ") : "Unknown Author"}</p>
    `;
    favoritesList.appendChild(favoriteItem);
  }

  // Function to mark a book as read
  function markAsRead(book) {
    const readItem = document.createElement("li");
    readItem.className = "read-item";
    readItem.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.authors ? book.authors.join(", ") : "Unknown Author"}</p>
      <label for="rating">Rating:</label>
      <select name="rating" class="rating">
        <option value="1">1 - Poor</option>
        <option value="2">2 - Mid</option>
        <option value="3">3 - Great</option>
      </select>
      <textarea placeholder="Leave a comment"></textarea>
    `;
    readList.appendChild(readItem);
  }

  // Function to debounce input
  function debounce(func, delay) {
    let debounceTimeout;
    return function (...args) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Function to show home section
  function showHome() {
    bookList.style.display = "flex";
    favoritesList.parentElement.style.display = "none";
    readList.parentElement.style.display = "none";
    videoSection.style.display = "block";
  }

  // Function to show favorites section
  function showFavorites() {
    bookList.style.display = "none";
    favoritesList.parentElement.style.display = "block";
    readList.parentElement.style.display = "none";
    videoSection.style.display = "none";
  }

  // Function to show read section
  function showRead() {
    bookList.style.display = "none";
    favoritesList.parentElement.style.display = "none";
    readList.parentElement.style.display = "block";
    videoSection.style.display = "none";
  }

  // Function to toggle light/dark mode
  function toggleMode() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      modeToggle.textContent = "Light Mode";
    } else {
      modeToggle.textContent = "Dark Mode";
    }
  }

  // Initial load
  showHome();
});
