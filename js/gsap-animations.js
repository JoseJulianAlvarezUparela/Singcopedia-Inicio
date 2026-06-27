gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   UTILIDADES
───────────────────────────────────────── */
const snap = document.querySelector(".snap-shell");

function stOf(trigger, el) {
  return {
    trigger,
    scroller: snap,
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
  };
}

/* ─────────────────────────────────────────
   HEADER — slide + fade al cargar
───────────────────────────────────────── */
gsap.from(".site-header", {
  y: -60,
  opacity: 0,
  duration: 0.9,
  ease: "power3.out",
  delay: 0.2,
});

/* ─────────────────────────────────────────
   HERO — efecto máquina de escribir en h1
   + línea accent que crece
───────────────────────────────────────── */
(function initHero() {
  const h1 = document.querySelector(".hero h1");
  const accentLine = document.querySelector(".hero-accent-line");
  const subhead = document.querySelector(".subhead");

  // La h1 empieza invisible (CSS la tiene opacity:0 + translateX)
  // Primero la hacemos visible y quitamos el transform del CSS
  gsap.set(h1, { opacity: 0, x: -40, filter: "blur(8px)" });
  gsap.set(subhead, { opacity: 0, y: 16 });

  const tl = gsap.timeline({ delay: 0.55 });

  tl.to(subhead, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
    .to(
      accentLine,
      { height: "100%", duration: 0.75, ease: "power3.inOut" },
      "-=0.2"
    )
    .to(
      h1,
      {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "power3.out",
      },
      "-=0.4"
    );

  // Scroll hint pulsante (ya está en CSS, pero lo reforzamos)
  gsap.from(".scroll-hint", {
    opacity: 0,
    y: 10,
    delay: 1.8,
    duration: 0.7,
    ease: "power2.out",
  });
})();

/* ─────────────────────────────────────────
   HEAT — contador animado + partículas
───────────────────────────────────────── */
(function initHeat() {
  const section = document.querySelector('[data-section="heat"]');
  const counterSpan = document.querySelector("#heatCounter span");
  const kicker = section.querySelector(".section-kicker");
  const support = section.querySelector(".heat-support");

  gsap.set([kicker, support], { opacity: 0, y: 30 });
  gsap.set("#heatCounter", { opacity: 0, scale: 0.6 });

  ScrollTrigger.create({
    trigger: section,
    scroller: snap,
    start: "top 60%",
    onEnter() {
      const tl = gsap.timeline();

      tl.to(kicker, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .to(
          "#heatCounter",
          { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" },
          "-=0.2"
        )
        .to(support, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");

      // Contador numérico
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 1500,
        duration: 2.2,
        ease: "power2.inOut",
        delay: 0.5,
        onUpdate() {
          counterSpan.textContent = Math.round(obj.val);
        },
        onComplete() {
          // Pulso final
          gsap.to("#heatCounter", {
            scale: 1.08,
            duration: 0.18,
            yoyo: true,
            repeat: 3,
            ease: "power1.inOut",
          });
        },
      });

      // Partículas de calor (pseudo-bubbles flotantes)
      spawnHeatParticles(section);
    },
    onLeaveBack() {
      gsap.set([kicker, support, "#heatCounter"], { opacity: 0, y: 30 });
      gsap.set("#heatCounter", { scale: 0.6, y: 0 });
      counterSpan.textContent = "0";
    },
  });

  function spawnHeatParticles(parent) {
    for (let i = 0; i < 18; i++) {
      const dot = document.createElement("div");
      Object.assign(dot.style, {
        position: "absolute",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "rgba(0,90,140,0.35)",
        pointerEvents: "none",
        left: Math.random() * 100 + "%",
        bottom: "0px",
      });
      parent.appendChild(dot);

      gsap.to(dot, {
        y: -(Math.random() * 340 + 80),
        x: (Math.random() - 0.5) * 120,
        opacity: 0,
        scale: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 2.5 + 1.5,
        delay: Math.random() * 1.5,
        ease: "power1.out",
        onComplete: () => dot.remove(),
      });
    }
  }
})();

/* ─────────────────────────────────────────
   TRIVIA — cards que entran en cascada
   + texto con split por caracteres
───────────────────────────────────────── */
(function initTrivia() {
  const section = document.querySelector('[data-section="trivia"]');
  const lead = section.querySelector(".trivia-lead h2");
  const cards = section.querySelectorAll(".question-card");

  // Split manual del h2 en spans por palabra
  const words = lead.textContent.trim().split(/\s+/);
  lead.innerHTML = words
    .map((w) => `<span class="split-word" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block">${w}</span></span>`)
    .join(" ");
  const wordInners = lead.querySelectorAll(".split-word > span");

  gsap.set(wordInners, { y: "110%" });
  gsap.set(cards, { opacity: 0, y: 60, rotateX: 20 });

  ScrollTrigger.create({
    trigger: section,
    scroller: snap,
    start: "top 60%",
    onEnter() {
      const tl = gsap.timeline();

      tl.to(wordInners, {
        y: "0%",
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
      }).to(
        cards,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.65,
          stagger: 0.18,
          ease: "back.out(1.5)",
        },
        "-=0.3"
      );
    },
    onLeaveBack() {
      gsap.set(wordInners, { y: "110%" });
      gsap.set(cards, { opacity: 0, y: 60, rotateX: 20 });
    },
  });
})();

/* ─────────────────────────────────────────
   PROCESS — filas que entran alternadas
   con efecto de "typewriter" en el índice
───────────────────────────────────────── */
(function initProcess() {
  const section = document.querySelector('[data-section="process"]');
  const rows = section.querySelectorAll(".process-row");

  rows.forEach((row, i) => {
    const fromX = i % 2 === 0 ? -80 : 80;
    gsap.set(row, { opacity: 0, x: fromX, filter: "blur(4px)" });
  });

  ScrollTrigger.create({
    trigger: section,
    scroller: snap,
    start: "top 60%",
    onEnter() {
      gsap.to(rows, {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 0.7,
        stagger: 0.18,
        ease: "power3.out",
      });

      // Animación del índice: cuenta de 0 al número real
      rows.forEach((row, i) => {
        const indexEl = row.querySelector(".process-index");
        const finalText = `0${i + 1}.`;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: i + 1,
          duration: 0.9,
          delay: 0.2 + i * 0.18,
          ease: "power2.inOut",
          onUpdate() {
            indexEl.textContent = `0${Math.round(obj.val)}.`;
          },
          onComplete() {
            indexEl.textContent = finalText;
          },
        });
      });
    },
    onLeaveBack() {
      rows.forEach((row, i) => {
        const fromX = i % 2 === 0 ? -80 : 80;
        gsap.set(row, { opacity: 0, x: fromX, filter: "blur(4px)" });
        row.querySelector(".process-index").textContent = `0${i + 1}.`;
      });
    },
  });
})();

/* ─────────────────────────────────────────
   ROOTS — cards con flip 3D
   + footer que parpadea al entrar
───────────────────────────────────────── */
(function initRoots() {
  const section = document.querySelector('[data-section="roots"]');
  const cards = section.querySelectorAll(".roots-card");
  const footer = section.querySelector(".roots-footer");

  gsap.set(cards, { opacity: 0, rotateY: -90, transformOrigin: "left center" });
  gsap.set(footer, { opacity: 0, y: 40 });

  ScrollTrigger.create({
    trigger: section,
    scroller: snap,
    start: "top 60%",
    onEnter() {
      const tl = gsap.timeline();

      tl.to(cards, {
        opacity: 1,
        rotateY: 0,
        duration: 0.75,
        stagger: 0.2,
        ease: "power3.out",
      }).to(
        footer,
        { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" },
        "-=0.2"
      );
    },
    onLeaveBack() {
      gsap.set(cards, { opacity: 0, rotateY: -90 });
      gsap.set(footer, { opacity: 0, y: 40 });
    },
  });
})();

/* ─────────────────────────────────────────
   CTA — texto que explota y se recompone
   + outline que se dibuja
───────────────────────────────────────── */
(function initCTA() {
  const section = document.querySelector('[data-section="cta"]');
  const kicker = section.querySelector(".cta-kicker");
  const brandWrap = section.querySelector(".cta-brand-wrap");
  const h2 = section.querySelector(".cta-brand-wrap h2");
  const outline = section.querySelector(".brand-outline");
  const copy = section.querySelector(".cta-copy");

  gsap.set(kicker, { opacity: 0, y: -20, letterSpacing: "0.6em" });
  gsap.set(h2, { opacity: 0, scale: 1.35, filter: "blur(12px)" });
  gsap.set(outline, { opacity: 0, scale: 0.85 });
  gsap.set(copy, { opacity: 0, y: 24 });

  ScrollTrigger.create({
    trigger: section,
    scroller: snap,
    start: "top 60%",
    onEnter() {
      const tl = gsap.timeline();

      tl.to(kicker, {
        opacity: 1,
        y: 0,
        letterSpacing: "0.22em",
        duration: 0.7,
        ease: "power3.out",
      })
        .to(
          outline,
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
          "-=0.3"
        )
        .to(
          h2,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "expo.out",
          },
          "-=0.3"
        )
        .to(
          copy,
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        );

      // Pulso continuo suave del outline
      gsap.to(outline, {
        boxShadow: "0 0 60px rgba(255,76,41,0.5)",
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
    },
    onLeaveBack() {
      gsap.set(kicker, { opacity: 0, y: -20, letterSpacing: "0.6em" });
      gsap.set(h2, { opacity: 0, scale: 1.35, filter: "blur(12px)" });
      gsap.set(outline, { opacity: 0, scale: 0.85 });
      gsap.set(copy, { opacity: 0, y: 24 });
    },
  });
})();

/* ─────────────────────────────────────────
   CURSOR MAGNÉTICO en el header logo
───────────────────────────────────────── */
(function initMagneticLogo() {
  const logo = document.querySelector(".site-logo");
  logo.addEventListener("mousemove", (e) => {
    const rect = logo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    gsap.to(logo, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
  });
  logo.addEventListener("mouseleave", () => {
    gsap.to(logo, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" });
  });
})();

/* ─────────────────────────────────────────
   HOVER: process-rows con underline animado
───────────────────────────────────────── */
(function initProcessHover() {
  document.querySelectorAll(".process-row").forEach((row) => {
    row.addEventListener("mouseenter", () => {
      gsap.to(row, { x: 18, duration: 0.25, ease: "power2.out" });
    });
    row.addEventListener("mouseleave", () => {
      gsap.to(row, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    });
  });
})();

/* ─────────────────────────────────────────
   PARALLAX sutil en las secciones al scroll
───────────────────────────────────────── */
(function initParallax() {
  const sections = document.querySelectorAll(".section-page");

  sections.forEach((sec) => {
    const inner = sec.firstElementChild;
    if (!inner) return;

    gsap.to(inner, {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: sec,
        scroller: snap,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });
  });
})();