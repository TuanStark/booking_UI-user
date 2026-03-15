"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, RefreshCw, CheckCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/services/apiClient";

/** Minimum time between resend attempts (seconds) */
const RESEND_COOLDOWN_SEC = 60;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") ?? "";
  const userIdFromUrl = searchParams.get("userId") ?? "";

  const [codeId, setCodeId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const hasRequiredParams = Boolean(emailFromUrl && userIdFromUrl);

  const startResendCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN_SEC);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeId.trim() || !userIdFromUrl) return;

    setIsVerifying(true);
    setError("");

    try {
      const response = await apiClient.verifyEmailCode({
        codeId: codeId.trim(),
        id: userIdFromUrl,
      });
      // Handle both direct auth response and gateway-wrapped { status, data }
      const payload = (response as any)?.data ?? response;
      const statusCode = payload?.statusCode ?? (response as any)?.status;
      const userData = payload?.data ?? (response as any)?.data?.data;
      const isSuccess =
        (statusCode === 200 || statusCode === 201) && userData != null;

      if (isSuccess) {
        setSuccess("Xác thực thành công! Đang chuyển tới đăng nhập...");
        setTimeout(() => {
          router.push("/auth/signin?verified=1");
        }, 1500);
      } else {
        setError("Mã xác thực không hợp lệ hoặc đã hết hạn");
      }
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof (err.response as any)?.data === "object"
          ? (err.response as any).data?.message ??
            (err.response as any).data?.data?.message
          : err instanceof Error
            ? err.message
            : "Mã xác thực không đúng hoặc đã hết hạn";
      setError(String(msg));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!userIdFromUrl || !emailFromUrl || resendCooldown > 0) return;

    setIsResending(true);
    setError("");

    try {
      await apiClient.resendVerificationCode({ id: userIdFromUrl, email: emailFromUrl });
      setSuccess("Mã xác thực mới đã được gửi đến email của bạn");
      startResendCooldown();
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof (err.response as any)?.data === "object"
          ? (err.response as any).data?.message ??
            (err.response as any).data?.data?.message
          : err instanceof Error
            ? err.message
            : "Không thể gửi lại mã. Vui lòng thử lại sau.";
      setError(String(msg));
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (!hasRequiredParams) {
      setError("Thiếu thông tin. Vui lòng đăng ký hoặc đăng nhập lại.");
    }
  }, [hasRequiredParams]);

  if (!hasRequiredParams) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-6">
            Liên kết không hợp lệ. Vui lòng đăng ký hoặc đăng nhập lại.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-brand hover:text-brand-dark font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-brand" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Xác thực email
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Chúng tôi đã gửi mã xác thực đến{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {emailFromUrl}
              </span>
              . Vui lòng nhập mã vào ô bên dưới.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
              <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label
                htmlFor="codeId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Mã xác thực
              </label>
              <input
                id="codeId"
                type="text"
                required
                value={codeId}
                onChange={(e) => setCodeId(e.target.value)}
                placeholder="Dán mã từ email"
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-brand text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                "Xác thực"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Chưa nhận được mã?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="flex items-center gap-2 text-brand hover:text-brand-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {resendCooldown > 0
                ? `Gửi lại mã sau ${resendCooldown}s`
                : "Gửi lại mã xác thực"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand font-medium text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
