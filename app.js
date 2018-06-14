class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  isValid({ title, author, isbn }) {
    return title !== "" && author !== "" && isbn !== "";
  }

  addBook(book) {
    const bookList = document.querySelector(".book-list");
    const tr = document.createElement("tr");

    let output = "";

    Object.keys(book).forEach(function(field) {
      output += `<td class=${field}>${book[field]}</td>`;
    });

    output += "<td class='remove-book'>&times</td>";

    tr.innerHTML = output;
    bookList.appendChild(tr);
  }

  clearFields() {
    (document.getElementById("title").value = ""),
      (document.getElementById("author").value = ""),
      (document.getElementById("isbn").value = "");
  }

  deleteBook(target) {
    if (target.classList.contains("remove-book")) {
      target.parentElement.remove();
      const isbn = target.previousElementSibling.textContent;
      Store.deletebook(isbn);
    }

    this.showAlert("Deleted Book", "success");
  }

  showAlert(message, className) {
    if (!document.querySelector(`.${className}`)) {
      const container = document.querySelector(".container");
      const form = document.querySelector(".add-book");
      const div = document.createElement("div");

      div.appendChild(document.createTextNode(message));
      div.className = className;

      container.insertBefore(div, form);

      setTimeout(function() {
        div.remove();
      }, 800);
    }
  }
}

class Store {
  static getBooks() {
    let books;

    if (localStorage.getItem("books")) {
      books = JSON.parse(localStorage.getItem("books"));
    } else {
      books = [];
    }

    return books;
  }

  static displayBooks(books) {
    const ui = new UI();

    books.forEach(function(book) {
      ui.addBook(book);
    });
  }

  static storeBook(book) {
    let books = Store.getBooks();

    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static deletebook(isbn) {
    let books = this.getBooks();

    books.forEach(function(book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

document.addEventListener("DOMContentLoaded", displayBooksHandler);

function displayBooksHandler() {
  let books = Store.getBooks();

  if (books.length) {
    Store.displayBooks(books);
  }
}

document.querySelector(".add-book").addEventListener("submit", addBookHandler);

function addBookHandler(e) {
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  const book = new Book(title, author, isbn);

  const ui = new UI();

  if (ui.isValid(book)) {
    ui.addBook(book);
    ui.showAlert("Added book", "success");
    Store.storeBook(book);
    ui.clearFields();
  } else {
    ui.showAlert("Fill all fields", "error");
  }

  e.preventDefault();
}

document
  .querySelector(".book-list")
  .addEventListener("click", deleteBookHandler);

function deleteBookHandler(e) {
  const ui = new UI();
  ui.deleteBook(e.target);
}
