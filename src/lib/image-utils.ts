/**
 * Resize và compress ảnh để phù hợp với avatar upload
 * Target: < 100KB, kích thước 400x400px
 */
export async function resizeAndCompressImage(
  file: File,
  maxWidth: number = 400,
  maxHeight: number = 400,
  quality: number = 0.8,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Tính toán kích thước mới (giữ tỷ lệ)
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Tạo canvas để resize
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Cannot get canvas context"));
          return;
        }

        // Vẽ ảnh đã resize
        ctx.drawImage(img, 0, 0, width, height);

        // Convert sang Blob với compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Cannot create blob"));
              return;
            }

            // Tạo File mới từ Blob
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, ".jpg"), // Convert sang .jpg
              {
                type: "image/jpeg",
                lastModified: Date.now(),
              },
            );

            resolve(compressedFile);
          },
          "image/jpeg", // Luôn convert sang JPEG để tối ưu size
          quality, // 0.8 = 80% quality
        );
      };

      img.onerror = () => {
        reject(new Error("Cannot load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Cannot read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validate file trước khi process
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check MIME type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Chỉ hỗ trợ file JPG, PNG, WebP, GIF",
    };
  }

  // Check size (max 10MB trước khi compress)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File quá lớn. Tối đa 10MB",
    };
  }

  return { valid: true };
}
