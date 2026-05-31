import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUsers from "../hooks/useUsers";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import { Plus, Download, Eye, Edit2, Trash2 } from "lucide-react";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    users,
    loading,
    search,
    page,
    limit,
    pagination,
    setSearch,
    setPage,
    deleteUser,
    exportExcel,
  } = useUsers();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteUser(deleteId);
      setDeleteId(null);
      setIsConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
    setIsConfirmOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-xl shadow-md transition-all duration-300">
      {/* Title block */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            Land Record Registry Database
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mt-1">
            Registered farmers and survey audits report
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportExcel}
            className="h-11 px-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-200 font-bold uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer bg-white dark:bg-gray-800 rounded-md transition-all duration-200 shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export Database (Excel)
          </button>
          <button
            onClick={() => navigate("/users/new")}
            className="h-11 px-5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer rounded-md transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add New Record
          </button>
        </div>
      </div>

      {/* Stats summary banner */}
      <div className="bg-gray-50 dark:bg-gray-850/50 border border-gray-250/10 dark:border-gray-800 p-4 mb-6 rounded-lg flex items-center justify-between transition-colors duration-300 shadow-inner">
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">
            Total Enrolled Profiles:
          </span>
          <strong className="text-xl font-extrabold text-gray-900 dark:text-white ml-2">
            {pagination.total}
          </strong>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest bg-gray-200/50 dark:bg-gray-800 px-3 py-1.5 rounded-full">
          STATUS: ACTIVE AUDIT SESSION
        </div>
      </div>

      {/* Filter and Search section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-stretch">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter by Name, Mobile, Aadhar, PAN, Village..."
        />
      </div>

      {/* Grid Table */}
      {loading ? (
        <div className="border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-850/20 rounded-lg shadow-inner">
          <p className="font-bold text-xs tracking-wider uppercase animate-pulse">
            Retrieving Registry Records...
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-850/20 rounded-lg">
          <p className="font-bold text-base text-gray-900 dark:text-white uppercase">
            No Records Found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-semibold">
            {search
              ? "No files matching your search terms exist in the registry."
              : "No user files have been registered on the server yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-850/80">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    Full Name
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    Mobile Number
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    Aadhar Number
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    PAN Card
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    Village (Gao)
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    Total Rakhva
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 w-48">
                    Audit Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id || user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors duration-150">
                    <td className="px-4 py-3 text-sm font-bold text-gray-950 dark:text-white whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-650 dark:text-gray-300 whitespace-nowrap">
                      {user.mobile}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-650 dark:text-gray-300 whitespace-nowrap">
                      {user.aadhar}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-650 dark:text-gray-300 whitespace-nowrap font-mono">
                      {user.pan}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-650 dark:text-gray-300 whitespace-nowrap">
                      {user.gao}
                    </td>
                    <td className="px-4 py-3 text-sm font-black text-gray-950 dark:text-white whitespace-nowrap text-right">
                      {user.totalRakhva.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-center">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => navigate(`/users/${user.id || user._id}`)}
                          className="h-8 px-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 cursor-pointer rounded transition-all"
                          title="View user details"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/users/${user.id || user._id}/edit`)}
                          className="h-8 px-2.5 border border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-455 hover:bg-blue-100/50 dark:hover:bg-blue-950/40 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 cursor-pointer rounded transition-all"
                          title="Edit user details"
                        >
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.id || user._id!)}
                          className="h-8 px-2.5 border border-red-200 dark:border-red-950/30 bg-red-50/50 dark:bg-red-950/20 text-red-650 dark:text-red-455 hover:bg-red-100/50 dark:hover:bg-red-950/40 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 cursor-pointer rounded transition-all"
                          title="Delete user"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination component */}
      {!loading && users.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          limit={limit}
          onPageChange={setPage}
        />
      )}

      {/* Confirmation modal for deletion */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm Audited File Deletion"
        message="Are you sure you want to delete this user file from the registry database? This operation is permanent and cannot be undone."
        confirmText="Permanently Delete"
        cancelText="Keep Record"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Dashboard;
