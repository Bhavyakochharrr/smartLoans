import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Bankers from './Bankers';
import * as authService from '../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock the toast.success and toast.error functions
jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Bankers Component', () => {
  const mockBankers = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      gender: 'Male',
      address: '123 Main St',
      pannumber: 'ABCDE1234F',
      aadharnumber: '123456789012',
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '9876543210',
      gender: 'Female',
      address: '456 Oak Ave',
      pannumber: 'FGHIJ5678K',
      aadharnumber: '987654321098',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders bankers table and total bankers count', async () => {
    jest.spyOn(authService, 'getBankers').mockResolvedValue(mockBankers);

    render(<Bankers />);

    await waitFor(() => {
      expect(screen.getByText('Banker Management')).toBeInTheDocument();
      expect(screen.getByText('Total Bankers')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
    });
  });

  it('handles error fetching bankers', async () => {
    jest.spyOn(authService, 'getBankers').mockRejectedValue(new Error('Failed to fetch'));

    render(<Bankers />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching bankers')).toBeInTheDocument();
    });
  });

  it('opens and closes view banker modal', async () => {
    jest.spyOn(authService, 'getBankers').mockResolvedValue(mockBankers);

    render(<Bankers />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('View')[0]);
      expect(screen.getByText('Banker Information')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Close'));
      expect(screen.queryByText('Banker Information')).toBeNull();
    });
  });

  it('opens and closes delete confirmation modal', async () => {
    jest.spyOn(authService, 'getBankers').mockResolvedValue(mockBankers);

    render(<Bankers />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Delete')[0]);
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete John Doe? This action cannot be undone.')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Confirm Delete')).toBeNull();
    });
  });

  it('deletes a banker successfully', async () => {
    jest.spyOn(authService, 'getBankers').mockResolvedValue(mockBankers);
    jest.spyOn(authService, 'deleteBanker').mockResolvedValue();

    render(<Bankers />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Delete')[0]);
      fireEvent.click(screen.getByText('Delete'));
    });

    await waitFor(() => {
      expect(authService.deleteBanker).toHaveBeenCalledWith('1');
      expect(toast.success).toHaveBeenCalledWith('Banker deleted successfully!');
    });
  });

  it('handles error deleting a banker', async () => {
    jest.spyOn(authService, 'getBankers').mockResolvedValue(mockBankers);
    jest.spyOn(authService, 'deleteBanker').mockRejectedValue(new Error('Failed to delete'));

    render(<Bankers />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Delete')[0]);
      fireEvent.click(screen.getByText('Delete'));
    });

    await waitFor(() => {
      expect(authService.deleteBanker).toHaveBeenCalledWith('1');
      expect(toast.error).toHaveBeenCalled();
      expect(screen.getByText('Error deleting banker')).toBeInTheDocument();
    });
  });

  it('renders phone with +91',async()=>{
    jest.spyOn(authService, 'getBankers').mockResolvedValue(mockBankers);
    render(<Bankers/>);
    await waitFor(()=>{
      expect(screen.getByText('+91 1234567890')).toBeInTheDocument();
    })
  })

  it('renders N/A for missing phone number',async()=>{
    const mockBankersNoPhone = [{...mockBankers[0], phone:null}]
    jest.spyOn(authService, 'getBankers').mockResolvedValue(mockBankersNoPhone);
    render(<Bankers/>);
    await waitFor(()=>{
      fireEvent.click(screen.getAllByText('View')[0]);
      expect(screen.getByText('N/A')).toBeInTheDocument();
    })
  })
});