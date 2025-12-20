"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import LeadPopupForm from "./LeadPopupForm";

type OpenOptions = {
  serviceSelected?: string;
};

type LeadModalContextValue = {
  open: (options?: OpenOptions) => void;
  close: () => void;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) {
    throw new Error("useLeadModal must be used within LeadModalProvider");
  }
  return ctx;
}

export default function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceSelected, setServiceSelected] = useState<string | undefined>(undefined);

  const open = useCallback((options?: OpenOptions) => {
    setServiceSelected(options?.serviceSelected);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <LeadPopupForm
        open={isOpen}
        onClose={close}
        defaultServiceSelected={serviceSelected}
        leftImageSrc="/images/popupform.png"
      />
    </LeadModalContext.Provider>
  );
}

