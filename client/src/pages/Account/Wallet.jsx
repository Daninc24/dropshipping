import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  WalletIcon, 
  CreditCardIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, [currentPage]);

  const fetchWallet = async () => {
    try {
      const response = await api.get('/wallet');
      setWallet(response.data.data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const response = await api.get(`/wallet/transactions?page=${currentPage}&limit=10`);
      setTransactions(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const getTransactionIcon = (type, source) => {
    if (type === 'credit') {
      return <ArrowDownIcon className="h-5 w-5 text-green-500" />;
    }
    return <ArrowUpIcon className="h-5 w-5 text-red-500" />;
  };

  const getTransactionColor = (type) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  const getSourceLabel = (source) => {
    const labels = {
      mpesa: 'M-Pesa',
      refund: 'Refund',
      cashback: 'Cashback',
      admin_credit: 'Admin Credit',
      order_payment: 'Order Payment',
      withdrawal: 'Withdrawal'
    };
    return labels[source] || source;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Wallet
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your wallet balance and view transaction history
        </p>
      </div>

      {/* Wallet Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <WalletIcon className="h-8 w-8 mr-3" />
              <h2 className="text-xl font-semibold">Wallet Balance</h2>
            </div>
            <div className="text-4xl font-bold mb-2">
              {wallet ? formatCurrency(wallet.balance) : 'KES 0'}
            </div>
            <p className="text-blue-100">Available for purchases</p>
          </div>
          <div className="text-right">
            <CreditCardIcon className="h-16 w-16 opacity-20" />
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-fit mx-auto mb-3">
              <ArrowDownIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Add Money
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Top up via M-Pesa
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-fit mx-auto mb-3">
              <CreditCardIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Pay with Wallet
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use for orders
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-fit mx-auto mb-3">
              <ArrowUpIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Withdraw
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              To M-Pesa
            </p>
          </div>
        </motion.button>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Transaction History
          </h2>
        </div>

        <div className="p-6">
          {transactionsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <WalletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No transactions yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      {getTransactionIcon(transaction.type, transaction.source)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{getSourceLabel(transaction.source)}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1 capitalize">{transaction.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.reference}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'text-white bg-blue-600 border border-blue-600'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;