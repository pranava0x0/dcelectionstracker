export type PartyTone = {
  stripe: string;
  pill: string;
  label: string;
};

export function partyTone(party: string): PartyTone {
  if (party === "D") {
    return {
      stripe: "bg-[hsl(210_65%_38%)]",
      pill: "bg-[hsl(210_65%_38%)] text-white",
      label: "D",
    };
  }
  if (party === "I") {
    return { stripe: "bg-ink", pill: "bg-ink text-white", label: "I" };
  }
  if (party === "R") {
    return { stripe: "bg-primary", pill: "bg-primary text-primary-fg", label: "R" };
  }
  if (party === "Statehood Green") {
    return {
      stripe: "bg-[hsl(140_45%_35%)]",
      pill: "bg-[hsl(140_45%_35%)] text-white",
      label: "SG",
    };
  }
  if (party === "Nonpartisan") {
    return { stripe: "bg-muted", pill: "bg-muted text-white", label: "NP" };
  }
  return { stripe: "bg-muted", pill: "bg-muted text-white", label: party };
}
