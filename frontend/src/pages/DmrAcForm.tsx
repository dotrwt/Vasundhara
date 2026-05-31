import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiGetUsers } from "../api/users";
import { apiCreateDmrAccount, apiGetDmrAccountById, apiUpdateDmrAccount } from "../api/dmrac";
import { User } from "../types";
import { toast } from "sonner";
import { ArrowLeft, Save, HelpCircle } from "lucide-react";

const dmrAcSchema = z.object({
  farmerName: z.string().min(1, "Farmer name is required").trim(),
  farmerId: z.string().optional().or(z.literal("")),
  kharifCash: z.number().min(0, "Kharif Cash allocation must be at least 0"),
  kharifKind: z.number().min(0, "Kharif Kind allocation must be at least 0"),
  rabiCash: z.number().min(0, "Rabi Cash allocation must be at least 0"),
  rabiKind: z.number().min(0, "Rabi Kind allocation must be at least 0"),
  remarks: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof dmrAcSchema>;

export const DmrAcForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(dmrAcSchema),
    defaultValues: {
      farmerName: "",
      farmerId: "",
      kharifCash: 0,
      kharifKind: 0,
      rabiCash: 0,
      rabiKind: 0,
      remarks: "",
    },
  });

  const watchedFarmerId = watch("farmerId");
  const kharifCashVal = watch("kharifCash") || 0;
  const kharifKindVal = watch("kharifKind") || 0;
  const rabiCashVal = watch("rabiCash") || 0;
  const rabiKindVal = watch("rabiKind") || 0;
  const totalVal = kharifCashVal + kharifKindVal + rabiCashVal + rabiKindVal;

  useEffect(() => {
    document.title = isEdit ? "Modify Crop Loan Allocation — Vasundhara" : "Allocate Crop Loan — Vasundhara";
    loadFormDependencies();
  }, [id]);

  // Autofill name when farmerId changes
  useEffect(() => {
    if (watchedFarmerId && watchedFarmerId !== "") {
      const selectedFarmer = users.find((u) => u.id === watchedFarmerId || u._id === watchedFarmerId);
      if (selectedFarmer) {
        setValue("farmerName", selectedFarmer.name);
      }
    }
  }, [watchedFarmerId, users, setValue]);

  const loadFormDependencies = async () => {
    setLoading(true);
    try {
      // Load users registry list for matching reference (up to 100 to avoid performance bottleneck)
      const userRes = await apiGetUsers(1, 100, "");
      if (userRes.success && userRes.data) {
        setUsers(userRes.data);
      }

      if (isEdit) {
        const dmrRes = await apiGetDmrAccountById(id);
        if (dmrRes.success && dmrRes.data) {
          const ac = dmrRes.data;
          const matchedFarmerId = ac.farmerId && typeof ac.farmerId === "object"
            ? (ac.farmerId as any)._id || (ac.farmerId as any).id
            : ac.farmerId || "";
            
          reset({
            farmerName: ac.farmerName,
            farmerId: matchedFarmerId,
            kharifCash: ac.kharifCash,
            kharifKind: ac.kharifKind,
            rabiCash: ac.rabiCash,
            rabiKind: ac.rabiKind,
            remarks: ac.remarks || "",
          });
        } else {
          toast.error("Crop Loan Account record not found");
          navigate("/dmrac");
        }
      }
    } catch (error: any) {
      console.error("Load form dependencies error:", error);
      toast.error("Failed to load crop loan page dependencies");
      navigate("/dmrac");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    try {
      if (isEdit) {
        const response = await apiUpdateDmrAccount(id, values);
        if (response.success) {
          toast.success("DMR Crop Loan ledger updated successfully");
          navigate("/dmrac");
        }
      } else {
        const response = await apiCreateDmrAccount(values);
        if (response.success) {
          toast.success("DMR Crop Loan ledger created successfully");
          navigate("/dmrac");
        }
      }
    } catch (error: any) {
      console.error("Save DMR Account error:", error);
      toast.error(error.response?.data?.message || "Failed to save crop loan allocation ledger");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-500 dark:text-gray-400 shadow-md max-w-3xl mx-auto rounded-xl">
        <p className="font-bold text-xs tracking-wider uppercase animate-pulse">
          Loading Allocation Panel dependencies...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-xl shadow-md max-w-2xl mx-auto transition-all duration-300">
      {/* Title */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            {isEdit ? "Modify Crop Loan Ledger" : "Allocate Crop Loan Ledger"}
          </h2>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mt-1">
            {isEdit ? `Ledger ID: ${id}` : "Enroll new season limits"}
          </p>
        </div>
        <button
          onClick={() => navigate("/dmrac")}
          className="h-10 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Beneficiary Link Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 uppercase tracking-wider">
            1. Beneficiary Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Link to Registry Farmer (Optional)
              </label>
              <select
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-earth/20 focus:border-earth text-sm rounded-md dark:text-white transition-all"
                {...register("farmerId")}
              >
                <option value="">-- Click to select registered farmer --</option>
                {users.map((u) => (
                  <option key={u.id || u._id} value={u.id || u._id}>
                    {u.name} (Aadhar: {u.aadhar.slice(-4)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Farmer / Beneficiary Name *
              </label>
              <input
                type="text"
                disabled={isSaving || (!!watchedFarmerId && watchedFarmerId !== "")}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-808 focus:outline-none focus:ring-2 focus:ring-earth/20 focus:border-earth text-sm rounded-md dark:text-white transition-all disabled:bg-gray-100 dark:disabled:bg-gray-850"
                placeholder="Enter beneficiary full name"
                {...register("farmerName")}
              />
              {errors.farmerName && (
                <p className="text-red-605 text-xs font-bold mt-1 uppercase">
                  {errors.farmerName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Allocations Limits Section */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-gray-805 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 uppercase tracking-wider flex items-center justify-between">
            <span>2. Seasonal Allocations (Credit Limits)</span>
            <span className="text-earth dark:text-gold text-xs font-black">
              Total: ₹{totalVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 dark:bg-gray-900/40 p-4 rounded-lg border border-gray-100 dark:border-gray-850">
            {/* Kharif Allocations */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-blue-650 dark:text-blue-400 uppercase tracking-widest border-b border-blue-100 dark:border-blue-900 pb-1">
                Kharif Season (Rainy/Monsoon)
              </h4>
              <div>
                <label className="block text-[10px] font-bold text-gray-650 dark:text-gray-400 mb-1 uppercase">
                  Kharif Cash (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  disabled={isSaving}
                  className="block w-full h-10 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-earth/20 focus:border-earth text-sm rounded-md dark:text-white font-mono"
                  placeholder="0.00"
                  {...register("kharifCash", { valueAsNumber: true })}
                />
                {errors.kharifCash && (
                  <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                    {errors.kharifCash.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-650 dark:text-gray-400 mb-1 uppercase">
                  Kharif Kind (Seed/Fertilizer allocation value) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  disabled={isSaving}
                  className="block w-full h-10 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-earth/20 focus:border-earth text-sm rounded-md dark:text-white font-mono"
                  placeholder="0.00"
                  {...register("kharifKind", { valueAsNumber: true })}
                />
                {errors.kharifKind && (
                  <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                    {errors.kharifKind.message}
                  </p>
                )}
              </div>
            </div>

            {/* Rabi Allocations */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-emerald-650 dark:text-emerald-400 uppercase tracking-widest border-b border-emerald-100 dark:border-emerald-900 pb-1">
                Rabi Season (Winter crop)
              </h4>
              <div>
                <label className="block text-[10px] font-bold text-gray-655 dark:text-gray-400 mb-1 uppercase">
                  Rabi Cash (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  disabled={isSaving}
                  className="block w-full h-10 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-earth/20 focus:border-earth text-sm rounded-md dark:text-white font-mono"
                  placeholder="0.00"
                  {...register("rabiCash", { valueAsNumber: true })}
                />
                {errors.rabiCash && (
                  <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                    {errors.rabiCash.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-655 dark:text-gray-400 mb-1 uppercase">
                  Rabi Kind (Seed/Fertilizer allocation value) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  disabled={isSaving}
                  className="block w-full h-10 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-earth/20 focus:border-earth text-sm rounded-md dark:text-white font-mono"
                  placeholder="0.00"
                  {...register("rabiKind", { valueAsNumber: true })}
                />
                {errors.rabiKind && (
                  <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                    {errors.rabiKind.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-gray-808 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 uppercase tracking-wider">
            3. Administrative Remarks
          </h3>
          <div>
            <textarea
              disabled={isSaving}
              rows={3}
              className="block w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-earth/20 focus:border-earth text-sm rounded-md dark:text-white resize-y"
              placeholder="e.g. Allocation approved based on Joint land survey records."
              {...register("remarks")}
            />
          </div>
        </div>

        {/* Form Submission actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            type="submit"
            disabled={isSaving}
            className="h-11 px-6 bg-earth hover:bg-earth-mid text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-md transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Allocation Ledger"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DmrAcForm;
