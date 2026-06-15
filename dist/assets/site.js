document.documentElement.classList.add("js")

const menuButton = document.querySelector("[data-menu-button]")
const mainNav = document.querySelector("[data-main-nav]")
const scrollProgress = document.querySelector("[data-scroll-progress]")
const flightSections = [...document.querySelectorAll("[data-flight-section]")]
const kineticHeroes = [...document.querySelectorAll("[data-kinetic-hero]")]
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
const CRM_ENDPOINT = "https://group.quadcode.com/api/notPopup"
const pageLang = document.documentElement.lang || "pt-BR"
const isEnglish = pageLang.startsWith("en")
const formCopy = isEnglish
  ? {
      required: "Fill in name, email and phone to send.",
      email: "Enter a valid email.",
      consent: "Confirm consent to receive contact.",
      sending: "Sending brief...",
      success: "Received. We will review your scope and return with next steps.",
      error: "Could not send right now. Try again in a few moments.",
      lead: "Lead Arcos Online",
      reference: "Reference",
      name: "Name",
      phone: "Phone",
      phoneCountry: "Phone country",
      phoneInvalid: "Enter a valid phone number for the selected country.",
      phoneHelper: "Country is detected automatically, but users can change it before submitting.",
      company: "Company",
      page: "Page",
      project: "Project",
      empty: "No additional notes.",
    }
  : {
      required: "Preencha nome, email e telefone para enviar.",
      email: "Digite um email válido.",
      consent: "Confirme o consentimento para receber contato.",
      sending: "Enviando briefing...",
      success: "Recebido. Vamos revisar seu escopo e retornar com os próximos passos.",
      error: "Não foi possível enviar agora. Tente novamente em alguns instantes.",
      lead: "Lead Arcos Online",
      reference: "Referencia",
      name: "Nome",
      phone: "Telefone",
      phoneCountry: "País do telefone",
      phoneInvalid: "Digite um telefone válido para o país selecionado.",
      phoneHelper: "O país é detectado automaticamente, mas você pode alterá-lo antes de enviar.",
      company: "Empresa",
      page: "Pagina",
      project: "Projeto",
      empty: "Sem notas adicionais.",
    }

const phoneCountryOptions = [
  { country: "BR", name: "Brazil", callingCode: "55", example: "11 99999-9999" },
  { country: "US", name: "United States", callingCode: "1", example: "555 000 0000" },
  { country: "GB", name: "United Kingdom", callingCode: "44", example: "7400 123456" },
  { country: "NL", name: "Netherlands", callingCode: "31", example: "6 12345678" },
  { country: "CA", name: "Canada", callingCode: "1", example: "555 000 0000" },
  { country: "IN", name: "India", callingCode: "91", example: "98765 43210" },
  { country: "ID", name: "Indonesia", callingCode: "62", example: "812 3456 7890" },
  { country: "NG", name: "Nigeria", callingCode: "234", example: "801 234 5678" },
  { country: "ZA", name: "South Africa", callingCode: "27", example: "82 123 4567" },
  { country: "AE", name: "United Arab Emirates", callingCode: "971", example: "50 123 4567" },
  { country: "CY", name: "Cyprus", callingCode: "357", example: "96 123456" },
  { country: "DE", name: "Germany", callingCode: "49", example: "1512 3456789" },
  { country: "ES", name: "Spain", callingCode: "34", example: "612 345 678" },
  { country: "FR", name: "France", callingCode: "33", example: "6 12 34 56 78" },
  { country: "IT", name: "Italy", callingCode: "39", example: "312 345 6789" },
  { country: "PT", name: "Portugal", callingCode: "351", example: "912 345 678" },
  { country: "MX", name: "Mexico", callingCode: "52", example: "55 1234 5678" },
  { country: "AR", name: "Argentina", callingCode: "54", example: "9 11 2345 6789" },
  { country: "CL", name: "Chile", callingCode: "56", example: "9 1234 5678" },
  { country: "CO", name: "Colombia", callingCode: "57", example: "300 1234567" },
  { country: "PE", name: "Peru", callingCode: "51", example: "912 345 678" },
  { country: "TR", name: "Turkey", callingCode: "90", example: "501 234 5678" },
  { country: "PL", name: "Poland", callingCode: "48", example: "512 345 678" },
  { country: "RO", name: "Romania", callingCode: "40", example: "712 345 678" },
  { country: "UA", name: "Ukraine", callingCode: "380", example: "50 123 4567" },
  { country: "KZ", name: "Kazakhstan", callingCode: "7", example: "701 123 4567" },
  { country: "PH", name: "Philippines", callingCode: "63", example: "917 123 4567" },
  { country: "MY", name: "Malaysia", callingCode: "60", example: "12 345 6789" },
  { country: "SG", name: "Singapore", callingCode: "65", example: "8123 4567" },
  { country: "TH", name: "Thailand", callingCode: "66", example: "81 234 5678" },
  { country: "VN", name: "Vietnam", callingCode: "84", example: "91 234 56 78" },
  { country: "AU", name: "Australia", callingCode: "61", example: "412 345 678" },
  { country: "NZ", name: "New Zealand", callingCode: "64", example: "21 123 4567" },
  { country: "JP", name: "Japan", callingCode: "81", example: "90 1234 5678" },
  { country: "KR", name: "South Korea", callingCode: "82", example: "10 1234 5678" },
  { country: "CN", name: "China", callingCode: "86", example: "131 2345 6789" },
  { country: "HK", name: "Hong Kong", callingCode: "852", example: "5123 4567" },
]

function getCountryFlag(country) {
  return country
    .split("")
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join("")
}

function getCountryOption(country) {
  return phoneCountryOptions.find((option) => option.country === country) || phoneCountryOptions[0]
}

function detectInitialCountry() {
  const browserRegion = (navigator.language || "").split("-")[1]?.toUpperCase()
  const pageRegion = pageLang.split("-")[1]?.toUpperCase()
  const fallback = isEnglish ? "US" : "BR"
  const detected = [browserRegion, pageRegion, fallback].find((country) =>
    phoneCountryOptions.some((option) => option.country === country),
  )

  return getCountryOption(detected)
}

function normalizePhoneNumber(rawValue, option) {
  const raw = rawValue.trim()
  const digits = raw.replace(/\D/g, "")

  if (!digits) return ""

  const normalized = raw.startsWith("+")
    ? `+${digits}`
    : digits.startsWith(option.callingCode)
      ? `+${digits}`
      : `+${option.callingCode}${digits.replace(/^0+/, "")}`
  const normalizedDigits = normalized.replace(/\D/g, "")

  return normalizedDigits.length >= 8 && normalizedDigits.length <= 15 ? normalized : ""
}

function buildCountryMenu(field) {
  const menu = document.createElement("div")
  menu.className = "phone-country-menu"
  menu.setAttribute("data-phone-country-menu", "")
  menu.setAttribute("role", "listbox")
  menu.hidden = true

  phoneCountryOptions.forEach((option) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "phone-country-option"
    button.dataset.countryOption = option.country
    button.setAttribute("role", "option")
    button.innerHTML = `<span>${getCountryFlag(option.country)}</span><span>${option.name}</span><strong>+${option.callingCode}</strong>`
    button.addEventListener("click", () => {
      setPhoneCountry(field, option.country)
      closeCountryMenu(field)
    })
    menu.append(button)
  })

  field.append(menu)
  return menu
}

function closeCountryMenu(field) {
  const button = field.querySelector("[data-phone-country-button]")
  const menu = field.querySelector("[data-phone-country-menu]")

  if (menu) menu.hidden = true
  if (button) button.setAttribute("aria-expanded", "false")
}

function setPhoneCountry(field, country) {
  const option = getCountryOption(country)
  const flag = field.querySelector("[data-phone-flag]")
  const code = field.querySelector("[data-phone-code]")
  const hiddenCountry = field.querySelector("[data-phone-country-value]")
  const input = field.querySelector("[data-phone-input]")

  field.dataset.phoneCountry = option.country
  if (flag) flag.textContent = getCountryFlag(option.country)
  if (code) code.textContent = `+${option.callingCode}`
  if (hiddenCountry) hiddenCountry.value = option.country
  if (input) input.placeholder = option.example
  syncPhoneValue(field)
}

function syncPhoneValue(field) {
  const option = getCountryOption(field.dataset.phoneCountry)
  const input = field.querySelector("[data-phone-input]")
  const hiddenPhone = field.querySelector("[data-phone-normalized]")
  const value = input ? normalizePhoneNumber(input.value, option) : ""

  if (hiddenPhone) hiddenPhone.value = value
  if (input) input.setCustomValidity(input.value.trim() && !value ? formCopy.phoneInvalid : "")

  return value
}

function initPhoneField(field) {
  const button = field.querySelector("[data-phone-country-button]")
  const input = field.querySelector("[data-phone-input]")
  const menu = buildCountryMenu(field)

  setPhoneCountry(field, detectInitialCountry().country)

  button?.addEventListener("click", () => {
    const isOpen = menu.hidden
    menu.hidden = !isOpen
    button.setAttribute("aria-expanded", String(isOpen))
  })

  field.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCountryMenu(field)
  })

  input?.addEventListener("input", () => syncPhoneValue(field))
  input?.addEventListener("blur", () => syncPhoneValue(field))
}

function readCookie(name) {
  const match = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : ""
}

document.addEventListener("click", (event) => {
  document.querySelectorAll("[data-phone-field]").forEach((field) => {
    if (!field.contains(event.target)) closeCountryMenu(field)
  })
})

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open")
    menuButton.setAttribute("aria-expanded", String(isOpen))
  })

  mainNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      mainNav.classList.remove("is-open")
      menuButton.setAttribute("aria-expanded", "false")
    }
  })
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear()
})

if (scrollProgress) {
  const updateScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const progress = max > 0 ? window.scrollY / max : 0
    scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`
    document.body.classList.toggle("hero-past", window.scrollY > window.innerHeight * 0.7)
  }

  updateScrollProgress()
  window.addEventListener("scroll", updateScrollProgress, { passive: true })
  window.addEventListener("resize", updateScrollProgress)
}

if (kineticHeroes.length > 0 && !reducedMotion.matches) {
  let kineticTicking = false

  const updateKineticHero = () => {
    const progress = clamp(window.scrollY / (window.innerHeight * 0.95), 0, 1)
    kineticHeroes.forEach((hero) => {
      hero.style.setProperty("--hero-motion", progress.toFixed(3))
    })
    kineticTicking = false
  }

  const scheduleKineticHero = () => {
    if (kineticTicking) return
    kineticTicking = true
    window.requestAnimationFrame(updateKineticHero)
  }

  scheduleKineticHero()
  window.addEventListener("scroll", scheduleKineticHero, { passive: true })
  window.addEventListener("resize", scheduleKineticHero)
}

if (flightSections.length > 0 && !reducedMotion.matches) {
  let flightTicking = false

  const updateFlightMotion = () => {
    flightSections.forEach((section) => {
      const aircraft = section.querySelector("[data-flight-aircraft]")
      if (!aircraft) return

      const rect = section.getBoundingClientRect()
      const isNarrow = window.innerWidth < 760
      const startLine = window.innerHeight * (isNarrow ? 1.3 : 1.4)
      const endLine = window.innerHeight * (isNarrow ? -1.85 : -1.6)
      const progress = clamp((startLine - rect.top) / (startLine - endLine), 0, 1)
      const eased = easeInOut(progress)
      const startX = isNarrow ? -108 : -92
      const endX = isNarrow ? 54 : 45
      const x = startX + (endX - startX) * eased
      const y = 30 - 55 * eased + Math.sin(eased * Math.PI) * -8
      const rotate = -11 + 19 * eased
      const scale = (isNarrow ? 0.78 : 0.68) + 0.28 * Math.sin(eased * Math.PI)
      const opacity = Math.max(0, Math.min(1, progress * 7, (1 - progress) * 7))

      aircraft.style.transform = `translate3d(${x}vw, ${y}vh, 0) rotate(${rotate}deg) scale(${scale})`
      aircraft.style.opacity = String(opacity)
    })

    flightTicking = false
  }

  const scheduleFlightMotion = () => {
    if (flightTicking) return
    flightTicking = true
    window.requestAnimationFrame(updateFlightMotion)
  }

  scheduleFlightMotion()
  window.addEventListener("scroll", scheduleFlightMotion, { passive: true })
  window.addEventListener("resize", scheduleFlightMotion)
}

const revealNodes = [...document.querySelectorAll("[data-reveal]")]

if (revealNodes.length > 0) {
  revealNodes.forEach((node) => {
    const delay = Number(node.dataset.revealDelay || 0)
    if (delay > 0) {
      node.style.setProperty("--reveal-delay", `${delay}ms`)
    }
  })

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"))
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    )

    revealNodes.forEach((node) => revealObserver.observe(node))
  }
}

function getModalFocusables(shell) {
  return [...shell.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])')].filter(
    (element) => !element.disabled && element.offsetParent !== null,
  )
}

function openLeadModal(shell) {
  const panel = shell.querySelector("[data-lead-modal-panel]")

  if (!panel) return

  shell.lastFocusedElement = document.activeElement
  panel.hidden = false
  document.body.classList.add("modal-open")

  requestAnimationFrame(() => {
    const dialog = panel.querySelector(".lead-modal-dialog")

    if (dialog) {
      dialog.scrollTop = 0
      dialog.focus({ preventScroll: true })
    } else {
      getModalFocusables(shell)[0]?.focus({ preventScroll: true })
    }
  })
}

function closeLeadModal(shell) {
  const panel = shell.querySelector("[data-lead-modal-panel]")

  if (!panel || panel.hidden) return

  panel.hidden = true

  if (!document.querySelector("[data-lead-modal-panel]:not([hidden])")) {
    document.body.classList.remove("modal-open")
  }

  shell.lastFocusedElement?.focus?.()
}

document.querySelectorAll("[data-lead-modal]").forEach((shell) => {
  shell.querySelector("[data-lead-modal-open]")?.addEventListener("click", () => openLeadModal(shell))
  shell.querySelectorAll("[data-lead-modal-close]").forEach((button) => {
    button.addEventListener("click", () => closeLeadModal(shell))
  })

  shell.querySelector("[data-lead-modal-panel]")?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLeadModal(shell)
      return
    }

    if (event.key !== "Tab") return

    const focusables = getModalFocusables(shell)
    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    if (!first || !last) return

    const dialog = shell.querySelector(".lead-modal-dialog")

    if (document.activeElement === dialog) {
      event.preventDefault()
      ;(event.shiftKey ? last : first).focus()
      return
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  })
})

document.querySelectorAll("[data-phone-field]").forEach(initPhoneField)

document.querySelectorAll("[data-lead-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const formData = new FormData(form)
    const name = String(formData.get("name") || "").trim()
    const email = String(formData.get("email") || "").trim()
    const phone = String(formData.get("phone") || "").trim()
    const phoneCountry = String(formData.get("phone_country") || "").trim()
    const company = String(formData.get("company_name") || "").trim()
    const message = String(formData.get("message") || "").trim()
    const consent = formData.get("consent")
    const phoneInput = form.querySelector("[data-phone-input]")
    const reference = form.dataset.reference || "Arcos Online"
    const slug = form.dataset.slug || "home"
    const status = form.querySelector("[data-form-status]")
    const button = form.querySelector("button[type='submit']")

    if (!name || !email || !phone) {
      if (!phone && phoneInput) {
        phoneInput.setCustomValidity(phoneInput.value.trim() ? formCopy.phoneInvalid : formCopy.required)
        phoneInput.reportValidity()
      }
      setStatus(status, formCopy.required, "error")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus(status, formCopy.email, "error")
      return
    }

    if (!consent) {
      setStatus(status, formCopy.consent, "error")
      return
    }

    const payload = new FormData()
    const pageUrl = window.location.href
    const searchParams = new URLSearchParams(window.location.search)
    const comment = [
      formCopy.lead,
      `${formCopy.reference}: ${reference}`,
      `Slug: ${slug}`,
      `${formCopy.name}: ${name}`,
      `Email: ${email}`,
      `${formCopy.phone}: ${phone}`,
      phoneCountry ? `${formCopy.phoneCountry}: ${phoneCountry}` : "",
      company ? `${formCopy.company}: ${company}` : "",
      `${formCopy.page}: ${pageUrl}`,
      "",
      `${formCopy.project}:`,
      message || formCopy.empty,
    ]
      .filter(Boolean)
      .join("\n")

    payload.set("first_name", name)
    payload.set("name", name)
    payload.set("email", email)
    payload.set("phone", phone)
    payload.set("phone_country", phoneCountry)
    payload.set("company_name", company)
    payload.set("comment", comment)
    payload.set("message", comment)
    payload.set("terms_agree", "on")
    payload.set("landing_url", pageUrl)
    payload.set("page_url", pageUrl)
    payload.set("referrer", document.referrer || "")
    payload.set("lang_by_browser", navigator.language || pageLang)
    payload.set("page_language", pageLang)
    payload.set("source_site", "Arcos Online")
    payload.set("source_form", "arcos_clone_script_quote")
    payload.set("reference", reference)
    payload.set("slug", slug)

    ;["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
      payload.set(key, searchParams.get(key) || "")
    })

    const roistat = searchParams.get("roistat") || readCookie("roistat_visit")
    payload.set("roistat", roistat || "")
    payload.set("roistat_id", roistat || "")

    setStatus(status, formCopy.sending, "")
    if (button) button.disabled = true

    try {
      const response = await fetch(CRM_ENDPOINT, {
        method: "POST",
        body: payload,
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`CRM returned ${response.status}`)
      }

      form.reset()
      form.querySelectorAll("[data-phone-field]").forEach((field) => {
        setPhoneCountry(field, field.dataset.phoneCountry || detectInitialCountry().country)
      })
      setStatus(status, formCopy.success, "success")
    } catch (error) {
      setStatus(status, formCopy.error, "error")
    } finally {
      if (button) button.disabled = false
    }
  })
})

function setStatus(node, message, type) {
  if (!node) return
  node.textContent = message
  node.classList.remove("is-success", "is-error")
  if (type === "success") node.classList.add("is-success")
  if (type === "error") node.classList.add("is-error")
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function easeInOut(value) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2
}
