/* Trading Cat
   Update the contract here when it is live.
   Leave ca as "TBA" until then — both address bars read TBA,
   and Buy stays inactive until ca is a real 0x address. */
const CONFIG = {
  ca: "TBA",
  xCommunity: "https://x.com/tradingcat_X",
};

const isLive = /^0x[a-fA-F0-9]{40}$/.test(CONFIG.ca);
const buyUrl = isLive
  ? `https://pancakeswap.finance/swap?outputCurrency=${CONFIG.ca}`
  : "";
const shownCa = isLive ? CONFIG.ca : "TBA";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const trx = (k, fb) => (window.t ? window.t(k) : fb);

document.querySelectorAll("[data-ca-bar]").forEach((bar) => {
  const text = bar.querySelector("[data-ca-text]");
  const btn = bar.querySelector("[data-ca-copy]");
  text.textContent = shownCa;
  delete text.dataset.i18n;
  btn.querySelector("span").dataset.i18n = "ca.copy";
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shownCa);
      btn.classList.add("done");
      btn.querySelector("span").textContent = trx("ca.copied", "Copied");
      setTimeout(() => {
        btn.classList.remove("done");
        btn.querySelector("span").textContent = trx("ca.copy", "Copy");
      }, 1600);
    } catch (e) {
      text.focus?.();
    }
  });
});

document.querySelectorAll("[data-buy]").forEach((a) => {
  if (buyUrl) {
    a.href = buyUrl;
    a.target = "_blank";
    a.rel = "noopener";
  } else {
    a.addEventListener("click", (e) => e.preventDefault());
    a.setAttribute("aria-disabled", "true");
    a.title = "Contract address coming soon";
  }
});

document.querySelectorAll("[data-x]").forEach((a) => {
  a.href = CONFIG.xCommunity;
});

if (!reduced && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ lerp: 0.12 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -70 });
      }
    });
  });

  gsap.fromTo(
    ".reveal-h",
    { y: 34, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.05, ease: "power3.out", stagger: 0.07, delay: 0.15 }
  );
  gsap.fromTo(
    ".hero-knight img",
    { y: 60, opacity: 0, scale: 0.97 },
    { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "power3.out", delay: 0.35 }
  );

  const kx = gsap.quickTo("#knight", "x", { duration: 0.9, ease: "power3.out" });
  const ky = gsap.quickTo("#knight", "y", { duration: 0.9, ease: "power3.out" });
  window.addEventListener("pointermove", (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    kx(nx * 22);
    ky(ny * 14);
  }, { passive: true });

  gsap.to(".hero-knight", {
    yPercent: 14,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
  });

  ScrollTrigger.create({
    trigger: ".marquee",
    start: "top 90%",
    onEnter: () => document.getElementById("nav").classList.add("on"),
    onLeaveBack: () => document.getElementById("nav").classList.remove("on"),
  });

  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { y: 44, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" },
      }
    );
  });

  const creedTl = gsap.timeline({
    scrollTrigger: { trigger: ".creed", start: "top 68%" },
  });
  creedTl
    .fromTo(".creed-cap", { opacity: 0 }, { opacity: 1, duration: 0.5 })
    .fromTo(".creed-a", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.2")
    .fromTo(
      ".creed-b",
      { clipPath: "inset(0 100% 0 0)", opacity: 0.3, scale: 0.985 },
      { clipPath: "inset(0 0% 0 0)", opacity: 1, scale: 1, duration: 0.95, ease: "power4.inOut" },
      "+=0.15"
    )
    .fromTo(
      ".creed-stamp",
      { scale: 2.1, opacity: 0, rotate: -14 },
      { scale: 1, opacity: 1, rotate: -5, duration: 0.55, ease: "back.out(2.2)" },
      "-=0.15"
    );

  gsap.fromTo(
    ".warband-bg",
    { yPercent: -12, scale: 1.18 },
    {
      yPercent: 12,
      scale: 1.18,
      ease: "none",
      scrollTrigger: { trigger: ".warband", start: "top bottom", end: "bottom top", scrub: 1 },
    }
  );
} else {
  document.getElementById("nav").classList.add("on");
}
