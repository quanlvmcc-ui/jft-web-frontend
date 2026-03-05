"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UpdateProfileBodyType } from "@/schemaValidations/profile.schema";
import { useUploadAvatarMutation } from "@/queries/profile";
import { resizeAndCompressImage, validateImageFile } from "@/lib/image-utils";

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: {
    displayName: string | null;
    phoneNumber: string | null;
    bio: string | null;
    avatarUrl: string | null;
  };
  onSubmit: (data: UpdateProfileBodyType) => Promise<void>;
  isPending?: boolean;
};

export function EditProfileDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isPending = false,
}: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
    bio: "",
    avatarUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  // Hook upload
  const uploadAvatarMutation = useUploadAvatarMutation();

  // Prefill form when dialog opens or when defaultValues change
  useEffect(() => {
    if (open) {
      setFormData({
        displayName: defaultValues.displayName ?? "",
        phoneNumber: defaultValues.phoneNumber ?? "",
        bio: defaultValues.bio ?? "",
        avatarUrl: defaultValues.avatarUrl ?? "",
      });
    }
  }, [
    open,
    defaultValues.displayName,
    defaultValues.phoneNumber,
    defaultValues.bio,
    defaultValues.avatarUrl,
  ]);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setError("");

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "File không hợp lệ");
      return;
    }

    try {
      setIsProcessingImage(true);

      // Resize và compress ảnh (400x400px, < 100KB)
      const processedFile = await resizeAndCompressImage(
        file,
        400,
        400,
        0.8, // 80% quality
      );

      // Kiểm tra size sau khi compress
      console.log("Original size:", (file.size / 1024).toFixed(2), "KB");
      console.log(
        "Compressed size:",
        (processedFile.size / 1024).toFixed(2),
        "KB",
      );

      setSelectedFile(processedFile);

      // Tạo preview URL
      const url = URL.createObjectURL(processedFile);
      setPreviewUrl(url);
    } catch (err) {
      console.error("Image processing error:", err);
      setError("Lỗi xử lý ảnh. Vui lòng thử lại.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalAvatarUrl = formData.avatarUrl;

    // Nếu user chọn file mới, upload trước
    if (selectedFile) {
      try {
        const uploadRes = await uploadAvatarMutation.mutateAsync(selectedFile);
        // uploadRes đã là object (API gọi .json() rồi)
        finalAvatarUrl = uploadRes.avatarUrl;
      } catch (err) {
        console.error("Upload error:", err);
        setError(
          "Lỗi upload ảnh: " +
            (err instanceof Error ? err.message : "Không xác định"),
        );
        return;
      }
    }

    // Submit profile với finalAvatarUrl
    try {
      await onSubmit({
        displayName: formData.displayName || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        bio: formData.bio || undefined,
        avatarUrl: finalAvatarUrl || undefined,
      });

      setSelectedFile(null);
      setPreviewUrl("");
      setError("");
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        "Lỗi: " + (err instanceof Error ? err.message : "Không xác định"),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin cá nhân</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin của bạn và bấm lưu thay đổi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="displayName">Tên hiển thị</Label>
            <Input
              id="displayName"
              placeholder="Nhập tên hiển thị"
              value={formData.displayName}
              onChange={(e) => handleFieldChange("displayName", e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              placeholder="Nhập số điện thoại"
              value={formData.phoneNumber}
              onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={
                isPending || uploadAvatarMutation.isPending || isProcessingImage
              }
            />
            <p className="text-xs text-gray-500">
              Ảnh sẽ tự động được resize về 400x400px và nén để tối ưu tải lên
            </p>

            {/* Loading state */}
            {isProcessingImage && (
              <div className="text-sm text-blue-600 flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                <span>Đang xử lý ảnh...</span>
              </div>
            )}

            {/* Preview */}
            {previewUrl && !isProcessingImage && (
              <div className="mt-2 flex justify-center">
                <div className="relative w-24 h-24">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Tiểu sử</Label>
            <Textarea
              id="bio"
              placeholder="Viết vài dòng về bạn..."
              rows={4}
              value={formData.bio}
              onChange={(e) => handleFieldChange("bio", e.target.value)}
              disabled={isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
