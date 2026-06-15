const DEFAULT_FORMS_API_URL = "https://group.quadcode.com"
const DEFAULT_FORMS_API_ENDPOINT = "/api/notPopup"
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]

function readString(body, key, maxLength = 1200) {
  const value = body?.[key]
  return typeof value === "string" ? value.trim().slice(0, maxLength) : ""
}

function readBoolean(body, key) {
  return body?.[key] === true || body?.[key] === "true" || body?.[key] === "on"
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "")
  if (digits.length < 8 || digits.length > 15) return ""
  return `+${digits}`
}

function appendIfPresent(payload, key, value) {
  if (value) payload.set(key, value)
}

function getLandingReference(sourceUrl, pagePath) {
  if (sourceUrl) {
    try {
      const url = new URL(sourceUrl)
      return `${url.host}${url.pathname}`
    } catch {
      // Fall back to the path below.
    }
  }

  return pagePath ? `arcosonline.com.br${pagePath}` : "arcosonline.com.br"
}

function parseCrmResponse(responseText) {
  if (!responseText) return null

  try {
    return JSON.parse(responseText)
  } catch {
    return responseText
  }
}

function isCrmRejection(result) {
  return Boolean(result && typeof result === "object" && "success" in result && result.success === false)
}

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.end(JSON.stringify(body))
}

function isEnglishPage(body) {
  return readString(body, "page_language", 20).startsWith("en")
}

function copyFor(body) {
  const isEnglish = isEnglishPage(body)

  return isEnglish
    ? {
        required: "Name, email, phone, and consent are required.",
        email: "Please enter a valid email address.",
        phone: "Please enter a valid phone number with country code.",
        crmRejected: "CRM rejected the lead request. Please check the form fields and try again.",
        unavailable: "Unable to submit the lead right now.",
      }
    : {
        required: "Nome, email, telefone e consentimento são obrigatórios.",
        email: "Digite um email válido.",
        phone: "Digite um telefone válido com código do país.",
        crmRejected: "O CRM recusou o envio. Revise os campos e tente novamente.",
        unavailable: "Não foi possível enviar agora. Tente novamente em alguns instantes.",
      }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    sendJson(res, 405, { message: "Method not allowed." })
    return
  }

  const body = req.body && typeof req.body === "object" ? req.body : {}
  const copy = copyFor(body)
  const firstName = readString(body, "first_name", 120) || readString(body, "name", 120)
  const email = readString(body, "email", 180)
  const phoneInput = readString(body, "phone", 80)
  const phone = normalizePhone(phoneInput)
  const phoneCountry = readString(body, "phone_country", 10)
  const termsAgree = readBoolean(body, "terms_agree")

  if (!firstName || !email || !phoneInput || !termsAgree) {
    sendJson(res, 400, { message: copy.required })
    return
  }

  if (!isEmail(email)) {
    sendJson(res, 400, { message: copy.email })
    return
  }

  if (!phone) {
    sendJson(res, 400, { message: copy.phone })
    return
  }

  const companyName = readString(body, "company_name", 180)
  const reference = readString(body, "reference", 180) || readString(body, "broker_name", 120) || "Arcos Online"
  const slug = readString(body, "slug", 120) || readString(body, "broker_slug", 120) || "home"
  const sourceUrl = readString(body, "source_url", 500) || readString(body, "page_url", 500) || readString(body, "landing_url", 500)
  const pagePath = readString(body, "page_path", 220)
  const pageUrl = sourceUrl || getLandingReference(sourceUrl, pagePath)
  const referrer = readString(body, "referrer", 500)
  const language = readString(body, "lang_by_browser", 20) || "pt-BR"
  const pageLanguage = readString(body, "page_language", 20) || "pt-BR"
  const roistat = readString(body, "roistat", 120) || readString(body, "roistat_id", 120)
  const comment = readString(body, "comment", 1600) || readString(body, "message", 1600)

  const contextLines = [
    "Lead Arcos Online",
    "Request type: clone script / white-label brokerage platform",
    `Reference: ${reference}`,
    `Slug: ${slug}`,
    `Name: ${firstName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    phoneCountry ? `Phone country: ${phoneCountry}` : "",
    companyName ? `Company / business: ${companyName}` : "",
    `Page: ${pageUrl}`,
    "",
    "Project:",
    comment || "No additional notes.",
    "",
    pagePath ? `Page path: ${pagePath}` : "",
    sourceUrl ? `Source URL: ${sourceUrl}` : "",
    ...UTM_FIELDS.map((field) => {
      const value = readString(body, field, 180)
      return value ? `${field}: ${value}` : ""
    }),
  ].filter(Boolean)

  const payload = new FormData()

  payload.set("first_name", firstName)
  payload.set("name", firstName)
  payload.set("email", email)
  payload.set("phone", phone)
  payload.set("terms_agree", "on")
  payload.set("landing_url", pageUrl)
  payload.set("page_url", pageUrl)
  payload.set("referrer", referrer || getLandingReference(sourceUrl, pagePath))
  payload.set("lang_by_browser", language)
  payload.set("page_language", pageLanguage)
  payload.set("source_form", "arcos_clone_script_quote")
  payload.set("source_site", "Arcos Online")
  payload.set("reference", reference)
  payload.set("slug", slug)
  appendIfPresent(payload, "comment", contextLines.join("\n"))
  appendIfPresent(payload, "message", contextLines.join("\n"))
  appendIfPresent(payload, "company_name", companyName)
  appendIfPresent(payload, "broker_name", reference)
  appendIfPresent(payload, "broker_slug", slug)
  appendIfPresent(payload, "phone_country", phoneCountry)
  appendIfPresent(payload, "roistat", roistat)
  appendIfPresent(payload, "roistat_id", roistat)

  for (const field of UTM_FIELDS) {
    appendIfPresent(payload, field, readString(body, field, 180))
  }

  const formsApiUrl = process.env.FORMS_API_URL || DEFAULT_FORMS_API_URL
  const formsApiEndpoint = process.env.FORMS_API_ENDPOINT || DEFAULT_FORMS_API_ENDPOINT
  const endpoint = new URL(formsApiEndpoint, formsApiUrl)

  try {
    const crmResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: payload,
      cache: "no-store",
    })

    const responseText = await crmResponse.text()
    const crmResult = parseCrmResponse(responseText)

    if (!crmResponse.ok || isCrmRejection(crmResult)) {
      console.error("CRM rejected Arcos lead request", {
        status: crmResponse.status,
        body: responseText.slice(0, 500),
      })

      sendJson(res, crmResponse.status === 422 ? 422 : 502, {
        message: copy.crmRejected,
      })
      return
    }

    sendJson(res, 200, { success: true, message: "Request sent." })
  } catch (error) {
    console.error("Unable to submit Arcos lead", error)
    sendJson(res, 502, { message: copy.unavailable })
  }
}
