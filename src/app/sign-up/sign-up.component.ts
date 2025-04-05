import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  imports: [],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  http = inject(HttpClient);

  apiProgress = false;

  ngOnInit(): void {
    // Initialize component
  }


  onUserNameChange(event: Event) {
    this.username = (event.target as HTMLInputElement).value;
  }
  onEmailChange(event: Event) {
    this.email = (event.target as HTMLInputElement).value; 
  }

  onPasswordChange(event: Event) {
    this.password = (event.target as HTMLInputElement).value;
  }

  onConfirmPasswordChange(event: Event) {
    this.confirmPassword = (event.target as HTMLInputElement).value;
  }

  isDisabled() {
    return !this.password || this.password !== this.confirmPassword || this.apiProgress;
  }

  onClickSignUp() {
    this.apiProgress = true;
    this.http.post('/api/1.0/users', {
      username: this.username,
      email: this.email,
      password: this.password,
    }).subscribe((response) => {
      this.apiProgress = false;
      console.log(response);
    }
    , (error) => {  
      this.apiProgress = false;
      console.log(error);
    }
    , () => {
      console.log('completed');
    }
    );
  }
}
