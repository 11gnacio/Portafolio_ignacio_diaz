const menuToggle = document.querySelector(".menu-toggle");
const navigationLinks = document.querySelector(".nav-links");

const revealSections = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion) {
    document.querySelectorAll(".about-card, .project-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const bounds = card.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width) * 100;
            const y = ((event.clientY - bounds.top) / bounds.height) * 100;

            card.style.setProperty("--pointer-x", `${x}%`);
            card.style.setProperty("--pointer-y", `${y}%`);
        });

        card.addEventListener("pointerleave", () => {
            card.style.removeProperty("--pointer-x");
            card.style.removeProperty("--pointer-y");
        });
    });
}

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealSections.forEach((section) => sectionObserver.observe(section));
} else {
    revealSections.forEach((section) => section.classList.add("is-visible"));
}

menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navigationLinks.classList.toggle("is-open", !isExpanded);
});

navigationLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        menuToggle.setAttribute("aria-expanded", "false");
        navigationLinks.classList.remove("is-open");
    }
});

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const emptyState = document.querySelector(".empty-state");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;
        let visibleProjects = 0;

        filterButtons.forEach((filterButton) => {
            const isActive = filterButton === button;
            filterButton.classList.toggle("is-active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });

        projectCards.forEach((card) => {
            const isVisible = selectedFilter === "todos" || card.dataset.category === selectedFilter;
            card.hidden = !isVisible;
            visibleProjects += Number(isVisible);
        });

        emptyState.hidden = visibleProjects > 0;
    });
});
