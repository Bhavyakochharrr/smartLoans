
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoanDetailsModal from './modals/LoanDetailsModal';
import { BankerContext } from './contexts/BankerContext';

describe('LoanDetailsModal', () => {
  const mockContextValue = {
    selectedLoan: {
      customerName: 'John Doe',
      email: 'john@example.com',
      accountNumber: '1234567890',
      pannumber: 'ABCDE1234F',
      loanAmount: 50000,
      status: 'pending',
      cibilScore: 750,
      itrValue: 100000,
      documents: [
        { filename: 'document1.pdf', data: 'base64data1', mimetype: 'application/pdf' },
        { filename: 'document2.jpg', data: 'base64data2', mimetype: 'image/jpeg' },
      ],
      remarks: 'Initial remarks',
    },
    showModal: true,
    documentsVerified: false,
    remarks: 'Initial remarks',
    isButtonsDisabled: true,
    DocumentSelected: false,
    showViewer: false,
    selectedDocument: null,
    selectedDocType: null,
    setShowModal: vi.fn(),
    setDocumentsVerified: vi.fn(),
    setRemarks: vi.fn(),
    setShowViewer: vi.fn(),
    handleStatusChange: vi.fn(),
    handleDocumentVerification: vi.fn(),
    handleRemarksChange: vi.fn(),
    handleDownload: vi.fn(),
    handleViewDocument: vi.fn(),
  };

  it('renders loan details correctly', () => {
    render(
      <BankerContext.Provider value={mockContextValue}>
        <LoanDetailsModal />
      </BankerContext.Provider>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('ABCDE1234F')).toBeInTheDocument();
    expect(screen.getByText('₹50000')).toBeInTheDocument();
    expect(screen.getByText('750')).toBeInTheDocument();
    expect(screen.getByText('100000')).toBeInTheDocument();
  });

  it('calls handleDocumentVerification when checkbox is clicked', () => {
    render(
      <BankerContext.Provider value={mockContextValue}>
        <LoanDetailsModal />
      </BankerContext.Provider>
    );

    const checkbox = screen.getByLabelText('I have verified all documents');
    fireEvent.click(checkbox);

    expect(mockContextValue.handleDocumentVerification).toHaveBeenCalled();
  });

  it('calls handleRemarksChange when remarks are changed', () => {
    render(
      <BankerContext.Provider value={mockContextValue}>
        <LoanDetailsModal />
      </BankerContext.Provider>
    );

    const textarea = screen.getByPlaceholderText('Enter remarks here');
    fireEvent.change(textarea, { target: { value: 'Updated remarks' } });

    expect(mockContextValue.handleRemarksChange).toHaveBeenCalled();
  });

  it('calls handleStatusChange when approve button is clicked', () => {
    render(
      <BankerContext.Provider value={mockContextValue}>
        <LoanDetailsModal />
      </BankerContext.Provider>
    );

    const approveButton = screen.getByText('Approve');
    fireEvent.click(approveButton);

    expect(mockContextValue.handleStatusChange).toHaveBeenCalledWith(mockContextValue.selectedLoan.loanId, 'approve', mockContextValue.remarks);
  });

  it('calls handleDownload when download button is clicked', () => {
    render(
      <BankerContext.Provider value={mockContextValue}>
        <LoanDetailsModal />
      </BankerContext.Provider>
    );

    const downloadButton = screen.getAllByText('Download')[0];
    fireEvent.click(downloadButton);

    expect(mockContextValue.handleDownload).toHaveBeenCalledWith('base64data1', 'document1.pdf');
  });
});