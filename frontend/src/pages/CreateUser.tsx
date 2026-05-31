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
  samagraId: z
    .string()
    .regex(/^\d{9}$/, "Samagra ID must be exactly 9 digits")
    .optional()
    .or(z.literal("")),
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

const dmrAccountSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^\d{9,18}$/.test(val), {
    message: "Account number must be between 9 and 18 digits",
  });

const step3Schema = z.object({
  kharifCashAccount: dmrAccountSchema,
  kharifKindAccount: dmrAccountSchema,
  rabiCashAccount: dmrAccountSchema,
  rabiKindAccount: dmrAccountSchema,
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);

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
    resolver: zodResolver(
      step === 1 ? step1Schema : step === 2 ? step2Schema : step === 3 ? step3Schema : fullSchema
    ),
    defaultValues: {
      name: "",
      fatherName: "",
      mobile: "",
      aadhar: "",
      pan: "",
      samagraId: "",
      kharifCashAccount: "",
      kharifKindAccount: "",
      rabiCashAccount: "",
      rabiKindAccount: "",
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

  const watchedLandRecords = getValues("landRecords") || [];
  const calculatedTotalRakhva = watchedLandRecords.reduce((sum, item) => {
    return sum + (Number(item?.rakhva) || 0);
  }, 0);

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["name", "fatherName", "mobile", "aadhar", "pan", "samagraId"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      isValid = await trigger(["jila", "tehsil", "gao", "landRecords"]);
      if (isValid) setStep(3);
    } else if (step === 3) {
      isValid = await trigger([
        "kharifCashAccount",
        "kharifKindAccount",
        "rabiCashAccount",
        "rabiKindAccount",
      ]);
      if (isValid) setStep(4);
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
      data.pan = data.pan.toUpperCase();
      
      const response = await apiCreateUser(data);
      if (response.success) {
        toast.success("Farmer record enrolled successfully");
        if (goToDashboard) {
          navigate("/dashboard");
        } else {
          reset({
            name: "",
            fatherName: "",
            mobile: "",
            aadhar: "",
            pan: "",
            samagraId: "",
            kharifCashAccount: "",
            kharifKindAccount: "",
            rabiCashAccount: "",
            rabiKindAccount: "",
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
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-xl shadow-md max-w-3xl mx-auto transition-all duration-300">
      {/* Title Block */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            Record Enrollment Registry Form
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mt-1">
            Fill all mandatory parameters below
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="h-10 px-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider transition-colors rounded-md cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Steps Indicator Stepper */}
      <div className="flex items-center justify-between mb-8 bg-gray-50/50 dark:bg-gray-850/30 p-4 rounded-lg border border-gray-150/10 dark:border-gray-800/80 transition-colors">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                step === s
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-110"
                  : step > s
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-250 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }`}
            >
              {s}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider hidden sm:inline ${
                step === s
                  ? "text-blue-600 dark:text-blue-400"
                  : step > s
                  ? "text-emerald-600 dark:text-emerald-450"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {s === 1 ? "Personal" : s === 2 ? "Land Details" : s === 3 ? "DMR Accounts" : "Preview"}
            </span>
            {s < 4 && <div className="h-0.5 w-4 sm:w-10 bg-gray-200 dark:bg-gray-800" />}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 uppercase tracking-wider">
              Step 1: Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                  placeholder="Enter full name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-650 text-xs font-bold mt-1 uppercase">
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
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
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
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                  Mobile Number (10 Digits) *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
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
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                  Aadhar Card Number (12 Digits) *
                </label>
                <input
                  type="text"
                  maxLength={12}
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                  placeholder="e.g. 543210987654"
                  {...register("aadhar")}
                  onChange={(e) => {
                    setValue("aadhar", e.target.value.replace(/\D/g, ""));
                    trigger("aadhar");
                  }}
                />
                {errors.aadhar && (
                  <p className="text-red-650 text-xs font-bold mt-1 uppercase">
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
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white font-mono uppercase transition-all"
                  placeholder="ABCDE1234F"
                  {...register("pan")}
                  onChange={(e) => {
                    setValue("pan", e.target.value.toUpperCase());
                    trigger("pan");
                  }}
                />
                {errors.pan && (
                  <p className="text-red-650 text-xs font-bold mt-1 uppercase">
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
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                  placeholder="e.g. 123456789"
                  {...register("samagraId")}
                  onChange={(e) => {
                    setValue("samagraId", e.target.value.replace(/\D/g, ""));
                    trigger("samagraId");
                  }}
                />
                {errors.samagraId && (
                  <p className="text-red-660 text-xs font-bold mt-1 uppercase">
                    {errors.samagraId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-250/10 dark:border-gray-800">
              <button
                type="button"
                onClick={handleNext}
                className="h-11 px-6 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-md flex items-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                Proceed to Land Details
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 uppercase tracking-wider">
              Step 2: Land Records & Jurisdiction
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                  District (Jila) *
                </label>
                <input
                  type="text"
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                  placeholder="District name"
                  {...register("jila")}
                />
                {errors.jila && (
                  <p className="text-red-650 text-xs font-bold mt-1 uppercase">
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
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                  placeholder="Tehsil name"
                  {...register("tehsil")}
                />
                {errors.tehsil && (
                  <p className="text-red-650 text-xs font-bold mt-1 uppercase">
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
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                  placeholder="Village name"
                  {...register("gao")}
                />
                {errors.gao && (
                  <p className="text-red-650 text-xs font-bold mt-1 uppercase">
                    {errors.gao.message}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Land Survey Records List
                </h4>
                <button
                  type="button"
                  onClick={() => append({ surveyNumber: "", rakhva: 0.1 })}
                  className="h-9 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 cursor-pointer rounded transition-all shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Row
                </button>
              </div>

              {errors.landRecords?.message && (
                <p className="text-red-650 text-xs font-bold mb-4 uppercase">
                  {errors.landRecords.message}
                </p>
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-gray-50 dark:bg-gray-855/30 p-4 border border-gray-200 dark:border-gray-800 rounded-lg transition-colors"
                  >
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">
                        Survey / Khasra No. *
                      </label>
                      <input
                        type="text"
                        className="block w-full h-10 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
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
                      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">
                        Rakhva (Area in Hectares) *
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        className="block w-full h-10 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
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
                      <div className="flex items-end pt-4 sm:pt-5">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="h-10 w-10 border border-red-205 dark:border-red-950/30 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-950/40 font-bold uppercase tracking-wider text-xs flex items-center justify-center cursor-pointer rounded-md transition-all shadow-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Running total banner */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-150/10 dark:border-blue-900/30 p-4 mt-4 flex items-center justify-between text-blue-800 dark:text-blue-400 font-bold rounded-lg transition-colors">
                <span className="text-xs uppercase tracking-wider">Calculated Total Area:</span>
                <span className="text-lg font-black">{calculatedTotalRakhva.toFixed(4)} Hectares</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-250/10 dark:border-gray-800">
              <button
                type="button"
                onClick={handleBack}
                className="h-11 px-5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer rounded-md transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="h-11 px-6 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-md flex items-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                Proceed to DMR Accounts
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 uppercase tracking-wider">
              Step 3: DMR Accounts Management
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                  Kharif Cash Account Number
                </label>
                <input
                  type="text"
                  maxLength={18}
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                  placeholder="Enter 9-18 digit account number"
                  {...register("kharifCashAccount")}
                  onChange={(e) => {
                    setValue("kharifCashAccount", e.target.value.replace(/\D/g, ""));
                    trigger("kharifCashAccount");
                  }}
                />
                {errors.kharifCashAccount && (
                  <p className="text-red-655 text-xs font-bold mt-1 uppercase">
                    {errors.kharifCashAccount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                  Kharif Kind Account Number
                </label>
                <input
                  type="text"
                  maxLength={18}
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                  placeholder="Enter 9-18 digit account number"
                  {...register("kharifKindAccount")}
                  onChange={(e) => {
                    setValue("kharifKindAccount", e.target.value.replace(/\D/g, ""));
                    trigger("kharifKindAccount");
                  }}
                />
                {errors.kharifKindAccount && (
                  <p className="text-red-655 text-xs font-bold mt-1 uppercase">
                    {errors.kharifKindAccount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                  Rabi Cash Account Number
                </label>
                <input
                  type="text"
                  maxLength={18}
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                  placeholder="Enter 9-18 digit account number"
                  {...register("rabiCashAccount")}
                  onChange={(e) => {
                    setValue("rabiCashAccount", e.target.value.replace(/\D/g, ""));
                    trigger("rabiCashAccount");
                  }}
                />
                {errors.rabiCashAccount && (
                  <p className="text-red-655 text-xs font-bold mt-1 uppercase">
                    {errors.rabiCashAccount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                  Rabi Kind Account Number
                </label>
                <input
                  type="text"
                  maxLength={18}
                  className="block w-full h-11 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-sm rounded-md dark:text-white transition-all"
                  placeholder="Enter 9-18 digit account number"
                  {...register("rabiKindAccount")}
                  onChange={(e) => {
                    setValue("rabiKindAccount", e.target.value.replace(/\D/g, ""));
                    trigger("rabiKindAccount");
                  }}
                />
                {errors.rabiKindAccount && (
                  <p className="text-red-655 text-xs font-bold mt-1 uppercase">
                    {errors.rabiKindAccount.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-250/10 dark:border-gray-800">
              <button
                type="button"
                onClick={handleBack}
                className="h-11 px-5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer rounded-md transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="h-11 px-6 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-md flex items-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                Proceed to Preview
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2 uppercase tracking-wider">
              Step 4: Official Audit Preview
            </h3>

            <div className="border border-gray-200 dark:border-gray-800 p-6 space-y-6 rounded-lg bg-gray-50/20 dark:bg-gray-900 transition-colors shadow-inner">
              <div>
                <h4 className="text-xs font-bold text-gray-955 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mb-4 uppercase tracking-wider">
                  Personal Information
                </h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div className="flex justify-between md:block border-b border-gray-100 dark:border-gray-800 md:border-b-0 pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Full Name</dt>
                    <dd className="font-bold text-gray-955 dark:text-white">{formValues.name}</dd>
                  </div>
                  <div className="flex justify-between md:block border-b border-gray-100 dark:border-gray-800 md:border-b-0 pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Father's Name</dt>
                    <dd className="font-bold text-gray-955 dark:text-white">{formValues.fatherName}</dd>
                  </div>
                  <div className="flex justify-between md:block border-b border-gray-100 dark:border-gray-800 md:border-b-0 pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Mobile Number</dt>
                    <dd className="font-bold text-gray-955 dark:text-white">{formValues.mobile}</dd>
                  </div>
                  <div className="flex justify-between md:block border-b border-gray-100 dark:border-gray-800 md:border-b-0 pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Aadhar Card</dt>
                    <dd className="font-bold text-gray-955 dark:text-white">{formValues.aadhar}</dd>
                  </div>
                  <div className="flex justify-between md:block border-b border-gray-100 dark:border-gray-800 md:border-b-0 pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">PAN Card</dt>
                    <dd className="font-bold text-gray-955 dark:text-white font-mono">{formValues.pan}</dd>
                  </div>
                  <div className="flex justify-between md:block pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Samagra ID</dt>
                    <dd className="font-bold text-gray-955 dark:text-white">{formValues.samagraId || "N/A"}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-955 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mb-4 uppercase tracking-wider">
                  DMR Accounts
                </h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div className="flex justify-between md:block border-b border-gray-100 dark:border-gray-800 md:border-b-0 pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Kharif Cash Account</dt>
                    <dd className="font-bold text-gray-955 dark:text-white font-mono">{formValues.kharifCashAccount}</dd>
                  </div>
                  <div className="flex justify-between md:block border-b border-gray-100 dark:border-gray-800 md:border-b-0 pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Kharif Kind Account</dt>
                    <dd className="font-bold text-gray-955 dark:text-white font-mono">{formValues.kharifKindAccount}</dd>
                  </div>
                  <div className="flex justify-between md:block border-b border-gray-100 dark:border-gray-800 md:border-b-0 pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Rabi Cash Account</dt>
                    <dd className="font-bold text-gray-955 dark:text-white font-mono">{formValues.rabiCashAccount}</dd>
                  </div>
                  <div className="flex justify-between md:block pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Rabi Kind Account</dt>
                    <dd className="font-bold text-gray-955 dark:text-white font-mono">{formValues.rabiKindAccount}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-955 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mb-4 uppercase tracking-wider">
                  Jurisdiction & Land Summary
                </h4>
                <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex justify-between md:block border-b border-gray-100 dark:border-gray-800 md:border-b-0 pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">District (Jila)</dt>
                    <dd className="font-bold text-gray-955 dark:text-white">{formValues.jila}</dd>
                  </div>
                  <div className="flex justify-between md:block border-b border-gray-100 dark:border-gray-800 md:border-b-0 pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Tehsil</dt>
                    <dd className="font-bold text-gray-955 dark:text-white">{formValues.tehsil}</dd>
                  </div>
                  <div className="flex justify-between md:block pb-1">
                    <dt className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Village (Gao)</dt>
                    <dd className="font-bold text-gray-955 dark:text-white">{formValues.gao}</dd>
                  </div>
                </dl>

                <div className="overflow-hidden border border-gray-205 dark:border-gray-800 rounded-lg mt-4 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-xs">
                    <thead className="bg-gray-50 dark:bg-gray-850/80">
                      <tr>
                        <th className="px-3 py-2.5 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                          #
                        </th>
                        <th className="px-3 py-2.5 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                          Survey/Khasra Number
                        </th>
                        <th className="px-3 py-2.5 text-right font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                          Area (Rakhva)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {formValues.landRecords?.map((record, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2.5 text-gray-505">{index + 1}</td>
                          <td className="px-3 py-2.5 text-gray-900 dark:text-white font-semibold">
                            {record.surveyNumber}
                          </td>
                          <td className="px-3 py-2.5 text-gray-950 dark:text-white font-bold text-right">
                            {record.rakhva.toFixed(4)} Hectares
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50/50 dark:bg-blue-955/20 font-bold text-blue-800 dark:text-blue-400">
                        <td colSpan={2} className="px-3 py-3 text-right uppercase tracking-wider text-[10px]">
                          Total Audited Area:
                        </td>
                        <td className="px-3 py-3 text-right text-sm font-black">
                          {calculatedTotalRakhva.toFixed(4)} Hectares
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleBack}
                className="h-11 px-5 border border-gray-350 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-750 dark:text-gray-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-md transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Edit
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => submitRecord(false)}
                  className="h-11 px-4 border border-gray-355 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-750 dark:text-gray-300 font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50 rounded-md transition-all"
                >
                  Save & Create Another
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => submitRecord(true)}
                  className="h-11 px-6 bg-blue-600 dark:bg-blue-505 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-md transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
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
