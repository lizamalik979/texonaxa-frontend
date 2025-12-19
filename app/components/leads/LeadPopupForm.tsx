"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { poppins } from "../../fonts";

type LeadPayload = {
  name: string;
  email: string;
  phoneNo: string;
  companyName: string;
  serviceSelected: string;
  message: string;
};

const SERVICE_OPTIONS = [
  "Site Development",
  "UI/UX Designing",
  "Digital Marketing",
  "Website Maintenance",
] as const;

export default function LeadPopupForm({
  open,
  onClose,
  defaultServiceSelected,
  leftImageSrc,
}: {
  open: boolean;
  onClose: () => void;
  defaultServiceSelected?: string;
  leftImageSrc: string;
}) {
  const apiBase = useMemo(
    // Client components can only read NEXT_PUBLIC_* env vars at runtime
    () => process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000",
    []
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [serviceSelected, setServiceSelected] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(null);
      // Only prefill if it matches an option; otherwise keep empty
      const normalized = (defaultServiceSelected || "").trim();
      const match = SERVICE_OPTIONS.find(
        (o) => o.toLowerCase() === normalized.toLowerCase()
      );
      setServiceSelected(match || "");
    }
  }, [open, defaultServiceSelected]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const validate = (): string | null => {
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return "Enter a valid email";
    if (!phone.trim()) return "Phone is required";
    if (!/^[6-9]\d{9}$/.test(phone.trim()))
      return "Enter a valid 10-digit mobile number";
    return null;
  };

  const onSubmit = async () => {
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: LeadPayload = {
      name: name.trim(),
      email: email.trim(),
      phoneNo: phone.trim(),
      companyName: company.trim(),
      serviceSelected: serviceSelected.trim(),
      message: message.trim(),
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "Failed to submit";
        try {
          const j = await res.json();
          msg = j?.message || msg;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      setSuccess("Submitted successfully");
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setServiceSelected(defaultServiceSelected || "");
      setMessage("");
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden bg-white shadow-2xl">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-10 rounded-full bg-black/10 hover:bg-black/20 p-2"
          >
            <X className="h-5 w-5 text-black" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative hidden md:block min-h-[520px]">
              <Image
                src={leftImageSrc}
                alt="Popup form"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="p-6 sm:p-8 md:p-10 overflow-y-auto">
              <h2
                className={`text-3xl sm:text-3xl font-semibold text-black mb-0 ${poppins.className}`}
              >
                Let’s Talk About Your Project
              </h2>

              <div className="mt-2 space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-black/80 mb-1 ${poppins.className}`}
                  >
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your Name"
                    className="w-full h-10 rounded-lg text-black bg-black/5 px-4 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-black/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium text-black/80 mb-1 ${poppins.className}`}
                    >
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email id"
                      className="w-full h-10 rounded-lg text-black bg-black/5 px-4 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-black/30"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium text-black/80 mb-1 ${poppins.className}`}
                    >
                      Phone
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your Mobile Number"
                      className="w-full h-10 rounded-lg text-black bg-black/5 px-4 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-black/30"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-black/80 mb-1 ${poppins.className}`}
                  >
                    Company
                  </label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter your Company"
                    className="w-full h-10 rounded-lg text-black bg-black/5 px-4 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-black/30"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-black/80 mb-1 ${poppins.className}`}
                  >
                    Service Selected
                  </label>
                  <select
                    value={serviceSelected}
                    onChange={(e) => setServiceSelected(e.target.value)}
                    className="w-full h-10 text-black rounded-lg bg-black/5 px-4 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-black/30"
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-black/80 mb-1 ${poppins.className}`}
                  >
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your Message"
                    className="w-full h-10 rounded-lg text-black bg-black/5 px-4 py-2 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-black/30"
                  />
                </div>

                {error && (
                  <p className={`text-sm text-red-600 ${poppins.className}`}>
                    {error}
                  </p>
                )}
                {success && (
                  <p className={`text-sm text-green-700 ${poppins.className}`}>
                    {success}
                  </p>
                )}

                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className={`w-full h-10 rounded-lg bg-[#FBEAAB] text-black text-lg font-semibold disabled:opacity-60 ${poppins.className}`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

