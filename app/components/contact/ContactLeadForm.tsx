"use client";

import { useMemo, useState, useEffect } from "react";
import { poppins } from "../../fonts";
import { X, ArrowLeft, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Country/Region list
const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Portugal",
  "Greece",
  "Ireland",
  "Austria",
  "Czech Republic",
  "Romania",
  "Hungary",
  "Singapore",
  "Malaysia",
  "Thailand",
  "Indonesia",
  "Philippines",
  "Vietnam",
  "Japan",
  "South Korea",
  "China",
  "Hong Kong",
  "Taiwan",
  "United Arab Emirates",
  "Saudi Arabia",
  "Israel",
  "South Africa",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "Colombia",
  "New Zealand",
  "Other",
];

// Country to Phone Code mapping
const COUNTRY_PHONE_CODES: Record<string, string> = {
  "India": "+91",
  "United States": "+1",
  "United Kingdom": "+44",
  "Canada": "+1",
  "Australia": "+61",
  "Germany": "+49",
  "France": "+33",
  "Italy": "+39",
  "Spain": "+34",
  "Netherlands": "+31",
  "Belgium": "+32",
  "Switzerland": "+41",
  "Sweden": "+46",
  "Norway": "+47",
  "Denmark": "+45",
  "Finland": "+358",
  "Poland": "+48",
  "Portugal": "+351",
  "Greece": "+30",
  "Ireland": "+353",
  "Austria": "+43",
  "Czech Republic": "+420",
  "Romania": "+40",
  "Hungary": "+36",
  "Singapore": "+65",
  "Malaysia": "+60",
  "Thailand": "+66",
  "Indonesia": "+62",
  "Philippines": "+63",
  "Vietnam": "+84",
  "Japan": "+81",
  "South Korea": "+82",
  "China": "+86",
  "Hong Kong": "+852",
  "Taiwan": "+886",
  "United Arab Emirates": "+971",
  "Saudi Arabia": "+966",
  "Israel": "+972",
  "South Africa": "+27",
  "Brazil": "+55",
  "Mexico": "+52",
  "Argentina": "+54",
  "Chile": "+56",
  "Colombia": "+57",
  "New Zealand": "+64",
  "Other": "+91",
};

// Country to Currency mapping
const COUNTRY_CURRENCIES: Record<string, { code: string; symbol: string }> = {
  "India": { code: "INR", symbol: "₹" },
  "United States": { code: "USD", symbol: "$" },
  "United Kingdom": { code: "GBP", symbol: "£" },
  "Canada": { code: "CAD", symbol: "C$" },
  "Australia": { code: "AUD", symbol: "A$" },
  "Germany": { code: "EUR", symbol: "€" },
  "France": { code: "EUR", symbol: "€" },
  "Italy": { code: "EUR", symbol: "€" },
  "Spain": { code: "EUR", symbol: "€" },
  "Netherlands": { code: "EUR", symbol: "€" },
  "Belgium": { code: "EUR", symbol: "€" },
  "Switzerland": { code: "CHF", symbol: "CHF" },
  "Sweden": { code: "SEK", symbol: "kr" },
  "Norway": { code: "NOK", symbol: "kr" },
  "Denmark": { code: "DKK", symbol: "kr" },
  "Finland": { code: "EUR", symbol: "€" },
  "Poland": { code: "PLN", symbol: "zł" },
  "Portugal": { code: "EUR", symbol: "€" },
  "Greece": { code: "EUR", symbol: "€" },
  "Ireland": { code: "EUR", symbol: "€" },
  "Austria": { code: "EUR", symbol: "€" },
  "Czech Republic": { code: "CZK", symbol: "Kč" },
  "Romania": { code: "RON", symbol: "lei" },
  "Hungary": { code: "HUF", symbol: "Ft" },
  "Singapore": { code: "SGD", symbol: "S$" },
  "Malaysia": { code: "MYR", symbol: "RM" },
  "Thailand": { code: "THB", symbol: "฿" },
  "Indonesia": { code: "IDR", symbol: "Rp" },
  "Philippines": { code: "PHP", symbol: "₱" },
  "Vietnam": { code: "VND", symbol: "₫" },
  "Japan": { code: "JPY", symbol: "¥" },
  "South Korea": { code: "KRW", symbol: "₩" },
  "China": { code: "CNY", symbol: "¥" },
  "Hong Kong": { code: "HKD", symbol: "HK$" },
  "Taiwan": { code: "TWD", symbol: "NT$" },
  "United Arab Emirates": { code: "AED", symbol: "د.إ" },
  "Saudi Arabia": { code: "SAR", symbol: "﷼" },
  "Israel": { code: "ILS", symbol: "₪" },
  "South Africa": { code: "ZAR", symbol: "R" },
  "Brazil": { code: "BRL", symbol: "R$" },
  "Mexico": { code: "MXN", symbol: "$" },
  "Argentina": { code: "ARS", symbol: "$" },
  "Chile": { code: "CLP", symbol: "$" },
  "Colombia": { code: "COP", symbol: "$" },
  "New Zealand": { code: "NZD", symbol: "NZ$" },
  "Other": { code: "USD", symbol: "$" },
};


// Services will be fetched from API

type Step = 1 | 2 | 3 | "success" | "skip";

type LeadPayload = {
  name: string;
  email: string;
  phoneNo: string;
  companyName?: string;
  region: string;
  serviceSelected?: string;
  message?: string;
};

type Package = {
  _id: string;
  serviceName: string;
  packageName: string;
  packageTier: string;
  description?: string;
  features: string[];
  isPopular: boolean;
  price: number;
  currency: string;
  displayPrice: string;
  region: string;
};

interface ContactLeadFormProps {
  onClose?: () => void;
}

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ContactLeadForm({ onClose }: ContactLeadFormProps) {
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://texonaxa-cms.vercel.app",
    []
  );

  // Step management
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1: Lead form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [region, setRegion] = useState("");
  const [serviceSelected, setServiceSelected] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);

  // Get phone code and currency based on region
  const phoneCode = useMemo(() => {
    return region ? (COUNTRY_PHONE_CODES[region] || "+1") : "";
  }, [region]);

  const currency = useMemo(() => {
    return region ? (COUNTRY_CURRENCIES[region] || { code: "USD", symbol: "$" }) : { code: "USD", symbol: "$" };
  }, [region]);

  // Step 2: Package selection
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [packageError, setPackageError] = useState<string | null>(null);

  // Step 3: Payment
  const [leadId, setLeadId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Services fetched from API
  const [services, setServices] = useState<string[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // General state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch services from API on component mount
  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      setServicesError(null);

      try {
        const res = await fetch(`${apiBase}/api/packages/clients/services`, {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await res.json();
        if (data.success && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          setServices([]);
        }
      } catch (e) {
        setServicesError(e instanceof Error ? e.message : "Failed to load services");
        setServices([]);
        console.error("Error fetching services:", e);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [apiBase]);

  // Load Razorpay script
  useEffect(() => {
    if (currentStep === 3 && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [currentStep]);

  // Step 1: Validation
  const validateStep1 = (): string | null => {
    if (!region) return "Please select your region/country";
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email";
    if (!phone.trim()) return "Phone number is required";
    // Validate phone number (digits only, 6-15 digits)
    if (!/^\d{6,15}$/.test(phone.trim())) {
      return "Enter a valid phone number (6-15 digits)";
    }
    if (!agree) return "Please agree to the terms and conditions";
    return null;
  };

  // Step 1: Submit lead form
  const handleStep1Submit = async () => {
    setError(null);
    setSuccess(null);

    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Attach phone code to phone number with a space
    const fullPhoneNumber = phoneCode ? `${phoneCode} ${phone.trim()}` : phone.trim();

    const payload: LeadPayload = {
      name: name.trim(),
      email: email.trim(),
      phoneNo: fullPhoneNumber,
      companyName: company.trim() || undefined,
      region: region,
      serviceSelected: serviceSelected.trim() || undefined,
      message: message.trim() || undefined,
    };

    setIsSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch(`${apiBase}/api/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Check if response is ok
      if (!res.ok) {
        let msg = "Failed to submit form";
        try {
          const errorData = await res.json();
          msg = errorData?.message || msg;
        } catch {
          // If response is not JSON, use status text
          msg = `Server error: ${res.status} ${res.statusText}`;
        }
        throw new Error(msg);
      }

      // Parse response
      const data = await res.json();
      
      // Strict validation: Only proceed if we have success AND leadId
      if (!data) {
        throw new Error("No response data received from server");
      }
      
      if (!data.success) {
        throw new Error(data.message || "Failed to save your details. Please try again.");
      }
      
      if (!data.leadId) {
        throw new Error("Lead ID not received. Your details may not have been saved. Please try again.");
      }

      // All validations passed - lead is successfully saved to database
      console.log("Lead successfully saved to database:", data.leadId);
      
      // Store leadId
      setLeadId(data.leadId);
      
      // Show success message briefly before proceeding
      setSuccess("Your details have been saved successfully!");
      
      // Wait a moment to show success message, then proceed to Step 2
      setTimeout(() => {
        setCurrentStep(2);
        // Fetch packages for Step 2
        fetchPackages(serviceSelected || "", region);
      }, 500);
      
    } catch (e) {
      // Error occurred - stay on Step 1 and show error
      const errorMessage = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      setError(errorMessage);
      console.error("Error saving lead:", e);
      // Do NOT proceed to Step 2 if there's an error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Fetch packages
  const fetchPackages = async (service: string, userRegion: string) => {
    setLoadingPackages(true);
    setPackageError(null);

    try {
      const params = new URLSearchParams();
      
      if (service) params.append("service", service);
      if (userRegion) params.append("region", userRegion);

      const res = await fetch(`${apiBase}/api/packages?${params.toString()}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch packages");
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.packages)) {
        setPackages(data.packages);
      } else {
        setPackages([]);
      }
    } catch (e) {
      setPackageError(e instanceof Error ? e.message : "Failed to load packages");
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  // Step 2: Skip package selection
  const handleSkipPackages = () => {
    setCurrentStep("skip");
    setSuccess("Thank you! We'll contact you soon.");
    setTimeout(() => {
      if (onClose) onClose();
    }, 2000);
  };

  // Step 2: Select package and proceed to payment
  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setOrderId(null); // Reset orderId when selecting new package
    setCurrentStep(3);
    handleCreateOrder(pkg);
  };

  // Step 3: Create Razorpay order
  const handleCreateOrder = async (pkg: Package) => {
    if (!leadId) {
      setPaymentError("Lead ID is missing");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const res = await fetch(`${apiBase}/api/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          packageId: pkg._id,
        }),
      });

      if (!res.ok) {
        let msg = "Failed to create payment order";
        try {
          const j = await res.json();
          msg = j?.message || msg;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const data = await res.json();
      if (data.success && data.orderId) {
        // Store orderId for modal close handler
        setOrderId(data.orderId);
        // Initialize Razorpay checkout
        initializeRazorpayPayment(data);
      } else {
        throw new Error("Failed to create order");
      }
    } catch (e) {
      setPaymentError(e instanceof Error ? e.message : "Failed to initialize payment");
      setIsProcessingPayment(false);
    }
  };

  // Step 3: Initialize Razorpay payment
  const initializeRazorpayPayment = (orderData: any) => {
    if (!window.Razorpay) {
      setPaymentError("Payment gateway not loaded. Please refresh the page.");
      setIsProcessingPayment(false);
      return;
    }

    const currentOrderId = orderData.orderId || orderId;
    let paymentCompleted = false; // Add flag to prevent duplicate calls

    // Function to handle modal close (reusable)
    const handleModalClose = async () => {
      // Prevent duplicate calls if payment was already processed
      if (paymentCompleted) {
        return;
      }

      setIsProcessingPayment(false);
      setPaymentError("Payment was cancelled");
      
      // Call modal-closed API to log the event
      if (leadId && currentOrderId) {
        try {
          console.log("Modal closed - calling API with:", { leadId, orderId: currentOrderId });
          
          const response = await fetch(`${apiBase}/api/razorpay/modal-closed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              leadId: leadId,
              orderId: currentOrderId,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Modal close API error:", response.status, errorData);
          } else {
            const data = await response.json();
            console.log("Modal close event logged successfully:", data);
          }
        } catch (error) {
          console.error("Error logging modal close event:", error);
        }
      }
    };

    const options = {
      key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: currentOrderId,
      name: "Texonaxa",
      description: `${orderData.packageDetails?.name || selectedPackage?.packageName} - ${orderData.packageDetails?.service || selectedPackage?.serviceName}`,
      prefill: {
        name: name,
        email: email,
        contact: phoneCode ? `${phoneCode}${phone}` : phone,
      },
      theme: {
        color: "#F0AF4E",
      },
      handler: async (response: any) => {
        paymentCompleted = true; // Mark as completed
        // Payment successful, verify payment
        await handlePaymentVerification(response);
      },
      modal: {
        ondismiss: function() {
          // Only log if payment wasn't completed
          if (!paymentCompleted) {
            console.log("Razorpay modal ondismiss triggered");
            handleModalClose();
          }
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    
    // Handle payment failure
    razorpay.on("payment.failed", async (response: any) => {
      paymentCompleted = true; // Mark as completed to prevent ondismiss from firing
      
      console.log("Payment failed event:", response);
      setPaymentError(response.error?.description || "Payment failed");
      setIsProcessingPayment(false);
      
      // When payment fails, Razorpay still provides payment_id
      // We should verify it to log the failure properly
      if (response.error?.metadata?.payment_id && leadId) {
        try {
          await fetch(`${apiBase}/api/razorpay/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.error.metadata.order_id || currentOrderId,
              razorpay_payment_id: response.error.metadata.payment_id,
              razorpay_signature: "", // Failed payments might not have signature
              leadId,
            }),
          });
        } catch (error) {
          console.error("Error verifying failed payment:", error);
        }
      }
    });

    razorpay.open();
    
    return razorpay;
  };

  // Step 3: Verify payment
  const handlePaymentVerification = async (response: any) => {
    if (!leadId) {
      setPaymentError("Lead ID is missing");
      setIsProcessingPayment(false);
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/razorpay/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          leadId,
        }),
      });

      if (!res.ok) {
        let msg = "Payment verification failed";
        try {
          const j = await res.json();
          msg = j?.message || msg;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const data = await res.json();
      if (data.success) {
        setCurrentStep("success");
        setSuccess("Payment successful! Thank you for your purchase.");
        setOrderId(null); // Reset orderId after successful payment
        setTimeout(() => {
          if (onClose) onClose();
        }, 3000);
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (e) {
      setPaymentError(e instanceof Error ? e.message : "Payment verification failed");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Render Step 1: Lead Form
  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-2.5"
    >

        <div>
          <label className={`block text-xs font-medium text-white/80 mb-1 ${poppins.className}`}>
          Name <span className="text-red-400">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full h-9 rounded-lg bg-white/5 text-white placeholder:text-white/40 px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
          />
        </div>

        <div>
          <label className={`block text-xs font-medium text-white/80 mb-1 ${poppins.className}`}>
          Email <span className="text-red-400">*</span>
          </label>
          <input
          type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-9 rounded-lg bg-white/5 text-white placeholder:text-white/40 px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
          />
        </div>

            {/* Region/Country - At the top */}
            <div>
        <label className={`block text-xs font-medium text-white/80 mb-1 ${poppins.className}`}>
          Region/Country <span className="text-red-400">*</span>
        </label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full h-9 rounded-lg bg-white/5 text-white px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
        >
          <option value="" disabled className="bg-black text-white">
            Select your region
          </option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country} className="bg-black text-white">
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Phone Number with Code - Side by side */}
        <div>
          <label className={`block text-xs font-medium text-white/80 mb-1 ${poppins.className}`}>
          Phone Number <span className="text-red-400">*</span>
          </label>
        <div className="flex gap-2">
          {/* Phone Code - Read-only display */}
          <div className="flex-shrink-0 w-20">
            <input
              type="text"
              value={phoneCode || ""}
              readOnly
              placeholder="Code"
              className="w-full h-9 rounded-lg bg-white/10 text-white/70 px-3 text-sm outline-none ring-1 ring-white/10 cursor-not-allowed"
            />
          </div>
          {/* Phone Number */}
          <div className="flex-1">
          <input
              type="tel"
            value={phone}
              onChange={(e) => {
                // Only allow digits
                const value = e.target.value.replace(/\D/g, '');
                setPhone(value);
              }}
            placeholder="Phone Number"
              maxLength={15}
            className="w-full h-9 rounded-lg bg-white/5 text-white placeholder:text-white/40 px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
          />
          </div>
        </div>
        {region && phoneCode && (
          <p className={`text-xs text-white/50 mt-1 ${poppins.className}`}>
            Full number: {phoneCode} {phone || "..."}
          </p>
        )}
      </div>


        <div>
          <label className={`block text-xs font-medium text-white/80 mb-1 ${poppins.className}`}>
            Company
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          placeholder="Company (Optional)"
            className="w-full h-9 rounded-lg bg-white/5 text-white placeholder:text-white/40 px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25"
          />
        </div>

        <div>
          <label className={`block text-xs font-medium text-white/80 mb-1 ${poppins.className}`}>
            Service Selected
          </label>
          <select
            value={serviceSelected}
            onChange={(e) => setServiceSelected(e.target.value)}
          disabled={loadingServices}
          className="w-full h-9 rounded-lg bg-white/5 text-white px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" className="bg-black text-white">
            {loadingServices ? "Loading services..." : "Select a service (Optional)"}
          </option>
          {services.length > 0 ? (
            services.map((service) => (
              <option key={service} value={service} className="bg-black text-white">
                {service}
              </option>
            ))
          ) : (
            !loadingServices && (
            <option value="" disabled className="bg-black text-white">
                No services available
              </option>
            )
          )}
          </select>
        {servicesError && (
          <p className={`text-xs text-red-400 mt-1 ${poppins.className}`}>
            {servicesError}
          </p>
        )}
        </div>

        <div>
          <label className={`block text-xs font-medium text-white/80 mb-1 ${poppins.className}`}>
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          placeholder="Message (Optional)"
            className="w-full min-h-[70px] rounded-lg bg-white/5 text-white placeholder:text-white/40 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/25 resize-none"
          />
        </div>

        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-3 w-3 rounded border-white/30 bg-white/5"
          />
          <span className={`text-white/80 text-xs ${poppins.className}`}>
          I agree with the terms and conditions. <span className="text-red-400">*</span>
          </span>
        </label>

        {error && <p className={`text-xs text-red-400 ${poppins.className}`}>{error}</p>}
        {success && <p className={`text-xs text-green-300 ${poppins.className}`}>{success}</p>}

        <button
          type="button"
        onClick={handleStep1Submit}
          disabled={isSubmitting}
          className={`w-full h-10 rounded-full bg-[#F0AF4E] text-black text-sm font-semibold disabled:opacity-60 hover:bg-[#F0AF4E]/90 transition-colors ${poppins.className}`}
      >
        {isSubmitting ? "Submitting..." : "Continue"}
      </button>
    </motion.div>
  );

  // Render Step 2: Package Selection
  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      <div className="text-center mb-4">
        <h2 className={`text-lg font-semibold text-white ${poppins.className}`}>
          Choose a Package
        </h2>
        <p className={`text-sm text-white/70 mt-1 ${poppins.className}`}>
          Select a package that suits your needs, or skip to contact us later
        </p>
      </div>

      {loadingPackages ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
          <span className={`ml-2 text-white ${poppins.className}`}>Loading packages...</span>
        </div>
      ) : packageError ? (
        <div className="text-center py-8">
          <p className={`text-sm text-red-400 ${poppins.className}`}>{packageError}</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-8">
          <p className={`text-sm text-white/70 ${poppins.className}`}>
            No packages available at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedPackage?._id === pkg._id
                  ? "border-[#F0AF4E] bg-[#F0AF4E]/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              onClick={() => handleSelectPackage(pkg)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className={`text-base font-semibold text-white ${poppins.className}`}>
                    {pkg.packageName}
                    {pkg.isPopular && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-[#F0AF4E] text-black rounded">
                        Popular
                      </span>
                    )}
                  </h3>
                  <p className={`text-xs text-white/60 mt-1 ${poppins.className}`}>
                    {pkg.serviceName}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold text-[#F0AF4E] ${poppins.className}`}>
                    {pkg.displayPrice}
                  </p>
                  <p className={`text-xs text-white/50 ${poppins.className}`}>
                    {pkg.currency}
                  </p>
                </div>
              </div>
              {pkg.description && (
                <p className={`text-xs text-white/70 mb-2 ${poppins.className}`}>
                  {pkg.description}
                </p>
              )}
              {pkg.features && pkg.features.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {pkg.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className={`text-xs text-white/60 flex items-start ${poppins.className}`}>
                      <Check className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`flex-1 h-10 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors ${poppins.className}`}
        >
          <ArrowLeft className="w-4 h-4 inline mr-1" />
          Back
        </button>
        <button
          type="button"
          onClick={handleSkipPackages}
          className={`flex-1 h-10 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors ${poppins.className}`}
        >
          Skip for Now
        </button>
      </div>
    </motion.div>
  );

  // Render Step 3: Payment Processing
  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      <div className="text-center mb-4">
        <h2 className={`text-lg font-semibold text-white ${poppins.className}`}>
          Processing Payment
        </h2>
        <p className={`text-sm text-white/70 mt-1 ${poppins.className}`}>
          {selectedPackage && (
            <>
              Package: <span className="text-[#F0AF4E]">{selectedPackage.packageName}</span> -{" "}
              <span className="text-[#F0AF4E]">{selectedPackage.displayPrice}</span>
            </>
          )}
        </p>
      </div>

      {isProcessingPayment ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-[#F0AF4E] animate-spin mb-4" />
          <p className={`text-sm text-white/70 ${poppins.className}`}>
            Opening payment gateway...
          </p>
        </div>
      ) : paymentError ? (
        <div className="text-center py-4">
          <p className={`text-sm text-red-400 mb-4 ${poppins.className}`}>{paymentError}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex-1 h-10 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors ${poppins.className}`}
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Back
            </button>
            {selectedPackage && (
              <button
                type="button"
                onClick={() => handleCreateOrder(selectedPackage)}
                className={`flex-1 h-10 rounded-full bg-[#F0AF4E] text-black text-sm font-semibold hover:bg-[#F0AF4E]/90 transition-colors ${poppins.className}`}
              >
                Retry Payment
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className={`text-sm text-white/70 ${poppins.className}`}>
            Please complete the payment in the popup window.
          </p>
        </div>
      )}
    </motion.div>
  );

  // Render Success/Skip state
  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-400" />
      </div>
      <h2 className={`text-xl font-semibold text-white mb-2 ${poppins.className}`}>
        {currentStep === "success" ? "Payment Successful!" : "Thank You!"}
      </h2>
      <p className={`text-sm text-white/70 ${poppins.className}`}>
        {success || "We'll contact you soon."}
      </p>
    </motion.div>
  );

  return (
    <div className="w-full mx-auto px-0">
      <div className="relative">
        <h1 className={`text-xl sm:text-2xl font-semibold text-white text-center ${poppins.className}`}>
          {currentStep === 1 && "Let's Build Something Great"}
          {currentStep === 2 && "Choose Your Package"}
          {currentStep === 3 && "Complete Payment"}
          {(currentStep === "success" || currentStep === "skip") && "Thank You!"}
        </h1>
        {onClose && currentStep !== "success" && currentStep !== "skip" && (
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-white/80 hover:text-white transition-colors p-1.5 sm:p-2 -mt-1 sm:mt-0"
            aria-label="Close form"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>
      <div className="mt-2 h-px w-full bg-white/15" />

      {/* Step indicator */}
      {currentStep !== "success" && currentStep !== "skip" && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${step === currentStep
                    ? "bg-[#F0AF4E] text-black"
                    : step < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-white/10 text-white/50"
                  } ${poppins.className}`}
              >
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-8 h-0.5 ${step < currentStep ? "bg-green-500" : "bg-white/10"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3">
        <AnimatePresence mode="wait">
          {currentStep === 1 && <div key="step1">{renderStep1()}</div>}
          {currentStep === 2 && <div key="step2">{renderStep2()}</div>}
          {currentStep === 3 && <div key="step3">{renderStep3()}</div>}
          {(currentStep === "success" || currentStep === "skip") && (
            <div key="success">{renderSuccess()}</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
