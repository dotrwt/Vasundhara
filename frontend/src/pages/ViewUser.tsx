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
      <div className="bg-white border-2 border-gray-400 p-12 text-center text-gray-600 shadow-sm max-w-3xl mx-auto">
        <p className="font-bold text-sm tracking-wider uppercase animate-pulse">
          Retrieving Profile Registry Data...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white border-2 border-gray-400 p-12 text-center text-gray-600 shadow-sm max-w-3xl mx-auto">
        <ShieldAlert className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <p className="font-bold text-base text-gray-900 uppercase">
          Record Corruption Error
        </p>
        <p className="text-sm text-gray-500 mt-1 font-semibold">
          This record does not exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-400 p-6 md:p-8 shadow-sm max-w-3xl mx-auto">
      {/* Title */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
            Official Land Audit Report
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase mt-1">
            Registry ID: {user.id || user._id}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="h-10 px-4 border border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-sm uppercase tracking-wider cursor-pointer"
          >
            Back
          </button>
          <Link
            to={`/users/${user.id || user._id}/edit`}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Record
          </Link>
        </div>
      </div>

      {/* Grid view of records */}
      <div className="space-y-8">
        <div>
          <h3 className="text-base font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider">
            Personal Information
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="border-b border-gray-100 pb-2">
              <dt className="text-gray-500 font-bold uppercase text-xs">Full Name</dt>
              <dd className="font-extrabold text-base text-gray-900 mt-0.5">{user.name}</dd>
            </div>
            <div className="border-b border-gray-100 pb-2">
              <dt className="text-gray-500 font-bold uppercase text-xs">Father's Name</dt>
              <dd className="font-bold text-base text-gray-900 mt-0.5">{user.fatherName}</dd>
            </div>
            <div className="border-b border-gray-100 pb-2">
              <dt className="text-gray-500 font-bold uppercase text-xs">Mobile Number</dt>
              <dd className="font-bold text-base text-gray-900 mt-0.5">{user.mobile}</dd>
            </div>
            <div className="border-b border-gray-100 pb-2">
              <dt className="text-gray-500 font-bold uppercase text-xs">Aadhar Card</dt>
              <dd className="font-bold text-base text-gray-900 mt-0.5">{user.aadhar}</dd>
            </div>
            <div className="border-b border-gray-100 pb-2">
              <dt className="text-gray-500 font-bold uppercase text-xs">PAN Card</dt>
              <dd className="font-bold text-base text-gray-900 mt-0.5 font-mono uppercase">
                {user.pan}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider">
            Location Details
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="border-b border-gray-100 pb-2 md:border-b-0">
              <dt className="text-gray-500 font-bold uppercase text-xs">District (Jila)</dt>
              <dd className="font-bold text-base text-gray-900 mt-0.5">{user.jila}</dd>
            </div>
            <div className="border-b border-gray-100 pb-2 md:border-b-0">
              <dt className="text-gray-500 font-bold uppercase text-xs">Tehsil</dt>
              <dd className="font-bold text-base text-gray-900 mt-0.5">{user.tehsil}</dd>
            </div>
            <div className="pb-2">
              <dt className="text-gray-500 font-bold uppercase text-xs">Village (Gao)</dt>
              <dd className="font-bold text-base text-gray-900 mt-0.5">{user.gao}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider">
            Land Holdings Survey Registry
          </h3>
          <div className="overflow-x-auto border border-gray-400">
            <table className="min-w-full divide-y divide-gray-300 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    #
                  </th>
                  <th className="px-4 py-2.5 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Survey / Khasra No.
                  </th>
                  <th className="px-4 py-2.5 text-right font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Area (Rakhva)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {user.landRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2.5 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-2.5 text-gray-900 font-bold">
                      {record.surveyNumber}
                    </td>
                    <td className="px-4 py-2.5 text-gray-900 font-bold text-right">
                      {Number(record.rakhva).toFixed(4)} Hectares
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold text-blue-900">
                  <td colSpan={2} className="px-4 py-3 text-right uppercase tracking-wider text-xs">
                    Total Registered Area:
                  </td>
                  <td className="px-4 py-3 text-right text-base">
                    {user.totalRakhva.toFixed(4)} Hectares
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit details footer */}
        <div className="border border-gray-300 p-4 bg-gray-50 text-xs text-gray-500 font-bold space-y-1">
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
