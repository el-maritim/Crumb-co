const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

document.documentElement.classList.add('motion-enabled');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? 'Close' : 'Menu';
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.textContent = 'Menu';
  });
});

document.querySelectorAll('[data-allergen]').forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.allergen;
    document.querySelectorAll('[data-allergen]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    document.querySelectorAll('.menu-item').forEach((item) => {
      const allergens = item.dataset.contains?.split(',').map((allergen) => allergen.trim()) ?? [];
      item.classList.toggle('is-hidden', selected !== 'all' && allergens.includes(selected));
    });
  });
});

document.querySelectorAll('.subscribe').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const note = form.parentElement.querySelector('.form-note');
    if (note) note.textContent = 'Demo only: this page does not submit email subscriptions.';
    form.reset();
  });
});

document.querySelectorAll('[data-order-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const note = form.querySelector('.form-note');
    if (note) note.textContent = 'Demo only: no request was sent. Connect this form to an order service before publishing.';
  });
});

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

document.querySelectorAll('.product-grid, .journal-preview, .values-grid').forEach((group) => {
  group.classList.add('reveal-stagger');
  group.querySelectorAll(':scope > *').forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${index * 90}ms`);
  });
});

const revealTargets = document.querySelectorAll(
  '.section, .story-strip, .page-hero, .journal-row, .menu-category, .contact-grid, .story-photo, .article-content, .faq-item, .shop-card, .loaf-menu-section, [data-footer-reveal], .story-intro-grid > *, .story-stat, .story-section-heading, .story-milestone, .story-principle, .story-team-card, .story-quote-content, .story-invitation > .container > *, .reveal-stagger > *',
);

revealTargets.forEach((target) => target.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

document.querySelectorAll('[data-loaf-menu]').forEach((menu) => {
  const options = [...menu.querySelectorAll('[data-loaf-option]')];
  const images = [...menu.querySelectorAll('[data-loaf-image]')];

  const activateLoaf = (option) => {
    const selected = option.dataset.loafOption;
    options.forEach((item) => item.setAttribute('aria-pressed', String(item === option)));
    images.forEach((image) => {
      const isActive = image.dataset.loafImage === selected;
      image.classList.toggle('is-active', isActive);
      image.setAttribute('aria-hidden', String(!isActive));
    });
  };

  options.forEach((option) => {
    option.addEventListener('pointerenter', () => activateLoaf(option));
    option.addEventListener('focus', () => activateLoaf(option));
    option.addEventListener('click', () => activateLoaf(option));
  });
});

const bakeStory = document.querySelector('[data-bake-scroll]');
const bakeTrack = bakeStory?.querySelector('[data-bake-track]');
const bakeTrackWindow = bakeStory?.querySelector('.bake-track-window');

if (bakeStory && bakeTrack && bakeTrackWindow) {
  const bakeCards = [...bakeTrack.querySelectorAll('[data-bake-card]')];
  const progressFill = bakeStory.querySelector('[data-bake-progress]');
  const progressDots = [...bakeStory.querySelectorAll('[data-progress-dot]')];
  const clock = bakeStory.querySelector('[data-bake-clock]');
  const status = bakeStory.querySelector('[data-bake-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const refreshClock = () => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const bakeTimes = [360, 450, 660, 960];
    const nextBake = bakeTimes.find((time) => time > minutes);

    if (clock) {
      clock.textContent = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).format(now);
    }

    if (status) {
      if (minutes < bakeTimes[0]) {
        status.textContent = 'The ovens are warming. First loaves at 6:00.';
      } else if (nextBake) {
        const formatted = `${Math.floor(nextBake / 60)}:${String(nextBake % 60).padStart(2, '0')}`;
        status.textContent = `Next little batch at ${formatted}. Come by hungry.`;
      } else {
        status.textContent = 'That’s the last bake today. Tomorrow, from 6:00.';
      }
    }
  };

  const updateBakeStory = () => {
    const maxTranslate = Math.max(0, bakeTrack.scrollWidth - bakeTrackWindow.clientWidth);
    const touchLayout = window.innerWidth <= 760 || reducedMotion.matches;
    const progress = touchLayout && maxTranslate
      ? bakeTrackWindow.scrollLeft / maxTranslate
      : Math.min(1, Math.max(0, -bakeStory.getBoundingClientRect().top / Math.max(1, bakeStory.offsetHeight - bakeStory.querySelector('.bake-pin').offsetHeight)));

    if (!touchLayout) {
      bakeTrackWindow.scrollLeft = 0;
      bakeTrack.style.transform = `translate3d(${-maxTranslate * progress}px, 0, 0)`;
    } else {
      bakeTrack.style.removeProperty('transform');
    }

    if (progressFill) progressFill.style.width = `${progress * 100}%`;

    const viewportCenter = bakeTrackWindow.getBoundingClientRect().left + bakeTrackWindow.clientWidth / 2;
    const activeIndex = bakeCards.reduce((closestIndex, card, index) => {
      const bounds = card.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - viewportCenter);
      const closestBounds = bakeCards[closestIndex].getBoundingClientRect();
      const closestDistance = Math.abs(closestBounds.left + closestBounds.width / 2 - viewportCenter);
      return distance < closestDistance ? index : closestIndex;
    }, 0);
    bakeCards.forEach((card, index) => card.classList.toggle('is-current', index === activeIndex));
    progressDots.forEach((dot, index) => {
      dot.classList.toggle('is-passed', index < activeIndex);
      dot.classList.toggle('is-current', index === activeIndex);
    });
  };

  let bakeFramePending = false;
  const scheduleBakeUpdate = () => {
    if (bakeFramePending) return;
    bakeFramePending = true;
    requestAnimationFrame(() => {
      updateBakeStory();
      bakeFramePending = false;
    });
  };

  window.addEventListener('scroll', scheduleBakeUpdate, { passive: true });
  window.addEventListener('resize', scheduleBakeUpdate);
  bakeTrackWindow.addEventListener('scroll', scheduleBakeUpdate, { passive: true });
  reducedMotion.addEventListener?.('change', scheduleBakeUpdate);
  refreshClock();
  window.setInterval(refreshClock, 30_000);
  updateBakeStory();
}
