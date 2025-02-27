
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BankerHome from './components/BankerHome';
import { BankerContext } from './contexts/BankerContext';

describe('BankerHome', () => {
  const mockContextValue = {
    loans: [
      { status: 'pending' },
      { status: 'approved' },
      { status: 'rejected' },
      { status: 'approved' },
    ],
  };

  it('renders loan statistics correctly', () => {
    render(
      <BankerContext.Provider value={mockContextValue}>
        <BankerHome />
      </BankerContext.Provider>
    );

    expect(screen.getByText('Total Applications: 4')).toBeInTheDocument();
    expect(screen.getByText('Pending: 1')).toBeInTheDocument();
    expect(screen.getByText('Approved: 2')).toBeInTheDocument();
    expect(screen.getByText('Rejected: 1')).toBeInTheDocument();
  });

  it('renders bar chart correctly', () => {
    render(
      <BankerContext.Provider value={mockContextValue}>
        <BankerHome />
      </BankerContext.Provider>
    );

    expect(screen.getByText('Loan Applications')).toBeInTheDocument();
  });

  it('renders circular progress bar correctly', () => {
    render(
      <BankerContext.Provider value={mockContextValue}>
        <BankerHome />
      </BankerContext.Provider>
    );

    expect(screen.getByText('Approved Loans vs Target')).toBeInTheDocument();
    expect(screen.getByText('2/50')).toBeInTheDocument();
  });
});