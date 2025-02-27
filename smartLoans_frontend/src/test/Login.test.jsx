import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../Home/contexts/AuthContext';
import Login from '../Home/components/Login';
import { vi } from 'vitest';
import { loginUser } from '../Home/services/AuthService';

vi.mock('../services/AuthService');

describe('Login', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should login a user successfully', async () => {
    loginUser.mockResolvedValue({ token: 'test-token', user: { roles: ['user'] } });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Test@1234' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(screen.getByText('Login')).toBeInTheDocument());
  });
});