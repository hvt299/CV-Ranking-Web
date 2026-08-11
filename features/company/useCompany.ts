import { useState, useEffect, useCallback } from 'react';
import { companyService } from './company.service';
import toast from 'react-hot-toast';

/**
 * Hook cho Admin quản lý Công ty
 */
export function useAdminCompanies() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCompanies = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await companyService.getAdminCompanies();
            setCompanies(data);
        } catch (error) {
            toast.error('Không thể tải danh sách công ty');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const verifyCompany = async (companyId: string, approve: boolean, rejectionReason: string = '') => {
        try {
            await companyService.verifyCompany(companyId, {
                approve,
                rejection_reason: approve ? null : rejectionReason
            });
            toast.success(approve ? 'Đã duyệt công ty thành công' : 'Đã từ chối công ty');
            await fetchCompanies();
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Lỗi khi xử lý');
            return false;
        }
    };

    const updateCompany = async (companyId: string, payload: any) => {
        try {
            await companyService.updateCompanyByAdmin(companyId, payload);
            toast.success("Cập nhật thông tin thành công!");
            await fetchCompanies();
            return true;
        } catch (e: any) {
            toast.error("Lỗi cập nhật!");
            return false;
        }
    };

    return { companies, isLoading, verifyCompany, updateCompany, refetch: fetchCompanies };
}

/**
 * Hook cho Admin quản lý Users và Phân quyền
 */
export function useAdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        companyService.getAdminUsers()
            .then(data => setUsers(data))
            .catch(() => toast.error('Không thể tải danh sách người dùng'))
            .finally(() => setIsLoading(false));
    }, []);

    const changeUserRole = async (userId: string, newRole: string) => {
        try {
            await companyService.updateUserRole(userId, newRole);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success('Đã cập nhật role thành công');
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Lỗi khi cập nhật role');
            return false;
        }
    };

    return { users, isLoading, changeUserRole };
}