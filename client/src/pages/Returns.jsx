import { Helmet } from 'react-helmet-async'
import { 
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  TruckIcon,
  DocumentTextIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const Returns = () => {
  const returnSteps = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Log into your account and select the item you want to return',
      icon: DocumentTextIcon
    },
    {
      step: 2,
      title: 'Choose Reason',
      description: 'Select the reason for return and provide any additional details',
      icon: CheckCircleIcon
    },
    {
      step: 3,
      title: 'Schedule Pickup',
      description: 'We\'ll arrange free pickup from your location or provide return instructions',
      icon: TruckIcon
    },
    {
      step: 4,
      title: 'Get Refund',
      description: 'Once we receive and inspect the item, your refund will be processed',
      icon: CurrencyDollarIcon
    }
  ]

  const returnableItems = [
    { item: 'Electronics', returnable: true, note: 'Must be in original packaging with all accessories' },
    { item: 'Clothing & Fashion', returnable: true, note: 'Must be unworn with tags attached' },
    { item: 'Books & Media', returnable: true, note: 'Must be in original condition' },
    { item: 'Home & Garden', returnable: true, note: 'Must be unused and in original packaging' },
    { item: 'Beauty Products', returnable: false, note: 'For hygiene reasons, opened beauty products cannot be returned' },
    { item: 'Perishable Items', returnable: false, note: 'Food items and perishables cannot be returned' },
    { item: 'Custom Items', returnable: false, note: 'Personalized or custom-made items cannot be returned' },
    { item: 'Digital Products', returnable: false, note: 'Downloaded software and digital content cannot be returned' }
  ]

  const refundMethods = [
    {
      method: 'M-Pesa',
      timeframe: '3-5 business days',
      description: 'Refund directly to your M-Pesa account',
      popular: true
    },
    {
      method: 'Bank Transfer',
      timeframe: '5-7 business days',
      description: 'Direct transfer to your bank account',
      popular: false
    },
    {
      method: 'Store Credit',
      timeframe: 'Instant',
      description: 'Credit to your E-Shop wallet for future purchases',
      popular: false
    },
    {
      method: 'Original Payment Method',
      timeframe: '5-10 business days',
      description: 'Refund to the card or method used for purchase',
      popular: false
    }
  ]

  const returnReasons = [
    'Item not as described',
    'Wrong item received',
    'Damaged during shipping',
    'Defective product',
    'Changed my mind',
    'Size/fit issues',
    'Quality concerns',
    'Arrived too late'
  ]

  return (
    <>
      <Helmet>
        <title>Returns & Refunds Policy - E-Shop Kenya</title>
        <meta name="description" content="Easy returns within 14 days. Learn about our return policy, process, and refund options. Free pickup and hassle-free returns across Kenya." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <ArrowPathIcon className="h-16 w-16 mx-auto mb-4 text-primary-100" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Returns & Refunds
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Easy returns within 14 days. Free pickup, hassle-free process, 
                and quick refunds to your preferred method.
              </p>
            </div>
          </div>
        </div>

        {/* Return Policy Overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Return Policy
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We want you to be completely satisfied with your purchase. 
              If you're not happy, we make returns simple and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                14-Day Return Window
              </h3>
              <p className="text-gray-600">
                Return items within 14 days of delivery for a full refund
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Free Pickup
              </h3>
              <p className="text-gray-600">
                We'll collect the item from your location at no extra cost
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick Refunds
              </h3>
              <p className="text-gray-600">
                Get your money back within 3-5 business days via M-Pesa
              </p>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How to Return an Item
              </h2>
              <p className="text-lg text-gray-600">
                Simple 4-step process to return your items
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {returnSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-primary-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors">
                Start a Return
              </button>
            </div>
          </div>
        </div>

        {/* What Can Be Returned */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Can Be Returned?
            </h2>
            <p className="text-lg text-gray-600">
              Check if your item is eligible for return
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Category
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Returnable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conditions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {returnableItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.item}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {item.returnable ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-500 mx-auto" />
                        ) : (
                          <XCircleIcon className="h-6 w-6 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{item.note}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Refund Methods */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Refund Options
              </h2>
              <p className="text-lg text-gray-600">
                Choose how you'd like to receive your refund
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {refundMethods.map((method, index) => (
                <div 
                  key={index} 
                  className={`bg-gray-50 rounded-lg p-6 relative ${
                    method.popular ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  {method.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {method.method}
                    </h3>
                    <div className="text-sm text-primary-600 font-medium mb-3">
                      {method.timeframe}
                    </div>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Return Reasons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Common Return Reasons
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We understand that sometimes things don't work out. 
                Here are the most common reasons customers return items:
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {returnReasons.map((reason, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-8">
              <ShieldCheckIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Quality Guarantee
              </h3>
              <p className="text-gray-600 text-center mb-6">
                If you receive a defective or damaged item, we'll not only 
                replace it for free but also cover all return shipping costs.
              </p>
              <div className="text-center">
                <button className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors">
                  Report Quality Issue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Return FAQ
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What if I miss the 14-day return window?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Unfortunately, we cannot accept returns after 14 days. However, 
                    if the item is defective, warranty terms may still apply.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Do I need the original packaging?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes, items should be returned in their original packaging with 
                    all accessories and documentation included.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I return sale items?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes, sale items can be returned within the same 14-day period, 
                    subject to the same conditions as regular-priced items.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How long does the refund take?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    M-Pesa refunds typically take 3-5 business days. Bank transfers 
                    and card refunds may take 5-10 business days.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What if the item was a gift?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Gift recipients can return items for store credit. The original 
                    purchaser can request a refund to their payment method.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I exchange instead of return?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We don't offer direct exchanges. Please return the item for a 
                    refund and place a new order for the desired item.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Need Help with a Return?
              </h2>
              <p className="text-gray-300 mb-6">
                Our customer service team is here to help make your return process smooth.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors">
                  Start Return Process
                </button>
                <a
                  href="mailto:returns@eshop.co.ke"
                  className="text-gray-300 hover:text-white"
                >
                  Email: returns@eshop.co.ke
                </a>
                <a
                  href="tel:+254700123456"
                  className="text-gray-300 hover:text-white"
                >
                  Call: +254 700 123 456
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Returns