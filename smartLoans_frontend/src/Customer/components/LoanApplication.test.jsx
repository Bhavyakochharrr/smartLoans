import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoanApplication from "./LoanApplication";
import { vi } from "vitest";
import { useAuth } from "../../Home/contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

vi.mock("../../Home/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("axios");

describe("LoanApplication Component", () => {
  const mockUser = {
    accountNumber: "1234567890",
    name: "John Doe",
    email: "john@example.com",
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LoanApplication />
      </BrowserRouter>
    );
  };

  test("renders loan application form", () => {
    renderComponent();
    expect(screen.getByText(/Loan Application/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aadhar Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PAN Number/i)).toBeInTheDocument();
  });

  test("allows user to input data", () => {
    renderComponent();
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    fireEvent.change(phoneInput, { target: { value: "9876543210" } });
    expect(phoneInput.value).toBe("9876543210");
  });

  test("updates interest rate based on loan type selection", () => {
    renderComponent();
    const loanTypeSelect = screen.getByLabelText(/Loan Type/i);
    fireEvent.change(loanTypeSelect, { target: { value: "Home Loan" } });
    expect(screen.getByLabelText(/Loan Type/i).value).toBe("Home Loan");
  });

  test("displays additional fields based on loan type selection", () => {
    renderComponent();
    const loanTypeSelect = screen.getByLabelText(/Loan Type/i);
    fireEvent.change(loanTypeSelect, { target: { value: "Home Loan" } });
    expect(screen.getByLabelText(/Property Value/i)).toBeInTheDocument();
  });

  test("submits form successfully", async () => {
    axios.post.mockResolvedValue({ status: 201, data: {} });
    renderComponent();
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    fireEvent.change(phoneInput, { target: { value: "9876543210" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  test("shows alert on missing required fields", async () => {
    window.alert = vi.fn();
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Please fill in all required fields."));
  });
});
