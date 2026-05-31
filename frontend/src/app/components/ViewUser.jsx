import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getFarmer } from "@/lib/api";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from "sonner";

export function ViewUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const data = await getFarmer(id);
      setUser(data.farmer);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="h-10 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">View User</h1>
          </div>
          <Button
            onClick={() => navigate(`/edit-user/${id}`)}
            className="h-10 gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit User
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-white border border-gray-300 p-8">
          <div className="space-y-6">
            {/* User Details Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-300">User Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-semibold text-base">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Father Name</p>
                  <p className="font-semibold text-base">{user.fatherName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mobile Number</p>
                  <p className="font-semibold text-base">{user.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aadhar Number</p>
                  <p className="font-semibold text-base">{user.aadhar}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">PAN Number</p>
                  <p className="font-semibold text-base">{user.pan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Farmer ID</p>
                  <p className="font-semibold text-base">{user.farmerId}</p>
                </div>
                {user.panFile && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">PAN File</p>
                    <p className="font-semibold text-base">{user.panFile}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Land Details Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-300">Land Details</h2>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Jila</p>
                  <p className="font-semibold text-base">{user.jila}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tehsil</p>
                  <p className="font-semibold text-base">{user.tehsil}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Gao (Village)</p>
                  <p className="font-semibold text-base">{user.gao}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-3 text-base">Land Records</p>
                <div className="border border-gray-300">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-3 font-bold border-b border-gray-300">#</th>
                        <th className="text-left p-3 font-bold border-b border-gray-300">Survey Number</th>
                        <th className="text-right p-3 font-bold border-b border-gray-300">Rakhva</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.landRecords.map((record, index) => (
                        <tr key={index} className="border-b border-gray-200 last:border-0">
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3">{record.surveyNumber}</td>
                          <td className="p-3 text-right">{record.rakhva.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-bold">
                        <td colSpan={2} className="p-3 text-right text-base">Total Rakhva:</td>
                        <td className="p-3 text-right text-blue-600 text-xl">{user.totalRakhva.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-300 pt-4">
              <p className="text-sm text-gray-500">
                Created on: {new Date(user.createdAt).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
