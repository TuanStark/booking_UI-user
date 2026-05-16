import { Metadata } from "next";
import Link from "next/link";
import { Check, Search, CreditCard, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Bảng giá & phí dịch vụ | KTX Online",
  description:
    "Minh bạch phí sử dụng nền tảng KTX Online: tra cứu miễn phí, đặt phòng và thanh toán theo từng ký túc xá.",
};

const tiers = [
  {
    name: "Tra cứu & xem tin",
    icon: Search,
    price: "Miễn phí",
    description:
      "Xem danh sách tòa nhà, phòng trống, mô tả và tiện ích mà không mất phí.",
    highlights: [
      "Tìm kiếm theo khu vực",
      "Xem ảnh, đánh giá (khi có)",
      "So sánh phòng & mức giá",
    ],
    cta: { label: "Tìm phòng ngay", href: "/buildings" },
    featured: false,
  },
  {
    name: "Đặt phòng qua KTX Online",
    icon: CreditCard,
    price: "Theo từng KTX",
    description:
      "Khi đặt chỗ, bạn thanh toán đặt cọc / tiền phòng theo chính sách của từng tòa nhà và cổng thanh toán được tích hợp.",
    highlights: [
      "Giá phòng do chủ KTX niêm yết",
      "Thanh toán an toàn (VNPay, v.v.)",
      "Xác nhận đặt chỗ qua hệ thống",
    ],
    cta: { label: "Khám phá tòa nhà", href: "/buildings" },
    featured: true,
  },
  {
    name: "Đối tác vận hành KTX",
    icon: Building2,
    price: "Liên hệ",
    description:
      "Dành cho ban quản lý ký túc xá muốn đưa phòng lên nền tảng và tiếp cận sinh viên.",
    highlights: [
      "Hỗ trợ đăng tin & cập nhật phòng",
      "Bàn giao quy trình vận hành",
      "Ưu đãi theo gói hợp tác",
    ],
    cta: { label: "Liên hệ hợp tác", href: "/contact" },
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-0">
      <section className="bg-brand text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Bảng giá & phí
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Minh bạch theo hình thức sử dụng: tra cứu không thu phí; giá thuê và
            đặt cọc do từng ký túc xá quy định.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.name}
                  className={`relative flex flex-col rounded-2xl border p-6 md:p-8 shadow-soft transition-shadow hover:shadow-soft-lg ${
                    tier.featured
                      ? "border-brand bg-white dark:bg-gray-800 ring-2 ring-brand/30 scale-[1.02]"
                      : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-0.5 text-xs font-semibold text-white">
                      Phổ biến
                    </span>
                  )}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
                    {tier.name}
                  </h2>
                  <p className="mt-2 text-2xl font-semibold text-brand dark:text-brand-light">
                    {tier.price}
                  </p>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {tier.description}
                  </p>
                  <ul className="mt-6 space-y-3 flex-1">
                    {tier.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.cta.href}
                    className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                      tier.featured
                        ? "bg-brand text-white hover:bg-brand-dark"
                        : "border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    {tier.cta.label}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 md:p-8 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lưu ý quan trọng
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                • Giá hiển thị trên từng phòng là do{" "}
                <strong className="text-gray-800 dark:text-gray-200">
                  đơn vị quản lý KTX
                </strong>{" "}
                cung cấp; KTX Online là nền tảng kết nối và xử lý đặt chỗ.
              </li>
              <li>
                • Phí giao dịch ngân hàng / cổng thanh toán (nếu có) tuân theo
                điều kiện nhà cung cấp thanh toán tại thời điểm giao dịch.
              </li>
              <li>
                • Mọi thắc mắc về{" "}
                <Link href="/support" className="text-brand hover:underline">
                  hoàn cọc / hủy phòng
                </Link>{" "}
                xem thêm trung tâm hỗ trợ hoặc{" "}
                <Link href="/contact" className="text-brand hover:underline">
                  liên hệ
                </Link>
                .
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
