import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
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

  describe('Interactions', () => {

    let httpTestingController: HttpTestingController;
    let button: HTMLButtonElement;
    const setupForm = async () => {
      httpTestingController = TestBed.inject(HttpTestingController);

      const usernameInput = fixture.nativeElement.querySelector('input[id=username]') as HTMLInputElement;
      const emailInput = fixture.nativeElement.querySelector('input[id=email]') as HTMLInputElement;
      const passwordInput = fixture.nativeElement.querySelector('input[id=password]') as HTMLInputElement;
      const confirmPasswordInput = fixture.nativeElement.querySelector('input[id=confirmPassword]') as HTMLInputElement;
    
      passwordInput.value = '123456';
      passwordInput.dispatchEvent(new Event('input'));
    
      confirmPasswordInput.value = '123456';
      confirmPasswordInput.dispatchEvent(new Event('input'));
    
      usernameInput.value = 'testuser';
      usernameInput.dispatchEvent(new Event('input'));
    
      emailInput.value = 'test@test.com';
      emailInput.dispatchEvent(new Event('input'));
    
      fixture.detectChanges();
      await fixture.whenStable(); // дочекайтеся завершення прив'язки
    
      button = fixture.nativeElement.querySelector('button[type=submit]') as HTMLButtonElement;
    }

    it('enables the button when password and confirm password are the same', async () => {
      await setupForm();
      expect(button.disabled).toBeFalsy();
    });

    it('SENDS username, email and password after clicking the button', async () => {
      await setupForm();
      button.click();
    
      const reqObj = httpTestingController.expectOne('/api/1.0/users');
      const reqBody = reqObj.request.body;
      expect(reqBody).toEqual({
        username: 'testuser',
        password: '123456',
        email: 'test@test.com',
      });
    });
    it('disables button when there is ongoing api call', async () => {
      await setupForm();
      button.click();
      fixture.detectChanges();
      button.click();
      httpTestingController.expectOne('/api/1.0/users');
      expect(button.disabled).toBeTruthy();
    })

    it('displays spinner when there is ongoing api call', async () => {
      await setupForm();
      button.click();
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector('.app-spinner') as HTMLElement;
      expect(spinner).toBeTruthy();
    })
    it('doe not display spinner it there is no api request', async () => {
      await setupForm();
      const spinner = fixture.nativeElement.querySelector('.app-spinner') as HTMLElement;
      expect(spinner).toBeFalsy();
    })
    it('displays account activation notification when api call is successful', async () => {
      await setupForm();
      expect(fixture.nativeElement.querySelector('.alert-success')).toBeFalsy();
      button.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush({});
      fixture.detectChanges();
      const message = fixture.nativeElement.querySelector('.alert-success') as HTMLElement;
      expect(message.textContent).toContain('Check your email to activate your account');
    })
    it('hides form after successfull sign up', async () => {
      await setupForm();
       expect(fixture.nativeElement.querySelector('.sign-up-form')).toBeTruthy();
       button.click();
       const req = httpTestingController.expectOne('/api/1.0/users');
       req.flush({});
       fixture.detectChanges();
       expect(fixture.nativeElement.querySelector('.sign-up-form')).toBeFalsy();
    })
  })
});
