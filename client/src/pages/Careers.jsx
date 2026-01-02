import { Helmet } from 'react-helmet-async'
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const Careers = () => {
  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      salary: 'KES 150,000 - 250,000',
      description: 'Join our team to build amazing user experiences for our e-commerce platform.',
      requirements: [
        '5+ years of React experience',
        'Strong TypeScript skills',
        'Experience with e-commerce platforms',
        'Knowledge of Kenyan market preferred'
      ]
    },
    {
      id: 2,
      title: 'Backend Developer',
      department: 'Engineering',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      salary: 'KES 120,000 - 200,000',
      description: 'Build scalable APIs and services for our growing platform.',
      requirements: [
        '3+ years Node.js experience',
        'MongoDB expertise',
        'Payment integration experience',
        'Understanding of African payment systems'
      ]
    },
    {
      id: 3,
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      salary: 'KES 80,000 - 120,000',
      description: 'Help our customers succeed and grow their businesses on our platform.',
      requirements: [
        'Customer service experience',
        'Fluent in English and Swahili',
        'Understanding of e-commerce',
        'Strong communication skills'
      ]
    },
    {
      id: 4,
      title: 'Digital Marketing Specialist',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      salary: 'KES 70,000 - 100,000',
      description: 'Drive growth through digital marketing campaigns and strategies.',
      requirements: [
        'Digital marketing experience',
        'Social media expertise',
        'Analytics and data-driven approach',
        'Knowledge of Kenyan market'
      ]
    }
  ]

  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: 'Competitive Salary',
      description: 'Market-competitive salaries with performance bonuses'
    },
    {
      icon: AcademicCapIcon,
      title: 'Learning & Development',
      description: 'Continuous learning opportunities and conference attendance'
    },
    {
      icon: UserGroupIcon,
      title: 'Great Team',
      description: 'Work with passionate, talented people who care about impact'
    },
    {
      icon: ClockIcon,
      title: 'Flexible Hours',
      description: 'Flexible working hours and remote work options'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Careers - Join Our Team | E-Shop Kenya</title>
        <meta name="description" content="Join our team and help build the future of e-commerce in Kenya. Explore career opportunities and grow with us." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Join Our Team
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Help us build the future of e-commerce in Kenya. We're looking for passionate, 
                talented people who want to make a real impact.
              </p>
            </div>
          </div>
        </div>

        {/* Why Work With Us */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Work With Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're building something special - a platform that empowers Kenyan businesses 
              and connects customers with quality products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Current Openings
              </h2>
              <p className="text-lg text-gray-600">
                Find your next opportunity with us
              </p>
            </div>

            <div className="space-y-6">
              {jobOpenings.map((job) => (
                <div key={job.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm font-medium">
                          {job.department}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">
                        {job.description}
                      </p>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <button className="w-full lg:w-auto bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Hiring Process
            </h2>
            <p className="text-lg text-gray-600">
              We believe in a fair, transparent hiring process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Apply</h3>
              <p className="text-gray-600 text-sm">Submit your application and resume</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Screen</h3>
              <p className="text-gray-600 text-sm">Initial phone/video screening</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interview</h3>
              <p className="text-gray-600 text-sm">Technical and cultural fit interviews</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Offer</h3>
              <p className="text-gray-600 text-sm">Welcome to the team!</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Don't See a Perfect Fit?
              </h2>
              <p className="text-gray-300 mb-6">
                We're always looking for talented people. Send us your resume and tell us how you'd like to contribute.
              </p>
              <a
                href="mailto:careers@eshop.co.ke"
                className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors inline-block"
              >
                Send Us Your Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Careers