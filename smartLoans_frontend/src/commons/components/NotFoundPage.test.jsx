import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  it('renders the 404 heading', () => {
    const { getByText } = render(<NotFoundPage />);
    expect(getByText('404')).toBeInTheDocument();
  });

  it('renders the "Oops! Page Not Found" message', () => {
    const { getByText } = render(<NotFoundPage />);
    expect(getByText('Oops! Page Not Found')).toBeInTheDocument();
  });

  it('renders the description message', () => {
    const { getByText } = render(<NotFoundPage />);
    expect(getByText("The page you're looking for might have been removed or is temporarily unavailable.")).toBeInTheDocument();
  });

  it('renders the "Go Back Home" button', () => {
    const { getByText } = render(<NotFoundPage />);
    const button = getByText('Go Back Home');
    expect(button).toBeInTheDocument();
    expect(button.closest('a')).toHaveAttribute('href', '/');
  });
});