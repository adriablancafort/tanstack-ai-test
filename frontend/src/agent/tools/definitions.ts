import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

// Client
export const updateThemeDef = toolDefinition({
  name: "update_theme",
  description: "Change the UI theme between light and dark mode",
  inputSchema: z.object({
    theme: z.enum(["light", "dark"]).describe("The theme to switch to"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    theme: z.enum(["light", "dark"]),
  }),
});
