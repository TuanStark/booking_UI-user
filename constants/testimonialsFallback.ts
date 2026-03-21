/** Dùng bổ sung khi API trả về ít hơn 2 đánh giá hiển thị được. */
export type FallbackTestimonial = {
  id: string
  content: string
  author: string
  role: string
  avatar: string
}

export const TESTIMONIALS_FALLBACK: FallbackTestimonial[] = [
  {
    id: 'fallback-1',
    content:
      'KTX Online luôn mang đến sự hài lòng! Tôi đã tìm được phòng ký túc xá ưng ý chỉ trong vài phút. Dịch vụ hỗ trợ rất nhiệt tình và chuyên nghiệp.',
    author: 'Nguyễn Văn A',
    role: 'Sinh viên ĐH Bách Khoa',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'fallback-2',
    content:
      'Đối tác tin cậy cho việc tìm kiếm chỗ ở. Hệ thống đặt phòng nhanh chóng, thông tin minh bạch và giá cả rất hợp lý cho sinh viên.',
    author: 'Trần Thị B',
    role: 'Sinh viên ĐH Kinh Tế',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
]
