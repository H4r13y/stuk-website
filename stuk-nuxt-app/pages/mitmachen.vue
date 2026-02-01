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
          <h1>Mitmachen</h1>
          <p class="sub">Werde Teil unseres Teams!</p>

          <div style="margin-top: 24px;">
            <p>
              Der StuK lebt von den Menschen, die sich engagieren. Ob an der Bar,
              in der Technik, oder in der Organisation – bei uns kannst du dich
              einbringen und aktiv mitgestalten!
            </p>

            <h3 style="margin-top: 24px;">Bereiche</h3>
            <ul>
              <li><strong>Bar:</strong> Mixe Drinks und lerne coole Leute kennen</li>
              <li><strong>Technik:</strong> Sound & Licht für Events</li>
              <li><strong>Orga:</strong> Events planen und durchführen</li>
              <li><strong>Social Media:</strong> Content erstellen und Community managen</li>
            </ul>

            <div style="margin-top: 32px;">
              <h3>Interesse?</h3>
              <p>
                Schreib uns eine Mail an
                <a href="mailto:kontakt@stuk-leipzig.de" style="color: var(--brand-red);">
                  kontakt@stuk-leipzig.de
                </a>
                oder komm einfach bei einem unserer Events vorbei!
              </p>
            </div>
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
  title: 'StuK – Mitmachen',
  meta: [
    { name: 'description', content: 'Werde Teil des StuK Teams' }
  ]
})
</script>
