'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, User, Mail as MailIcon } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    }, 1000)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Địa chỉ',
      content: '123 Đường Đại Học, Quận 1, TP.HCM',
      link: 'https://maps.google.com'
    },
    {
      icon: Phone,
      title: 'Điện thoại',
      content: '028 1234 5678',
      link: 'tel:02812345678'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'support@dormbooking.com',
      link: 'mailto:support@dormbooking.com'
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Chủ nhật: 8:00 - 22:00',
      link: null
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-16 space-y-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Liên Hệ Với Chúng Tôi
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon
                const content = (
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {info.title}
                    </h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        {info.content}
                      </p>
                    )}
                  </div>
                )
                return info.link ? (
                  <a key={index} href={info.link} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={index}>{content}</div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Side - Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Gửi Tin Nhắn Cho Chúng Tôi
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  Bạn có câu hỏi, góp ý hoặc cần hỗ trợ? Hãy điền form bên cạnh và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Phản hồi nhanh chóng
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Chúng tôi sẽ phản hồi trong vòng 24 giờ
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Hỗ trợ chuyên nghiệp
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Đội ngũ tư vấn nhiệt tình, sẵn sàng giúp đỡ bạn
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MailIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Thông tin bảo mật
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Thông tin của bạn được bảo mật tuyệt đối
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0123 456 789"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chủ đề *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="booking">Đặt phòng</option>
                      <option value="support">Hỗ trợ kỹ thuật</option>
                      <option value="feedback">Góp ý</option>
                      <option value="partnership">Hợp tác</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tin nhắn *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Nhập tin nhắn của bạn..."
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
                      Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                      Có lỗi xảy ra. Vui lòng thử lại sau.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Gửi tin nhắn</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

