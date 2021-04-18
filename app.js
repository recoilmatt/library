// Book Class - represents a book

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class - handle UI tasks

class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list"); //attach to the element book-list
    const row = document.createElement("div");
    row.classList.add("col-6");

    row.innerHTML = `
    <div class="card">
    <div id="title">
    ${book.title}
    </div>
    <div id="author">
    ${book.author}
    </div>
    <div id="isbn">
    ${book.isbn}
    </div>
  
    <a href="#" class="btn btn-danger btn-sm delete">x</a>
   
    </div>
    `;
    list.appendChild(row);
  }

  static clearFields() {
    document.getElementById("book-form").reset();
  }

  // Alert message

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // Remove after 3 seconds.
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static deleteBook(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
    }
  }
}

// Store Class - local storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event - display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event - add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // prevents the refresh
  e.preventDefault();

  // Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // Validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in fields.", "danger");
  } else {
    // Instatiate book
    const book = new Book(title, author, isbn);
    console.log(book);

    // Add the Book to the UI
    UI.addBookToList(book);

    // Add book to storage
    Store.addBook(book);

    // Show a success msg after adding a book.
    UI.showAlert("Book added", "success");

    // Clear fields
    UI.clearFields();
  }
});

// Event - remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target);

  //trim whitespace from the textContet!
  console.log(
    e.target.previousElementSibling.textContent.replace(/\s+/g, " ").trim()
  );

  //Remove book from store -- this gets the isbn.
  Store.removeBook(
    e.target.previousElementSibling.textContent.replace(/\s+/g, " ").trim()
  );

  // Show book removed alert
  UI.showAlert("Book Removed", "success");
});
