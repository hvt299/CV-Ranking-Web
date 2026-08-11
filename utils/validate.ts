/**
 * Kiểm tra định dạng Mã số thuế (10 số, có thể kèm mã chi nhánh 3 số)
 */
export const validateMST = (mst: string): boolean => {
    const mstRegex = /^\d{10}(-\d{3})?$/;
    return mstRegex.test(mst.trim());
};

/**
 * Kiểm tra định dạng Email
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

/**
 * Kiểm tra cấu trúc mật khẩu mạnh (như Backend đã định nghĩa)
 */
export const validateStrongPassword = (password: string): boolean => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_=])[A-Za-z\d@$!%*?&#+\-_=]{8,}$/;
    return pattern.test(password);
};