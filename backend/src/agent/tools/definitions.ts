import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

// Server
export const getWeatherDef = toolDefinition({
  name: "get_weather",
  description: "Get the current weather for a location",
  inputSchema: z.object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
    unit: z.enum(["celsius", "fahrenheit"]).optional(),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    conditions: z.string(),
    location: z.string(),
  }),
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
