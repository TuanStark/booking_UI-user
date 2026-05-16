import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ | KTX Online",
  description:
    "Điều khoản sử dụng nền tảng KTX Online: quyền và nghĩa vụ người dùng, đặt phòng, thanh toán và giới hạn trách nhiệm.",
};

const sections = [
  {
    title: "1. Chấp nhận điều khoản",
    body: [
      "KTX Online là nền tảng kết nối người tìm phòng với các đơn vị quản lý ký túc xá (KTX).",
      "Khi đăng ký, đăng nhập hoặc sử dụng dịch vụ, bạn đồng ý bị ràng buộc bởi các điều khoản này và các chính sách kèm theo (bao gồm chính sách bảo mật).",
    ],
  },
  {
    title: "2. Tài khoản người dùng",
    body: [
      "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra trên tài khoản của mình.",
      "Cung cấp thông tin trung thực khi đăng ký và đặt phòng. Chúng tôi có quyền tạm khóa tài khoản nếu phát hiện vi phạm nghiêm trọng hoặc gian lận.",
    ],
  },
  {
    title: "3. Đặt phòng & thanh toán",
    body: [
      "Thông tin phòng, giá và điều kiện cụ thể do từng KTX niêm yết. Hợp đồng thuê / đặt cọc thực tế được hình thành giữa bạn và KTX theo quy định của họ và luật hiện hành.",
      "Thanh toán trực tuyến (nếu có) thực hiện qua đối tác thanh toán; KTX Online không lưu đầy đủ dữ liệu thẻ của bạn.",
    ],
  },
  {
    title: "4. Hủy đặt & hoàn tiền",
    body: [
      "Chính sách hủy phòng, đổi lịch và hoàn tiền do KTX và nội dung hiển thị tại thời điểm đặt quyết định, trừ khi có thỏa thuận khác bằng văn bản.",
      "Tranh chấp giữa bạn và KTX nên được giải quyết trực tiếp; KTX Online có thể hỗ trợ trung gian ở mức hợp lý nhưng không đảm bảo kết quả.",
    ],
  },
  {
    title: "5. Nội dung và hành vi",
    body: [
      "Không sử dụng dịch vụ cho mục đích vi phạm pháp luật, xâm phạm quyền người khác, phát tán mã độc, hoặc làm gián đoạn hệ thống.",
      "Đánh giá và bình luận (nếu có) phải trung thực, không xúc phạm, kích động thù hằn.",
    ],
  },
  {
    title: "6. Giới hạn trách nhiệm",
    body: [
      "Dịch vụ được cung cấp “như hiện có”. Trong phạm vi pháp luật cho phép, KTX Online không chịu trách nhiệm về thiệt hại gián tiếp hoặc mất lợi nhuận phát sinh từ việc sử dụng nền tảng.",
      "Chúng tôi không bảo đảm không gián đoạn; có thể bảo trì hoặc ngưng tính năng có thông báo hợp lý khi khả thi.",
    ],
  },
  {
    title: "7. Thay đổi điều khoản",
    body: [
      "Chúng tôi có thể cập nhật điều khoản; phiên bản mới được đăng tại trang này kèm ngày hiệu lực. Tiếp tục sử dụng sau thay đổi đồng nghĩa bạn chấp nhận bản cập nhật, trừ khi pháp luật yêu cầu khác.",
    ],
  },
  {
    title: "8. Liên hệ",
    body: [
      "Thông tin liên hệ được đăng trên trang Liên hệ và chân trang website.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="space-y-0 pb-16">
      <section className="bg-brand text-white py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
            Điều khoản dịch vụ
          </h1>
          <p className="text-white/85 text-sm md:text-base">
            Hiệu lực: 16/05/2026 · KTX Online
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
          Vui lòng đọc kỹ trước khi sử dụng nền tảng. Nếu bạn không đồng ý với
          bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ.
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
          <Link href="/privacy" className="text-brand hover:underline font-medium">
            Chính sách bảo mật
          </Link>
          <Link href="/support" className="text-brand hover:underline font-medium">
            Trung tâm hỗ trợ
          </Link>
        </div>
      </article>
    </div>
  );
}
