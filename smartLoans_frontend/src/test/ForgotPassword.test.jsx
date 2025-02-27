import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { vi } from 'vitest';
import ForgotPassword from '../Home/components/ForgotPassword';

vi.mock('axios');

describe('ForgotPassword', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should send OTP successfully', async () => {
    axios.post.mockResolvedValue({ data: { message: 'OTP sent successfully!' } });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send otp/i }));

    await waitFor(() => expect(screen.getByText('OTP sent successfully!')).toBeInTheDocument());
  });

  it('should verify OTP successfully', async () => {
    axios.post.mockResolvedValue({ data: { message: 'OTP verified successfully!' } });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/Enter OTP/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /verify otp/i }));

    await waitFor(() => expect(screen.getByText('OTP verified successfully!')).toBeInTheDocument());
  });

  it('should reset password successfully', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Password reset successfully!' } });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'Test@1234' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => expect(screen.getByText('Password reset successfully!')).toBeInTheDocument());
  });
});