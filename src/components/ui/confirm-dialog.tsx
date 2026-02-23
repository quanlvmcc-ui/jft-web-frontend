/**
 * 🎓 CONFIRM DIALOG COMPONENT
 *
 * Kiến thức trọng tâm:
 * 1. Props interface - định nghĩa contract giữa parent và child
 * 2. Conditional rendering - {open && ...}
 * 3. Event delegation - onConfirm, onCancel callbacks
 * 4. Backdrop click handling - đóng dialog khi click ngoài
 * 5. Accessibility - role, aria-labels
 */

interface ConfirmDialogProps {
  // ✅ Props với type rõ ràng
  open: boolean; // Trạng thái hiển thị
  title: string; // Tiêu đề dialog
  message: string; // Nội dung thông báo
  confirmText?: string; // Text nút xác nhận (optional)
  cancelText?: string; // Text nút hủy (optional)
  onConfirm: () => void; // Callback khi confirm
  onCancel: () => void; // Callback khi cancel
  loading?: boolean; // Trạng thái loading (optional)
  stats?: {
    // Thống kê câu hỏi (optional)
    answered: number;
    unanswered: number;
    total: number;
  };
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  loading = false,
  stats,
}: ConfirmDialogProps) {
  // ⚠️ QUAN TRỌNG: Nếu không open, return null = không render gì
  if (!open) return null;

  return (
    <>
      {/* 🎯 BACKDROP - Lớp phủ tối phía sau */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onCancel} // Click backdrop = đóng dialog
        aria-hidden="true" // Không cần đọc bởi screen reader
      />

      {/* 🎯 DIALOG CONTAINER - Căn giữa màn hình */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 🎯 DIALOG CONTENT */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
          role="dialog" // Accessibility: định nghĩa role
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          onClick={(e) => e.stopPropagation()} // Ngăn click bubble lên backdrop
        >
          {/* 📌 ICON WARNING */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* 📌 TITLE */}
          <h3
            id="dialog-title"
            className="text-xl font-bold text-gray-900 text-center mb-2"
          >
            {title}
          </h3>

          {/* 📌 MESSAGE */}
          <p id="dialog-description" className="text-gray-600 text-center mb-4">
            {message}
          </p>

          {/* 📌 STATS (nếu có) */}
          {stats && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Đã trả lời:</span>
                <span className="font-semibold text-green-600">
                  {stats.answered}/{stats.total}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Chưa trả lời:</span>
                <span className="font-semibold text-red-600">
                  {stats.unanswered}
                </span>
              </div>
            </div>
          )}

          {/* 📌 BUTTONS */}
          <div className="flex gap-3">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelText}
            </button>

            {/* Confirm Button */}
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 rounded-lg font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Đang nộp..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * 💡 KIẾN THỨC QUAN TRỌNG:
 *
 * 1. FIXED POSITIONING
 *    - fixed inset-0 = vị trí cố định, phủ full màn hình
 *    - z-40, z-50 = layer stack (backdrop dưới, dialog trên)
 *
 * 2. EVENT BUBBLING
 *    - Click dialog content → stopPropagation() → không trigger backdrop click
 *    - Quan trọng để tránh đóng dialog khi click vào nội dung
 *
 * 3. ACCESSIBILITY (a11y)
 *    - role="dialog" → screen reader biết đây là dialog
 *    - aria-labelledby, aria-describedby → liên kết title/description
 *    - aria-hidden="true" trên backdrop → không đọc
 *
 * 4. TAILWIND ANIMATIONS
 *    - animate-in fade-in → fade vào mượt
 *    - zoom-in-95 → scale từ 95% lên 100%
 *    - duration-200 → thời gian animation 200ms
 *
 * 5. OPTIONAL PROPS
 *    - stats? → có thể có hoặc không
 *    - confirmText = "Xác nhận" → default value
 */
