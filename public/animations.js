// Sistema de animaciones con Intersection Observer
// Ligero y eficiente para activar animaciones al hacer scroll

class AnimationObserver {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.observerOptions
    );

    this.init();
  }

  init() {
    // Esperamos a que el DOM esté listo
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupAnimations()
      );
    } else {
      this.setupAnimations();
    }
  }

  setupAnimations() {
    // Observar todos los elementos con la clase animate-on-scroll
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    animatedElements.forEach((element) => {
      this.observer.observe(element);
    });

    // Configurar animaciones especiales
    this.setupStaggeredAnimations();
    this.setupTextReveal();
    this.setupTypewriterEffect();
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationType = element.dataset.animation || "fade-up";
        const delay = element.dataset.delay || "0";

        // Agregar delay si se especifica
        if (delay !== "0") {
          element.style.animationDelay = `${delay}ms`;
        }

        // Aplicar la animación
        element.classList.add(`animate-${animationType}`);

        // Dejar de observar el elemento después de animarlo
        this.observer.unobserve(element);
      }
    });
  }

  setupStaggeredAnimations() {
    // Configurar animaciones escalonadas para grupos de elementos
    const staggerGroups = document.querySelectorAll("[data-stagger]");

    staggerGroups.forEach((group) => {
      const children = group.querySelectorAll(".animate-on-scroll");
      const staggerDelay = parseInt(group.dataset.stagger) || 100;

      children.forEach((child, index) => {
        child.dataset.delay = (index * staggerDelay).toString();
      });
    });
  }

  setupTextReveal() {
    // Configurar revelación de texto palabra por palabra
    const textElements = document.querySelectorAll(".text-reveal");

    textElements.forEach((element) => {
      if (element.dataset.wordReveal === "true") {
        this.setupWordReveal(element);
      }
    });
  }

  setupWordReveal(element) {
    const text = element.textContent;
    const words = text.split(" ");

    element.innerHTML = words
      .map(
        (word, index) =>
          `<span class="inline-block" style="animation-delay: ${
            index * 100
          }ms">${word}</span>`
      )
      .join(" ");
  }

  setupTypewriterEffect() {
    // Configurar efecto de máquina de escribir
    const typewriterElements = document.querySelectorAll(".typewriter-effect");

    typewriterElements.forEach((element) => {
      this.observer.observe(element);

      element.addEventListener("animationstart", () => {
        this.typeWriter(element);
      });
    });
  }

  typeWriter(element) {
    const text = element.dataset.text || element.textContent;
    const speed = parseInt(element.dataset.speed) || 50;

    element.textContent = "";
    element.style.borderRight = "2px solid #f07845";

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        // Opcional: remover el cursor después de completar
        setTimeout(() => {
          element.style.borderRight = "none";
        }, 1000);
      }
    }, speed);
  }

  // Método para agregar nuevos elementos dinámicamente
  addElement(element) {
    this.observer.observe(element);
  }

  // Método para limpiar el observer
  destroy() {
    this.observer.disconnect();
  }
}

// Utilidades adicionales para animaciones
const AnimationUtils = {
  // Animar contadores
  animateCounter(element, start = 0, end, duration = 2000) {
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Usar easing para suavizar la animación
      const easedProgress = this.easeOutQuart(progress);
      const current = Math.floor(start + (end - start) * easedProgress);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  },

  // Función de easing
  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  },

  // Animar elementos con física de resorte
  springAnimation(element, property, targetValue, config = {}) {
    const { tension = 120, friction = 14, precision = 0.01 } = config;

    let currentValue = parseFloat(getComputedStyle(element)[property]) || 0;
    let velocity = 0;

    const animate = () => {
      const spring = -tension * (currentValue - targetValue);
      const damper = -friction * velocity;
      const acceleration = spring + damper;

      velocity += acceleration * 0.016; // 60fps
      currentValue += velocity * 0.016;

      element.style[property] = `${currentValue}px`;

      if (
        Math.abs(targetValue - currentValue) > precision ||
        Math.abs(velocity) > precision
      ) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  },

  // Crear partículas flotantes
  createFloatingParticles(container, count = 6) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className =
        "absolute w-2 h-2 bg-blue-300 rounded-full opacity-20 float-animation";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${4 + Math.random() * 4}s`;

      container.appendChild(particle);
    }
  },

  // Efecto typewriter
  typeWriter(element) {
    const text = element.dataset.text || element.textContent;
    const speed = parseInt(element.dataset.speed) || 50;

    element.textContent = "";
    element.style.borderRight = "2px solid #f07845";

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        // Opcional: remover el cursor después de completar
        setTimeout(() => {
          element.style.borderRight = "none";
        }, 1000);
      }
    }, speed);
  },

  // Efecto parallax simple
  setupParallax(elements) {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;

      elements.forEach((element) => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    // Throttle para rendimiento
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  },
};

// Inicializar el sistema de animaciones cuando el script se carga
let animationObserver;

// Auto-inicialización
(() => {
  if (typeof window !== "undefined") {
    animationObserver = new AnimationObserver();

    // Exponer utilidades globalmente para uso opcional
    window.AnimationUtils = AnimationUtils;
    window.animationObserver = animationObserver;
  }
})();

// Exportar para uso como módulo si es necesario
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AnimationObserver, AnimationUtils };
}
