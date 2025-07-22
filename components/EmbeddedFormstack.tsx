"use client";
import { useEffect } from "react";

export default function EmbeddedFormstack() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Step 1: Store ?agent=XYZ to localStorage (if not already set)
    const urlParams = new URLSearchParams(window.location.search);
    const agent = urlParams.get("agent");
    if (agent && !localStorage.getItem("agentName")) {
      localStorage.setItem("agentName", agent);
    }

    // Step 2: Watch for Formstack field and fill it
    const fillAgentField = () => {
      const storedAgent = localStorage.getItem("agentName");
      if (!storedAgent) return;
      const input = document.getElementById("field184472337") as HTMLInputElement | null;
      if (input && !input.value) {
        input.value = storedAgent;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };

    fillAgentField(); // Try immediately

    const observer = new MutationObserver(() => {
      fillAgentField();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <iframe
        src="https://copilot.formstack.com/forms/your-form-id"
        width="100%"
        height="800"
        frameBorder="0"
        title="Formstack Intake"
      />
    </div>
  );
} 