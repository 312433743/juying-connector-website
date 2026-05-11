/* ============================================
   前海聚英官网 - JavaScript交互
   ============================================ */

(function() {
  'use strict';

  // ===== Header Scroll Effect =====
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ===== Mobile Menu Toggle =====
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      this.classList.toggle('active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // ===== Language Switcher =====
  const langSwitcher = document.getElementById('langSwitcher');

  if (langSwitcher) {
    const langBtn = langSwitcher.querySelector('.lang-btn');

    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      langSwitcher.classList.toggle('open');
    });

    document.addEventListener('click', function() {
      langSwitcher.classList.remove('open');
    });
  }

  // ===== Scroll Animation (Intersection Observer) =====
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(function(el) {
    observer.observe(el);
  });

  // ===== Counter Animation =====
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach(function(counter) {
      if (counter.dataset.animated) return;

      const target = parseInt(counter.dataset.count, 10);
      const suffix = counter.querySelector('span') ? counter.querySelector('span').textContent : '';
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * easeOut);

        if (counter.querySelector('span')) {
          counter.innerHTML = current + '<span>' + suffix + '</span>';
        } else {
          counter.textContent = current;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.dataset.animated = 'true';
        }
      }

      // Start counter when element is in view
      const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counterObserver.observe(counter);
    });
  }

  animateCounters();

  // ===== Hero Particles =====
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (6 + Math.random() * 6) + 's';
      container.appendChild(particle);
    }
  }

  createParticles();

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Product Filter (Product List Page) =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productItems = document.querySelectorAll('.product-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        // Remove active from all
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');

        const filter = this.dataset.filter;

        productItems.forEach(function(item) {
          if (filter === 'all' || item.dataset.series === filter) {
            item.style.display = '';
            setTimeout(function() { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(function() { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // ===== Form Validation (Contact Page) =====
  const inquiryForm = document.getElementById('inquiryForm');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();

      let valid = true;
      const requiredFields = this.querySelectorAll('[required]');

      requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#EF4444';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      // Email validation
      const emailField = this.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          emailField.style.borderColor = '#EF4444';
          valid = false;
        }
      }

      // Privacy checkbox
      const privacyCheck = this.querySelector('#privacyCheck');
      if (privacyCheck && !privacyCheck.checked) {
        valid = false;
        alert('请同意隐私协议');
        return;
      }

      if (valid) {
        // Submit via Formspree or show success
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = '提交中...';
        submitBtn.disabled = true;

        // Simulate submission (replace with Formspree in production)
        setTimeout(function() {
          document.getElementById('formSuccess').style.display = 'block';
          inquiryForm.style.display = 'none';
        }, 1500);
      }
    });

    // Clear error on input
    inquiryForm.querySelectorAll('.form-control').forEach(function(field) {
      field.addEventListener('input', function() {
        this.style.borderColor = '';
      });
    });
  }

  // ===== Active Navigation Link =====
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinksAll = document.querySelectorAll('.nav-links a');

    navLinksAll.forEach(function(link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (currentPath === href || (href !== '/' && currentPath.startsWith(href))) {
        link.classList.add('active');
      }
    });

    // If on homepage
    if (currentPath === '/' || currentPath === '/index.html') {
      navLinksAll.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '/') {
          link.classList.add('active');
        }
      });
    }
  }

  setActiveNavLink();

  // ===== Page Transition Effect =====
  document.body.classList.add('page-transition');

  // ===== Back to Top Button =====
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', '回到顶部');
  backToTop.style.cssText = 'position:fixed;bottom:30px;right:30px;width:44px;height:44px;background:var(--gradient-primary);color:#fff;border:none;border-radius:50%;font-size:1.2rem;cursor:pointer;opacity:0;visibility:hidden;transition:all 0.3s;z-index:999;box-shadow:0 4px 15px rgba(0,102,204,0.4);';

  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 500) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
    }
  }, { passive: true });

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();
