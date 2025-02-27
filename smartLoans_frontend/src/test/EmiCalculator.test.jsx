import { render, screen, fireEvent } from '@testing-library/react';
import EmiCalculator from '../Home/components/EmiCalculator';

describe('EmiCalculator', () => {
  it('should calculate EMI correctly', () => {
    render(<EmiCalculator />);

    const loanAmountInput = screen.getByLabelText(/Loan Amount/i);
    const interestRateInput = screen.getByLabelText(/Interest Rate/i);
    const loanTenureInput = screen.getByLabelText(/Tenure/i);

    fireEvent.change(loanAmountInput, { target: { value: 1000000 } });
    fireEvent.change(interestRateInput, { target: { value: 10 } });
    fireEvent.change(loanTenureInput, { target: { value: 120 } });

    expect(screen.getByText(/EMI: ₹/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Interest: ₹/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Payment: ₹/i)).toBeInTheDocument();
  });
});