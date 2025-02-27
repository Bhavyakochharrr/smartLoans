import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../Home/contexts/AuthContext';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

const TestComponent = () => {
  const { login, logout, token, user } = useAuth();
  return (
    <div>
      <button onClick={() => login('test-token')}>Login</button>
      <button onClick={logout}>Logout</button>
      <div data-testid="token">{token}</div>
      <div data-testid="user">{user ? 'Logged In' : 'Logged Out'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should login and logout correctly', async () => {
    axios.get.mockResolvedValue({ data: { claims: { roles: ['user'], name: 'Test User' } } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe('test-token'));
    expect(screen.getByTestId('user').textContent).toBe('Logged In');

    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe(''));
    expect(screen.getByTestId('user').textContent).toBe('Logged Out');
  });
});