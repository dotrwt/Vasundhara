import { useState, useEffect, useCallback } from "react";
import { User } from "../types";
import { apiGetUsers, apiDeleteUser, apiExportUsersExcel } from "../api/users";
import { toast } from "sonner";

export const useUsers = (initialPage = 1, initialLimit = 10) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiGetUsers(page, limit, search);
      if (response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      }
    } catch (error: any) {
      console.error("Fetch users error:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset page to 1 when search query changes
  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  const handleDeleteUser = async (id: string): Promise<boolean> => {
    try {
      const response = await apiDeleteUser(id);
      if (response.success) {
        toast.success("User deleted successfully");
        fetchUsers();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Delete user error:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
      return false;
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await apiExportUsersExcel();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `users_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Excel report exported successfully");
    } catch (error: any) {
      console.error("Excel export error:", error);
      toast.error("Failed to export Excel report");
    }
  };

  return {
    users,
    loading,
    search,
    page,
    limit,
    pagination,
    setSearch: handleSearchChange,
    setPage,
    refresh: fetchUsers,
    deleteUser: handleDeleteUser,
    exportExcel: handleExportExcel,
  };
};

export default useUsers;
