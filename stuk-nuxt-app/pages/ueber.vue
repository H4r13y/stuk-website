<template>
  <div class="has-bottom-nav">
    <div class="bg"><div class="confetti"></div></div>

    <!-- Header -->
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
          <h1>Über den StuK</h1>
          <p class="sub">Dein studentischer Kulturclub in Leipzig</p>

          <div style="margin-top: 24px;">
            <h2>Willkommen im StuK!</h2>
            <p>
              Der StuK (Studentischer Kulturklub) ist seit vielen Jahren eine feste Institution
              im Leipziger Nachtleben und kulturellen Leben. Wir bieten ein vielfältiges Programm
              aus Konzerten, Partys, Quiz-Abenden, Comedy und vielem mehr.
            </p>

            <h3 style="margin-top: 24px;">Was uns ausmacht</h3>
            <ul>
              <li>Studentisch organisiert und geführt</li>
              <li>Vielfältiges Kulturprogramm</li>
              <li>Faire Preise für Studierende</li>
              <li>Gemütliche Atmosphäre</li>
              <li>Kein Platz für Hass - Party mit Prinzipien</li>
            </ul>

            <p style="margin-top: 24px; color: var(--muted); font-style: italic;">
              Diese Seite wird noch mit Inhalten aus Strapi gefüllt...
            </p>
          </div>
        </article>
      </section>
    </main>

    <!-- Footer -->
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
  title: 'StuK – Über uns',
  meta: [
    { name: 'description', content: 'Erfahre mehr über den StuK Leipzig - Dein studentischer Kulturclub' }
  ]
})
</script>
