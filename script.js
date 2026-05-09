(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  const stagePanels = Array.from(document.querySelectorAll(".stage-panel"));
  const parallaxElements = Array.from(document.querySelectorAll("[data-parallax]"));

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    stagePanels.forEach((panel) => panel.classList.add("is-active"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -6% 0px"
    }
  );

  revealElements.forEach((el) => {
    if (el.classList.contains("is-visible")) {
      return;
    }
    revealObserver.observe(el);
  });

  const stageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-active", entry.isIntersecting);
      });
    },
    { threshold: 0.25 }
  );

  stagePanels.forEach((panel) => stageObserver.observe(panel));

  let rafId = null;

  const updateParallax = () => {
    parallaxElements.forEach((el) => {
      const speed = Number(el.dataset.speed || 0.1);
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight * 0.5;
      const elementCenter = rect.top + rect.height * 0.5;
      const offset = (viewportCenter - elementCenter) * speed;
      el.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
    });

    rafId = null;
  };

  const requestParallax = () => {
    if (rafId !== null) {
      return;
    }
    rafId = window.requestAnimationFrame(updateParallax);
  };

  requestParallax();
  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener("resize", requestParallax);
})();
