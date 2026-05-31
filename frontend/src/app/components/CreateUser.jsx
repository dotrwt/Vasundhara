import { useState } from "react";
import { useNavigate } from "react-router";
import { createFarmer } from "@/lib/api";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CreateUser() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validateStep1 = () => {
    const newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

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

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePreview = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleEdit = () => {
    setStep(1);
  };

  const addLandRecord = () => {
    setFormData({
      ...formData,
      landRecords: [...formData.landRecords, { surveyNumber: "", rakhva: 0 }],
    });
  };

  const removeLandRecord = (index) => {
    if (formData.landRecords.length > 1) {
      const newRecords = formData.landRecords.filter((_, i) => i !== index);
      setFormData({ ...formData, landRecords: newRecords });
    }
  };

  const updateLandRecord = (index, field, value) => {
    const newRecords = [...formData.landRecords];
    newRecords[index] = { ...newRecords[index], [field]: value };
    setFormData({ ...formData, landRecords: newRecords });
  };

  const calculateTotalRakhva = () => {
    return formData.landRecords.reduce((sum, record) => sum + (Number(record.rakhva) || 0), 0);
  };

  const handleSave = async (returnToDashboard) => {
    setSaving(true);
    try {
      const totalRakhva = calculateTotalRakhva();

      await createFarmer({
        ...formData,
        totalRakhva,
      });

      toast.success("User created successfully");

      if (returnToDashboard) {
        navigate("/dashboard");
      } else {
        // Reset form for creating another user
        setFormData({
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
        setStep(1);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <span className={`font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>User Details</span>
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <span className={`font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>Land Details</span>
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
            <span className={`font-medium ${step >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>Preview</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-white border border-gray-300 p-8">
          {/* Step 1: User Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Step 1: User Details</h2>

              <div>
                <Label htmlFor="name" className="text-base mb-2 block">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 text-base"
                  placeholder="Enter full name"
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
                  placeholder="Enter father's name"
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
                  placeholder="Enter 10-digit mobile number"
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
                  placeholder="Enter 12-digit Aadhar number"
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
                  placeholder="Enter PAN (e.g., ABCDE1234F)"
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
                  placeholder="Enter Farmer ID"
                />
                {errors.farmerId && <p className="text-red-600 text-sm mt-1">{errors.farmerId}</p>}
              </div>

              <div>
                <Label htmlFor="panFile" className="text-base mb-2 block">Upload PAN File (Optional)</Label>
                <Input
                  id="panFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, panFile: file.name });
                    }
                  }}
                  className="h-12 text-base"
                />
                <p className="text-sm text-gray-500 mt-1">PDF or Image files only</p>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNext}
                  className="h-12 text-base font-semibold gap-2 px-8"
                >
                  Next
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Land Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Step 2: Land Details</h2>

              <div>
                <Label htmlFor="jila" className="text-base mb-2 block">Jila *</Label>
                <Input
                  id="jila"
                  value={formData.jila}
                  onChange={(e) => setFormData({ ...formData, jila: e.target.value })}
                  className="h-12 text-base"
                  placeholder="Enter Jila name"
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
                  placeholder="Enter Tehsil name"
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
                  placeholder="Enter village name"
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
                          placeholder="Enter survey number"
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
                          placeholder="Enter rakhva"
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
                  onClick={handleBack}
                  variant="outline"
                  className="h-12 text-base font-semibold gap-2 px-8"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={handlePreview}
                  className="h-12 text-base font-semibold gap-2 px-8"
                >
                  Preview
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Step 3: Preview & Confirm</h2>

              <div className="border border-gray-300 p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-300">User Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-base">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Father Name</p>
                      <p className="font-semibold text-base">{formData.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mobile Number</p>
                      <p className="font-semibold text-base">{formData.mobile}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Aadhar Number</p>
                      <p className="font-semibold text-base">{formData.aadhar}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">PAN Number</p>
                      <p className="font-semibold text-base">{formData.pan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Farmer ID</p>
                      <p className="font-semibold text-base">{formData.farmerId}</p>
                    </div>
                    {formData.panFile && (
                      <div>
                        <p className="text-sm text-gray-600">PAN File</p>
                        <p className="font-semibold text-base">{formData.panFile}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-300">Land Details</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Jila</p>
                      <p className="font-semibold text-base">{formData.jila}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tehsil</p>
                      <p className="font-semibold text-base">{formData.tehsil}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gao</p>
                      <p className="font-semibold text-base">{formData.gao}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">Land Records</p>
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
                          {formData.landRecords.map((record, index) => (
                            <tr key={index} className="border-b border-gray-200 last:border-0">
                              <td className="p-3">{index + 1}</td>
                              <td className="p-3">{record.surveyNumber}</td>
                              <td className="p-3 text-right">{record.rakhva.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="bg-blue-50 font-bold">
                            <td colSpan={2} className="p-3 text-right">Total Rakhva:</td>
                            <td className="p-3 text-right text-blue-600 text-lg">{calculateTotalRakhva().toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="h-12 text-base font-semibold px-8"
                >
                  Edit
                </Button>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSave(false)}
                    disabled={saving}
                    variant="outline"
                    className="h-12 text-base font-semibold px-8"
                  >
                    {saving ? "Saving..." : "Save & Create Another"}
                  </Button>
                  <Button
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="h-12 text-base font-semibold px-8"
                  >
                    {saving ? "Saving..." : "Save & Go to Dashboard"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
