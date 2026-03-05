"use client";

import { useState, useEffect } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      displayName: formData.displayName || undefined,
      phoneNumber: formData.phoneNumber || undefined,
      bio: formData.bio || undefined,
      avatarUrl: formData.avatarUrl || undefined,
    });
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
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              placeholder="https://example.com/avatar.jpg"
              value={formData.avatarUrl}
              onChange={(e) => handleFieldChange("avatarUrl", e.target.value)}
              disabled={isPending}
            />
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
