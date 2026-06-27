const sections = Array.from(document.querySelectorAll(".section-page"));
const heatSection = document.querySelector('[data-section="heat"]');
const heatCounter = document.querySelector("#heatCounter span");
const rootsSection = document.querySelector('[data-section="roots"]');
const rootsCards = Array.from(document.querySelectorAll(".roots-card, .roots-footer"));
const ctaBrandWrap = document.querySelector(".cta-brand-wrap");

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        if (entry.target === heatSection) {
          runCounter();
        }
        if (entry.target === rootsSection) {
          runRootsReveal();
        }
        if (entry.target.dataset.section === "cta") {
          ctaBrandWrap.classList.add("is-visible");
        }
      }
    }
  },
  { threshold: 0.6 }
);

sections.forEach((section) => observer.observe(section));

let counterStarted = false;

function runCounter() {
  if (counterStarted) {
    return;
  }

  counterStarted = true;
  const target = 1500;
  const duration = 1500;
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    heatCounter.textContent = String(value);

    if (progress < 1) {
      requestAnimationFrame(frame);
      return;
    }

    heatCounter.parentElement.classList.add("is-pulsing");
  }

  requestAnimationFrame(frame);
}

function runRootsReveal() {
  rootsCards.forEach((card) => card.classList.add("is-faded"));
  window.setTimeout(() => {
    rootsCards.forEach((card) => card.classList.remove("is-faded"));
  }, 180);
}

const footer = document.querySelector(".roots-footer");
footer?.addEventListener("click", () => {
  footer.classList.remove("is-flash");
  void footer.offsetWidth;
  footer.classList.add("is-flash");
});
