import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const EMIPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loanDetails, emiDetails } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loanDetails || !emiDetails) {
      toast.error("Payment details not found!");
      navigate('/customer-dashboard/loans');
    }
  }, [loanDetails, emiDetails, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate input based on payment method
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID in the format username@bank');
      return;
    }

    if (paymentMethod === 'card') {
      if (cardNumber.length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return;
      }
      
      if (!expiryDate.includes('/') || expiryDate.length !== 5) {
        toast.error('Please enter a valid expiry date in MM/YY format');
        return;
      }
      
      if (cvv.length !== 3) {
        toast.error('Please enter a valid 3-digit CVV');
        return;
      }
    }

    try {
      const paymentData = {
        loanId: loanDetails.loanId,
        emiNumber: emiDetails.emiNumber,
        amount: emiDetails.totalDue,
        paymentMethod,
        paymentDetails: paymentMethod === 'upi' 
          ? { upiId } 
          : { cardNumber, expiryDate, cvv }
      };

      // Show processing toast
      toast.info('Processing payment...', { autoClose: 2000 });

      const response = await axios.patch('http://localhost:2000/api/emi/pay', paymentData);
      console.log(response.data);
      
      if (response.data.success) {
        toast.success('Payment Successful!');
        // Add a small delay to ensure the user sees the success message
        setTimeout(() => {
          navigate('/customer-dashboard/loan-details');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Payment was not successful');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (!loanDetails || !emiDetails) return null;

  return (
    <Container className="py-5">
      {/* Add ToastContainer at the top level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Card className="shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card.Header className="text-white bg" style={{ backgroundColor: '#41B3A2' }}>
          <h4 className="mb-0">EMI Payment</h4>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <h5>Payment Details</h5>
            <div className="payment-info">
              <p><strong>Loan ID:</strong> {loanDetails.loanId}</p>
              <p><strong>EMI Number:</strong> {emiDetails.emiNumber}</p>
              <p><strong>Due Date:</strong> {new Date(emiDetails.dueDate).toLocaleDateString()}</p>
              <p><strong>Principal Amount:</strong> {formatCurrency(emiDetails.principal)}</p>
              <p><strong>Interest:</strong> {formatCurrency(emiDetails.interest)}</p>
              <p><strong>EMI Amount:</strong> {formatCurrency(emiDetails.amount)}</p>
              {emiDetails.lateFee > 0 && (
                <p className="text-danger">
                  <strong>Late Fee:</strong> {formatCurrency(emiDetails.lateFee)}
                </p>
              )}
              <p className="h5 mt-3">
                <strong>Total Due:</strong> {formatCurrency(emiDetails.totalDue)}
              </p>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  // Reset form fields when payment method changes
                  setUpiId('');
                  setCardNumber('');
                  setExpiryDate('');
                  setCvv('');
                }}
              >
                <option value="upi">UPI</option>
                <option value="card">Credit/Debit Card</option>
              </Form.Select>
            </Form.Group>

            {paymentMethod === 'upi' ? (
              <Form.Group className="mb-3">
                <Form.Label>UPI ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter UPI ID"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  Enter your UPI ID in the format username@bank
                </Form.Text>
              </Form.Group>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => {
                      const input = e.target.value.replace(/\D/g, '').slice(0, 16);
                      setCardNumber(input);
                      if (input.length === 16) {
                        toast.info('Card number complete');
                      }
                    }}
                    pattern="\d{16}"
                    required
                  />
                </Form.Group>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            let formattedValue = value;
                            if (value.length > 2) {
                              formattedValue = value.substring(0, 2) + '/' + value.substring(2);
                            }
                            setExpiryDate(formattedValue);
                          }
                        }}
                        pattern="\d{2}/\d{2}"
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        pattern="\d{3}"
                        required
                      />
                    </Form.Group>
                  </div>
                </div>
              </>
            )}

            <div className="d-grid gap-2">
              <Button 
                type="submit" 
                style={{ backgroundColor: '#41B3A2', borderColor: '#41B3A2' }}
              >
                Pay {formatCurrency(emiDetails.totalDue)}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  toast.info('Payment cancelled');
                  navigate('/customer-dashboard/loan-details');
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EMIPayment;