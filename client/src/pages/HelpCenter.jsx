import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { 
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  TruckIcon,
  ArrowPathIcon,
  UserIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: QuestionMarkCircleIcon,
      description: 'Learn the basics of using E-Shop Kenya',
      articles: [
        'How to create an account',
        'Setting up your profile',
        'Adding delivery addresses',
        'Understanding our platform'
      ]
    },
    {
      id: 'shopping',
      title: 'Shopping & Orders',
      icon: ShoppingCartIcon,
      description: 'Everything about browsing and ordering',
      articles: [
        'How to search for products',
        'Adding items to cart',
        'Placing an order',
        'Order tracking',
        'Modifying orders'
      ]
    },
    {
      id: 'payments',
      title: 'Payments & M-Pesa',
      icon: CreditCardIcon,
      description: 'Payment methods and M-Pesa integration',
      articles: [
        'M-Pesa payment guide',
        'Card payment security',
        'Cash on delivery',
        'Payment failures',
        'Refunds and cancellations'
      ]
    },
    {
      id: 'delivery',
      title: 'Delivery & Shipping',
      icon: TruckIcon,
      description: 'Delivery zones, times, and tracking',
      articles: [
        'Delivery areas in Kenya',
        'Delivery timeframes',
        'Tracking your package',
        'Delivery charges',
        'Failed delivery attempts'
      ]
    },
    {
      id: 'returns',
      title: 'Returns & Exchanges',
      icon: ArrowPathIcon,
      description: 'Return policy and process',
      articles: [
        'Return policy overview',
        'How to return items',
        'Exchange process',
        'Refund timeline',
        'Return shipping'
      ]
    },
    {
      id: 'account',
      title: 'Account Management',
      icon: UserIcon,
      description: 'Managing your account and preferences',
      articles: [
        'Password reset',
        'Email preferences',
        'Address management',
        'Order history',
        'Account deletion'
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: ShieldCheckIcon,
      description: 'Keeping your account secure',
      articles: [
        'Account security tips',
        'Privacy policy explained',
        'Data protection',
        'Suspicious activity',
        'Two-factor authentication'
      ]
    }
  ]

  const popularArticles = [
    {
      title: 'How to pay with M-Pesa',
      category: 'Payments',
      views: '15.2K views',
      description: 'Step-by-step guide to making payments using M-Pesa STK Push'
    },
    {
      title: 'Delivery areas and charges',
      category: 'Delivery',
      views: '12.8K views',
      description: 'Complete list of delivery zones across all 47 counties'
    },
    {
      title: 'How to track my order',
      category: 'Orders',
      views: '10.5K views',
      description: 'Track your order status from confirmation to delivery'
    },
    {
      title: 'Return policy and process',
      category: 'Returns',
      views: '8.9K views',
      description: 'Understanding our 14-day return policy and how to return items'
    },
    {
      title: 'Account security best practices',
      category: 'Security',
      views: '7.3K views',
      description: 'Keep your account safe with these security tips'
    }
  ]

  const quickActions = [
    {
      title: 'Track Order',
      description: 'Enter your order number to track status',
      icon: TruckIcon,
      action: 'Track Now'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: ChatBubbleLeftRightIcon,
      action: 'Chat Now'
    },
    {
      title: 'Return Item',
      description: 'Start a return for your recent order',
      icon: ArrowPathIcon,
      action: 'Start Return'
    },
    {
      title: 'Report Issue',
      description: 'Report a problem with your order',
      icon: PhoneIcon,
      action: 'Report'
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    // In a real app, this would search through help articles
    console.log('Searching for:', searchQuery)
  }

  return (
    <>
      <Helmet>
        <title>Help Center - E-Shop Kenya</title>
        <meta name="description" content="Find answers to your questions about shopping, payments, delivery, and more. Get help with your E-Shop Kenya account." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Search */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Help Center
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
                Find answers to your questions about shopping, payments, delivery, and more.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for help articles..."
                    className="w-full pl-12 pr-24 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickActions.map((action, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow text-center">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <action.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm">
                  {action.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Popular Help Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {popularArticles.map((article, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {article.views}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {article.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Help Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => (
              <div 
                key={category.id} 
                className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <category.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.articles.length} articles
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                
                <ul className="space-y-2">
                  {category.articles.slice(0, 3).map((article, index) => (
                    <li key={index} className="text-sm text-gray-700 hover:text-primary-600 cursor-pointer">
                      • {article}
                    </li>
                  ))}
                  {category.articles.length > 3 && (
                    <li className="text-sm text-primary-600 font-medium">
                      + {category.articles.length - 3} more articles
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Still Need Help?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you 24/7.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors">
                  Start Live Chat
                </button>
                <a
                  href="tel:+254700123456"
                  className="border border-gray-600 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Call Support
                </a>
                <a
                  href="mailto:support@eshop.co.ke"
                  className="text-gray-300 hover:text-white"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HelpCenter