// Validate name: tối thiểu 2 ký tự, không toàn khoảng trắng
export function isValidName(name: string) {
  return /^[a-zA-ZÀ-ỹ\s'-]{2,}$/.test(name.trim());
}

// Validate ngày sinh: đúng định dạng dd/mm/yyyy và là ngày hợp lệ, không tương lai, không quá 120 tuổi
export function isValidDob(dob: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) return false;
  const [dd, mm, yyyy] = dob.split("/").map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  const now = new Date();
  if (
    date.getFullYear() !== yyyy ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd ||
    date > now ||
    now.getFullYear() - yyyy > 120
  ) {
    return false;
  }
  return true;
}

export function isValidMedNo(medNo: string) {
  return /^[A-Z]{2}\d{13}$/.test(medNo.trim());
}
export function isValidMedDate(medDate: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(medDate)) return false;
  const [dd, mm, yyyy] = medDate.split("/").map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  const now = new Date();
  if (
    date.getFullYear() !== yyyy ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd ||
    date > now ||
    yyyy < now.getFullYear() - 30 // hạn chế quá xa về quá khứ
  ) {
    return false;
  }
  return true;
}
export function isValidMedFac(medFac: string) {
  return medFac.trim().length >= 4;
}
