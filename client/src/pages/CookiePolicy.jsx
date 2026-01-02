import { Helmet } from 'react-helmet-async'
import { 
  ShieldCheckIcon,
  CogIcon,
  InformationCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const CookiePolicy = () => {
  const cookieTypes = [
    {
      type: 'Essential Cookies',
      icon: ShieldCheckIcon,
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      examples: ['Authentication', 'Security', 'Shopping cart', 'Form submissions'],
      canDisable: false
    },
    {
      type: 'Performance Cookies',
      icon: CogIcon,
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: ['Google Analytics', 'Page load times', 'Error tracking', 'Usage statistics'],
      canDisable: true
    },
    {
      type: 'Functional Cookies',
      icon: InformationCircleIcon,
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: ['Language preferences', 'Region settings', 'Accessibility options', 'Chat support'],
      canDisable: true
    },
    {
      type: 'Marketing Cookies',
      icon: DocumentTextIcon,
      description: 'These cookies are used to deliver relevant advertisements and track campaigns.',
      examples: ['Facebook Pixel', 'Google Ads', 'Retargeting', 'Social media integration'],
      canDisable: true
    }
  ]

  const thirdPartyServices = [
    {
      service: 'Google Analytics',
      purpose: 'Website analytics and performance tracking',
      dataCollected: 'Page views, user behavior, device information',
      retention: '26 months',
      optOut: 'https://tools.google.com/dlpage/gaoptout'
    },
    {
      service: 'Facebook Pixel',
      purpose: 'Advertising and conversion tracking',
      dataCollected: 'Page visits, purchases, user interactions',
      retention: '180 days',
      optOut: 'https://www.facebook.com/settings/?tab=ads'
    },
    {
      service: 'Safaricom M-Pesa',
      purpose: 'Payment processing and fraud prevention',
      dataCollected: 'Transaction data, phone numbers',
      retention: '7 years (regulatory requirement)',
      optOut: 'Cannot opt out for payment processing'
    },
    {
      service: 'Cloudinary',
      purpose: 'Image optimization and delivery',
      dataCollected: 'Image requests, device capabilities',
      retention: '30 days',
      optOut: 'Automatic (no personal data stored)'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Cookie Policy - E-Shop Kenya</title>
        <meta name="description" content="Learn about how E-Shop Kenya uses cookies to improve your browsing experience. Manage your cookie preferences and understand your privacy options." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-primary-100" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Cookie Policy
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Learn how we use cookies to improve your experience on E-Shop Kenya 
                and how you can manage your preferences.
              </p>
            </div>
          </div>
        </div>

        {/* What Are Cookies */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What Are Cookies?
            </h2>
            <div className="prose prose-lg text-gray-600">
              <p>
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better browsing experience by remembering your preferences, 
                keeping you logged in, and helping us understand how you use our site.
              </p>
              <p>
                We use cookies in accordance with Kenyan data protection laws and international best practices. 
                This policy explains what cookies we use, why we use them, and how you can manage them.
              </p>
            </div>
          </div>
        </div>

        {/* Types of Cookies */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Types of Cookies We Use
              </h2>
              <p className="text-lg text-gray-600">
                We use different types of cookies for various purposes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cookieTypes.map((cookie, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <cookie.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {cookie.type}
                      </h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        cookie.canDisable 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cookie.canDisable ? 'Optional' : 'Required'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {cookie.description}
                  </p>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Examples:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {cookie.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Third Party Services */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Third-Party Services
            </h2>
            <p className="text-lg text-gray-600">
              We work with trusted partners who may also set cookies
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Collected
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Retention
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opt Out
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {thirdPartyServices.map((service, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{service.service}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{service.purpose}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{service.dataCollected}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{service.retention}</div>
                      </td>
                      <td className="px-6 py-4">
                        {service.optOut.startsWith('http') ? (
                          <a
                            href={service.optOut}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm"
                          >
                            Opt Out Link
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">{service.optOut}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Managing Cookies */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Managing Your Cookie Preferences
              </h2>
              <p className="text-lg text-gray-600">
                You have control over how cookies are used on our site
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Browser Settings
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Chrome</h4>
                    <p className="text-sm text-gray-600">
                      Settings → Privacy and security → Cookies and other site data
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Firefox</h4>
                    <p className="text-sm text-gray-600">
                      Options → Privacy & Security → Cookies and Site Data
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Safari</h4>
                    <p className="text-sm text-gray-600">
                      Preferences → Privacy → Manage Website Data
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Edge</h4>
                    <p className="text-sm text-gray-600">
                      Settings → Cookies and site permissions → Cookies and site data
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Our Cookie Preferences
                </h3>
                <div className="bg-primary-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    You can manage your cookie preferences for our website using our 
                    cookie preference center. This allows you to accept or reject 
                    different types of cookies.
                  </p>
                  <button className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors">
                    Manage Cookie Preferences
                  </button>
                </div>

                <div className="mt-6 bg-yellow-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-2">Important Note</h4>
                  <p className="text-sm text-gray-600">
                    Disabling certain cookies may affect the functionality of our website. 
                    Essential cookies cannot be disabled as they are necessary for the 
                    site to work properly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Apps */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gray-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mobile App Data Collection
            </h2>
            <p className="text-gray-600 mb-4">
              Our mobile apps may collect similar information through app-specific technologies. 
              This includes:
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>• Device identifiers and app usage analytics</li>
              <li>• Push notification preferences</li>
              <li>• Location data (with your permission)</li>
              <li>• Crash reports and performance data</li>
            </ul>
            <p className="text-sm text-gray-500">
              You can manage these preferences through your device settings or within the app itself.
            </p>
          </div>
        </div>

        {/* Updates and Contact */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Policy Updates
                </h2>
                <p className="text-gray-300 mb-4">
                  We may update this Cookie Policy from time to time to reflect changes 
                  in our practices or for legal reasons. We'll notify you of any 
                  significant changes.
                </p>
                <p className="text-sm text-gray-400">
                  Last updated: January 2, 2025
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Questions About Cookies?
                </h2>
                <p className="text-gray-300 mb-6">
                  If you have any questions about our use of cookies or this policy, 
                  please contact our privacy team.
                </p>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    Email: privacy@eshop.co.ke
                  </p>
                  <p className="text-gray-300">
                    Phone: +254 700 123 456
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CookiePolicy