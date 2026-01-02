import { motion } from 'framer-motion'

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2024</p>
          
          <p className="mb-6">
            Welcome to E-Shop. These Terms of Service ("Terms") govern your use of our website 
            and services. By accessing or using our services, you agree to be bound by these Terms.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing and using this website, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, please 
            do not use this service.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily download one copy of the materials on E-Shop's 
            website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Registration</h2>
          <p className="mb-6">
            To access certain features of our service, you may be required to create an account. 
            You are responsible for maintaining the confidentiality of your account credentials 
            and for all activities that occur under your account.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
          <p className="mb-6">
            We strive to provide accurate product information, but we do not warrant that product 
            descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free. 
            We reserve the right to correct any errors or inaccuracies.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders and Payment</h2>
          <p className="mb-4">By placing an order, you agree to:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Pay all charges incurred by your account</li>
            <li>Accept responsibility for any taxes or duties</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping and Returns</h2>
          <p className="mb-6">
            Shipping times and costs vary by location and shipping method. We offer a 30-day 
            return policy for most items in original condition. Please see our Returns Policy 
            for complete details.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Uses</h2>
          <p className="mb-4">You may not use our service:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
          <p className="mb-6">
            The materials on E-Shop's website are provided on an 'as is' basis. E-Shop makes no 
            warranties, expressed or implied, and hereby disclaims and negates all other warranties 
            including without limitation, implied warranties or conditions of merchantability, 
            fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations</h2>
          <p className="mb-6">
            In no event shall E-Shop or its suppliers be liable for any damages (including, without 
            limitation, damages for loss of data or profit, or due to business interruption) arising 
            out of the use or inability to use the materials on E-Shop's website.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications</h2>
          <p className="mb-6">
            E-Shop may revise these terms of service at any time without notice. By using this 
            website, you are agreeing to be bound by the then current version of these terms of service.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
            <br />
            Email: legal@eshop.com
            <br />
            Phone: +1 (555) 123-4567
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default TermsOfService