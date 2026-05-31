import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiCreateUser } from "../api/users";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Plus, Trash2, Save } from "lucide-react";

// Schemas for steps
const step1Schema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  fatherName: z.string().min(1, "Father's name is required").trim(),
  mobile: z.string().regex(/^\d{10}$/, "Mobile must be exactly 10 digits"),
  aadhar: z.string().regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
  pan: z
    .string()
    .toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN must be a valid format (e.g., ABCDE1234F)"),
});

const step2Schema = z.object({
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

const fullSchema = step1Schema.merge(step2Schema);

type FormValues = z.infer<typeof fullSchema>;

export const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(step === 1 ? step1Schema : step === 2 ? step2Schema : fullSchema),
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
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "landRecords",
  });

  // Watch land records to calculate total rakhva
  const watchedLandRecords = control._fields.landRecords
    ? getValues("landRecords") || []
    : [];
  const calculatedTotalRakhva = watchedLandRecords.reduce((sum, item) => {
    return sum + (Number(item?.rakhva) || 0);
  }, 0);

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["name", "fatherName", "mobile", "aadhar", "pan"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      isValid = await trigger(["jila", "tehsil", "gao", "landRecords"]);
      if (isValid) setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitRecord = async (goToDashboard: boolean) => {
    setIsSaving(true);
    try {
      const data = getValues();
      // Enforce PAN uppercase
      data.pan = data.pan.toUpperCase();
      
      const response = await apiCreateUser(data);
      if (response.success) {
        toast.success("User record enrolled successfully");
        if (goToDashboard) {
          navigate("/dashboard");
        } else {
          // Reset form completely and return to Step 1
          reset({
            name: "",
            fatherName: "",
            mobile: "",
            aadhar: "",
            pan: "",
            jila: "",
            tehsil: "",
            gao: "",
            landRecords: [{ surveyNumber: "", rakhva: 0.1 }],
          });
          setStep(1);
        }
      } else {
        toast.error(response.message || "Failed to create user");
      }
    } catch (error: any) {
      console.error("Create user error:", error);
      const errMsg = error.response?.data?.message || "Failed to submit record. Please check validation.";
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const formValues = getValues();

  return (
    <div className="bg-white border-2 border-gray-400 p-6 md:p-8 shadow-sm max-w-3xl mx-auto">
      {/* Title Block */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
            Record Enrollment Registry Form
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase mt-1">
            Fill all mandatory parameters below
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="h-10 px-4 border border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-sm uppercase tracking-wider cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Process Step Indicators */}
      <div className="mb-8 border border-gray-300 bg-gray-100 p-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase text-gray-600 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 flex items-center justify-center border ${
                step >= 1 ? "bg-blue-600 border-blue-700 text-white" : "bg-white border-gray-400 text-gray-600"
              }`}
            >
              1
            </span>
            <span className={step >= 1 ? "text-gray-900" : ""}>Personal</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 flex items-center justify-center border ${
                step >= 2 ? "bg-blue-600 border-blue-700 text-white" : "bg-white border-gray-400 text-gray-600"
              }`}
            >
              2
            </span>
            <span className={step >= 2 ? "text-gray-900" : ""}>Land Details</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 flex items-center justify-center border ${
                step >= 3 ? "bg-blue-600 border-blue-700 text-white" : "bg-white border-gray-400 text-gray-600"
              }`}
            >
              3
            </span>
            <span className={step >= 3 ? "text-gray-900" : ""}>Audited Preview</span>
          </div>
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-300 pb-2 uppercase tracking-wider">
              Step 1: Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
                  Full Name *
                </label>
                <input
                  type="text"
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

            <div className="flex justify-end pt-4 border-t border-gray-300">
              <button
                type="button"
                onClick={handleNext}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm uppercase tracking-wider border-2 border-blue-700 flex items-center gap-2 cursor-pointer"
              >
                Proceed to Land Details
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-300 pb-2 uppercase tracking-wider">
              Step 2: Land Records & Jurisdiction
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
                  District (Jila) *
                </label>
                <input
                  type="text"
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

            <div className="border-t border-gray-300 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Land Survey Records List
                </h4>
                <button
                  type="button"
                  onClick={() => append({ surveyNumber: "", rakhva: 0.1 })}
                  className="h-9 px-3 border border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold uppercase tracking-wider text-xs flex items-center gap-1 cursor-pointer"
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
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-gray-50 p-4 border border-gray-300"
                  >
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                        Survey / Khasra No. *
                      </label>
                      <input
                        type="text"
                        className="block w-full h-10 px-3 border border-gray-400 bg-white focus:outline-none focus:border-blue-600 text-sm"
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
                        Rakhva (Area in Hectares) *
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        className="block w-full h-10 px-3 border border-gray-400 bg-white focus:outline-none focus:border-blue-600 text-sm"
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

              {/* Running total banner */}
              <div className="bg-blue-50 border border-blue-200 p-4 mt-4 flex items-center justify-between text-blue-900 font-bold">
                <span className="text-sm uppercase tracking-wider">Calculated Total Rakhva:</span>
                <span className="text-xl font-extrabold">{calculatedTotalRakhva.toFixed(4)} Hectares</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-300">
              <button
                type="button"
                onClick={handleBack}
                className="h-11 px-6 border border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm uppercase tracking-wider border-2 border-blue-700 flex items-center gap-2 cursor-pointer"
              >
                Review Registry Preview
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-300 pb-2 uppercase tracking-wider">
              Step 3: Official Audit Preview
            </h3>

            <div className="border border-gray-400 p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">
                  Personal Information
                </h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div className="flex justify-between md:block border-b border-gray-100 md:border-b-0 pb-1">
                    <dt className="text-gray-500 font-semibold uppercase text-xs">Full Name</dt>
                    <dd className="font-bold text-gray-900">{formValues.name}</dd>
                  </div>
                  <div className="flex justify-between md:block border-b border-gray-100 md:border-b-0 pb-1">
                    <dt className="text-gray-500 font-semibold uppercase text-xs">Father's Name</dt>
                    <dd className="font-bold text-gray-900">{formValues.fatherName}</dd>
                  </div>
                  <div className="flex justify-between md:block border-b border-gray-100 md:border-b-0 pb-1">
                    <dt className="text-gray-500 font-semibold uppercase text-xs">Mobile Number</dt>
                    <dd className="font-bold text-gray-900">{formValues.mobile}</dd>
                  </div>
                  <div className="flex justify-between md:block border-b border-gray-100 md:border-b-0 pb-1">
                    <dt className="text-gray-500 font-semibold uppercase text-xs">Aadhar Card</dt>
                    <dd className="font-bold text-gray-900">{formValues.aadhar}</dd>
                  </div>
                  <div className="flex justify-between md:block pb-1">
                    <dt className="text-gray-500 font-semibold uppercase text-xs">PAN Card</dt>
                    <dd className="font-bold text-gray-900 font-mono">{formValues.pan}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider">
                  Jurisdiction & Land Summary
                </h4>
                <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex justify-between md:block border-b border-gray-100 md:border-b-0 pb-1">
                    <dt className="text-gray-500 font-semibold uppercase text-xs">District (Jila)</dt>
                    <dd className="font-bold text-gray-900">{formValues.jila}</dd>
                  </div>
                  <div className="flex justify-between md:block border-b border-gray-100 md:border-b-0 pb-1">
                    <dt className="text-gray-500 font-semibold uppercase text-xs">Tehsil</dt>
                    <dd className="font-bold text-gray-900">{formValues.tehsil}</dd>
                  </div>
                  <div className="flex justify-between md:block pb-1">
                    <dt className="text-gray-500 font-semibold uppercase text-xs">Village (Gao)</dt>
                    <dd className="font-bold text-gray-900">{formValues.gao}</dd>
                  </div>
                </dl>

                <div className="overflow-x-auto border border-gray-300 mt-4">
                  <table className="min-w-full divide-y divide-gray-300 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          #
                        </th>
                        <th className="px-3 py-2 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Survey/Khasra Number
                        </th>
                        <th className="px-3 py-2 text-right font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                          Area (Rakhva)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formValues.landRecords?.map((record, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-gray-600">{index + 1}</td>
                          <td className="px-3 py-2 text-gray-900 font-semibold">
                            {record.surveyNumber}
                          </td>
                          <td className="px-3 py-2 text-gray-900 font-bold text-right">
                            {record.rakhva.toFixed(4)} Hectares
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-bold text-blue-900">
                        <td colSpan={2} className="px-3 py-2 text-right uppercase tracking-wider text-xs">
                          Total Audited Area:
                        </td>
                        <td className="px-3 py-2 text-right text-base">
                          {calculatedTotalRakhva.toFixed(4)} Hectares
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-300">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleBack}
                className="h-11 px-6 border border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Edit
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => submitRecord(false)}
                  className="h-11 px-5 border-2 border-gray-400 hover:bg-gray-100 text-gray-800 font-bold text-sm uppercase tracking-wider cursor-pointer bg-white disabled:opacity-50"
                >
                  Save & Create Another
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => submitRecord(true)}
                  className="h-11 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm uppercase tracking-wider border-2 border-blue-700 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Save & Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateUser;
