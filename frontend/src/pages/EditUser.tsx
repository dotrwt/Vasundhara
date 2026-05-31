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
          // Reset form with fetched data
          reset({
            name: user.name,
            fatherName: user.fatherName,
            mobile: user.mobile,
            aadhar: user.aadhar,
            pan: user.pan,
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
  const watchedLandRecords = control._fields.landRecords
    ? getValues("landRecords") || []
    : [];
  const calculatedTotalRakhva = watchedLandRecords.reduce((sum, item) => {
    return sum + (Number(item?.rakhva) || 0);
  }, 0);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;
    setIsSaving(true);
    try {
      // Enforce PAN uppercase
      values.pan = values.pan.toUpperCase();

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
      <div className="bg-white border-2 border-gray-400 p-12 text-center text-gray-600 shadow-sm max-w-3xl mx-auto">
        <p className="font-bold text-sm tracking-wider uppercase animate-pulse">
          Retrieving Profile Registry Data...
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
            Edit Audit Registry Entry
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase mt-1">
            Update registry details below
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="h-10 px-4 border border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-sm uppercase tracking-wider cursor-pointer"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal details */}
        <div>
          <h3 className="text-base font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
                Full Name *
              </label>
              <input
                type="text"
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-400 focus:outline-none focus:border-blue-600 text-base"
                placeholder="Enter full name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
                Father's Name *
              </label>
              <input
                type="text"
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-400 focus:outline-none focus:border-blue-600 text-base"
                placeholder="Enter father's name"
                {...register("fatherName")}
              />
              {errors.fatherName && (
                <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                  {errors.fatherName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
                Mobile Number (10 Digits) *
              </label>
              <input
                type="text"
                maxLength={10}
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-400 focus:outline-none focus:border-blue-600 text-base"
                placeholder="e.g. 9876543210"
                {...register("mobile")}
                onChange={(e) => {
                  setValue("mobile", e.target.value.replace(/\D/g, ""));
                  trigger("mobile");
                }}
              />
              {errors.mobile && (
                <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
                Aadhar Card Number (12 Digits) *
              </label>
              <input
                type="text"
                maxLength={12}
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-400 focus:outline-none focus:border-blue-600 text-base"
                placeholder="e.g. 543210987654"
                {...register("aadhar")}
                onChange={(e) => {
                  setValue("aadhar", e.target.value.replace(/\D/g, ""));
                  trigger("aadhar");
                }}
              />
              {errors.aadhar && (
                <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                  {errors.aadhar.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
                PAN Card Number (10 Characters) *
              </label>
              <input
                type="text"
                maxLength={10}
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-400 focus:outline-none focus:border-blue-600 text-base font-mono uppercase"
                placeholder="ABCDE1234F"
                {...register("pan")}
                onChange={(e) => {
                  setValue("pan", e.target.value.toUpperCase());
                  trigger("pan");
                }}
              />
              {errors.pan && (
                <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                  {errors.pan.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Location & Land records */}
        <div>
          <h3 className="text-base font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider">
            Jurisdiction & Land Records
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
                District (Jila) *
              </label>
              <input
                type="text"
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-400 focus:outline-none focus:border-blue-600 text-base"
                placeholder="District name"
                {...register("jila")}
              />
              {errors.jila && (
                <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                  {errors.jila.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
                Tehsil *
              </label>
              <input
                type="text"
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-400 focus:outline-none focus:border-blue-600 text-base"
                placeholder="Tehsil name"
                {...register("tehsil")}
              />
              {errors.tehsil && (
                <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                  {errors.tehsil.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
                Village (Gao) *
              </label>
              <input
                type="text"
                disabled={isSaving}
                className="block w-full h-11 px-3 border border-gray-400 focus:outline-none focus:border-blue-600 text-base"
                placeholder="Village name"
                {...register("gao")}
              />
              {errors.gao && (
                <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                  {errors.gao.message}
                </p>
              )}
            </div>
          </div>

          <div className="border border-gray-300 p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Land Survey Records List
              </h4>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => append({ surveyNumber: "", rakhva: 0.1 })}
                className="h-9 px-3 border border-gray-400 bg-white hover:bg-gray-100 text-gray-800 font-bold uppercase tracking-wider text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Row
              </button>
            </div>

            {errors.landRecords?.message && (
              <p className="text-red-600 text-xs font-bold mb-4 uppercase">
                {errors.landRecords.message}
              </p>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white p-4 border border-gray-300"
                >
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      Survey / Khasra No. *
                    </label>
                    <input
                      type="text"
                      disabled={isSaving}
                      className="block w-full h-10 px-3 border border-gray-400 focus:outline-none focus:border-blue-600 text-sm"
                      placeholder="Survey Number"
                      {...register(`landRecords.${index}.surveyNumber` as const)}
                    />
                    {errors.landRecords?.[index]?.surveyNumber && (
                      <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                        {errors.landRecords[index]?.surveyNumber?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      Rakhva (Hectares) *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      disabled={isSaving}
                      className="block w-full h-10 px-3 border border-gray-400 focus:outline-none focus:border-blue-600 text-sm"
                      placeholder="0.0000"
                      {...register(`landRecords.${index}.rakhva` as const, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.landRecords?.[index]?.rakhva && (
                      <p className="text-red-600 text-xs font-bold mt-1 uppercase">
                        {errors.landRecords[index]?.rakhva?.message}
                      </p>
                    )}
                  </div>

                  {fields.length > 1 && (
                    <div className="flex items-end pt-5">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => remove(index)}
                        className="h-10 px-3 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold uppercase tracking-wider text-xs flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 mt-4 flex items-center justify-between text-blue-900 font-bold">
              <span className="text-sm uppercase tracking-wider">Calculated Total Area:</span>
              <span className="text-xl font-extrabold">{calculatedTotalRakhva.toFixed(4)} Hectares</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-300">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => navigate("/dashboard")}
            className="h-11 px-6 border border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel Changes
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="h-11 px-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm uppercase tracking-wider border-2 border-blue-700 flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
