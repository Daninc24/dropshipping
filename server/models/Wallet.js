const mongoose = require('mongoose');

const WalletTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['credit', 'debit']
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  description: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['mpesa', 'refund', 'cashback', 'admin_credit', 'order_payment', 'withdrawal'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  metadata: {
    orderId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order'
    },
    mpesaReceiptNumber: String,
    adminId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  currency: {
    type: String,
    default: 'KES'
  },
  transactions: [WalletTransactionSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  lastTransactionAt: Date
}, {
  timestamps: true
});

// Create indexes
WalletSchema.index({ user: 1 });
WalletSchema.index({ 'transactions.reference': 1 });
WalletSchema.index({ 'transactions.createdAt': -1 });

// Add transaction method
WalletSchema.methods.addTransaction = function(transactionData) {
  const { type, amount, description, reference, source, metadata = {} } = transactionData;
  
  // Validate balance for debit transactions
  if (type === 'debit' && this.balance < amount) {
    throw new Error('Insufficient wallet balance');
  }
  
  // Create transaction
  const transaction = {
    type,
    amount,
    description,
    reference,
    source,
    metadata,
    status: 'completed'
  };
  
  // Update balance
  if (type === 'credit') {
    this.balance += amount;
  } else {
    this.balance -= amount;
  }
  
  // Add transaction to history
  this.transactions.push(transaction);
  this.lastTransactionAt = new Date();
  
  return this.save();
};

// Get transaction history with pagination
WalletSchema.methods.getTransactionHistory = function(page = 1, limit = 10) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const transactions = this.transactions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(startIndex, endIndex);
  
  return {
    transactions,
    pagination: {
      page,
      limit,
      total: this.transactions.length,
      totalPages: Math.ceil(this.transactions.length / limit),
      hasNext: endIndex < this.transactions.length,
      hasPrev: page > 1
    }
  };
};

// Virtual for formatted balance
WalletSchema.virtual('formattedBalance').get(function() {
  return `${this.currency} ${this.balance.toLocaleString()}`;
});

// Ensure virtual fields are serialized
WalletSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Wallet', WalletSchema);