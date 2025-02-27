import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the company info', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('SMART LOANS')).toBeInTheDocument();
    expect(getByText('Secure. Reliable. Efficient.')).toBeInTheDocument();
    expect(getByText('Take control of your financial future.')).toBeInTheDocument();
  });

  it('renders the quick links', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('Quick Links')).toBeInTheDocument();
    expect(getByText('🏠 Home')).toBeInTheDocument();
    expect(getByText('📄 Apply for Loan')).toBeInTheDocument();
    expect(getByText('💳 Repayment')).toBeInTheDocument();
    expect(getByText('📞 Contact Us')).toBeInTheDocument();
  });

  it('renders the contact info', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('Contact Us')).toBeInTheDocument();
    expect(getByText('Bren Optimus, Bengaluru')).toBeInTheDocument();
    expect(getByText('+91 9000101234')).toBeInTheDocument();
    expect(getByText('smartloans.app@gmail.com')).toBeInTheDocument();
  });

  it('renders the social media icons', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('a[href="#"] svg[data-icon="facebook-f"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="#"] svg[data-icon="twitter"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="#"] svg[data-icon="linkedin-in"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="#"] svg[data-icon="instagram"]')).toBeInTheDocument();
  });

  it('renders the copyright text', () => {
    const { getByText } = render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(getByText(`© ${currentYear} SMART LOANS`)).toBeInTheDocument();
  });
});