import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Message sent successfully! We\'ll get back to you soon.')
    reset()
    setIsSubmitting(false)
  }

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: 'support@eshop.com',
      description: 'Send us an email anytime!'
    },
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: MapPinIcon,
      title: 'Address',
      details: '123 Commerce St, City, State 12345',
      description: 'Come visit our office'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      details: 'Mon-Fri: 8am-6pm, Sat: 9am-4pm',
      description: 'We\'re here to help!'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have a question or need help? We'd love to hear from you. 
          Send us a message and we'll respond as soon as possible.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
          
          <div className="space-y-6">
            {contactInfo.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <item.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-900 font-medium">{item.details}</p>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">How long does shipping take?</h4>
                <p className="text-gray-600 text-sm">
                  Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">What is your return policy?</h4>
                <p className="text-gray-600 text-sm">
                  We offer 30-day returns on most items. Items must be in original condition with tags attached.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Do you ship internationally?</h4>
                <p className="text-gray-600 text-sm">
                  Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name</label>
                  <input
                    {...register('firstName', { required: 'First name is required' })}
                    type="text"
                    className="form-input"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="form-error">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Last Name</label>
                  <input
                    {...register('lastName', { required: 'Last name is required' })}
                    type="text"
                    className="form-input"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="form-error">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Email</label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email'
                    }
                  })}
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Subject</label>
                <select
                  {...register('subject', { required: 'Please select a subject' })}
                  className="form-input"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="shipping">Shipping Question</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <p className="form-error">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Message</label>
                <textarea
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters'
                    }
                  })}
                  rows={5}
                  className="form-input"
                  placeholder="Tell us how we can help you..."
                />
                {errors.message && (
                  <p className="form-error">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact