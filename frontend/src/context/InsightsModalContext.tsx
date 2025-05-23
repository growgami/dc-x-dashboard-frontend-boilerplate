"use client";
import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

interface InsightsModalContextValue {
  modalOpen: boolean;
  selectedCard: string | null;
  openModal: (cardId: string) => void;
  closeModal: () => void;
}

const InsightsModalContext = createContext<InsightsModalContextValue | undefined>(undefined);

export const InsightsModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      modalOpen,
      selectedCard,
      openModal: (cardId: string) => {
        setSelectedCard(cardId);
        setModalOpen(true);
      },
      closeModal: () => {
        setModalOpen(false);
        setSelectedCard(null);
      },
    }),
    [modalOpen, selectedCard]
  );

  return (
    <InsightsModalContext.Provider value={value}>
      {children}
    </InsightsModalContext.Provider>
  );
};

export function useInsightsModal() {
  const ctx = useContext(InsightsModalContext);
  if (!ctx) throw new Error("useInsightsModal must be used within an InsightsModalProvider");
  return ctx;
}