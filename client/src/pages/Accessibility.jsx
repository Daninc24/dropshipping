import { Helmet } from 'react-helmet-async'
import { 
  EyeIcon,
  SpeakerWaveIcon,
  HandRaisedIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const Accessibility = () => {
  const accessibilityFeatures = [
    {
      icon: EyeIcon,
      title: 'Visual Accessibility',
      features: [
        'High contrast color schemes',
        'Scalable text up to 200%',
        'Alt text for all images',
        'Clear visual hierarchy',
        'Focus indicators for keyboard navigation'
      ]
    },
    {
      icon: SpeakerWaveIcon,
      title: 'Audio & Screen Readers',
      features: [
        'Screen reader compatibility',
        'Semantic HTML structure',
        'ARIA labels and descriptions',
        'Skip navigation links',
        'Descriptive link text'
      ]
    },
    {
      icon: HandRaisedIcon,
      title: 'Motor & Mobility',
      features: [
        'Full keyboard navigation',
        'Large clickable areas',
        'No time-sensitive actions',
        'Drag and drop alternatives',
        'Voice control compatibility'
      ]
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile Accessibility',
      features: [
        'Touch-friendly interface',
        'Responsive design',
        'Gesture alternatives',
        'Portrait and landscape support',
        'Mobile screen reader support'
      ]
    }
  ]

  const wcagCompliance = [
    {
      level: 'WCAG 2.1 Level A',
      status: 'compliant',
      description: 'Basic accessibility requirements met'
    },
    {
      level: 'WCAG 2.1 Level AA',
      status: 'compliant',
      description: 'Enhanced accessibility standards achieved'
    },
    {
      level: 'WCAG 2.1 Level AAA',
      status: 'partial',
      description: 'Working towards highest accessibility standards'
    }
  ]

  const assistiveTechnologies = [
    {
      name: 'JAWS',
      type: 'Screen Reader',
      compatibility: 'Full Support',
      platform: 'Windows'
    },
    {
      name: 'NVDA',
      type: 'Screen Reader',
      compatibility: 'Full Support',
      platform: 'Windows'
    },
    {
      name: 'VoiceOver',
      type: 'Screen Reader',
      compatibility: 'Full Support',
      platform: 'macOS/iOS'
    },
    {
      name: 'TalkBack',
      type: 'Screen Reader',
      compatibility: 'Full Support',
      platform: 'Android'
    },
    {
      name: 'Dragon NaturallySpeaking',
      type: 'Voice Control',
      compatibility: 'Supported',
      platform: 'Windows'
    },
    {
      name: 'Switch Control',
      type: 'Switch Navigation',
      compatibility: 'Supported',
      platform: 'iOS/Android'
    }
  ]

  const keyboardShortcuts = [
    { key: 'Tab', action: 'Navigate to next interactive element' },
    { key: 'Shift + Tab', action: 'Navigate to previous interactive element' },
    { key: 'Enter', action: 'Activate buttons and links' },
    { key: 'Space', action: 'Activate buttons and checkboxes' },
    { key: 'Arrow Keys', action: 'Navigate within menus and lists' },
    { key: 'Escape', action: 'Close modals and dropdown menus' },
    { key: 'Alt + S', action: 'Skip to main content' },
    { key: 'Alt + M', action: 'Open main navigation menu' }
  ]

  return (
    <>
      <Helmet>
        <title>Accessibility Statement - E-Shop Kenya</title>
        <meta name="description" content="E-Shop Kenya is committed to digital accessibility. Learn about our accessibility features, compliance standards, and how to get support." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <AdjustmentsHorizontalIcon className="h-16 w-16 mx-auto mb-4 text-primary-100" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Accessibility Statement
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                E-Shop Kenya is committed to ensuring digital accessibility for all users, 
                including people with disabilities. We strive to provide an inclusive 
                shopping experience for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Our Commitment */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Commitment to Accessibility
            </h2>
            <div className="prose prose-lg text-gray-600">
              <p>
                At E-Shop Kenya, we believe that everyone should have equal access to online shopping. 
                We are committed to providing a website that is accessible to all users, regardless 
                of their abilities or the technologies they use.
              </p>
              <p>
                Our accessibility efforts are guided by the Web Content Accessibility Guidelines (WCAG) 2.1 
                and we continuously work to improve the user experience for all our customers across Kenya.
              </p>
            </div>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Accessibility Features
              </h2>
              <p className="text-lg text-gray-600">
                We've implemented various features to make our platform accessible to all users
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {accessibilityFeatures.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <feature.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WCAG Compliance */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              WCAG Compliance Status
            </h2>
            <p className="text-lg text-gray-600">
              Our compliance with Web Content Accessibility Guidelines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wcagCompliance.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <div className="mb-4">
                  {item.status === 'compliant' ? (
                    <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
                  ) : (
                    <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.level}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
                <div className="mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'compliant' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'compliant' ? 'Compliant' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assistive Technologies */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Supported Assistive Technologies
              </h2>
              <p className="text-lg text-gray-600">
                Our website works with popular assistive technologies
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Technology
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Compatibility
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assistiveTechnologies.map((tech, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{tech.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{tech.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {tech.compatibility}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{tech.platform}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Keyboard Navigation
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our website can be fully navigated using only a keyboard. 
                Here are the main keyboard shortcuts:
              </p>
              
              <div className="space-y-3">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border">
                    <div className="flex items-center">
                      <kbd className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                        {shortcut.key}
                      </kbd>
                    </div>
                    <div className="text-sm text-gray-600 ml-4">
                      {shortcut.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-primary-50 rounded-lg p-8">
                <ComputerDesktopIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  Accessibility Settings
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Customize your browsing experience with our accessibility options
                </p>
                <div className="space-y-3">
                  <button className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-900">Increase Text Size</div>
                    <div className="text-sm text-gray-500">Make text larger and easier to read</div>
                  </button>
                  <button className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-900">High Contrast Mode</div>
                    <div className="text-sm text-gray-500">Increase color contrast for better visibility</div>
                  </button>
                  <button className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-900">Reduce Motion</div>
                    <div className="text-sm text-gray-500">Minimize animations and transitions</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Known Issues */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Known Accessibility Issues
              </h2>
              <p className="text-lg text-gray-600">
                We're transparent about areas where we're still improving
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-8">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Areas Under Development
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Some third-party payment widgets may have limited accessibility</li>
                    <li>• Complex product filtering may require additional keyboard shortcuts</li>
                    <li>• Some dynamic content updates may not be announced to screen readers</li>
                    <li>• Mobile app accessibility features are still being enhanced</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-600">
                    We're actively working on these issues and expect to resolve them in upcoming updates. 
                    If you encounter any accessibility barriers, please let us know.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback and Support */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Accessibility Feedback
                </h2>
                <p className="text-gray-300 mb-6">
                  We welcome your feedback on the accessibility of E-Shop Kenya. 
                  If you encounter any accessibility barriers or have suggestions 
                  for improvement, please contact us.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Accessibility Team</h3>
                    <p className="text-gray-300">Email: accessibility@eshop.co.ke</p>
                    <p className="text-gray-300">Phone: +254 700 123 456</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white mb-2">Response Time</h3>
                    <p className="text-gray-300">
                      We aim to respond to accessibility inquiries within 2 business days.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Alternative Access Methods
                </h2>
                <p className="text-gray-300 mb-6">
                  If you're unable to access certain features on our website, 
                  we offer alternative ways to shop with us:
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li>• Phone orders: +254 700 123 456</li>
                  <li>• WhatsApp support: +254 700 123 456</li>
                  <li>• Email assistance: support@eshop.co.ke</li>
                  <li>• In-person support at our Nairobi office</li>
                </ul>
                
                <div className="mt-8">
                  <button className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors">
                    Contact Accessibility Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-600">
              <p>This accessibility statement was last updated on January 2, 2025.</p>
              <p>We review and update this statement regularly to reflect our ongoing accessibility improvements.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Accessibility