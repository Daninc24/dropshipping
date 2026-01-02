import { useState } from 'react';
import { motion } from 'framer-motion';
import { DevicePhoneMobileIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

const MpesaPayment = ({ order, onPaymentSuccess, onPaymentError }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input'); // input, processing, success, error
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [error, setError] = useState('');

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as Kenyan number
    if (digits.startsWith('254')) {
      return digits.slice(0, 12);
    } else if (digits.startsWith('0')) {
      return '254' + digits.slice(1, 10);
    } else if (digits.startsWith('7') || digits.startsWith('1')) {
      return '254' + digits.slice(0, 9);
    }
    
    return digits.slice(0, 12);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const displayPhoneNumber = (phone) => {
    if (phone.startsWith('254')) {
      return `+${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`;
    }
    return phone;
  };

  const validatePhoneNumber = (phone) => {
    const kenyanPhoneRegex = /^254[17]\d{8}$/;
    return kenyanPhoneRegex.test(phone);
  };

  const handlePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number');
      return;
    }

    setLoading(true);
    setError('');
    setStep('processing');

    try {
      const response = await api.post('/payments/mpesa/stk-push', {
        orderId: order._id,
        phoneNumber,
        amount: order.totalPrice
      });

      setCheckoutRequestId(response.data.data.checkoutRequestId);
      
      // Start polling for payment status
      pollPaymentStatus(order._id);
      
    } catch (error) {
      console.error('M-Pesa payment error:', error);
      setError(error.response?.data?.message || 'Failed to initiate payment');
      setStep('error');
      onPaymentError?.(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (orderId) => {
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await api.get(`/payments/status/${orderId}`);
        const { paymentStatus } = response.data.data;

        if (paymentStatus === 'completed') {
          setStep('success');
          onPaymentSuccess?.(response.data.data);
          return;
        } else if (paymentStatus === 'failed') {
          setStep('error');
          setError('Payment was cancelled or failed');
          onPaymentError?.('Payment failed');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setStep('error');
          setError('Payment timeout. Please try again.');
          onPaymentError?.('Payment timeout');
        }
      } catch (error) {
        console.error('Payment status check error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        } else {
          setStep('error');
          setError('Unable to verify payment status');
          onPaymentError?.('Payment verification failed');
        }
      }
    };

    poll();
  };

  const renderStep = () => {
    switch (step) {
      case 'input':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-fit mx-auto mb-4">
                <DevicePhoneMobileIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Pay with M-Pesa
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your M-Pesa number to complete payment
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Amount to pay:</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                M-Pesa Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={displayPhoneNumber(phoneNumber)}
                  onChange={handlePhoneChange}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <img
                    src="/images/mpesa-logo.png"
                    alt="M-Pesa"
                    className="h-6 w-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={loading || !phoneNumber}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay ${formatCurrency(order.totalPrice)}`
              )}
            </button>

            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              You will receive an M-Pesa prompt on your phone. Enter your M-Pesa PIN to complete the payment.
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-fit mx-auto">
              <DevicePhoneMobileIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Check Your Phone
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We've sent an M-Pesa payment request to
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {displayPhoneNumber(phoneNumber)}
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Next steps:</strong>
                <br />
                1. Check your phone for the M-Pesa prompt
                <br />
                2. Enter your M-Pesa PIN
                <br />
                3. Wait for confirmation
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Waiting for payment confirmation...</span>
            </div>

            <button
              onClick={() => setStep('input')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Use different number
            </button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-fit mx-auto"
            >
              <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </motion.div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your M-Pesa payment has been confirmed
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <div className="text-sm text-green-800 dark:text-green-200">
                <p><strong>Amount Paid:</strong> {formatCurrency(order.totalPrice)}</p>
                <p><strong>Phone:</strong> {displayPhoneNumber(phoneNumber)}</p>
                <p><strong>Order:</strong> {order.orderNumber}</p>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full w-fit mx-auto">
              <DevicePhoneMobileIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
            </div>

            <button
              onClick={() => {
                setStep('input');
                setError('');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      {renderStep()}
    </div>
  );
};

export default MpesaPayment;