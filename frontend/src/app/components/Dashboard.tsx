import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, getAccessToken } from "@/lib/supabase";
import { projectId } from "/utils/supabase/info";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/app/components/ui/alert-dialog";
import { Edit, Eye, Trash2, Plus, Download, LogOut, Search } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  fatherName: string;
  mobile: string;
  aadhar: string;
  pan: string;
  panFile?: string;
  farmerId: string;
  jila: string;
  tehsil: string;
  gao: string;
  landRecords: Array<{ surveyNumber: string; rakhva: number }>;
  totalRakhva: number;
  createdAt: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    checkAuth();
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const checkAuth = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data?.session) {
      navigate("/");
      return;
    }
  };

  const fetchUsers = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        navigate("/");
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0769110a/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Fetch users error response:", errorData);
        throw new Error(errorData.error || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      setCurrentPage(1);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.mobile?.includes(query) ||
        user.aadhar?.includes(query) ||
        user.pan?.toLowerCase().includes(query) ||
        user.farmerId?.toLowerCase().includes(query) ||
        user.gao?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const token = await getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0769110a/users/${userToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const exportToExcel = () => {
    // Create CSV format
    const headers = ["Name", "Father Name", "Mobile", "Aadhar", "PAN", "Farmer ID", "Jila", "Tehsil", "Gao", "Total Rakhva"];
    const csvData = filteredUsers.map(user => [
      user.name,
      user.fatherName,
      user.mobile,
      user.aadhar,
      user.pan,
      user.farmerId,
      user.jila,
      user.tehsil,
      user.gao,
      user.totalRakhva
    ]);

    const csv = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Data exported successfully");
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">User Management System</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="h-10 gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white border border-gray-300 p-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => navigate("/create-user")}
              className="h-12 text-base font-semibold gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Create New User
            </Button>

            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by Name, Mobile, Aadhar, PAN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-10 text-base"
                />
              </div>
              <Button
                onClick={exportToExcel}
                variant="outline"
                className="h-10 gap-2"
              >
                <Download className="h-4 w-4" />
                Export to Excel
              </Button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? "No users found matching your search" : "No users yet. Create your first user."}
            </div>
          ) : (
            <>
              <div className="border border-gray-300">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-bold text-gray-900 text-base h-12">Name</TableHead>
                      <TableHead className="font-bold text-gray-900 text-base h-12">Mobile Number</TableHead>
                      <TableHead className="font-bold text-gray-900 text-base h-12">Village (Gao)</TableHead>
                      <TableHead className="font-bold text-gray-900 text-base h-12">Jila</TableHead>
                      <TableHead className="font-bold text-gray-900 text-base h-12">Total Rakhva</TableHead>
                      <TableHead className="font-bold text-gray-900 text-base h-12 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow key={user.id} className="h-14">
                        <TableCell className="font-medium text-base">{user.name}</TableCell>
                        <TableCell className="text-base">{user.mobile}</TableCell>
                        <TableCell className="text-base">{user.gao}</TableCell>
                        <TableCell className="text-base">{user.jila}</TableCell>
                        <TableCell className="text-base">{user.totalRakhva}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => navigate(`/view-user/${user.id}`)}
                              variant="outline"
                              size="sm"
                              className="h-9 gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              onClick={() => navigate(`/edit-user/${user.id}`)}
                              variant="outline"
                              size="sm"
                              className="h-9 gap-1"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => {
                                setUserToDelete(user.id);
                                setDeleteDialogOpen(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="h-9 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="h-9"
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="h-9"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="h-10 bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}