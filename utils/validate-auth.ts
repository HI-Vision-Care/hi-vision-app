export function isValidEmail(email: string) {
  // Regex chuẩn cho email
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.trim());
}

export function isValidPassword(password: string) {
  return password.length >= 8 && !/\s/.test(password);
  // Nếu muốn yêu cầu mạnh hơn, thêm các check chữ hoa, số, ký tự đặc biệt
}

export function isValidPhone(phone: string) {
  // Chỉ số, tối thiểu 9, tối đa 11 ký tự
  return /^\d{9,11}$/.test(phone.trim());
}
