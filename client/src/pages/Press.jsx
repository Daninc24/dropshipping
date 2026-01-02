import { Helmet } from 'react-helmet-async'
import { 
  NewspaperIcon, 
  CalendarIcon, 
  DocumentTextIcon,
  PhotoIcon,
  UserIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

const Press = () => {
  const pressReleases = [
    {
      id: 1,
      title: 'E-Shop Kenya Launches Revolutionary M-Pesa Integration for Seamless Shopping',
      date: '2024-01-15',
      excerpt: 'New payment system makes online shopping more accessible to millions of Kenyans, supporting local businesses and digital economy growth.',
      category: 'Product Launch'
    },
    {
      id: 2,
      title: 'E-Shop Kenya Expands Delivery Network to All 47 Counties',
      date: '2024-01-10',
      excerpt: 'Complete nationwide coverage ensures every Kenyan can access quality products with reliable delivery services.',
      category: 'Expansion'
    },
    {
      id: 3,
      title: 'Partnership with Local Artisans Brings Authentic Kenyan Products Online',
      date: '2024-01-05',
      excerpt: 'New marketplace features showcase traditional crafts, supporting local communities and preserving cultural heritage.',
      category: 'Partnership'
    },
    {
      id: 4,
      title: 'E-Shop Kenya Achieves 1 Million Active Users Milestone',
      date: '2023-12-20',
      excerpt: 'Platform growth demonstrates increasing trust in digital commerce solutions across Kenya.',
      category: 'Milestone'
    }
  ]

  const mediaKit = [
    {
      title: 'Company Logo Pack',
      description: 'High-resolution logos in various formats (PNG, SVG, EPS)',
      type: 'Images',
      icon: PhotoIcon
    },
    {
      title: 'Brand Guidelines',
      description: 'Complete brand identity guidelines and usage instructions',
      type: 'PDF',
      icon: DocumentTextIcon
    },
    {
      title: 'Product Screenshots',
      description: 'High-quality screenshots of our platform and mobile app',
      type: 'Images',
      icon: PhotoIcon
    },
    {
      title: 'Executive Bios',
      description: 'Professional biographies and headshots of key executives',
      type: 'PDF',
      icon: UserIcon
    }
  ]

  const awards = [
    {
      year: '2024',
      title: 'Best E-Commerce Platform - Kenya Digital Awards',
      description: 'Recognized for innovation in digital commerce and customer experience'
    },
    {
      year: '2023',
      title: 'Fintech Innovation Award - East Africa Tech Summit',
      description: 'Honored for M-Pesa integration and financial inclusion initiatives'
    },
    {
      year: '2023',
      title: 'Rising Star - African Business Awards',
      description: 'Acknowledged as a promising startup driving economic growth'
    }
  ]

  const keyStats = [
    { label: 'Active Users', value: '1M+' },
    { label: 'Partner Merchants', value: '10K+' },
    { label: 'Counties Served', value: '47' },
    { label: 'Daily Transactions', value: '50K+' }
  ]

  return (
    <>
      <Helmet>
        <title>Press & Media - E-Shop Kenya</title>
        <meta name="description" content="Latest news, press releases, and media resources from E-Shop Kenya. Download our media kit and stay updated with our latest announcements." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Press & Media
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Stay updated with the latest news, announcements, and media resources from E-Shop Kenya.
              </p>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {keyStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Press Releases */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Press Releases
            </h2>
            <p className="text-lg text-gray-600">
              Recent announcements and company news
            </p>
          </div>

          <div className="space-y-6">
            {pressReleases.map((release) => (
              <div key={release.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm font-medium">
                        {release.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(release.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {release.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {release.excerpt}
                    </p>
                    
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      Read Full Release →
                    </button>
                  </div>
                  
                  <div className="ml-6">
                    <NewspaperIcon className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Kit */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Media Kit
              </h2>
              <p className="text-lg text-gray-600">
                Download our media resources for press coverage
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mediaKit.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {item.description}
                  </p>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm">
                    Download {item.type}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Awards & Recognition
            </h2>
            <p className="text-lg text-gray-600">
              Industry recognition for our innovation and impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  {award.year}
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {award.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {award.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Press Contact */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Press Inquiries
                </h2>
                <p className="text-gray-300 mb-8">
                  For media inquiries, interview requests, or additional information, 
                  please contact our press team.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-primary-400" />
                    <span>press@eshop.co.ke</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-primary-400" />
                    <span>Sarah Wanjiku, Communications Manager</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Quick Facts
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Founded: 2023</li>
                  <li>• Headquarters: Nairobi, Kenya</li>
                  <li>• Industry: E-commerce, Fintech</li>
                  <li>• Coverage: All 47 counties in Kenya</li>
                  <li>• Payment Methods: M-Pesa, Card, Cash on Delivery</li>
                  <li>• Mission: Democratizing commerce across Kenya</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Press