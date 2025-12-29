"use client";

import { useMemo, useState } from "react";
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

export default function ContactLeadForm() {
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000",
    []
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [serviceSelected, setServiceSelected] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email";
    if (!phone.trim()) return "Phone is required";
    if (!/^[6-9]\d{9}$/.test(phone.trim())) return "Enter a valid 10-digit mobile number";
    if (!agree) return "Please agree to the terms and conditions";
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
        headers: { "Content-Type": "application/json" },
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
      setServiceSelected("");
      setMessage("");
      setAgree(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className={`text-4xl sm:text-5xl font-semibold text-white text-center ${poppins.className}`}>
      Let’s Build Something Great
      </h1>
      <div className="mt-6 h-px w-full bg-white/15" />

      <div className="mt-8 space-y-6">
        <div>
          <label className={`block text-sm font-medium text-white/80 mb-2 ${poppins.className}`}>
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full h-14 rounded-2xl bg-white/5 text-white placeholder:text-white/40 px-6 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-white/80 mb-2 ${poppins.className}`}>
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-14 rounded-2xl bg-white/5 text-white placeholder:text-white/40 px-6 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-white/80 mb-2 ${poppins.className}`}>
            Phone Number
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full h-14 rounded-2xl bg-white/5 text-white placeholder:text-white/40 px-6 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-white/80 mb-2 ${poppins.className}`}>
            Company
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="w-full h-14 rounded-2xl bg-white/5 text-white placeholder:text-white/40 px-6 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-white/80 mb-2 ${poppins.className}`}>
            Service Selected
          </label>
          <select
            value={serviceSelected}
            onChange={(e) => setServiceSelected(e.target.value)}
            className="w-full h-14 rounded-2xl bg-white/5 text-white px-6 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
          >
            <option value="" disabled className="bg-black text-white">
              Select a service
            </option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-black text-white">
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium text-white/80 mb-2 ${poppins.className}`}>
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="w-full min-h-[260px] rounded-2xl bg-white/5 text-white placeholder:text-white/40 px-6 py-4 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-4 w-4 rounded border-white/30 bg-white/5"
          />
          <span className={`text-white/80 ${poppins.className}`}>
            I agree with the terms and conditions.
          </span>
        </label>

        {error && <p className={`text-sm text-red-400 ${poppins.className}`}>{error}</p>}
        {success && <p className={`text-sm text-green-300 ${poppins.className}`}>{success}</p>}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`w-full h-16 rounded-full bg-white text-black text-lg font-semibold disabled:opacity-60 ${poppins.className}`}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
