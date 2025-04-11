import { Component } from '@angular/core';
import { SignUpComponent } from "./sign-up/sign-up.component";

@Component({
  selector: 'app-root',
  imports: [SignUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test';
}
