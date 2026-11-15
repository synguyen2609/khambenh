// Vietnamese translations for common terms
export const statusTranslations = {
  pending: 'Chờ duyệt',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

export const genderTranslations = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Khác'
};

export const translateStatus = (status) => {
  return statusTranslations[status] || status;
};

export const translateGender = (gender) => {
  return genderTranslations[gender] || gender;
};



