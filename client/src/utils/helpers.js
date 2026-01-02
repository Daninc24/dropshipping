// Format currency for Kenya (KES)
export const formatCurrency = (amount, currency = 'KES') => {
  if (currency === 'KES') {
    return `KES ${amount.toLocaleString()}`;
  }
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format phone number for Kenya
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format Kenyan numbers
  if (digits.startsWith('254')) {
    const number = digits.slice(3);
    return `+254 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  } else if (digits.startsWith('0')) {
    const number = digits.slice(1);
    return `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  }
  
  return phone;
};

// Validate Kenyan phone number
export const isValidKenyanPhone = (phone) => {
  const kenyanPhoneRegex = /^(\+254|254|0)[17]\d{8}$/;
  const cleanPhone = phone.replace(/\s/g, '');
  return kenyanPhoneRegex.test(cleanPhone);
};

// Generate fallback image URL
export const getFallbackImage = (text, width = 500, height = 500) => {
  // Create a simple colored rectangle with text as fallback
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = '#6b7280';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL();
};

// Handle image loading errors
export const handleImageError = (event, fallbackText) => {
  const img = event.target;
  if (!img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = 'true';
    img.src = getFallbackImage(fallbackText || 'Image');
  }
};

// Format date for Kenya timezone
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('en-KE', defaultOptions);
};

// Format date and time for Kenya
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-KE', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate delivery fee based on order total and zone
export const calculateDeliveryFee = (orderTotal, zone) => {
  if (!zone) return 0;
  
  if (orderTotal >= zone.freeDeliveryThreshold) {
    return 0;
  }
  
  return zone.deliveryFee;
};

// Calculate VAT (16% for Kenya)
export const calculateVAT = (amount, rate = 0.16) => {
  return Math.round(amount * rate);
};

// Generate order number
export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get time ago string
export const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get Kenya counties list
export const getKenyaCounties = () => [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

// Check if user is online
export const isOnline = () => {
  return navigator.onLine;
};

// Local storage helpers with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};