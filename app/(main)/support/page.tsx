import { Metadata } from "next";
import Link from "next/link";
import {
  LifeBuoy,
  Mail,
  Phone,
  Clock,
  MessageCircle,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Trung tâm hỗ trợ | KTX Online",
  description:
    "Câu hỏi thường gặp, hotline, email và hướng dẫn sử dụng dịch vụ đặt phòng ký túc xá KTX Online.",
};

const faqs = [
  {
    q: "Làm sao để đặt phòng trên KTX Online?",
    a: "Chọn tòa nhà trong mục Tìm phòng, xem chi tiết phòng rồi làm theo các bước đặt chỗ và thanh toán (nếu có). Bạn sẽ nhận xác nhận sau khi hoàn tất.",
  },
  {
    q: "Tôi có được hoàn tiền đặt cọc không?",
    a: "Chính sách hoàn cọc / hủy phòng do từng ký túc xá quy định và được hiển thị khi đặt. Nếu có tranh chấp, vui lòng liên hệ bộ phận hỗ trợ kèm mã đặt phòng.",
  },
  {
    q: "Tôi chưa nhận được email xác thực tài khoản?",
    a: "Kiểm tra hộp thư spam. Đăng nhập lại bằng đúng email đã đăng ký — hệ thống có thể gửi lại mã xác thực. Nếu vẫn không được, gửi email tới địa chỉ hỗ trợ bên dưới.",
  },
  {
    q: "Làm sao để báo lỗi kỹ thuật hoặc nội dung sai?",
    a: "Dùng biểu mẫu trang Liên hệ hoặc gửi email với mô tả lỗi, ảnh chụp màn hình (nếu có). Chúng tôi phản hồi trong giờ hành chính.",
  },
];

const channels = [
  {
    icon: Phone,
    title: "Hotline",
    detail: "0845 663 357",
    href: "tel:0845663357",
    note: "Thứ 2 – Thứ 6, 8:00 – 17:30",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "support@gmail.com",
    href: "mailto:support@gmail.com",
    note: "Phản hồi trong 1–2 ngày làm việc",
  },
  {
    icon: MessageCircle,
    title: "Liên hệ trực tiếp",
    detail: "Gửi tin nhắn",
    href: "/contact",
    note: "Biểu mẫu liên hệ trên website",
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-0">
      <section className="bg-brand text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm text-white/95 mb-4">
                <LifeBuoy className="h-4 w-4" />
                Trung tâm hỗ trợ
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn
              </h1>
              <p className="text-white/90 text-lg">
                Tìm câu trả lời nhanh hoặc liên hệ qua kênh phù hợp — đặt phòng,
                tài khoản, thanh toán và hơn thế nữa.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand hover:bg-white/95 shrink-0"
            >
              Gửi yêu cầu hỗ trợ
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {channels.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="flex gap-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft hover:shadow-soft-lg transition-shadow"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {c.title}
                  </p>
                  <p className="mt-1 text-brand dark:text-brand-light font-medium">
                    {c.detail}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {c.note}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-brand font-semibold mb-2">
            <BookOpen className="h-5 w-5" />
            Câu hỏi thường gặp
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Giải đáp nhanh
          </h2>
          <div className="space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-1 open:shadow-soft"
              >
                <summary className="cursor-pointer list-none py-4 font-medium text-gray-900 dark:text-white flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-gray-400 text-xl leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                  {item.a}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-10 text-sm text-gray-600 dark:text-gray-400 text-center">
            Chưa tìm thấy câu trả lời?{" "}
            <Link href="/contact" className="text-brand font-medium hover:underline">
              Liên hệ với chúng tôi
            </Link>{" "}
            hoặc xem{" "}
            <Link href="/terms" className="text-brand font-medium hover:underline">
              điều khoản dịch vụ
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
