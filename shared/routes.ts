
import { z } from "zod";
import { insertResponseSchema } from "./schema";

export const api = {
  // Optional: Track when someone says YES
  responses: {
    create: {
      method: "POST",
      path: "/api/responses",
      input: insertResponseSchema,
      responses: {
        201: insertResponseSchema,
      },
    },
  },
};
