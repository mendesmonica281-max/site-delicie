const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const parallaxImage = document.querySelector("[data-parallax]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const updateParallax = () => {
  if (!parallaxImage) return;
  const offset = Math.min(window.scrollY * 0.16, 120);
  parallaxImage.style.setProperty("--parallax", `${offset}px`);
};

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.counter);
      const duration = 1500;
      const startedAt = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        counter.textContent = Math.floor(progress * target).toLocaleString("pt-BR");
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 1 }
);

document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));

window.addEventListener(
  "scroll",
  () => {
    updateHeader();
    updateParallax();
  },
  { passive: true }
);

updateHeader();
updateParallax();
