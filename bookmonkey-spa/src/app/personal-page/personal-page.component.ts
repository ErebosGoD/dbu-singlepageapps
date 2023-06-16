import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit {
  addedBooks: { title: string, numberOfTimesRead: number }[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getBooks();
  }

  getBooks() {
    this.http.get<any[]>('http://localhost:4730/books').subscribe(
      (response) => {
        this.addedBooks = response.map((book) => {
          return {
            title: book.title,
            numberOfTimesRead: book.numberOfTimesRead || 0
          };
        });
      },
      (error) => {
        console.error('Fehler beim Abrufen der Bücher:', error);
      }
    );
  }

  updateNumberOfTimesRead(book: { title: string, numberOfTimesRead: number }, value: number) {
    const updatedBook = { ...book, numberOfTimesRead: value };
    this.http.put(`http://localhost:4730/books/${book.title}`, updatedBook).subscribe(
      () => {
        book.numberOfTimesRead = value;
      },
      (error) => {
        console.error('Fehler beim Aktualisieren der Anzahl der gelesenen Bücher:', error);
      }
    );
  }
}
