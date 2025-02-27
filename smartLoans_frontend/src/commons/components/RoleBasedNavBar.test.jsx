import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoleBasedNavbar from './RoleBasedNavBar';
import Navbar from './NavBar';
import { useAuth } from '../../Home/contexts/AuthContext';

vi.mock('../../Home/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('./NavBar', () => ({
  __esModule: true,
  default: () => <div>Navbar Component</div>,
}));

describe('RoleBasedNavbar', () => {
  it('does not render Navbar if role includes banker', () => {
    useAuth.mockReturnValue({ role: ['banker'] });
    const { queryByText } = render(<RoleBasedNavbar />);
    expect(queryByText('Navbar Component')).not.toBeInTheDocument();
  });

  it('does not render Navbar if role includes user', () => {
    useAuth.mockReturnValue({ role: ['user'] });
    const { queryByText } = render(<RoleBasedNavbar />);
    expect(queryByText('Navbar Component')).not.toBeInTheDocument();
  });

  it('does not render Navbar if role includes admin', () => {
    useAuth.mockReturnValue({ role: ['admin'] });
    const { queryByText } = render(<RoleBasedNavbar />);
    expect(queryByText('Navbar Component')).not.toBeInTheDocument();
  });

  it('renders Navbar if role does not include banker, user, or admin', () => {
    useAuth.mockReturnValue({ role: [] });
    const { getByText } = render(<RoleBasedNavbar />);
    expect(getByText('Navbar Component')).toBeInTheDocument();
  });

  it('renders Navbar if role is undefined', () => {
    useAuth.mockReturnValue({ role: undefined });
    const { getByText } = render(<RoleBasedNavbar />);
    expect(getByText('Navbar Component')).toBeInTheDocument();
  });
});