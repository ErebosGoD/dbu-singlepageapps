import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    this.http.post('http://localhost:4730/register', { email, password }).subscribe(
      (response) => {
        console.log('Erfolgreich registriert:', response);
        this.router.navigate(['/personal-page']);
      },
      (error) => {
        console.error('Fehler bei der Registrierung:', error);
        // Hier kannst du Fehlerbehandlung durchführen
      }
    );
  }
}
