"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Mail, Phone, Briefcase, Heart, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { volunteerSchema, VolunteerFormValues } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EVENT_DATE, EVENT_VENUE } from "@/lib/constants";

interface VolunteerFormProps {
  className?: string;
}

export const VolunteerForm: React.FC<VolunteerFormProps> = ({ className = "" }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      role: "",
      motivation: "",
    },
  });

  const motivationValue = watch("motivation") ?? "";

  const onSubmit = async (data: VolunteerFormValues) => {
    setApiError(null);
    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmittedName(data.name);
        setIsSubmitted(true);
        reset();
      } else {
        setApiError(result.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Volunteer submission error:", err);
      setApiError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <section id="volunteer" className={`py-24 bg-bcn-black relative overflow-hidden ${className}`}>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-bcn-orange/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-bcn-orange uppercase block">
            SERVE AT BCN HANGOUT 2026
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F1E8] tracking-tight">
            Volunteer with Us
          </h2>
          <p className="text-base text-[#DFD8CE] font-normal max-w-md mx-auto">
            Be part of the team making BCN Hangout 2026 unforgettable. Help us serve, support, and inspire the community.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#141414] border border-bcn-orange/25 rounded-3xl p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl relative">
          {isSubmitted ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="py-12 text-center space-y-6 flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-bcn-orange/15 border-2 border-bcn-orange flex items-center justify-center text-bcn-orange shadow-[0_0_30px_rgba(255,132,0,0.3)]">
                <CheckCircle2 className="w-10 h-10 text-bcn-amber" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
                  Thank you, {submittedName}!
                </h3>
                <p className="text-base text-bcn-amber font-medium flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-bcn-orange" />
                  We&apos;ll be in touch before {EVENT_DATE}.
                </p>
                <p className="text-sm text-[#DFD8CE] pt-2 max-w-sm mx-auto">
                  Your volunteer application has been received. Our team will reach out with next steps soon.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsSubmitted(false)}
                >
                  Submit Another Application
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Volunteer Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {apiError && (
                <div className="p-4 rounded-xl bg-bcn-burgundy/15 border border-bcn-burgundy/50 text-[#FF6644] text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-bcn-burgundy shrink-0" />
                  {apiError}
                </div>
              )}

              {/* Name */}
              <Input
                id="volunteer-name"
                label="Full Name"
                icon={User}
                placeholder="Enter your full name"
                error={errors.name?.message}
                {...register("name")}
              />

              {/* Email */}
              <Input
                id="volunteer-email"
                type="email"
                label="Email Address"
                icon={Mail}
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />

              {/* WhatsApp */}
              <Input
                id="volunteer-whatsapp"
                type="tel"
                label="WhatsApp Number"
                icon={Phone}
                placeholder="+234 801 234 5678"
                error={errors.whatsapp?.message}
                {...register("whatsapp")}
              />

              {/* Role */}
              <Input
                id="volunteer-role"
                label="Role / Profession"
                icon={Briefcase}
                placeholder="e.g., Designer, Developer, Photographer"
                error={errors.role?.message}
                {...register("role")}
              />

              {/* Motivation textarea */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#DFD8CE]">
                  <Heart className="w-4 h-4 text-bcn-orange shrink-0" />
                  Why do you want to volunteer?
                  <span className="text-[#5C564E] font-normal text-xs ml-1">(optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    id="volunteer-motivation"
                    rows={4}
                    placeholder="Tell us why you'd love to be part of the team..."
                    className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F1E8] placeholder-[#5C564E] focus:outline-none focus:border-bcn-orange/60 transition-colors resize-none"
                    {...register("motivation")}
                  />
                  <span className="absolute bottom-2.5 right-3 text-[10px] text-[#5C564E] font-mono">
                    {motivationValue.length}/500
                  </span>
                </div>
                {errors.motivation && (
                  <p className="text-xs text-red-400 mt-1">{errors.motivation.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-black bg-bcn-orange hover:bg-bcn-amber disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_4px_25px_rgba(255,132,0,0.35)] hover:shadow-[0_4px_30px_rgba(255,132,0,0.5)] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      Submit Volunteer Application
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-[#A39C90] pt-2">
                Volunteering is free. Our team will review your application and contact you.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
