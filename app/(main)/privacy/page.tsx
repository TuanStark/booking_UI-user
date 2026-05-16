import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | KTX Online",
  description:
    "Cách KTX Online thu thập, sử dụng và bảo vệ dữ liệu cá nhân của người dùng nền tảng đặt phòng ký túc xá.",
};

const sections = [
  {
    title: "1. Phạm vi áp dụng",
    body: [
      "Chính sách này áp dụng khi bạn truy cập website/ứng dụng KTX Online, đăng ký tài khoản, tìm kiếm hoặc đặt phòng ký túc xá thông qua nền tảng.",
      "Bằng việc sử dụng dịch vụ, bạn xác nhận đã đọc và hiểu các nội dung dưới đây.",
    ],
  },
  {
    title: "2. Dữ liệu chúng tôi có thể thu thập",
    body: [
      "Thông tin tài khoản: họ tên, email, số điện thoại, mã số sinh viên (nếu bạn cung cấp khi đặt phòng).",
      "Thông tin giao dịch: mã đặt phòng, thời gian, trạng thái thanh toán (không lưu đầy đủ thông tin thẻ trên hệ thống của chúng tôi; xử lý qua đối tác thanh toán được cấp phép).",
      "Dữ liệu kỹ thuật: loại thiết bị, trình duyệt, địa chỉ IP rút gọn, nhật ký lỗi — nhằm vận hành và bảo mật hệ thống.",
    ],
  },
  {
    title: "3. Mục đích sử dụng",
    body: [
      "Cung cấp và cải thiện dịch vụ đặt phòng, xác thực tài khoản, gửi thông báo liên quan đơn đặt.",
      "Tuân thủ nghĩa vụ pháp luật, ngăn chặn gian lận và lạm dụng.",
      "Phân tích tổng hợp, ẩn danh hóa để cải thiện trải nghiệm (không bán dữ liệu cá nhân của bạn cho bên thứ ba cho mục đích tiếp thị không liên quan).",
    ],
  },
  {
    title: "4. Chia sẻ dữ liệu",
    body: [
      "Chúng tôi có thể chia sẻ thông tin cần thiết với đơn vị quản lý ký túc xá mà bạn chọn đặt phòng, và với nhà cung cấp thanh toán / hạ tầng lưu trữ theo hợp đồng bảo mật.",
      "Có thể công bố khi pháp luật yêu cầu hoặc để bảo vệ quyền lợi hợp pháp của người dùng và KTX Online.",
    ],
  },
  {
    title: "5. Lưu trữ và bảo mật",
    body: [
      "Dữ liệu được lưu trong thời gian cần thiết để thực hiện mục đích nêu trên hoặc theo quy định pháp luật.",
      "Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức hợp lý (mã hóa kết nối, phân quyền truy cập, sao lưu) để giảm thiểu rủi ro rò rỉ.",
    ],
  },
  {
    title: "6. Quyền của bạn",
    body: [
      "Bạn có thể yêu cầu truy cập, chỉnh sửa hoặc xóa một số thông tin cá nhân qua tài khoản hoặc kênh hỗ trợ.",
      "Bạn có thể từ chối nhận email tiếp thị (nếu có) thông qua hướng dẫn hủy đăng ký trong email.",
    ],
  },
  {
    title: "7. Liên hệ",
    body: [
      "Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ qua trang Liên hệ hoặc email hỗ trợ được niêm yết trên website.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="space-y-0 pb-16">
      <section className="bg-brand text-white py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
            Chính sách bảo mật
          </h1>
          <p className="text-white/85 text-sm md:text-base">
            Cập nhật lần cuối: 16/05/2026 · KTX Online
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
          KTX Online tôn trọng quyền riêng tư của bạn. Tài liệu này mô tả cách
          chúng tôi xử lý dữ liệu trong phạm vi nền tảng đặt phòng ký túc xá.
          Nội dung mang tính tổng quát; chi tiết kỹ thuật có thể được bổ sung
          theo từng phiên bản dịch vụ.
        </p>

        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {s.title}
              </h2>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {s.body.map((p, i) => (
                  <li key={i} className="pl-1">
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/terms" className="text-brand hover:underline font-medium">
            Xem điều khoản dịch vụ
          </Link>
          <Link href="/contact" className="text-brand hover:underline font-medium">
            Liên hệ
          </Link>
        </div>
      </article>
    </div>
  );
}
