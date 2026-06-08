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
      page: "Pagina",
      project: "Projeto",
      empty: "Sem notas adicionais.",
    }

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

document.querySelectorAll("[data-lead-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const formData = new FormData(form)
    const name = String(formData.get("name") || "").trim()
    const email = String(formData.get("email") || "").trim()
    const phone = String(formData.get("phone") || "").trim()
    const message = String(formData.get("message") || "").trim()
    const consent = formData.get("consent")
    const reference = form.dataset.reference || "Arcos Online"
    const slug = form.dataset.slug || "home"
    const status = form.querySelector("[data-form-status]")
    const button = form.querySelector("button[type='submit']")

    if (!name || !email || !phone) {
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
      `${formCopy.page}: ${pageUrl}`,
      "",
      `${formCopy.project}:`,
      message || formCopy.empty,
    ].join("\n")

    payload.set("first_name", name)
    payload.set("name", name)
    payload.set("email", email)
    payload.set("phone", phone)
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

    ;["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "roistat"].forEach((key) => {
      payload.set(key, searchParams.get(key) || "")
    })

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
