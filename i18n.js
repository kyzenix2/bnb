/* Trading Cat i18n: EN / zh-CN. */

window.TCC_I18N = {
  en: {
    "nav.genesis": "Genesis",
    "nav.creed": "Creed",
    "nav.buy": "Buy 交易猫",
    "hero.eyebrow": "BNB CHAIN",
    "hero.quote": "Want to invest but afraid of missing the timing? Start trading anytime, anywhere!",
    "ca.copy": "Copy",
    "ca.copied": "Copied",
    "btn.buy": "Buy 交易猫",
    "btn.x": "X Community",
    "ch1.no": "The idea",
    "ch1.h2": "Trade on your time",
    "genesis.quote": "Want to invest but afraid of missing the timing? Start trading anytime, anywhere!",
    "ch11.no": "Gallery",
    "ch11.h2": "Trading Cat Gallery",
    "creed.cap": "The idea",
    "creed.a": "TRADE ANYTIME.",
    "creed.b": "ANYWHERE.",
    "creed.stamp": "交易猫",
    "stat1.num": "TBA",
    "stat1.label": "Total supply",
    "stat2.num": "TBA",
    "stat2.label": "Tax",
    "stat3.num": "TBA",
    "stat3.label": "Liquidity",
    "stat4.label": "Home chain",
    "warroom.h2": "Let's win together",
    "warroom.line": "For the community, by the community",
    "foot.legal": "$交易猫 is a memecoin with no intrinsic value, no utility and no promise of financial return. Not affiliated with Binance, BNB Chain or CZ. Nothing here is financial advice. Do your own research.",
    "foot.line": "TRADE ANYTIME. ANYWHERE.",
  },
  zh: {
    "nav.genesis": "理念",
    "nav.creed": "随时交易",
    "nav.buy": "购买交易猫",
    "hero.eyebrow": "BNB链",
    "hero.quote": "想投资却怕错过时机？随时随地开始交易！",
    "ca.copy": "复制",
    "ca.copied": "已复制",
    "btn.buy": "购买交易猫",
    "btn.x": "X 社区",
    "ch1.no": "理念",
    "ch1.h2": "把握你的交易时机",
    "genesis.quote": "想投资却怕错过时机？随时随地开始交易！",
    "ch11.no": "画廊",
    "ch11.h2": "交易猫画廊",
    "creed.cap": "随时交易",
    "creed.a": "随时开启交易。",
    "creed.b": "随地把握时机。",
    "creed.stamp": "交易猫",
    "stat1.num": "待公布",
    "stat1.label": "总供应量",
    "stat2.num": "待公布",
    "stat2.label": "税费",
    "stat3.num": "待公布",
    "stat3.label": "流动性",
    "stat4.label": "主场链",
    "warroom.h2": "一起赢",
    "warroom.line": "社区所有，社区共建",
    "foot.legal": "$交易猫 是一个模因币，没有内在价值、没有实用功能，也不承诺任何财务回报。与币安、BNB Chain 或 CZ 均无关联。本页内容不构成任何投资建议。请自行研究。",
    "foot.line": "随时随地，开启交易。",
  },
};

window.tccLang = localStorage.getItem("tcc_lang") || "en";

window.applyLang = function (lang) {
  window.tccLang = lang;
  localStorage.setItem("tcc_lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  const dict = window.TCC_I18N[lang] || window.TCC_I18N.en;
  const en = window.TCC_I18N.en;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.dataset.i18n;
    el.textContent = dict[k] ?? en[k] ?? el.textContent;
  });
  document.querySelectorAll("[data-lang-btn]").forEach((b) => {
    b.classList.toggle("on", b.dataset.langBtn === lang);
  });
  document.dispatchEvent(new CustomEvent("tcc:lang", { detail: lang }));
};

window.t = (k) =>
  (window.TCC_I18N[window.tccLang] || {})[k] ?? window.TCC_I18N.en[k] ?? k;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-lang-btn]").forEach((b) => {
    b.addEventListener("click", () => window.applyLang(b.dataset.langBtn));
  });
  window.applyLang(window.tccLang || "en");
});
