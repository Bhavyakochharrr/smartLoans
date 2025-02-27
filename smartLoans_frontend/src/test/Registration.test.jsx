import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Register from '../Home/components/Registration';

vi.mock('axios');

describe('Register', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should register a user successfully', async () => {
    axios.post.mockResolvedValue({ data: { message: 'User registered successfully!' } });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: 'Test Address' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Test@1234' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => expect(screen.getByText('User registered successfully!')).toBeInTheDocument());
  });
});