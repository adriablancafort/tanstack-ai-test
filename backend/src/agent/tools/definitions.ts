import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

// Server
export const getWeatherDef = toolDefinition({
  name: "get_weather",
  description: "Get the current weather for a city",
  inputSchema: z.object({
    city: z.string().describe("City name, e.g. San Francisco"),
  }),
  outputSchema: z.object({
    temperature: z.number().describe("Current temperature at the location"),
    unit: z.string().describe("Unit of the temperature, e.g. °C or °F"),
    location: z.string().describe("Resolved location name"),
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
