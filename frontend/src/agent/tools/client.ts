import { updateThemeDef } from '@/agent/tools/definitions';
import { getGlobalSetTheme } from '@/components/theme-provider';

export const updateTheme = updateThemeDef.client((toolInput) => {
  const input = toolInput as { theme: "light" | "dark" };
  const setTheme = getGlobalSetTheme();

  if (setTheme) {
    setTheme(input.theme);
    return { success: true, theme: input.theme };
  }

  return { success: false, theme: input.theme };
});
