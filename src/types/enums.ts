// ============================================================================
// 📌 ENUMS - Centralized từ Prisma schema
// ============================================================================

/**
 * 💡 Enum vs Zod.enum()
 * - TypeScript enum: runtime object (có size overhead)
 * - Zod.enum(): const array (nhẹ hơn, recommended cho frontend)
 *
 * Ở đây dùng const object để:
 * 1. Có type hints autocomplete
 * 2. Dùng giá trị ở UI (labels, colors)
 * 3. Validate với Zod.enum()
 */

// ============================================================================
// 📚 SECTION TYPE - Phần thi (Script/Vocabulary/Conversation/Listening/Reading)
// ============================================================================

export const SECTION_TYPES = {
  SCRIPT_VOCABULARY: "SCRIPT_VOCABULARY",
  CONVERSATION_EXPRESSION: "CONVERSATION_EXPRESSION",
  LISTENING: "LISTENING",
  READING: "READING",
} as const;

export type SectionType = (typeof SECTION_TYPES)[keyof typeof SECTION_TYPES];

/**
 * 🎨 Label + màu cho UI (component render)
 */
export const SECTION_TYPE_LABELS: Record<
  SectionType,
  { label: string; color: string }
> = {
  SCRIPT_VOCABULARY: { label: "Script & Vocabulary", color: "bg-blue-100" },
  CONVERSATION_EXPRESSION: { label: "Conversation", color: "bg-green-100" },
  LISTENING: { label: "Listening", color: "bg-purple-100" },
  READING: { label: "Reading", color: "bg-orange-100" },
};

// ============================================================================
// ✅ QUESTION STATUS - Trạng thái câu hỏi
// ============================================================================

export const QUESTION_STATUSES = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
} as const;

export type QuestionStatus =
  (typeof QUESTION_STATUSES)[keyof typeof QUESTION_STATUSES];

export const QUESTION_STATUS_LABELS: Record<
  QuestionStatus,
  { label: string; variant: string }
> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  ACTIVE: { label: "Active", variant: "default" },
};

// ============================================================================
// � EXAM STATUS - Trạng thái đề thi
// ============================================================================

export const EXAM_STATUSES = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
} as const;

export type ExamStatus = (typeof EXAM_STATUSES)[keyof typeof EXAM_STATUSES];

export const EXAM_STATUS_LABELS: Record<
  ExamStatus,
  { label: string; variant: string }
> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PUBLISHED: { label: "Published", variant: "default" },
};

// ============================================================================
// �👤 USER ROLE - Phân quyền người dùng
// ============================================================================

export const USER_ROLES = {
  USER: "USER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  USER: "User",
  EDITOR: "Editor",
  ADMIN: "Admin",
};
