import {render, screen} from '@testing-library/angular'
import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  describe('Layout', () => {
    it('has Sign up header', async () => {
      await render(SignUpComponent);
      const h1 = screen.getByRole('heading', { name: 'Sign Up' });
      expect(h1).toBeInTheDocument();
    });
    it('has username input', async () => {
      await render(SignUpComponent);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    })
    it('has email input', async () => {
      await render(SignUpComponent);
      expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    })
    it('has password input', async () => {
      await render(SignUpComponent);
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    })
    it('has confirm password input', async () => {
      await render(SignUpComponent);
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    })
    it('has password type for password input', async () => {
      await render(SignUpComponent);
      const input = screen.getByLabelText('Password') as HTMLInputElement;
      expect(input).toHaveAttribute('type', 'password');
    })
    it('has password type for confirm password input', async () => {
      await render(SignUpComponent);
      const input = screen.getByLabelText('Confirm Password') as HTMLInputElement;
      expect(input).toHaveAttribute('type', 'password');
    });
    it('has Sign up button', async () => {
      await render(SignUpComponent);
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
    });

    it('disables the button initially', async () => {
      await render(SignUpComponent);
      const button = screen.getByRole('button', { name: 'Sign Up' }) as HTMLButtonElement;
      expect(button).toBeDisabled();
    })
  })
})