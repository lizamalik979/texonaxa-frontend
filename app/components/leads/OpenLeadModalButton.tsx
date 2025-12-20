"use client";

import { type ReactNode } from "react";
import { useLeadModal } from "./LeadModalProvider";

export default function OpenLeadModalButton({
  children,
  className,
  serviceSelected,
}: {
  children: ReactNode;
  className?: string;
  serviceSelected?: string;
}) {
  const { open } = useLeadModal();

  return (
    <button
      type="button"
      className={className}
      onClick={() => open({ serviceSelected })}
    >
      {children}
    </button>
  );
}

