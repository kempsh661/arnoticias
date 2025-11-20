<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <img src="/assets/logos/logo-principal.png" alt="Arauca Noticias" class="footer-logo-image">
            <h3>Arauca Noticias</h3>
          </div>
          <p class="footer-description">
            Tu fuente confiable de información. Mantente al día con las noticias más importantes.
          </p>
        </div>

        <div class="footer-section">
          <h4>Enlaces</h4>
          <ul class="footer-links">
            <li><a href="#inicio" @click.prevent="$emit('scroll-to-section', 'inicio')">Inicio</a></li>
            <li><a href="#destacadas" @click.prevent="$emit('scroll-to-section', 'destacadas')">Destacadas</a></li>
            <li><a href="/noticias">Noticias</a></li>
            <li><a href="#nosotros" @click.prevent="$emit('scroll-to-section', 'nosotros')">Nosotros</a></li>
            <li><a href="#contacto" @click.prevent="$emit('open-contact')">Contacto</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Contacto</h4>
          <ul class="footer-contact">
            <li>📧 Araucanoticias2019@gmail.com</li>
            <li>📱 +57 310 2279487</li>
            <li>📍 Arauca, Colombia</li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Síguenos</h4>
          <div class="social-links">
            <a
              href="https://www.facebook.com/arauca.noticia"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link facebook-link"
              aria-label="Facebook"
            >
              <svg class="social-logo" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/arauca_noticias20?igsh=OHVuemY2dXhnaGpr"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link instagram-link"
              aria-label="Instagram"
            >
              <svg class="social-logo" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
            <a
              href="https://x.com/arauca1noticias?s=21"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link twitter-link"
              aria-label="X (Twitter)"
            >
              <svg class="social-logo" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X (Twitter)
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 Arauca Noticias. Todos los derechos reservados.</p>
        <div class="footer-legal">
          <a href="#" @click.prevent="$emit('open-privacy')">Política de Privacidad</a>
          <a href="#" @click.prevent="$emit('open-terms')">Términos de Uso</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineEmits(['scroll-to-section', 'open-contact', 'open-privacy', 'open-terms'])
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, var(--primary-color, #1a365d) 0%, var(--secondary-color, #2c5282) 100%);
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-section h4 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.footer-logo-image {
  height: 50px;
  width: auto;
}

.footer-logo h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.footer-description {
  opacity: 0.9;
  line-height: 1.6;
  font-size: 0.9375rem;
}

.footer-links,
.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li,
.footer-contact li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  cursor: pointer;
}

.footer-links a:hover {
  color: white;
  transform: translateX(4px);
}

.footer-contact li {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9375rem;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius, 8px);
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
}

.social-logo {
  width: 20px;
  height: 20px;
}

.facebook-link:hover {
  background: #1877f2;
}

.instagram-link:hover {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
}

.twitter-link:hover {
  background: #000000;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.footer-legal {
  display: flex;
  gap: 2rem;
}

.footer-legal a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
  cursor: pointer;
}

.footer-legal a:hover {
  color: white;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .footer-legal {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
