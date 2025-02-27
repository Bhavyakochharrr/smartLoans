import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../Home/contexts/AuthContext';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';

vi.mock('./Home/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = require('../Home/contexts/AuthContext').useAuth;

describe('App', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      role: [],
      activeRole: null,
      token: null,
    });
  });

  test('renders home page when no role is set', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  test('redirects to role selection when multiple roles are available and no active role is set', async () => {
    mockUseAuth.mockReturnValue({
      role: ['user', 'banker'],
      activeRole: null,
      token: 'mockToken',
    });

    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    expect(screen.getByText(/role selection/i)).toBeInTheDocument();
  });

  test('redirects to customer dashboard when active role is user', async () => {
    mockUseAuth.mockReturnValue({
      role: ['user'],
      activeRole: 'user',
      token: 'mockToken',
    });

    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    expect(screen.getByText(/customer dashboard/i)).toBeInTheDocument();
  });

  test('redirects to banker dashboard when active role is banker', async () => {
    mockUseAuth.mockReturnValue({
      role: ['banker'],
      activeRole: 'banker',
      token: 'mockToken',
    });

    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    expect(screen.getByText(/banker dashboard/i)).toBeInTheDocument();
  });

  test('redirects to admin dashboard when active role is admin', async () => {
    mockUseAuth.mockReturnValue({
      role: ['admin'],
      activeRole: 'admin',
      token: 'mockToken',
    });

    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });
});