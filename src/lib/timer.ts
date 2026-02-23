/**
 * 【TIMER CALCULATION】
 * Hàm này là "bộ não" của timer
 * Nhận startTime + timeLimit → trả về thông tin hiển thị
 */

interface TimerInfo {
  totalSeconds: number; // Tổng thời gian (giây)
  elapsedSeconds: number; // Thời gian đã dùng (giây)
  remainingSeconds: number; // Thời gian còn lại (giây)
  minutes: number; // MM (để hiển thị)
  seconds: number; // SS (để hiển thị)
  isExpired: boolean; // true = hết giờ (red)
  isWarning: boolean; // true = sắp hết (<25% còn lại = yellow)
  percentage: number; // % thời gian còn lại (0-100)
}

/**
 * 【MAIN FUNCTION】
 * Tính tất cả thông tin timer
 * @param startTime - ISO string từ backend (ví dụ: "2026-02-21T10:00:00")
 * @param timeLimitSeconds - Số GIÂY từ backend (ví dụ: 1800 = 30 phút)
 */
export function calculateTimerInfo(
  startTime: string,
  timeLimitSeconds: number,
): TimerInfo {
  // 【Bước 1】Chuyển đổi startTime (string) → Date object
  const startDate = new Date(startTime);
  const now = new Date();

  // 【Bước 2】Tính thời gian đã dùng (mili giây → giây)
  const elapsedMs = now.getTime() - startDate.getTime();
  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  // 【Bước 3】Tổng thời gian (đã là giây rồi, không cần nhân 60)
  const totalSeconds = timeLimitSeconds;

  // 【Bước 4】Tính thời gian còn lại
  // ⚠️ Quan trọng: không được âm!
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

  // 【Bước 5】Chuyển đổi thành MM:SS
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  // 【Bước 6】Tính trạng thái (xanh/vàng/đỏ)
  const percentage = (remainingSeconds / totalSeconds) * 100;
  const isExpired = remainingSeconds <= 0; // Đỏ: 0%
  const isWarning = percentage < 25 && !isExpired; // Vàng: <25%

  return {
    totalSeconds,
    elapsedSeconds,
    remainingSeconds,
    minutes,
    seconds,
    isExpired,
    isWarning,
    percentage,
  };
}

/**
 * 【FORMAT HELPER】
 * Chuyển MM:SS thành string hiển thị (ví dụ: "25:03")
 * ⚠️ Pad cả minutes lẫn seconds để layout cố định
 */
export function formatTimer(minutes: number, seconds: number): string {
  const padMinutes = String(minutes).padStart(2, "0");
  const padSeconds = String(seconds).padStart(2, "0");
  return `${padMinutes}:${padSeconds}`;
}
