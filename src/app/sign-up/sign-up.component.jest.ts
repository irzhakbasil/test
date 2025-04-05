import { render, screen, waitFor } from '@testing-library/angular';
import { SignUpComponent } from './sign-up.component';
import userEvent from '@testing-library/user-event';
import { provideHttpClient } from '@angular/common/http';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Setup MSW server
const server = setupServer(
  rest.post('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}));
  })
);

// Component setup function
const setupComponent = async () => {
  return await render(SignUpComponent, {
    providers: [provideHttpClient()],
  });
};

describe('SignUpComponent', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('Layout', () => {
    it('has Sign Up header', async () => {
      await setupComponent();
      const header = screen.getByRole('heading', { name: 'Sign Up' });
      expect(header).toBeInTheDocument();
    });

    it('has username input', async () => {
      await setupComponent();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('has email input', async () => {
      await setupComponent();
      expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    });

    it('has password input', async () => {
      await setupComponent();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('has confirm password input', async () => {
      await setupComponent();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    it('has password type for password input', async () => {
      await setupComponent();
      const input = screen.getByLabelText('Password') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has password type for confirm password input', async () => {
      await setupComponent();
      const input = screen.getByLabelText('Confirm Password') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has Sign Up button', async () => {
      await setupComponent();
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
    });

    it('disables the button initially', async () => {
      await setupComponent();
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('enables the button when password and confirm password match', async () => {
      await setupComponent();
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const button = screen.getByRole('button', { name: 'Sign Up' });

      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(confirmPasswordInput, 'password123');

      expect(button).toBeEnabled();
    });

    it('sends username, email and password after clicking the button', async () => {
      let requestBody: any;
      server.use(
        rest.post('https://jsonplaceholder.typicode.com/posts', async (req, res, ctx) => {
          requestBody = await req.json();
          return res(ctx.status(200), ctx.json({}));
        })
      );

      await setupComponent();

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const button = screen.getByRole('button', { name: 'Sign Up' });

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(confirmPasswordInput, 'password123');
      await userEvent.click(button);

      await waitFor(() => {
        expect(requestBody).toEqual({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });

    it('disables button when password and confirm password do not match', async () => {
      await setupComponent();
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const button = screen.getByRole('button', { name: 'Sign Up' });

      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(confirmPasswordInput, 'differentpassword');

      expect(button).toBeDisabled();
    });
  });
});