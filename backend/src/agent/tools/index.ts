import { getWeather, sendEmail } from '@/agent/tools/server'
import { updateThemeDef } from '@/agent/tools/definitions'

export const tools = [
  getWeather,
  sendEmail,
  updateThemeDef,
]
