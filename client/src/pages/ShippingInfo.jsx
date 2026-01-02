import { Helmet } from 'react-helmet-async'
import { 
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const ShippingInfo = () => {
  const deliveryZones = [
    {
      zone: 'Nairobi Metropolitan',
      counties: ['Nairobi'],
      timeframe: 'Same day / Next day',
      cost: 'Free above KES 2,000',
      standardCost: 'KES 200'
    },
    {
      zone: 'Central Kenya',
      counties: ['Kiambu', 'Murang\'a', 'Nyeri', 'Kirinyaga', 'Nyandarua'],
      timeframe: '1-2 business days',
      cost: 'Free above KES 2,000',
      standardCost: 'KES 250'
    },
    {
      zone: 'Coast Region',
      counties: ['Mombasa', 'Kilifi', 'Kwale', 'Lamu', 'Tana River', 'Taita-Taveta'],
      timeframe: '2-3 business days',
      cost: 'Free above KES 3,000',
      standardCost: 'KES 350'
    },
    {
      zone: 'Western Kenya',
      counties: ['Kisumu', 'Kakamega', 'Vihiga', 'Busia', 'Siaya', 'Bungoma', 'Trans Nzoia'],
      timeframe: '2-3 business days',
      cost: 'Free above KES 3,000',
      standardCost: 'KES 350'
    },
    {
      zone: 'Eastern Kenya',
      counties: ['Machakos', 'Kitui', 'Makueni', 'Embu', 'Tharaka-Nithi', 'Meru', 'Isiolo'],
      timeframe: '2-4 business days',
      cost: 'Free above KES 3,000',
      standardCost: 'KES 400'
    },
    {
      zone: 'Northern Kenya',
      counties: ['Turkana', 'West Pokot', 'Samburu', 'Marsabit', 'Mandera', 'Wajir', 'Garissa'],
      timeframe: '3-5 business days',
      cost: 'Free above KES 4,000',
      standardCost: 'KES 500'
    },
    {
      zone: 'Rift Valley',
      counties: ['Nakuru', 'Uasin Gishu', 'Kericho', 'Bomet', 'Kajiado', 'Narok', 'Laikipia', 'Baringo', 'Elgeyo-Marakwet', 'Nandi', 'West Pokot'],
      timeframe: '2-4 business days',
      cost: 'Free above KES 3,000',
      standardCost: 'KES 350'
    },
    {
      zone: 'Nyanza Region',
      counties: ['Kisii', 'Nyamira', 'Homa Bay', 'Migori', 'Kisumu'],
      timeframe: '2-3 business days',
      cost: 'Free above KES 3,000',
      standardCost: 'KES 350'
    }
  ]

  const shippingFeatures = [
    {
      icon: TruckIcon,
      title: 'Nationwide Coverage',
      description: 'We deliver to all 47 counties in Kenya with reliable logistics partners'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Packaging',
      description: 'All items are carefully packaged to ensure they arrive in perfect condition'
    },
    {
      icon: MapPinIcon,
      title: 'Real-time Tracking',
      description: 'Track your order from our warehouse to your doorstep with SMS updates'
    },
    {
      icon: ClockIcon,
      title: 'Flexible Delivery',
      description: 'Choose convenient delivery times and locations that work for you'
    }
  ]

  const deliveryOptions = [
    {
      type: 'Standard Delivery',
      description: 'Regular delivery during business hours (8AM - 6PM)',
      icon: TruckIcon,
      features: ['Free for qualifying orders', 'Delivery to your address', 'SMS notifications']
    },
    {
      type: 'Express Delivery',
      description: 'Faster delivery for urgent orders (Nairobi only)',
      icon: ClockIcon,
      features: ['Same-day delivery available', 'Premium service', 'Priority handling']
    },
    {
      type: 'Pickup Points',
      description: 'Collect from convenient pickup locations',
      icon: MapPinIcon,
      features: ['Lower delivery costs', 'Extended pickup hours', 'Secure storage']
    }
  ]

  const packagingInfo = [
    'Eco-friendly packaging materials',
    'Fragile items receive extra protection',
    'Waterproof packaging for electronics',
    'Discrete packaging for personal items',
    'Recyclable materials used where possible'
  ]

  return (
    <>
      <Helmet>
        <title>Shipping Information - Delivery Across Kenya | E-Shop Kenya</title>
        <meta name="description" content="Learn about our shipping options, delivery zones, costs, and timeframes. We deliver to all 47 counties in Kenya with free shipping on qualifying orders." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <TruckIcon className="h-16 w-16 mx-auto mb-4 text-primary-100" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Shipping Information
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Fast, reliable delivery to all 47 counties in Kenya. 
                Free shipping on qualifying orders with real-time tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Features */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Shipping?
            </h2>
            <p className="text-lg text-gray-600">
              Reliable, secure, and convenient delivery across Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {shippingFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Options */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Delivery Options
              </h2>
              <p className="text-lg text-gray-600">
                Choose the delivery method that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {deliveryOptions.map((option, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <option.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {option.type}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {option.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Delivery Zones & Costs
            </h2>
            <p className="text-lg text-gray-600">
              Delivery timeframes and costs by region
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Counties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Free Shipping
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Standard Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deliveryZones.map((zone, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{zone.zone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {zone.counties.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{zone.timeframe}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-green-600 font-medium">
                        {zone.cost}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{zone.standardCost}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Packaging Information */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Secure Packaging
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We take great care in packaging your orders to ensure they arrive 
                  safely and in perfect condition.
                </p>
                
                <ul className="space-y-3">
                  {packagingInfo.map((info, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <ShieldCheckIcon className="h-24 w-24 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Damage Protection
                </h3>
                <p className="text-gray-600">
                  If your order arrives damaged, we'll replace it free of charge. 
                  Just contact us within 48 hours of delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping FAQ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shipping FAQ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How do I track my order?
                </h3>
                <p className="text-gray-600 text-sm">
                  You'll receive a tracking number via SMS and email once your order ships. 
                  You can also track orders in your account dashboard.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What if I'm not home for delivery?
                </h3>
                <p className="text-gray-600 text-sm">
                  Our delivery partners will attempt delivery 3 times. You can also 
                  reschedule delivery or choose a pickup point.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Do you deliver on weekends?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes, we offer weekend delivery in major cities. Weekend delivery 
                  may incur additional charges.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I change my delivery address?
                </h3>
                <p className="text-gray-600 text-sm">
                  You can change your delivery address before the order ships. 
                  Contact support immediately after placing your order.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What about remote areas?
                </h3>
                <p className="text-gray-600 text-sm">
                  We deliver to remote areas but delivery may take longer. 
                  Additional charges may apply for very remote locations.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is there a weight limit?
                </h3>
                <p className="text-gray-600 text-sm">
                  Standard delivery covers items up to 30kg. Heavier items 
                  require special handling and additional charges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Questions About Shipping?
              </h2>
              <p className="text-gray-300 mb-6">
                Our customer service team is here to help with any shipping questions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors">
                  Contact Support
                </button>
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

export default ShippingInfo