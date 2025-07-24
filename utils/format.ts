// src/utils/format.ts

export const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export function toLocalISODate(date: Date) {
  // Trả ra YYYY-MM-DD đúng local time
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

export function toLocalISODatee(date: Date) {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

export function formatDate(date: Date) {
  // ví dụ: Wed, 23/07/2025
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${days[date.getDay()]}, ${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
}

export function formatVietnameseDate(dateString: Date) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  // Lấy thứ, ngày/tháng/năm
  const days = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  const dayName = days[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${dayName}, ${day}/${month}/${year}`;
}
