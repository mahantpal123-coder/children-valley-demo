/**
 * Children Valley School - Interactive Logic
 * Using GSAP, Three.js, and Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initScrollProgress();
  initThreeBG();
  initParticleCanvas();
  initGSAPAnimations();
  initStatsCounter();
  initCarousels();
  initContactForm();
  initPopups();
  initBackToTop();
});

// 1. Theme Toggle
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Check saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const target = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
    updateThemeIcon(target);
  });

  function updateThemeIcon(theme) {
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// 2. Navbar Scroll Effect
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Mobile nav logic could be added here
  });
}

// 3. Scroll Progress Bar
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    bar.style.width = scrolled + "%";
  });
}

// 4. Three.js Background (Simple 3D Floating Particles)
function initThreeBG() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add floating objects
  const geometry = new THREE.IcosahedronGeometry(1, 0);
  const material = new THREE.MeshPhongMaterial({ 
    color: 0x003366, 
    wireframe: true,
    transparent: true,
    opacity: 0.1
  });

  const shapes = [];
  for(let i=0; i<15; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const scale = Math.random() * 0.5 + 0.2;
    mesh.scale.set(scale, scale, scale);
    scene.add(mesh);
    shapes.push({
      mesh,
      speed: Math.random() * 0.01 + 0.005,
      rotSpeed: Math.random() * 0.01
    });
  }

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  camera.position.z = 8;

  function animate() {
    requestAnimationFrame(animate);
    shapes.forEach(s => {
      s.mesh.rotation.x += s.rotSpeed;
      s.mesh.rotation.y += s.rotSpeed;
      s.mesh.position.y += Math.sin(Date.now() * 0.001 * s.speed) * 0.01;
    });
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// 5. Particle Canvas (Floating Bubbles)
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.fillStyle = `rgba(0, 51, 102, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 50; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// 6. GSAP Animations
function initGSAPAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Fade In Elements
  const fadeUps = document.querySelectorAll('.why-card, .course-card, .info-card, .pillar');
  fadeUps.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  });

  // Section Headers
  const headers = document.querySelectorAll('.section-title, .section-label, .section-sub');
  headers.forEach(h => {
    gsap.from(h, {
      scrollTrigger: {
        trigger: h,
        start: "top 90%",
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)"
    });
  });
}

// 7. Stats Counter
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-num');
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const countUp = () => {
      let current = 0;
      const step = target / 50;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          stat.innerText = target;
          clearInterval(timer);
        } else {
          stat.innerText = Math.floor(current);
        }
      }, 30);
    };

    ScrollTrigger.create({
      trigger: stat,
      onEnter: countUp,
      once: true
    });
  });
}

// 8. Carousels (Gallery & Testimonials)
function initCarousels() {
  // Gallery Logic
  const galTrack = document.getElementById('galleryTrack');
  const galNext = document.getElementById('galNext');
  const galPrev = document.getElementById('galPrev');
  let galIdx = 0;

  if (galTrack) {
    const updateGal = () => {
      const cardWidth = galTrack.children[0].offsetWidth + 32; // width + gap
      galTrack.style.transform = `translateX(-${galIdx * cardWidth}px)`;
    };

    galNext.addEventListener('click', () => {
      if (galIdx < galTrack.children.length - 3) {
        galIdx++;
        updateGal();
      }
    });

    galPrev.addEventListener('click', () => {
      if (galIdx > 0) {
        galIdx--;
        updateGal();
      }
    });
  }

  // Testimonial Logic
  const testiTrack = document.getElementById('testiTrack');
  const testiNext = document.getElementById('testiNext');
  const testiPrev = document.getElementById('testiPrev');
  let testiIdx = 0;

  if (testiTrack) {
    const updateTesti = () => {
      testiTrack.style.transform = `translateX(-${testiIdx * 100}%)`;
    };

    testiNext.addEventListener('click', () => {
      testiIdx = (testiIdx + 1) % testiTrack.children.length;
      updateTesti();
    });

    testiPrev.addEventListener('click', () => {
      testiIdx = (testiIdx - 1 + testiTrack.children.length) % testiTrack.children.length;
      updateTesti();
    });

    // Auto slide
    setInterval(() => {
      testiIdx = (testiIdx + 1) % testiTrack.children.length;
      updateTesti();
    }, 5000);
  }
}

// 9. Contact Form
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      // Simulate API call
      setTimeout(() => {
        form.reset();
        btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        success.style.display = 'block';
        setTimeout(() => {
          success.style.display = 'none';
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }, 5000);
      }, 1500);
    });
  }
}

// 10. Popups
function initPopups() {
  const popup = document.getElementById('admissionPopup');
  const close = document.getElementById('closePopup');

  // Show after 3 seconds
  setTimeout(() => {
    if(!sessionStorage.getItem('popupShown')) {
      popup.classList.add('show');
      sessionStorage.setItem('popupShown', 'true');
    }
  }, 3000);

  close.addEventListener('click', () => {
    popup.classList.remove('show');
  });

  popup.addEventListener('click', (e) => {
    if(e.target === popup) popup.classList.remove('show');
  });
}

// 11. Back to Top
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
