import { render, screen, waitFor } from '@testing-library/angular';
import { SignUpComponent } from './sign-up.component';
import userEvent from '@testing-library/user-event';
import { provideHttpClient } from '@angular/common/http';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Setup MSW server
let couter = 0;
const server = setupServer(
  rest.post('/api/1.0/users', (req, res, ctx) => {
    couter += 1;
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
  afterEach(() => {
    couter = 0; 
    server.resetHandlers()
  });
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
    let button: HTMLButtonElement;
    const setupForm = async () => {
      await setupComponent();

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(confirmPasswordInput, 'password123');

      button = screen.getByRole('button', { name: 'Sign Up' });
    }

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
        rest.post('/api/1.0/users', async (req, res, ctx) => {
          requestBody = await req.json();
          return res(ctx.status(200), ctx.json({}));
        })
      );

      await setupForm();

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

    it('disables button when there is ongoing api call', async () => {
      // Setup a delayed response to ensure we can test the loading state
      server.use(
        rest.post('/api/1.0/users', async (req, res, ctx) => {
          await new Promise(resolve => setTimeout(resolve, 100));
          couter += 1;
          return res(ctx.status(200), ctx.json({}));
        })
      );
    
      await setupForm();
      
      // First click - should trigger API call
      await userEvent.click(button);
      
      // Verify button is disabled during API call
      expect(button).toBeDisabled();
      
      // Try to click again while API call is ongoing
      await userEvent.click(button);
      
      // Wait for API call to complete and verify counter
      await waitFor(() => {
        expect(couter).toBe(1);
      });
    });

    it('displays spinner when there is ongoing api call', async () => {
    server.use(
      rest.post('/api/1.0/users', async (req, res, ctx) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return res(ctx.status(200), ctx.json({}));
      })
    );

    await setupForm();
    expect(document.querySelector('.app-spinner')).not.toBeInTheDocument();
    await userEvent.click(button);

    const spinner = document.querySelector('.app-spinner');
    expect(spinner).toBeInTheDocument();
    });
    it('displays account activation notification when api call is successful', async () => {
      server.use(
        rest.post('/api/1.0/users', async (req, res, ctx) => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return res(ctx.status(200), ctx.json({}));
        })
      );
      await setupForm();
      expect(document.querySelector('.alert-success')).not.toBeInTheDocument();
      await userEvent.click(button);
      const notification = await screen.findByRole('alert');
      expect(notification).toBeInTheDocument();
      expect(notification).toHaveClass('alert-success');
    })
    it('hides form after successfull sign up', async () => {
      server.use(
        rest.post('/api/1.0/users', async (req, res, ctx) => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return res(ctx.status(200), ctx.json({}));
        })
      );

      await setupForm();
      expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
      await userEvent.click(button);
      const notification = await screen.findByRole('alert');
      expect(notification).toBeInTheDocument();
      expect(screen.queryByTestId('sign-up-form')).not.toBeInTheDocument();
      expect(notification).toHaveClass('alert-success');
      expect(notification.textContent).toContain('Check your email to activate your account');
    })
  });
});