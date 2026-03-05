import { ChangePasswordBodyType } from "@/schemaValidations/profile.schema";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ChangePasswordBodyType) => Promise<void>;
  isPending?: boolean;
};

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: ChangePasswordDialogProps) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Error state - để hiển thị lỗi validation
  const [error, setError] = useState<string>("");

  // Reset form + error khi dialog mở/đóng
  useEffect(() => {
    if (!open) {
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError("");
    }
  }, [open]);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  // ham submit co validation local
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validate password
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới không trùng khớp");
      return;
    }

    if (!formData.oldPassword || !formData.newPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // goi API
    await onSubmit({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật mật khẩu</DialogTitle>
          <DialogDescription>
            Cập nhật của bạn và bấm lưu thay đổi.
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
            <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
            <Input
              id="oldPassword"
              type="password"
              placeholder="Nhập mật khẩu cũ"
              value={formData.oldPassword}
              onChange={(e) => handleFieldChange("oldPassword", e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={formData.newPassword}
              onChange={(e) => handleFieldChange("newPassword", e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleFieldChange("confirmPassword", e.target.value)
              }
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
              {isPending ? "Đang lưu..." : "Cập nhật mật khẩu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
