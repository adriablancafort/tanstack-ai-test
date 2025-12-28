import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

// Server
export const sendEmailDef = toolDefinition({
  name: "send_email",
  description: "Send an email to a recipient",
  inputSchema: z.object({
    to: z.email().describe("Recipient email address"),
    subject: z.string().describe("Email subject line"),
    body: z.string().describe("Email content"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
  }),
  needsApproval: true,
});

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
