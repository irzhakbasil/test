import {render, screen} from '@testing-library/angular'
import { SignUpComponent } from './sign-up.component';
import userEvent from '@testing-library/user-event';
import 'whatwg-fetch';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

const setup = async () => { await render(SignUpComponent, {
  providers: [provideHttpClient(), provideHttpClientTesting()],
});
}

describe('SignUpComponent', () => {
  describe('Layout', () => {
    it('has Sign up header', async () => {
      await setup();
      const h1 = screen.getByRole('heading', { name: 'Sign Up' });
      expect(h1).toBeInTheDocument();
    });
    it('has username input', async () => {
      await setup();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    })
    it('has email input', async () => {
      await setup();
      expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    })
    it('has password input', async () => {
      await setup();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    })
    it('has confirm password input', async () => {
      await setup();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    })
    it('has password type for password input', async () => {
      await setup();
      const input = screen.getByLabelText('Password') as HTMLInputElement;
      expect(input).toHaveAttribute('type', 'password');
    })
    it('has password type for confirm password input', async () => {
      await setup();
      const input = screen.getByLabelText('Confirm Password') as HTMLInputElement;
      expect(input).toHaveAttribute('type', 'password');
    });
    it('has Sign up button', async () => {
      await setup();
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
    });

    it('disables the button initially', async () => {
      await render(SignUpComponent, {
        providers: [provideHttpClient()],
      });
      const button = screen.getByRole('button', { name: 'Sign Up' }) as HTMLButtonElement;
      expect(button).toBeDisabled();
    });

    describe('Interactions', () => {
      it('enables the button when password and confirm password are the same', async () => {
        await setup();
        const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
        const confirmPasswordInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;
        await userEvent.type(passwordInput, '123456');
        await userEvent.type(confirmPasswordInput, '123456');
        const button = screen.getByRole('button', { name: 'Sign Up' }) as HTMLButtonElement;
        expect(button).toBeEnabled();
      })
    })

    it('SENDS username, email and password after clicking the button', async () => {
      await setup();
      let httpTestingController = TestBed.inject(HttpTestingController);

      const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
      const emailInput = screen.getByLabelText('E-mail') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const confirmPasswordInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(emailInput, 'test@test.com');
      await userEvent.type(passwordInput, '123456');
      await userEvent.type(confirmPasswordInput, '123456');
      const button = screen.getByRole('button', { name: 'Sign Up' }) as HTMLButtonElement;
      await userEvent.click(button);
      const reqObj = httpTestingController.expectOne('https://jsonplaceholder.typicode.com/posts');
      const reqBody = reqObj.request.body;
      expect(reqBody).toEqual({
        username: 'testuser',
        password: '123456',
        email: 'test@test.com',
      });
    })

  })
})