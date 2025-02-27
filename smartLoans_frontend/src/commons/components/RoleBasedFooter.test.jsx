import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoleBasedFooter from './RoleBasedFooter';
import Footer from './Footer';
import { useAuth } from '../../Home/contexts/AuthContext';

vi.mock('../../Home/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('./Footer', () => ({
  __esModule: true,
  default: () => <div>Footer Component</div>,
}));

describe('RoleBasedFooter', () => {
  it('does not render Footer if role includes user', () => {
    useAuth.mockReturnValue({ role: ['user'] });
    const { queryByText } = render(<RoleBasedFooter />);
    expect(queryByText('Footer Component')).not.toBeInTheDocument();
  });

  it('does not render Footer if role includes banker', () => {
    useAuth.mockReturnValue({ role: ['banker'] });
    const { queryByText } = render(<RoleBasedFooter />);
    expect(queryByText('Footer Component')).not.toBeInTheDocument();
  });

  it('does not render Footer if role includes admin', () => {
    useAuth.mockReturnValue({ role: ['admin'] });
    const { queryByText } = render(<RoleBasedFooter />);
    expect(queryByText('Footer Component')).not.toBeInTheDocument();
  });

  it('renders Footer if role does not include user, banker, or admin', () => {
    useAuth.mockReturnValue({ role: [] });
    const { getByText } = render(<RoleBasedFooter />);
    expect(getByText('Footer Component')).toBeInTheDocument();
  });

  it('renders Footer if role is undefined', () => {
    useAuth.mockReturnValue({ role: undefined });
    const { getByText } = render(<RoleBasedFooter />);
    expect(getByText('Footer Component')).toBeInTheDocument();
  });
});