import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import { useAuth } from '../../Home/contexts/AuthContext';

vi.mock('../../Home/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', () => {
  const actual = vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('RoleSelection', () => {
  const mockNavigate = vi.fn();
  const mockLogout = vi.fn();
  const mockSetActiveRole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({
      role: ['user', 'banker', 'admin'],
      setActiveRole: mockSetActiveRole,
      logout: mockLogout,
    });
  });

  it('renders role selection buttons based on roles', () => {
    const { getByText } = render(
      <MemoryRouter>
        <RoleSelection />
      </MemoryRouter>
    );

    expect(getByText('Continue as Customer')).toBeInTheDocument();
    expect(getByText('Continue as Banker')).toBeInTheDocument();
    expect(getByText('Continue as Admin')).toBeInTheDocument();
  });

  it('calls handleRoleSelect and navigates to the correct dashboard on role button click', () => {
    const { getByText } = render(
      <MemoryRouter>
        <RoleSelection />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Continue as Customer'));
    expect(mockSetActiveRole).toHaveBeenCalledWith('user');
    expect(mockNavigate).toHaveBeenCalledWith('/customer-dashboard');

    fireEvent.click(getByText('Continue as Banker'));
    expect(mockSetActiveRole).toHaveBeenCalledWith('banker');
    expect(mockNavigate).toHaveBeenCalledWith('/banker-dashboard');

    fireEvent.click(getByText('Continue as Admin'));
    expect(mockSetActiveRole).toHaveBeenCalledWith('admin');
    expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
  });

  it('calls handleLogout and logs out the user', () => {
    const { getByText } = render(
      <MemoryRouter>
        <RoleSelection />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });
});