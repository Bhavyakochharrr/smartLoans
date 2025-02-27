import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './NavBar';

describe('Navbar', () => {
  const renderWithRouter = (ui) => {
    return render(ui, { wrapper: MemoryRouter });
  };

  it('renders the logo with correct alt text', () => {
    const { getByAltText } = renderWithRouter(<Navbar />);
    const logo = getByAltText('Loan Management');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('logo.png'));
  });

  it('renders the Home link', () => {
    const { getByText } = renderWithRouter(<Navbar />);
    const homeLink = getByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders the EMI Calculator link', () => {
    const { getByText } = renderWithRouter(<Navbar />);
    const emiLink = getByText('EMI Calculator');
    expect(emiLink).toBeInTheDocument();
    expect(emiLink.closest('a')).toHaveAttribute('href', '/emi-calculator');
  });

  it('renders the Sign Up link', () => {
    const { getByText } = renderWithRouter(<Navbar />);
    const signUpLink = getByText('Sign Up');
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/Register');
  });

  it('renders the Login link', () => {
    const { getByText } = renderWithRouter(<Navbar />);
    const loginLink = getByText('Login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/Login');
  });

  it('renders the navbar toggler button', () => {
    const { getByLabelText } = renderWithRouter(<Navbar />);
    const togglerButton = getByLabelText('Toggle navigation');
    expect(togglerButton).toBeInTheDocument();
  });
});