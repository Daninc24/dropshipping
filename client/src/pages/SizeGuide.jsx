import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { 
  AdjustmentsHorizontalIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  SwatchIcon
} from '@heroicons/react/24/outline'

const SizeGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState('clothing')

  const sizeCategories = [
    { id: 'clothing', name: 'Clothing', icon: SwatchIcon },
    { id: 'shoes', name: 'Shoes', icon: UserIcon },
    { id: 'accessories', name: 'Accessories', icon: UserIcon }
  ]

  const clothingSizes = {
    men: {
      shirts: [
        { size: 'XS', chest: '86-91', waist: '71-76', length: '69' },
        { size: 'S', chest: '91-96', waist: '76-81', length: '71' },
        { size: 'M', chest: '96-101', waist: '81-86', length: '73' },
        { size: 'L', chest: '101-106', waist: '86-91', length: '75' },
        { size: 'XL', chest: '106-111', waist: '91-96', length: '77' },
        { size: 'XXL', chest: '111-116', waist: '96-101', length: '79' }
      ],
      pants: [
        { size: '28', waist: '71', hip: '86', inseam: '81' },
        { size: '30', waist: '76', hip: '91', inseam: '81' },
        { size: '32', waist: '81', hip: '96', inseam: '81' },
        { size: '34', waist: '86', hip: '101', inseam: '81' },
        { size: '36', waist: '91', hip: '106', inseam: '81' },
        { size: '38', waist: '96', hip: '111', inseam: '81' }
      ]
    },
    women: {
      tops: [
        { size: 'XS', bust: '81-84', waist: '61-64', hip: '86-89' },
        { size: 'S', bust: '84-89', waist: '64-69', hip: '89-94' },
        { size: 'M', bust: '89-94', waist: '69-74', hip: '94-99' },
        { size: 'L', bust: '94-99', waist: '74-79', hip: '99-104' },
        { size: 'XL', bust: '99-104', waist: '79-84', hip: '104-109' },
        { size: 'XXL', bust: '104-109', waist: '84-89', hip: '109-114' }
      ],
      dresses: [
        { size: '6', bust: '81', waist: '61', hip: '86' },
        { size: '8', bust: '84', waist: '64', hip: '89' },
        { size: '10', bust: '89', waist: '69', hip: '94' },
        { size: '12', bust: '94', waist: '74', hip: '99' },
        { size: '14', bust: '99', waist: '79', hip: '104' },
        { size: '16', bust: '104', waist: '84', hip: '109' }
      ]
    }
  }

  const shoeSizes = {
    men: [
      { uk: '6', us: '7', eu: '40', cm: '25.0' },
      { uk: '6.5', us: '7.5', eu: '40.5', cm: '25.5' },
      { uk: '7', us: '8', eu: '41', cm: '26.0' },
      { uk: '7.5', us: '8.5', eu: '41.5', cm: '26.5' },
      { uk: '8', us: '9', eu: '42', cm: '27.0' },
      { uk: '8.5', us: '9.5', eu: '42.5', cm: '27.5' },
      { uk: '9', us: '10', eu: '43', cm: '28.0' },
      { uk: '9.5', us: '10.5', eu: '43.5', cm: '28.5' },
      { uk: '10', us: '11', eu: '44', cm: '29.0' },
      { uk: '10.5', us: '11.5', eu: '44.5', cm: '29.5' },
      { uk: '11', us: '12', eu: '45', cm: '30.0' }
    ],
    women: [
      { uk: '3', us: '5', eu: '36', cm: '22.5' },
      { uk: '3.5', us: '5.5', eu: '36.5', cm: '23.0' },
      { uk: '4', us: '6', eu: '37', cm: '23.5' },
      { uk: '4.5', us: '6.5', eu: '37.5', cm: '24.0' },
      { uk: '5', us: '7', eu: '38', cm: '24.5' },
      { uk: '5.5', us: '7.5', eu: '38.5', cm: '25.0' },
      { uk: '6', us: '8', eu: '39', cm: '25.5' },
      { uk: '6.5', us: '8.5', eu: '39.5', cm: '26.0' },
      { uk: '7', us: '9', eu: '40', cm: '26.5' },
      { uk: '7.5', us: '9.5', eu: '40.5', cm: '27.0' },
      { uk: '8', us: '10', eu: '41', cm: '27.5' }
    ]
  }

  const measurementTips = [
    {
      title: 'Chest/Bust',
      description: 'Measure around the fullest part of your chest/bust, keeping the tape horizontal'
    },
    {
      title: 'Waist',
      description: 'Measure around your natural waistline, which is the narrowest part of your torso'
    },
    {
      title: 'Hip',
      description: 'Measure around the fullest part of your hips, about 8 inches below your waist'
    },
    {
      title: 'Inseam',
      description: 'Measure from the crotch seam to the bottom of the leg along the inside seam'
    },
    {
      title: 'Foot Length',
      description: 'Stand on paper, mark heel and longest toe, then measure the distance'
    }
  ]

  const fitGuide = [
    {
      fit: 'Slim Fit',
      description: 'Close to body, tailored silhouette with minimal ease',
      recommendation: 'Choose your exact size for intended fit'
    },
    {
      fit: 'Regular Fit',
      description: 'Comfortable fit with moderate ease through body',
      recommendation: 'True to size, comfortable for everyday wear'
    },
    {
      fit: 'Relaxed Fit',
      description: 'Loose, comfortable fit with generous ease',
      recommendation: 'Consider sizing down for less oversized look'
    },
    {
      fit: 'Oversized',
      description: 'Intentionally loose, boxy silhouette',
      recommendation: 'Size down 1-2 sizes for less dramatic oversized fit'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Size Guide - Find Your Perfect Fit | E-Shop Kenya</title>
        <meta name="description" content="Complete size guide for clothing, shoes, and accessories. Find your perfect fit with our detailed measurement charts and fitting tips." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <AdjustmentsHorizontalIcon className="h-16 w-16 mx-auto mb-4 text-primary-100" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Size Guide
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Find your perfect fit with our comprehensive size charts and measurement guide. 
                Get the right size every time.
              </p>
            </div>
          </div>
        </div>

        {/* Size Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-2 shadow-sm border">
              <div className="flex space-x-2">
                {sizeCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <category.icon className="h-5 w-5" />
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Measurement Tips */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-blue-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How to Measure Yourself
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {measurementTips.map((tip, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                💡 <strong>Pro Tip:</strong> Use a soft measuring tape and have someone help you for the most accurate measurements. 
                All measurements are in centimeters.
              </p>
            </div>
          </div>
        </div>

        {/* Size Charts */}
        {selectedCategory === 'clothing' && (
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Clothing Size Charts
              </h2>

              {/* Men's Clothing */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Men's Clothing
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Men's Shirts */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Shirts & T-Shirts</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full bg-gray-50 rounded-lg">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Size</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Chest (cm)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Waist (cm)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Length (cm)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clothingSizes.men.shirts.map((size, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="px-4 py-2 font-medium">{size.size}</td>
                              <td className="px-4 py-2">{size.chest}</td>
                              <td className="px-4 py-2">{size.waist}</td>
                              <td className="px-4 py-2">{size.length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Men's Pants */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Pants & Jeans</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full bg-gray-50 rounded-lg">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Size</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Waist (cm)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hip (cm)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Inseam (cm)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clothingSizes.men.pants.map((size, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="px-4 py-2 font-medium">{size.size}</td>
                              <td className="px-4 py-2">{size.waist}</td>
                              <td className="px-4 py-2">{size.hip}</td>
                              <td className="px-4 py-2">{size.inseam}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Women's Clothing */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Women's Clothing
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Women's Tops */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Tops & Blouses</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full bg-gray-50 rounded-lg">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Size</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Bust (cm)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Waist (cm)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hip (cm)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clothingSizes.women.tops.map((size, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="px-4 py-2 font-medium">{size.size}</td>
                              <td className="px-4 py-2">{size.bust}</td>
                              <td className="px-4 py-2">{size.waist}</td>
                              <td className="px-4 py-2">{size.hip}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Women's Dresses */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Dresses</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full bg-gray-50 rounded-lg">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Size</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Bust (cm)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Waist (cm)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hip (cm)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clothingSizes.women.dresses.map((size, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="px-4 py-2 font-medium">{size.size}</td>
                              <td className="px-4 py-2">{size.bust}</td>
                              <td className="px-4 py-2">{size.waist}</td>
                              <td className="px-4 py-2">{size.hip}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shoe Sizes */}
        {selectedCategory === 'shoes' && (
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Shoe Size Charts
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Men's Shoes */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Men's Shoes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-gray-50 rounded-lg">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">UK</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">US</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">EU</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Length (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shoeSizes.men.map((size, index) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-2 font-medium">{size.uk}</td>
                            <td className="px-4 py-2">{size.us}</td>
                            <td className="px-4 py-2">{size.eu}</td>
                            <td className="px-4 py-2">{size.cm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Women's Shoes */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Women's Shoes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-gray-50 rounded-lg">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">UK</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">US</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">EU</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Length (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shoeSizes.women.map((size, index) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-2 font-medium">{size.uk}</td>
                            <td className="px-4 py-2">{size.us}</td>
                            <td className="px-4 py-2">{size.eu}</td>
                            <td className="px-4 py-2">{size.cm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-yellow-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Shoe Fitting Tips:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Measure your feet in the evening when they're at their largest</li>
                  <li>• Always measure both feet and use the larger measurement</li>
                  <li>• Leave about 1cm of space between your longest toe and the shoe</li>
                  <li>• Consider the width of your foot - some brands run narrow or wide</li>
                  <li>• When in doubt, size up rather than down for comfort</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Fit Guide */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Fit Guide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fitGuide.map((fit, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {fit.fit}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {fit.description}
                </p>
                <p className="text-xs text-primary-600 font-medium">
                  {fit.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Size Finder Tool */}
        <div className="bg-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Still Not Sure About Your Size?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our interactive size finder tool or contact our customer service team 
                for personalized sizing advice.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors">
                  Use Size Finder Tool
                </button>
                <button className="border border-primary-600 text-primary-600 px-6 py-3 rounded-md hover:bg-primary-50 transition-colors">
                  Contact Size Expert
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Return Policy Reminder */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Wrong Size? No Problem!
              </h2>
              <p className="text-gray-300 mb-6">
                We offer free returns within 14 days if the size doesn't fit perfectly. 
                Your satisfaction is our priority.
              </p>
              <a
                href="/returns"
                className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors inline-block"
              >
                Learn About Returns
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SizeGuide