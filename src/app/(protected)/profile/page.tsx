"use client";

import {
  useChangePasswordMutation,
  useExamHistoryQuery,
  useUpdateProfileMutation,
  useUserProfileQuery,
} from "@/queries/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { useToast } from "@/components/ui/use-toast";
import {
  ChangePasswordBodyType,
  UpdateProfileBodyType,
} from "@/schemaValidations/profile.schema";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import { getAbsoluteAvatarUrl } from "@/lib/avatar-utils";

export default function ProfilePage() {
  const userProfile = useUserProfileQuery();
  const examHistory = useExamHistoryQuery();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const { toast } = useToast();

  const handleUpdateProfile = async (data: UpdateProfileBodyType) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật.",
      });
      setIsEditOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi cập nhật",
        description:
          error instanceof Error ? error.message : "Không thể cập nhật.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async (data: ChangePasswordBodyType) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast({
        title: "Cập nhật thành công",
        description: "Mật khẩu đã được cập nhật.",
      });
      setIsChangePasswordOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật mật khẩu.",
        variant: "destructive",
      });
    }
  };

  if (userProfile.isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  // TODO: Error check
  if (userProfile.error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Lỗi tải thông tin</CardTitle>
            <CardDescription className="text-red-500">
              Không thể tải thông tin cá nhân. Vui lòng thử lại.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 mb-4">
              {userProfile.error instanceof Error
                ? userProfile.error.message
                : "Đã xảy ra lỗi không xác định"}
            </p>
            <Button onClick={() => userProfile.refetch()} variant="destructive">
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // TODO: Render profile info
  const profile = userProfile.data;
  if (!profile) {
    return <div className="container mx-auto p-6">Không tìm thấy dữ liệu</div>;
  }

  // Helper function: Lấy chữ cái đầu từ tên
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Pagination logic
  const paginatedExams = examHistory.data
    ? examHistory.data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )
    : [];

  const totalPages = examHistory.data
    ? Math.ceil(examHistory.data.length / ITEMS_PER_PAGE)
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 flex-shrink-0">
              <AvatarImage
                src={getAbsoluteAvatarUrl(profile.avatarUrl)}
                alt={profile.displayName || profile.email}
              />
              <AvatarFallback>
                {getInitials(profile.displayName || profile.email)}
              </AvatarFallback>
            </Avatar>

            {/* Profile info alongside avatar */}
            <div className="flex-1 space-y-4">
              {/* Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base">{profile.email}</p>
                </div>

                {/* Display Name */}
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Tên hiển thị
                  </p>
                  <p className="text-base">{profile.displayName || "—"}</p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Số điện thoại
                  </p>
                  <p className="text-base">{profile.phoneNumber || "—"}</p>
                </div>

                {/* Role */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Vai trò</p>
                  <p className="text-base capitalize">
                    {profile.role === "USER"
                      ? "Người dùng"
                      : profile.role === "EDITOR"
                        ? "Biên tập viên"
                        : "Quản trị viên"}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Tiểu sử</p>
                  <p className="text-base text-gray-700">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={() => setIsEditOpen(true)}>Chỉnh sửa thông tin</Button>
        <Button onClick={() => setIsChangePasswordOpen(true)} variant="outline">
          Cập nhật mật khẩu
        </Button>
      </div>

      {/* Exam History Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử bài thi</CardTitle>
          <CardDescription>Danh sách các bài thi đã tham gia</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Loading state */}
          {examHistory.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : /* Error state */
          examHistory.error ? (
            <p className="text-sm text-red-600">
              {examHistory.error instanceof Error
                ? examHistory.error.message
                : "Không thể tải lịch sử bài thi"}
            </p>
          ) : /* Has data */
          examHistory.data && examHistory.data.length > 0 ? (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>STT</TableHead>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead className="text-right">% câu đúng</TableHead>
                      <TableHead className="text-right">
                        Thời gian (phút)
                      </TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thời gian làm bài</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedExams.map((exam, index) => (
                      <TableRow key={`${exam.examId}-${currentPage}-${index}`}>
                        <TableCell className="font-medium">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </TableCell>
                        <TableCell>{exam.examTitle}</TableCell>
                        <TableCell className="text-right">
                          {exam.percentage}%
                        </TableCell>
                        <TableCell className="text-right">
                          {Math.round(exam.timeTaken / 60)} phút
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Đã nộp
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(exam.submittedAt).toLocaleString("vi-VN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">
                    Trang {currentPage} / {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Trước
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Tiếp
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty state */
            <p className="text-center text-gray-500 py-8">
              Chưa có bài thi nào
            </p>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        defaultValues={{
          displayName: profile.displayName || "",
          phoneNumber: profile.phoneNumber || "",
          avatarUrl: profile.avatarUrl || "",
          bio: profile.bio || "",
        }}
        onSubmit={handleUpdateProfile}
        isPending={updateProfileMutation.isPending}
      />

      <ChangePasswordDialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
        onSubmit={handleChangePassword}
        isPending={changePasswordMutation.isPending}
      />
    </div>
  );
}
