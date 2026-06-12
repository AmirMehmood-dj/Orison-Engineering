/* ============================================
   Orison Engineering Services - Custom JavaScript
   Lightweight, no dependencies
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ---- Header Scroll Effect ----
  const header = document.querySelector('.header');
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ---- Mobile Navigation ----
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const navOverlay = document.querySelector('.nav-overlay');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('show');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', function() {
        navToggle.classList.remove('active');
        mobileNav.classList.remove('open');
        navOverlay.classList.remove('show');
        document.body.style.overflow = '';
      });
    }

    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        mobileNav.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('show');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Scroll to Top Button ----
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Fade-up Animation on Scroll ----
  const fadeElements = document.querySelectorAll('.fade-up');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // ---- Product Filtering ----
  const filterBtns = document.querySelectorAll('.product-filters button');
  const productGrid = document.querySelector('.product-grid');
  const productCards = document.querySelectorAll('.product-card');

  if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        // Fade out grid
        productGrid.style.opacity = '0';
        productGrid.style.transform = 'translateY(8px)';

        setTimeout(function() {
          productCards.forEach(function(card) {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });

          // Fade in grid
          requestAnimationFrame(function() {
            productGrid.style.opacity = '1';
            productGrid.style.transform = 'translateY(0)';
          });
        }, 250);
      });
    });
  }

  // ---- Stats Counter Animation ----
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    var counted = false;
    var statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          statNumbers.forEach(function(stat) {
            var target = parseInt(stat.getAttribute('data-count'));
            var suffix = stat.getAttribute('data-suffix') || '';
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function animate(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              var current = Math.floor(eased * target);
              stat.textContent = current.toLocaleString() + suffix;
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                stat.textContent = target.toLocaleString() + suffix;
              }
            }
            requestAnimationFrame(animate);
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    var statsSection = statNumbers[0].closest('.section, .section-dark');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }

  // ---- Partners Track Duplication for Seamless Loop ----
  var partnersTracks = document.querySelectorAll('.partners-track');
  partnersTracks.forEach(function(track) {
    var items = track.innerHTML;
    track.innerHTML = items + items;
  });

  // ---- Contact Form (Formspree) ----
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var loadingMsg = contactForm.querySelector('.form-message.loading');
      var successMsg = contactForm.querySelector('.form-message.success');
      var errorMsg = contactForm.querySelector('.form-message.error');

      // Hide all messages
      contactForm.querySelectorAll('.form-message').forEach(function(m) { m.classList.remove('show'); });

      // Show loading
      if (loadingMsg) loadingMsg.classList.add('show');

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function(response) {
        if (loadingMsg) loadingMsg.classList.remove('show');

        if (response.ok) {
          if (successMsg) successMsg.classList.add('show');
          contactForm.reset();
        } else {
          return response.json().then(function(data) {
            if (data.errors) {
              if (errorMsg) {
                errorMsg.textContent = data.errors.map(function(err) { return err.message; }).join(', ');
                errorMsg.classList.add('show');
              }
            } else {
              if (errorMsg) {
                errorMsg.textContent = 'Something went wrong. Please try again.';
                errorMsg.classList.add('show');
              }
            }
          });
        }
      })
      .catch(function() {
        if (loadingMsg) loadingMsg.classList.remove('show');
        if (errorMsg) {
          errorMsg.textContent = 'Something went wrong. Please try again.';
          errorMsg.classList.add('show');
        }
      });
    });
  }

});
