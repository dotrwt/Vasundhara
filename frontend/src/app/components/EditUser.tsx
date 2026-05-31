import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccessToken } from "@/lib/supabase";
import { projectId } from "/utils/supabase/info";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface LandRecord {
  surveyNumber: string;
  rakhva: number;
}

interface FormData {
  name: string;
  fatherName: string;
  mobile: string;
  aadhar: string;
  pan: string;
  panFile: string;
  farmerId: string;
  jila: string;
  tehsil: string;
  gao: string;
  landRecords: LandRecord[];
}

export function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    fatherName: "",
    mobile: "",
    aadhar: "",
    pan: "",
    panFile: "",
    farmerId: "",
    jila: "",
    tehsil: "",
    gao: "",
    landRecords: [{ surveyNumber: "", rakhva: 0 }],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0769110a/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      setFormData(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father name is required";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.aadhar.trim()) {
      newErrors.aadhar = "Aadhar number is required";
    } else if (!/^\d{12}$/.test(formData.aadhar)) {
      newErrors.aadhar = "Aadhar number must be 12 digits";
    }
    if (!formData.pan.trim()) {
      newErrors.pan = "PAN number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.pan)) {
      newErrors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
    }
    if (!formData.farmerId.trim()) {
      newErrors.farmerId = "Farmer ID is required";
    }
    if (!formData.jila.trim()) {
      newErrors.jila = "Jila is required";
    }
    if (!formData.tehsil.trim()) {
      newErrors.tehsil = "Tehsil is required";
    }
    if (!formData.gao.trim()) {
      newErrors.gao = "Gao is required";
    }

    formData.landRecords.forEach((record, index) => {
      if (!record.surveyNumber.trim()) {
        newErrors[`surveyNumber_${index}`] = "Survey number is required";
      }
      if (record.rakhva <= 0) {
        newErrors[`rakhva_${index}`] = "Rakhva must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addLandRecord = () => {
    setFormData({
      ...formData,
      landRecords: [...formData.landRecords, { surveyNumber: "", rakhva: 0 }],
    });
  };

  const removeLandRecord = (index: number) => {
    if (formData.landRecords.length > 1) {
      const newRecords = formData.landRecords.filter((_, i) => i !== index);
      setFormData({ ...formData, landRecords: newRecords });
    }
  };

  const updateLandRecord = (index: number, field: keyof LandRecord, value: string | number) => {
    const newRecords = [...formData.landRecords];
    newRecords[index] = { ...newRecords[index], [field]: value };
    setFormData({ ...formData, landRecords: newRecords });
  };

  const calculateTotalRakhva = () => {
    return formData.landRecords.reduce((sum, record) => sum + (Number(record.rakhva) || 0), 0);
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setSaving(true);
    try {
      const token = await getAccessToken();
      const totalRakhva = calculateTotalRakhva();

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0769110a/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            totalRakhva,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      toast.success("User updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="h-10 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-white border border-gray-300 p-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Details</h2>

            <div>
              <Label htmlFor="name" className="text-base mb-2 block">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 text-base"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="fatherName" className="text-base mb-2 block">Father Name *</Label>
              <Input
                id="fatherName"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="h-12 text-base"
              />
              {errors.fatherName && <p className="text-red-600 text-sm mt-1">{errors.fatherName}</p>}
            </div>

            <div>
              <Label htmlFor="mobile" className="text-base mb-2 block">Mobile Number (10 digits) *</Label>
              <Input
                id="mobile"
                type="tel"
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                className="h-12 text-base"
              />
              {errors.mobile && <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <Label htmlFor="aadhar" className="text-base mb-2 block">Aadhar Number (12 digits) *</Label>
              <Input
                id="aadhar"
                type="tel"
                maxLength={12}
                value={formData.aadhar}
                onChange={(e) => setFormData({ ...formData, aadhar: e.target.value.replace(/\D/g, '') })}
                className="h-12 text-base"
              />
              {errors.aadhar && <p className="text-red-600 text-sm mt-1">{errors.aadhar}</p>}
            </div>

            <div>
              <Label htmlFor="pan" className="text-base mb-2 block">PAN Number *</Label>
              <Input
                id="pan"
                maxLength={10}
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                className="h-12 text-base"
              />
              {errors.pan && <p className="text-red-600 text-sm mt-1">{errors.pan}</p>}
            </div>

            <div>
              <Label htmlFor="farmerId" className="text-base mb-2 block">Farmer ID *</Label>
              <Input
                id="farmerId"
                value={formData.farmerId}
                onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                className="h-12 text-base"
              />
              {errors.farmerId && <p className="text-red-600 text-sm mt-1">{errors.farmerId}</p>}
            </div>

            <div>
              <Label htmlFor="jila" className="text-base mb-2 block">Jila *</Label>
              <Input
                id="jila"
                value={formData.jila}
                onChange={(e) => setFormData({ ...formData, jila: e.target.value })}
                className="h-12 text-base"
              />
              {errors.jila && <p className="text-red-600 text-sm mt-1">{errors.jila}</p>}
            </div>

            <div>
              <Label htmlFor="tehsil" className="text-base mb-2 block">Tehsil *</Label>
              <Input
                id="tehsil"
                value={formData.tehsil}
                onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                className="h-12 text-base"
              />
              {errors.tehsil && <p className="text-red-600 text-sm mt-1">{errors.tehsil}</p>}
            </div>

            <div>
              <Label htmlFor="gao" className="text-base mb-2 block">Gao (Village) *</Label>
              <Input
                id="gao"
                value={formData.gao}
                onChange={(e) => setFormData({ ...formData, gao: e.target.value })}
                className="h-12 text-base"
              />
              {errors.gao && <p className="text-red-600 text-sm mt-1">{errors.gao}</p>}
            </div>

            <div className="border-t border-gray-300 pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-bold">Land Records</Label>
                <Button
                  type="button"
                  onClick={addLandRecord}
                  className="h-10 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Land Record
                </Button>
              </div>

              {formData.landRecords.map((record, index) => (
                <div key={index} className="border border-gray-300 p-4 mb-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Record {index + 1}</h3>
                    {formData.landRecords.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeLandRecord(index)}
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`survey_${index}`} className="text-base mb-2 block">Survey Number *</Label>
                      <Input
                        id={`survey_${index}`}
                        value={record.surveyNumber}
                        onChange={(e) => updateLandRecord(index, 'surveyNumber', e.target.value)}
                        className="h-12 text-base"
                      />
                      {errors[`surveyNumber_${index}`] && (
                        <p className="text-red-600 text-sm mt-1">{errors[`surveyNumber_${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`rakhva_${index}`} className="text-base mb-2 block">Rakhva *</Label>
                      <Input
                        id={`rakhva_${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={record.rakhva || ''}
                        onChange={(e) => updateLandRecord(index, 'rakhva', parseFloat(e.target.value) || 0)}
                        className="h-12 text-base"
                      />
                      {errors[`rakhva_${index}`] && (
                        <p className="text-red-600 text-sm mt-1">{errors[`rakhva_${index}`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 border border-blue-200 p-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">Total Rakhva:</span>
                  <span className="font-bold text-2xl text-blue-600">{calculateTotalRakhva().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="h-12 text-base font-semibold px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="h-12 text-base font-semibold px-8"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}