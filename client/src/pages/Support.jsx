import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  UserGroupIcon,
  CreditCardIcon,
  TruckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const Support = () => {
  const [selectedCategory, setSelectedCategory] = useState('general')

  const supportOptions = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      action: 'Start Chat',
      primary: true
    },
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      description: 'Speak directly with our support agents',
      availability: 'Mon-Fri 8AM-8PM EAT',
      action: 'Call Now',
      phone: '+254 700 123 456'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24 hours',
      action: 'Send Email',
      email: 'support@eshop.co.ke'
    },
    {
      icon: VideoCameraIcon,
      title: 'Video Call',
      description: 'Schedule a video call for complex issues',
      availability: 'By appointment',
      action: 'Schedule Call'
    }
  ]

  const faqCategories = [
    { id: 'general', name: 'General', icon: QuestionMarkCircleIcon },
    { id: 'orders', name: 'Orders', icon: DocumentTextIcon },
    { id: 'payments', name: 'Payments', icon: CreditCardIcon },
    { id: 'delivery', name: 'Delivery', icon: TruckIcon },
    { id: 'returns', name: 'Returns', icon: ArrowPathIcon },
    { id: 'account', name: 'Account', icon: UserGroupIcon }
  ]

  const faqs = {
    general: [
      {
        question: 'How do I create an account?',
        answer: 'Click on "Register" in the top right corner, fill in your details including phone number for M-Pesa verification, and verify your email address.'
      },
      {
        question: 'Is E-Shop Kenya available in my area?',
        answer: 'Yes! We deliver to all 47 counties in Kenya. Check our delivery zones page for specific areas and delivery times.'
      },
      {
        question: 'How secure is my personal information?',
        answer: 'We use industry-standard encryption and security measures to protect your data. We never share your information with third parties without consent.'
      }
    ],
    orders: [
      {
        question: 'How do I track my order?',
        answer: 'After placing an order, you\'ll receive a tracking number via SMS and email. You can also track orders in your account dashboard.'
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'You can cancel orders within 30 minutes of placement. For modifications, contact our support team immediately.'
      },
      {
        question: 'What if my order is damaged or incorrect?',
        answer: 'Contact us within 48 hours of delivery. We\'ll arrange a replacement or refund for damaged or incorrect items.'
      }
    ],
    payments: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept M-Pesa, Visa/Mastercard, and Cash on Delivery. M-Pesa is our most popular and secure payment method.'
      },
      {
        question: 'Is M-Pesa payment secure?',
        answer: 'Yes, our M-Pesa integration uses Safaricom\'s secure STK Push technology. Your payment is processed directly through M-Pesa.'
      },
      {
        question: 'Can I get a refund to my M-Pesa account?',
        answer: 'Yes, refunds are processed back to your original payment method, including M-Pesa, within 3-5 business days.'
      }
    ],
    delivery: [
      {
        question: 'How long does delivery take?',
        answer: 'Delivery times vary by location: Nairobi (same day), major towns (1-2 days), remote areas (3-5 days).'
      },
      {
        question: 'Do you deliver to my county?',
        answer: 'Yes, we deliver to all 47 counties in Kenya. Remote areas may have longer delivery times.'
      },
      {
        question: 'What are the delivery charges?',
        answer: 'Delivery is free for orders over KES 2,000. Below that, charges range from KES 200-500 depending on location.'
      }
    ],
    returns: [
      {
        question: 'What is your return policy?',
        answer: 'We offer 14-day returns for most items. Items must be unused and in original packaging.'
      },
      {
        question: 'How do I return an item?',
        answer: 'Go to your orders page, select the item to return, choose a reason, and we\'ll arrange pickup or provide return instructions.'
      },
      {
        question: 'When will I get my refund?',
        answer: 'Refunds are processed within 3-5 business days after we receive and inspect the returned item.'
      }
    ],
    account: [
      {
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page, enter your email or phone number, and follow the reset instructions.'
      },
      {
        question: 'Can I change my delivery address?',
        answer: 'Yes, you can add, edit, or delete delivery addresses in your account settings under "Addresses".'
      },
      {
        question: 'How do I delete my account?',
        answer: 'Contact our support team to request account deletion. Note that this action is permanent and cannot be undone.'
      }
    ]
  }

  const handleContactMethod = (method, contact) => {
    switch (method) {
      case 'chat':
        // In a real app, this would open a chat widget
        alert('Chat feature would open here')
        break
      case 'phone':
        window.open(`tel:${contact}`)
        break
      case 'email':
        window.open(`mailto:${contact}`)
        break
      case 'video':
        alert('Video call scheduling would open here')
        break
      default:
        break
    }
  }

  return (
    <>
      <Helmet>
        <title>Support & Help Center - E-Shop Kenya</title>
        <meta name="description" content="Get help with your E-Shop Kenya account, orders, payments, and more. 24/7 support available via chat, phone, and email." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                How Can We Help?
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
                Get support for your orders, payments, delivery, and account questions. 
                We're here to help 24/7.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for help articles..."
                    className="w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="absolute right-2 top-2 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600">
              Choose the best way to reach us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg p-6 text-center shadow-sm border hover:shadow-md transition-shadow ${
                  option.primary ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  option.primary ? 'bg-primary-600' : 'bg-gray-100'
                }`}>
                  <option.icon className={`h-8 w-8 ${
                    option.primary ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3">
                  {option.description}
                </p>
                
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {option.availability}
                </div>
                
                <button
                  onClick={() => handleContactMethod(
                    option.title.toLowerCase().includes('chat') ? 'chat' :
                    option.title.toLowerCase().includes('phone') ? 'phone' :
                    option.title.toLowerCase().includes('email') ? 'email' : 'video',
                    option.phone || option.email
                  )}
                  className={`w-full px-4 py-2 rounded-md transition-colors ${
                    option.primary 
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Find quick answers to common questions
              </p>
            </div>

            {/* FAQ Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs[selectedCategory]?.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border-t border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Emergency Support
              </h3>
              <p className="text-red-600 mb-4">
                For urgent issues with payments or security concerns
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <a
                  href="tel:+254700123456"
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Emergency Hotline: +254 700 123 456
                </a>
                <a
                  href="mailto:emergency@eshop.co.ke"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  emergency@eshop.co.ke
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Support