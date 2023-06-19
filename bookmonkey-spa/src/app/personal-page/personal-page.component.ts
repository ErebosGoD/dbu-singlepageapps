import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface Book {
  title: string;
  subtitle: string;
  isbn: string;
  abstract: string;
  numPages: 123;
  author: string;
  publisher: string;
  price: string;
  cover: string;
}

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})

export class PersonalPageComponent implements OnInit {
  addedBooks: { title: string, isbn: string }[] = [];
  bookToRemove: string = '';
  newBook: Book = {
    title: '',
    subtitle: '',
    isbn: '',
    abstract: '',
    numPages: 123,
    author: '',
    publisher: '',
    price: '',
    cover: ''
  };
  book: Book = {
    title: '',
    subtitle: '',
    isbn: '',
    abstract: '',
    numPages: 123,
    author: '',
    publisher: '',
    price: '',
    cover: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.getBooks();
  }

  getBooks() {
    this.http.get<any[]>('http://localhost:4730/books').subscribe(
      (response) => {
        this.addedBooks = response.map((book) => {
          return {
            title: book.title,
            isbn: book.isbn
          };
        });
      },
      (error) => {
        console.error('Fehler beim Abrufen der Bücher:', error);
      }
    );
  }

  removeBook() {
    const bookToRemove = this.bookToRemove.trim();
    if (!bookToRemove) {
      return;
    }

    const bookIndex = this.addedBooks.findIndex((book) => book.title === bookToRemove);
    if (bookIndex === -1) {
      console.error('Buch nicht gefunden:', bookToRemove);
      return;
    }

    const isbn = this.addedBooks[bookIndex].isbn;
    this.http.delete(`http://localhost:4730/books/${isbn}`).subscribe(
      () => {
        this.addedBooks.splice(bookIndex, 1);
        this.bookToRemove = '';
      },
      (error) => {
        console.error('Fehler beim Entfernen des Buchs:', error);
      }
    );
  }

  updateBook() {
    const title = this.book.title;
    const isbn = this.book.isbn;

    const url = `http://localhost:4730/books/${isbn}`;

    const bookData = {
      title: title,
      isbn: isbn
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.put(url, bookData, { headers: headers })
      .subscribe(
        response => {
          console.log('Buch erfolgreich aktualisiert:', response);
        },
        error => {
          console.error('Fehler beim Hinzufügen des Buches:', error);
        }
      );
  }

  addBook() {
    const title = this.newBook.title;
    const isbn = this.newBook.isbn;

    const url = 'http://localhost:4730/books';

    const bookData = {
      title: title,
      isbn: isbn
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(url, bookData, { headers: headers })
      .subscribe(
        response => {
          console.log('Buch erfolgreich hinzugefügt:', response);
        },
        error => {
          console.error('Fehler beim Hinzufügen des Buches:', error);
        }
      );
  }

  logout() {
    this.router.navigate(['/']); // Leitet zur Home-Seite weiter
  }
}
