import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home/components/Home';

describe('Home', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should render home page correctly', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('WELCOME TO SMART LOANS')).toBeInTheDocument();
    expect(screen.getByText('Find the Perfect Loan for You')).toBeInTheDocument();
  });

  it('should toggle theme correctly', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const themeToggleButton = screen.getByRole('button', { name: /theme/i });
    fireEvent.click(themeToggleButton);
    expect(document.body.getAttribute('data-theme')).toBe('dark');

    fireEvent.click(themeToggleButton);
    expect(document.body.getAttribute('data-theme')).toBe('light');
  });
});