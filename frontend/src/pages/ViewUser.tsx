import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiGetUserById } from "../api/users";
import { User } from "../types";
import { toast } from "sonner";
import { ArrowLeft, Edit2, ShieldAlert } from "lucide-react";

export const ViewUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      try {
        const response = await apiGetUserById(id);
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          toast.error("User record not found");
          navigate("/dashboard");
        }
      } catch (error: any) {
        console.error("Fetch user error:", error);
        toast.error("Failed to load user profile");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-500 dark:text-gray-400 shadow-md max-w-3xl mx-auto rounded-xl">
        <p className="font-bold text-xs tracking-wider uppercase animate-pulse">
          Retrieving Profile Registry Data...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-500 dark:text-gray-400 shadow-md max-w-3xl mx-auto rounded-xl">
        <ShieldAlert className="h-12 w-12 text-red-550 mx-auto mb-4" />
        <p className="font-bold text-base text-gray-900 dark:text-white uppercase">
          Record Corruption Error
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-semibold">
          This record does not exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-xl shadow-md max-w-3xl mx-auto transition-all duration-300">
      {/* Title */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            Official Land Audit Report
          </h2>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mt-1">
            Registry ID: {user.id || user._id}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="h-10 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer"
          >
            Back
          </button>
          <Link
            to={`/users/${user.id || user._id}/edit`}
            className="h-10 px-4 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-md transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Record
          </Link>
        </div>
      </div>

      {/* Grid view of records */}
      <div className="space-y-8">
        <div>
          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 mb-4 uppercase tracking-wider">
            Personal Information
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2">
              <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Full Name</dt>
              <dd className="font-extrabold text-base text-gray-900 dark:text-white mt-0.5">{user.name}</dd>
            </div>
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2">
              <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Father's Name</dt>
              <dd className="font-bold text-base text-gray-900 dark:text-white mt-0.5">{user.fatherName}</dd>
            </div>
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2">
              <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Mobile Number</dt>
              <dd className="font-bold text-base text-gray-900 dark:text-white mt-0.5">{user.mobile}</dd>
            </div>
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2">
              <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Aadhar Card</dt>
              <dd className="font-bold text-base text-gray-900 dark:text-white mt-0.5">{user.aadhar}</dd>
            </div>
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2">
              <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">PAN Card</dt>
              <dd className="font-bold text-base text-gray-900 dark:text-white mt-0.5 font-mono uppercase">
                {user.pan}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-805 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 mb-4 uppercase tracking-wider">
            Location Details
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2 md:border-b-0">
              <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">District (Jila)</dt>
              <dd className="font-bold text-base text-gray-900 dark:text-white mt-0.5">{user.jila}</dd>
            </div>
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2 md:border-b-0">
              <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Tehsil</dt>
              <dd className="font-bold text-base text-gray-900 dark:text-white mt-0.5">{user.tehsil}</dd>
            </div>
            <div className="pb-2">
              <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Village (Gao)</dt>
              <dd className="font-bold text-base text-gray-900 dark:text-white mt-0.5">{user.gao}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-805 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 mb-4 uppercase tracking-wider">
            Land Holdings Survey Registry
          </h3>
          <div className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-xs">
              <thead className="bg-gray-50 dark:bg-gray-850/80">
                <tr>
                  <th className="px-4 py-2.5 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    #
                  </th>
                  <th className="px-4 py-2.5 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    Survey / Khasra No.
                  </th>
                  <th className="px-4 py-2.5 text-right font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    Area (Rakhva)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {user.landRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2.5 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-2.5 text-gray-900 dark:text-white font-bold">
                      {record.surveyNumber}
                    </td>
                    <td className="px-4 py-2.5 text-gray-950 dark:text-white font-bold text-right">
                      {Number(record.rakhva).toFixed(4)} Hectares
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50/50 dark:bg-blue-950/20 font-bold text-blue-805 dark:text-blue-400">
                  <td colSpan={2} className="px-4 py-3 text-right uppercase tracking-wider text-[10px]">
                    Total Registered Area:
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-black">
                    {user.totalRakhva.toFixed(4)} Hectares
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit details footer */}
        <div className="border border-gray-205 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-850/25 text-[10px] text-gray-500 dark:text-gray-400 font-bold space-y-1 rounded-lg transition-colors">
          <p className="uppercase tracking-wide">
            Record Created At: {new Date(user.createdAt).toLocaleString()} (By:{" "}
            {typeof user.createdBy === "object" ? user.createdBy.name : "System"})
          </p>
          {user.updatedBy && (
            <p className="uppercase tracking-wide">
              Last Updated At: {new Date(user.updatedAt).toLocaleString()} (By:{" "}
              {typeof user.updatedBy === "object" ? user.updatedBy.name : "System"})
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
