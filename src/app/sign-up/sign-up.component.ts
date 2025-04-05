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

  ngOnInit(): void {
    setTimeout(() => {
      console.log();
    }, 1000);
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
    console.log('sdfsfd')
    return !this.password || this.password !== this.confirmPassword;
  }

  onClickSignUp() {
    this.http.post('https://jsonplaceholder.typicode.com/posts', {
      username: this.username,
      email: this.email,
      password: this.password,
    }).subscribe((response) => {
      console.log(response);
    }
    , (error) => {  
      console.log(error);
    }
    , () => {
      console.log('completed');
    }
    );
  }
}
