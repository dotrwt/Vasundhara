import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiGetUserById, apiUpdateUser } from "../api/users";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

const fullSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  fatherName: z.string().min(1, "Father's name is required").trim(),
  mobile: z.string().regex(/^\d{10}$/, "Mobile must be exactly 10 digits"),
  aadhar: z.string().regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
  pan: z
    .string()
    .toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN must be a valid format (e.g., ABCDE1234F)"),
  samagraId: z
    .string()
    .regex(/^\d{9}$/, "Samagra ID must be exactly 9 digits")
    .optional()
    .or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  farmerCategory: z.string().optional().or(z.literal("")),
  bankAccountNo: z
    .string()
    .regex(/^\d{9,18}$/, "Bank Account must be 9 to 18 digits")
    .optional()
    .or(z.literal("")),
  ifscCode: z
    .string()
    .toUpperCase()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "IFSC must be standard (e.g. SBIN0001234)")
    .optional()
    .or(z.literal("")),
  jila: z.string().min(1, "Jila is required").trim(),
  tehsil: z.string().min(1, "Tehsil is required").trim(),
  gao: z.string().min(1, "Village (Gao) is required").trim(),
  landRecords: z
    .array(
      z.object({
        surveyNumber: z.string().min(1, "Survey number is required").trim(),
        rakhva: z.number().positive("Rakhva must be greater than 0"),
      })
    )
    .min(1, "At least one land record is required"),
});

type FormValues = z.infer<typeof fullSchema>;

export const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      name: "",
      fatherName: "",
      mobile: "",
      aadhar: "",
      pan: "",
      samagraId: "",
      gender: "",
      farmerCategory: "",
      bankAccountNo: "",
      ifscCode: "",
      jila: "",
      tehsil: "",
      gao: "",
      landRecords: [{ surveyNumber: "", rakhva: 0.1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "landRecords",
  });

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      try {
        const response = await apiGetUserById(id);
        if (response.success && response.data) {
          const user = response.data;
          reset({
            name: user.name,
            fatherName: user.fatherName,
            mobile: user.mobile,
            aadhar: user.aadhar,
            pan: user.pan,
            samagraId: user.samagraId || "",
            gender: user.gender || "",
            farmerCategory: user.farmerCategory || "",
            bankAccountNo: user.bankAccountNo || "",
            ifscCode: user.ifscCode || "",
            jila: user.jila,
            tehsil: user.tehsil,
            gao: user.gao,
            landRecords: user.landRecords.map((r) => ({
              surveyNumber: r.surveyNumber,
              rakhva: Number(r.rakhva),
            })),
          });
        } else {
          toast.error("User record not found");
          navigate("/dashboard");
        }
      } catch (error: any) {
        console.error("Fetch user error:", error);
        toast.error("Failed to retrieve user registry record");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, reset, navigate]);

  // Watch land records to calculate total rakhva
  const watchedLandRecords = getValues("landRecords") || [];
  const calculatedTotalRakhva = watchedLandRecords.reduce((sum, item) => {
    return sum + (Number(item?.rakhva) || 0);
  }, 0);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;
    setIsSaving(true);
    try {
      values.pan = values.pan.toUpperCase();
      if (values.ifscCode) values.ifscCode = values.ifscCode.toUpperCase();
      const response = await apiUpdateUser(id, values);
      if (response.success) {
        toast.success("Registry record updated successfully");
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Failed to update record");
      }
    } catch (error: any) {
      console.error("Update user error:", error);
      const errMsg = error.response?.data?.message || "Failed to save updates. Check validations.";
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-500 dark:text-gray-400 shadow-md max-w-3xl mx-auto rounded-xl">
        <p className="font-bold text-xs tracking-wider uppercase animate-pulse">
          Retrieving Profile Registry Data...
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
            Edit Audit Registry Entry
          </h2>
          <p className="text-xs text-gray-505 dark:text-gray-400 font-bold uppercase mt-1">
            Update registry details below
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="h-10 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal details */}
        <div>
          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 mb-4 uppercase tracking-wider">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Full Name *
              </label>
              <input
                type="text"
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                placeholder="Enter full name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Father's Name *
              </label>
              <input
                type="text"
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-805 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                placeholder="Enter father's name"
                {...register("fatherName")}
              />
              {errors.fatherName && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.fatherName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Mobile Number (10 Digits) *
              </label>
              <input
                type="text"
                maxLength={10}
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                placeholder="e.g. 9876543210"
                {...register("mobile")}
                onChange={(e) => {
                  setValue("mobile", e.target.value.replace(/\D/g, ""));
                  trigger("mobile");
                }}
              />
              {errors.mobile && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Aadhar Card Number (12 Digits) *
              </label>
              <input
                type="text"
                maxLength={12}
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                placeholder="e.g. 543210987654"
                {...register("aadhar")}
                onChange={(e) => {
                  setValue("aadhar", e.target.value.replace(/\D/g, ""));
                  trigger("aadhar");
                }}
              />
              {errors.aadhar && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.aadhar.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                PAN Card Number (10 Characters) *
              </label>
              <input
                type="text"
                maxLength={10}
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-805 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white font-mono uppercase transition-all"
                placeholder="ABCDE1234F"
                {...register("pan")}
                onChange={(e) => {
                  setValue("pan", e.target.value.toUpperCase());
                  trigger("pan");
                }}
              />
              {errors.pan && (
                <p className="text-red-650 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.pan.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Samagra ID (9 Digits)
              </label>
              <input
                type="text"
                maxLength={9}
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-808 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                placeholder="e.g. 123456789"
                {...register("samagraId")}
                onChange={(e) => {
                  setValue("samagraId", e.target.value.replace(/\D/g, ""));
                  trigger("samagraId");
                }}
              />
              {errors.samagraId && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.samagraId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Gender
              </label>
              <select
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-808 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                {...register("gender")}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Farmer Category
              </label>
              <select
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-808 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                {...register("farmerCategory")}
              >
                <option value="">Select Category</option>
                <option value="Marginal">Marginal</option>
                <option value="Small">Small</option>
                <option value="Semi-Medium">Semi-Medium</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              {errors.farmerCategory && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.farmerCategory.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Bank Account Number
              </label>
              <input
                type="text"
                maxLength={18}
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-808 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                placeholder="e.g. 123456789012"
                {...register("bankAccountNo")}
                onChange={(e) => {
                  setValue("bankAccountNo", e.target.value.replace(/\D/g, ""));
                  trigger("bankAccountNo");
                }}
              />
              {errors.bankAccountNo && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.bankAccountNo.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Bank IFSC Code
              </label>
              <input
                type="text"
                maxLength={11}
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-808 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white font-mono uppercase transition-all"
                placeholder="e.g. SBIN0001234"
                {...register("ifscCode")}
                onChange={(e) => {
                  setValue("ifscCode", e.target.value.toUpperCase());
                  trigger("ifscCode");
                }}
              />
              {errors.ifscCode && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.ifscCode.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Location & Land records */}
        <div>
          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 mb-4 uppercase tracking-wider">
            Jurisdiction & Land Records
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                District (Jila) *
              </label>
              <input
                type="text"
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-808 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-505 text-sm rounded-md dark:text-white transition-all"
                placeholder="District name"
                {...register("jila")}
              />
              {errors.jila && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.jila.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Tehsil *
              </label>
              <input
                type="text"
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-808 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-505 text-sm rounded-md dark:text-white transition-all"
                placeholder="Tehsil name"
                {...register("tehsil")}
              />
              {errors.tehsil && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.tehsil.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                Village (Gao) *
              </label>
              <input
                type="text"
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-808 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-505 text-sm rounded-md dark:text-white transition-all"
                placeholder="Village name"
                {...register("gao")}
              />
              {errors.gao && (
                <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                  {errors.gao.message}
                </p>
              )}
            </div>
          </div>

          <div className="border border-gray-250/10 dark:border-gray-800 p-4 bg-gray-50/20 dark:bg-gray-850/10 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Land Survey Records List
              </h4>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => append({ surveyNumber: "", rakhva: 0.1 })}
                className="h-9 px-3 border border-gray-350 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 cursor-pointer rounded transition-all shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Row
              </button>
            </div>

            {errors.landRecords?.message && (
              <p className="text-red-600 dark:text-red-400 text-xs font-bold mb-4 uppercase">
                {errors.landRecords.message}
              </p>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white dark:bg-gray-850/30 p-4 border border-gray-200 dark:border-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">
                      Survey / Khasra No. *
                    </label>
                    <input
                      type="text"
                      disabled={isSaving}
                      className="block w-full h-10 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                      placeholder="Survey Number"
                      {...register(`landRecords.${index}.surveyNumber` as const)}
                    />
                    {errors.landRecords?.[index]?.surveyNumber && (
                      <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                        {errors.landRecords[index]?.surveyNumber?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-550 dark:text-gray-400 mb-1 uppercase">
                      Rakhva (Hectares) *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      disabled={isSaving}
                      className="block w-full h-10 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-805 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-505 text-sm rounded-md dark:text-white transition-all"
                      placeholder="0.0000"
                      {...register(`landRecords.${index}.rakhva` as const, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.landRecords?.[index]?.rakhva && (
                      <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">
                        {errors.landRecords[index]?.rakhva?.message}
                      </p>
                    )}
                  </div>

                  {fields.length > 1 && (
                    <div className="flex items-end pt-4 sm:pt-5">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => remove(index)}
                        className="h-10 w-10 border border-red-200 dark:border-red-950/30 bg-red-50/50 dark:bg-red-950/20 text-red-650 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-950/40 font-bold uppercase tracking-wider text-xs flex items-center justify-center cursor-pointer rounded-md transition-all shadow-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-150/10 dark:border-blue-900/30 p-4 mt-4 flex items-center justify-between text-blue-800 dark:text-blue-400 font-bold rounded-lg transition-colors">
              <span className="text-xs uppercase tracking-wider">Calculated Total Area:</span>
              <span className="text-base font-black">{calculatedTotalRakhva.toFixed(4)} Hectares</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-250/10 dark:border-gray-800">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => navigate("/dashboard")}
            className="h-11 px-5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-750 dark:text-gray-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 rounded-md transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel Changes
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="h-11 px-6 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 rounded-md transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving Entry..." : "Save Audit Updates"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
