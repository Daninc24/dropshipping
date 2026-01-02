import { motion } from 'framer-motion'

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About E-Shop</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Welcome to E-Shop, your trusted online shopping destination for quality products at great prices.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-6">
            Founded with a mission to make online shopping simple, secure, and enjoyable, E-Shop has grown 
            to become a leading e-commerce platform serving customers worldwide. We believe that everyone 
            deserves access to high-quality products at fair prices.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To provide an exceptional online shopping experience by offering a curated selection of products, 
            competitive prices, and outstanding customer service. We strive to build lasting relationships 
            with our customers based on trust, quality, and reliability.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose E-Shop?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Carefully curated product selection</li>
            <li>Competitive pricing and regular deals</li>
            <li>Fast and reliable shipping</li>
            <li>Secure payment processing</li>
            <li>24/7 customer support</li>
            <li>Easy returns and exchanges</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            Have questions or need assistance? Our customer service team is here to help. 
            Reach out to us anytime, and we'll be happy to assist you with your shopping needs.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default About