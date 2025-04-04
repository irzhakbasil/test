import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Layout', () => {
    it('has Sign up header', () => {
      const h1 = fixture.nativeElement.querySelector('h1') as HTMLElement;
      expect(h1.textContent).toBe('Sign Up');
    });

    it('has username input', () => {
      const label = fixture.nativeElement.querySelector('label[for=username]') as HTMLElement;
      expect(label.textContent).toBe('Username');
      const input = fixture.nativeElement.querySelector('input[id=username]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label.textContent).toBe('Username');
    });

    it('has username input', () => {
      const label = fixture.nativeElement.querySelector('label[for=email]') as HTMLElement;
      const input = fixture.nativeElement.querySelector('input[id=email]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label.textContent).toBe('E-mail');
    })

    it('has password input', () => {
      const label = fixture.nativeElement.querySelector('label[for=password]') as HTMLElement;
      const input = fixture.nativeElement.querySelector('input[id=password]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label.textContent).toBe('Password');
    })

    it('has password type for password input', () => {
      const input = fixture.nativeElement.querySelector('input[id=password]') as HTMLInputElement;
      expect(input.type).toBe('password');
    })

    it('has password repeat input', () => {
      const label = fixture.nativeElement.querySelector('label[for=confirmPassword]') as HTMLElement;
      const input = fixture.nativeElement.querySelector('input[id=confirmPassword]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label.textContent).toBe('Confirm Password');
    })

    it('has sign up button', () => {
      const button = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Sign Up');
    })

    it('disables the button initially', ()=>{
      const button = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    } )
  });

});
