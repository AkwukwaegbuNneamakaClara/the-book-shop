document.addEventListener('DOMContentLoaded', function () {

    fetch('books.json')
      .then(response => response.json())
      .then(data => {
        generateBookList(data.books);
        addFilterListeners(data.books);
        addSortListeners(data.books);
      })
      .catch(error => console.error('Error:', error));
  });
  
  // Function to generate the book list
  function generateBookList(books) {
    const bookListContainer = document.getElementById('book-list');
  
    bookListContainer.innerHTML = '';
    books.forEach(book => {
      const bookCard = createBookCard(book);
      bookListContainer.appendChild(bookCard);
    });
  }
  
  // Function to create a book card
  function createBookCard(book) {
    const card = document.createElement('div');
    card.classList.add('book-card');
    card.innerHTML = 
    `
      <img src="image/${book.image}" alt="${book.title}" class="book-image">
      <div class="book-details">
        <h2 class="title">${book.title}</h2>
        <p class="author">By ${book.author}</p>
        <p class="price">Sek:- ${book.price}</p>
        <button class="btn btn-primary add-to-cart" data-book="${JSON.stringify(book)}">Add to Cart</button>
      </div>
    `;
  card.addEventListener('click', () => showBookDetails(book));
  
    return card;
  }
  
  function showBookDetails(book) {
    const modalTitle = document.getElementById('book-details-modal-label');
    const modalBody = document.querySelector('#book-details-modal .modal-body');

    modalTitle.textContent = book.title;
    modalBody.innerHTML = `
      <img src="image/${book.image}" alt="${book.title}" class="book-image">
      <p class="author">By ${book.author}</p>
      <p class="price">Sek:- ${book.price}</p>
      <p class="description">${book.description}</p>
    `;
    $('#book-details-modal').modal('show');
  }
  // Function to add event listeners for filters
  function addFilterListeners(books) {
    const filterOptions = document.querySelectorAll('.filter-option');
    const priceRange = document.getElementById('price-range');
  
    // Add event listener for each filter option
    filterOptions.forEach(option => {
      option.addEventListener('click', () => {
        const category = option.dataset.category;
        const price = priceRange.value;
        const filteredBooks = filterBooks(books, category, price);
        generateBookList(filteredBooks);
      });
    });
    // Add event listener for price range input
  priceRange.addEventListener('input', () => {
    const category = getSelectedCategory();
    const price = priceRange.value;
    priceLabel.textContent = `Price: $0 - $${price}`;
    const filteredBooks = filterBooks(books, category, price);
    generateBookList(filteredBooks);
  });

  }
  // Function to filter books by category and price
  function filterBooks(books, category, price) {
  return books.filter(book => {
    const isInCategory = category === 'all' || book.category === category;
    const isInPriceRange = book.price <= price;
    return isInCategory && isInPriceRange;
  });
  }

  
  // Function to add event listeners for sorting
  function addSortListeners(books) {
    const sortSelect = document.getElementById('sort-select');

    sortSelect.addEventListener('change', () => {
      const sortValue = sortSelect.value;
      const sortedBooks = sortBooks(books, sortValue);
      generateBookList(sortedBooks);
    });
  }
  
  // Function to sort books
  function sortBooks(books, sortValue) {
    const sortedBooks = [...books];
  
    switch (sortValue) {
      case 'title-asc':
        sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-asc':
        sortedBooks.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedBooks.sort((a, b) => b.price - a.price);
        break;
      case 'author-asc':
        sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'author-desc':
        sortedBooks.sort((a, b) => b.author.localeCompare(a.author));
        break;
    }
  
    return sortedBooks;
  }
  
  
  // Function to add book to shopping cart
  function addToCart(book) {
    let cart = getCart();
  
    const existingBook = cart.find(item => item.book.title === book.title);
  
    if (existingBook) {
    } else {
      cart.push({ book, quantity: 1 });
    }
    saveCart(cart);
    alert('Book added to cart!');
  }
    function getCart() {
        const cartJSON = localStorage.getItem('cart');
        return cartJSON ? JSON.parse(cartJSON) : [];
    }
  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  // Event delegation for add to cart buttons
  document.addEventListener('click', function (event) {
    if (event.target && event.target.matches('.add-to-cart')) {
      const bookData = JSON.parse(event.target.dataset.book);
      addToCart(bookData);
    }
  });
  