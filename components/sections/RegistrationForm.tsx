"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Mail, Phone, Briefcase, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { registrationSchema, RegistrationFormValues } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EVENT_DATE, EVENT_VENUE, EVENT_HAS_ENDED } from "@/lib/constants";

interface RegistrationFormProps {
  className?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ className = "" }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      role: "",
    },
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    setApiError(null);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmittedName(data.name);
        setIsSubmitted(true);
        reset();
      } else {
        setApiError(result.message || "Failed to complete registration. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setApiError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <section id="register" className={`py-24 bg-bcn-black relative overflow-hidden ${className}`}>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-bcn-orange/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-bcn-orange uppercase block">
            {EVENT_HAS_ENDED ? "BCN HANGOUT 2026" : "JOIN US IN LOKOJA"}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F1E8] tracking-tight">
            {EVENT_HAS_ENDED ? "Registration Closed" : "Register Now"}
          </h2>
          <p className="text-base text-[#DFD8CE] font-normal max-w-md mx-auto">
            {EVENT_HAS_ENDED
              ? "This event has concluded."
              : "Reserve your seat for an inspiring day of networking, skill conversations, and impact."}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#141414] border border-bcn-orange/25 rounded-3xl p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl relative">
          {EVENT_HAS_ENDED ? (
            /* Concluded / Closed State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="py-10 sm:py-12 text-center space-y-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-bcn-orange/15 border-2 border-bcn-orange/40 flex items-center justify-center text-bcn-orange shadow-[0_0_30px_rgba(255,132,0,0.25)]">
                <CheckCircle2 className="w-8 h-8 text-bcn-amber" />
              </div>

              <div className="space-y-3 max-w-md">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
                  Registration has closed
                </h3>
                <p className="text-sm sm:text-base text-[#DFD8CE] leading-relaxed">
                  Thank you to everyone who registered for BCN Hangout 2026. Watch this space — details on our next event are coming soon.
                </p>
              </div>
            </motion.div>
          ) : isSubmitted ? (
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
                  You&apos;re registered, {submittedName}!
                </h3>
                <p className="text-base text-bcn-amber font-medium flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-bcn-orange" />
                  See you {EVENT_DATE} at {EVENT_VENUE}.
                </p>
                <p className="text-sm text-[#DFD8CE] pt-2 max-w-sm mx-auto">
                  We&apos;ve saved your spot — ticket details will follow by email soon.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsSubmitted(false)}
                >
                  Register Another Attendee
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {apiError && (
                <div className="p-4 rounded-xl bg-bcn-burgundy/15 border border-bcn-burgundy/50 text-[#FF6644] text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-bcn-burgundy shrink-0" />
                  {apiError}
                </div>
              )}

              {/* Name input */}
              <Input
                id="name"
                label="Full Name"
                icon={User}
                placeholder="Enter your full name"
                error={errors.name?.message}
                {...register("name")}
              />

              {/* Email input */}
              <Input
                id="email"
                type="email"
                label="Email Address"
                icon={Mail}
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />

              {/* WhatsApp input */}
              <Input
                id="whatsapp"
                type="tel"
                label="WhatsApp Number"
                icon={Phone}
                placeholder="+234 801 234 5678"
                error={errors.whatsapp?.message}
                {...register("whatsapp")}
              />

              {/* Role input */}
              <Input
                id="role"
                label="Role / Profession"
                icon={Briefcase}
                placeholder="e.g., Designer, Developer, Creator"
                error={errors.role?.message}
                {...register("role")}
              />

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                  className="shadow-[0_4px_25px_rgba(255,132,0,0.35)]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Registration...
                    </span>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </div>

              <p className="text-center text-[11px] text-[#A39C90] pt-2">
                Free attendance. Limited seats available for BCN Hangout 2026.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
