<template>
  <div class="has-bottom-nav">
    <div class="bg"><div class="confetti"></div></div>

    <header class="site-header">
      <div class="container nav">
        <NuxtLink to="/" class="logo" aria-label="Zur Startseite">
          <img src="/logo.svg" alt="StuK Leipzig Logo">
        </NuxtLink>
        <nav class="primary" aria-label="Navigation">
          <NuxtLink to="/ueber">Über</NuxtLink>
          <NuxtLink to="/kontakt">Kontakt</NuxtLink>
        </nav>
        <div class="spacer"></div>
        <a href="https://stuk-kalender.de/login?redirect=Lw%3D%3D" class="btn ghost" target="_blank" rel="noopener">Login</a>
        <NuxtLink to="/mitmachen" class="btn">Mitmachen</NuxtLink>
      </div>
    </header>

    <main>
      <section class="container" style="padding-top: 40px;">
        <article class="panel">
          <h1>Kontakt</h1>
          <p class="sub">Schreib uns oder komm vorbei!</p>

          <div style="margin-top: 32px; display: grid; gap: 24px; grid-template-columns: 1fr 1fr;">
            <div>
              <h3>Adresse</h3>
              <p>
                StuK Leipzig<br>
                Nürnberger Straße 42<br>
                04103 Leipzig
              </p>
            </div>

            <div>
              <h3>Email</h3>
              <p>
                <a href="mailto:kontakt@stuk-leipzig.de" style="color: var(--brand-red);">
                  kontakt@stuk-leipzig.de
                </a>
              </p>
            </div>
          </div>

          <div style="margin-top: 32px;">
            <h3>Social Media</h3>
            <p>
              Folge uns auf
              <a href="https://www.instagram.com/stuk_leipzig/" target="_blank" rel="noopener" style="color: var(--brand-red);">
                Instagram
              </a>
              für aktuelle Updates!
            </p>
          </div>
        </article>
      </section>
    </main>

    <footer>
      <div class="container meta-grid">
        <div>
          <strong>StuK Leipzig</strong>
          <p class="sub">Party mit Prinzipien - Kein Platz für Hass.</p>
        </div>
        <div>
          <strong>Kontakt</strong>
          <p class="sub">
            kontakt@stuk-leipzig.de<br>
            Nürnberger Straße 42, 04103 Leipzig
          </p>
        </div>
        <div>
          <strong>Rechtliches</strong>
          <p class="sub">
            <NuxtLink to="/impressum">Impressum</NuxtLink> ·
            <NuxtLink to="/datenschutz">Datenschutz</NuxtLink>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'StuK – Kontakt',
  meta: [
    { name: 'description', content: 'Kontaktiere den StuK Leipzig' }
  ]
})
</script>
