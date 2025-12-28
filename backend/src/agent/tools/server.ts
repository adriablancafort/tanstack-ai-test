import { getWeatherDef } from '@/agent/tools/definitions';

export const getWeather = getWeatherDef.server(async (input) => {
  const { location, unit } = input as { location: string; unit?: "celsius" | "fahrenheit" };

  const response = await fetch(
    `https://api.weather.com/v1/current?location=${location}&unit=${unit || "fahrenheit"}`
  );
  const data = await response.json();

  return {
    temperature: data.temperature,
    conditions: data.conditions,
    location: data.location,
  };
});
