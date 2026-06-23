const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discord-webhook`
const APP_VERSION = "1.0.0"

type EventType = "success" | "warning" | "error" | "info" | "security"

interface UserInfo {
  name?: string
  email?: string
  id?: string
  role?: string
  phone?: string
}

interface EventPayload {
  type: EventType
  eventName: string
  description: string
  user?: UserInfo
  data?: Record<string, string | number | boolean>
}

async function dispatch(payload: EventPayload): Promise<void> {
  try {
    await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        "Apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        ...payload,
        userAgent: navigator.userAgent,
        version: APP_VERSION,
      }),
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    // Silent — never let webhook errors surface to the user
  }
}

export const DiscordWebhookService = {
  sendSuccess(eventName: string, description: string, user?: UserInfo, data?: Record<string, string | number | boolean>) {
    return dispatch({ type: "success", eventName, description, user, data })
  },

  sendInfo(eventName: string, description: string, user?: UserInfo, data?: Record<string, string | number | boolean>) {
    return dispatch({ type: "info", eventName, description, user, data })
  },

  sendWarning(eventName: string, description: string, user?: UserInfo, data?: Record<string, string | number | boolean>) {
    return dispatch({ type: "warning", eventName, description, user, data })
  },

  sendError(eventName: string, description: string, user?: UserInfo, data?: Record<string, string | number | boolean>) {
    return dispatch({ type: "error", eventName, description, user, data })
  },

  sendSecurityAlert(eventName: string, description: string, user?: UserInfo, data?: Record<string, string | number | boolean>) {
    return dispatch({ type: "security", eventName, description, user, data })
  },

  sendUserEvent(eventName: string, description: string, user?: UserInfo, data?: Record<string, string | number | boolean>) {
    return dispatch({ type: "info", eventName, description, user, data })
  },
}
