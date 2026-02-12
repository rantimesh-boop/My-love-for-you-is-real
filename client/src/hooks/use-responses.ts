import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

// We don't have a GET hook because we only track creations (YES clicks)
// and we don't display a list of all proposals to the user.

export function useCreateResponse() {
  return useMutation({
    mutationFn: async (recipientName: string) => {
      // In a real scenario, we might want to track who said yes
      // The schema allows optional recipientName
      try {
        const res = await fetch(api.responses.create.path, {
          method: api.responses.create.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipientName, accepted: true }),
        });
        
        if (!res.ok) {
          // Silent fail is fine for this fun app, we don't want to block the user
          console.error("Failed to track response");
        }
        return await res.json();
      } catch (e) {
        console.error("Tracking error", e);
      }
    },
  });
}
