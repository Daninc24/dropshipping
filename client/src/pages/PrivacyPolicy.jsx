import { motion } from 'framer-motion'

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2024</p>
          
          <p className="mb-6">
            At E-Shop, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website or make a purchase.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
          <p className="mb-4">We may collect information about you in a variety of ways:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Personal Data: Name, email address, phone number, shipping address</li>
            <li>Payment Information: Credit card details, billing address</li>
            <li>Usage Data: How you interact with our website</li>
            <li>Device Information: Browser type, operating system, IP address</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your purchases</li>
            <li>Improve our website and services</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
          <p className="mb-6">
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except as described in this policy. We may share information with:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Service providers who assist us in operating our website</li>
            <li>Payment processors for transaction processing</li>
            <li>Shipping companies for order fulfillment</li>
            <li>Legal authorities when required by law</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
          <p className="mb-6">
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. However, no method of 
            transmission over the internet is 100% secure.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
          <p className="mb-6">
            We use cookies and similar tracking technologies to enhance your browsing experience, 
            analyze website traffic, and personalize content. You can control cookie settings 
            through your browser preferences.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
          <p className="mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@eshop.com
            <br />
            Phone: +1 (555) 123-4567
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default PrivacyPolicy