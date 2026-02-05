<template>
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
</template>

<script setup lang="ts">
useHead({
  title: 'StuK – Über uns',
  meta: [
    { name: 'description', content: 'Erfahre mehr über den StuK Leipzig - Dein studentischer Kulturclub' }
  ]
})
</script>
