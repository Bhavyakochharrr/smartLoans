import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../Home/contexts/AuthContext';

vi.mock('../../Home/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const MockComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: MemoryRouter });
  };

  it('redirects to login if no token', () => {
    useAuth.mockReturnValue({ token: null });

    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={MockComponent} allowedRoles={['user']} />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    expect(getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to login if no user', () => {
    useAuth.mockReturnValue({ token: 'token', user: null });

    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={MockComponent} allowedRoles={['user']} />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );

    expect(getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to unauthorized if no role', () => {
    useAuth.mockReturnValue({ token: 'token', user: {}, role: [] });

    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={MockComponent} allowedRoles={['user']} />} />
        <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
      </Routes>
    );

    expect(getByText('Unauthorized Page')).toBeInTheDocument();
  });

  it('redirects to unauthorized if user does not have allowed role', () => {
    useAuth.mockReturnValue({ token: 'token', user: {}, role: ['admin'], activeRole: 'admin' });

    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={MockComponent} allowedRoles={['user']} />} />
        <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
      </Routes>
    );

    expect(getByText('Unauthorized Page')).toBeInTheDocument();
  });

  it('renders component if user has allowed role', () => {
    useAuth.mockReturnValue({ token: 'token', user: {}, role: ['user'], activeRole: 'user' });

    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={MockComponent} allowedRoles={['user']} />} />
      </Routes>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to error page if component throws an error', () => {
    const ErrorComponent = () => {
      throw new Error('Test Error');
    };

    useAuth.mockReturnValue({ token: 'token', user: {}, role: ['user'], activeRole: 'user' });

    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={ErrorComponent} allowedRoles={['user']} />} />
        <Route path="/error" element={<div>Error Page</div>} />
      </Routes>
    );

    expect(getByText('Error Page')).toBeInTheDocument();
  });
});