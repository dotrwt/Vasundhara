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
    <div className="bg-white border-2 border-gray-400 p-6 md:p-8 shadow-sm">
      {/* Title block */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
            Land Record Registry Database
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase mt-1">
            Registered farmers and survey audits report
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportExcel}
            className="h-11 px-4 border-2 border-gray-400 hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-bold uppercase tracking-wider text-sm flex items-center gap-2 cursor-pointer bg-white"
          >
            <Download className="h-4 w-4" />
            Export Database (Excel)
          </button>
          <button
            onClick={() => navigate("/users/new")}
            className="h-11 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 border-2 border-blue-700 text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add New Record
          </button>
        </div>
      </div>

      {/* Stats summary banner */}
      <div className="bg-gray-100 border border-gray-300 p-4 mb-6 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
            Total Enrolled Profiles:
          </span>
          <strong className="text-xl font-extrabold text-gray-900 ml-2">
            {pagination.total}
          </strong>
        </div>
        <div className="text-xs text-gray-500 font-bold uppercase">
          Status: ACTIVE AUDIT SESSION
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
        <div className="border border-gray-300 p-12 text-center text-gray-600 bg-gray-50">
          <p className="font-bold text-sm tracking-wider uppercase animate-pulse">
            Retrieving Registry Records...
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="border border-gray-300 p-12 text-center text-gray-600 bg-gray-50">
          <p className="font-bold text-base text-gray-900 uppercase">
            No Records Found
          </p>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            {search
              ? "No files matching your search filter terms exist in the registry."
              : "No user files have been registered on the server yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-400">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  Full Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  Mobile Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  Aadhar Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  PAN Card
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  Village (Gao)
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  Total Rakhva
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 w-48">
                  Audit Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {users.map((user) => (
                <tr key={user.id || user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {user.mobile}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {user.aadhar}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap font-mono">
                    {user.pan}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {user.gao}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 whitespace-nowrap text-right">
                    {user.totalRakhva.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-center">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => navigate(`/users/${user.id || user._id}`)}
                        className="h-8 px-2 border border-gray-400 bg-gray-50 hover:bg-gray-150 text-gray-800 font-bold uppercase tracking-wider text-xs flex items-center gap-1 cursor-pointer"
                        title="View user details"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/users/${user.id || user._id}/edit`)}
                        className="h-8 px-2 border border-gray-400 bg-gray-50 hover:bg-gray-150 text-blue-800 font-bold uppercase tracking-wider text-xs flex items-center gap-1 cursor-pointer"
                        title="Edit user details"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id || user._id!)}
                        className="h-8 px-2 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold uppercase tracking-wider text-xs flex items-center gap-1 cursor-pointer"
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
