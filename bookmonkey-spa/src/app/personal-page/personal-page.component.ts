import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit {
  addedBooks: { title: string, isbn: string }[] = [];
  bookToRemove: string = '';

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
  logout() {
    // Hier kannst du ggf. zusätzliche Logik für das Abmelden implementieren
    this.router.navigate(['/']); // Leitet zur Home-Seite weiter
  }
}
