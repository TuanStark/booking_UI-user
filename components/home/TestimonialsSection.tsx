'use client'

import Image from 'next/image'

export default function TestimonialsSection() {
    const testimonials = [
        {
            id: 1,
            content: "DormBooking luôn mang đến sự hài lòng! Tôi đã tìm được phòng ký túc xá ưng ý chỉ trong vài phút. Dịch vụ hỗ trợ rất nhiệt tình và chuyên nghiệp.",
            author: "Nguyễn Văn A",
            role: "Sinh viên ĐH Bách Khoa",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            id: 2,
            content: "Đối tác tin cậy cho việc tìm kiếm chỗ ở. Hệ thống đặt phòng nhanh chóng, thông tin minh bạch và giá cả rất hợp lý cho sinh viên.",
            author: "Trần Thị B",
            role: "Sinh viên ĐH Kinh Tế",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        }
    ]

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Đánh Giá Từ Sinh Viên
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {testimonials.map((item) => (
                        <div key={item.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-blue-500 text-6xl font-serif mb-6">“</div>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                {item.content}
                            </p>
                            <div className="flex items-center">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <Image
                                        src={item.avatar}
                                        alt={item.author}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{item.author}</h4>
                                    <p className="text-sm text-gray-500">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
