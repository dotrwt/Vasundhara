import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiGetDmrAccounts, apiDeleteDmrAccount } from "../api/dmrac";
import { DmrAc } from "../types";
import { toast } from "sonner";
import { Plus, Search, Edit2, Trash2, IndianRupee, Notebook } from "lucide-react";

export const DmrAcList: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<DmrAc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    document.title = "DMR AC Accounts Management — Vasundhara";
    loadAccounts();
  }, [page, search]);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const response = await apiGetDmrAccounts(page, limit, search);
      if (response.success && response.data) {
        setAccounts(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      }
    } catch (error: any) {
      console.error("Load DMR Accounts error:", error);
      toast.error("Failed to load DMR Accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete DMR Account for "${name}"?`)) {
      return;
    }
    try {
      const response = await apiDeleteDmrAccount(id);
      if (response.success) {
        toast.success("DMR Account deleted successfully");
        loadAccounts();
      }
    } catch (error: any) {
      console.error("Delete DMR Account error:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page
  };

  return (
    <div className="space-y-6">
      {/* Upper header action card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-md transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Notebook className="h-5 w-5 text-earth" />
              DMR AC Crop Loan Management
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mt-1">
              Configure and allocate Kharif/Rabi season Cash & Kind credit limits
            </p>
          </div>
          <Link
            to="/dmrac/new"
            className="h-11 px-4 bg-earth hover:bg-earth-mid text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-md transition-all shadow-sm self-start md:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Allocate Crop Loan
          </Link>
        </div>

        {/* Search bar */}
        <div className="mt-6 flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2.5 max-w-md transition-colors focus-within:ring-2 focus-within:ring-earth/20 focus-within:border-earth">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input
            type="text"
            className="bg-transparent border-0 focus:outline-none focus:ring-0 text-sm w-full dark:text-white"
            placeholder="Search by beneficiary name or remarks..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Accounts List Container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md overflow-hidden transition-all">
        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase animate-pulse">
            Retrieving Crop Loan Ledgers...
          </div>
        ) : accounts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-semibold">
            No crop loan accounts matched your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-xs">
              <thead className="bg-gray-50 dark:bg-gray-850/80 uppercase font-bold text-gray-700 dark:text-gray-300 tracking-wider">
                <tr>
                  <th className="px-6 py-4.5 text-left">Beneficiary Name</th>
                  <th className="px-6 py-4.5 text-right bg-blue-50/10">Kharif Cash</th>
                  <th className="px-6 py-4.5 text-right bg-blue-50/10">Kharif Kind</th>
                  <th className="px-6 py-4.5 text-right bg-emerald-50/10">Rabi Cash</th>
                  <th className="px-6 py-4.5 text-right bg-emerald-50/10">Rabi Kind</th>
                  <th className="px-6 py-4.5 text-right font-black border-l border-gray-100 dark:border-gray-800">Total Allocation</th>
                  <th className="px-6 py-4.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-850">
                {accounts.map((ac) => {
                  const total = ac.kharifCash + ac.kharifKind + ac.rabiCash + ac.rabiKind;
                  return (
                    <tr key={ac.id || ac._id} className="hover:bg-gray-50/30 dark:hover:bg-gray-850/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm text-gray-905 dark:text-white">
                        <div>
                          {ac.farmerName}
                          {ac.farmerId && typeof ac.farmerId === "object" && (
                            <span className="block text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">
                              Reg ID: {(ac.farmerId as any)._id || (ac.farmerId as any).id}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold font-mono text-gray-700 dark:text-gray-300 bg-blue-50/5 dark:bg-blue-950/5">
                        ₹{ac.kharifCash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold font-mono text-gray-700 dark:text-gray-300 bg-blue-50/5 dark:bg-blue-950/5">
                        ₹{ac.kharifKind.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold font-mono text-gray-700 dark:text-gray-300 bg-emerald-50/5 dark:bg-emerald-950/5">
                        ₹{ac.rabiCash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold font-mono text-gray-700 dark:text-gray-300 bg-emerald-50/5 dark:bg-emerald-950/5">
                        ₹{ac.rabiKind.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-black font-mono text-earth dark:text-gold border-l border-gray-100 dark:border-gray-800 text-sm">
                        ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/dmrac/${ac.id || ac._id}/edit`)}
                            className="p-2 border border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer"
                            title="Edit Crop Loan Allocation"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(ac.id || ac._id!, ac.farmerName)}
                            className="p-2 border border-gray-250 dark:border-gray-700 text-gray-650 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer"
                            title="Delete Ledger"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="h-9 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="h-9 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DmrAcList;
