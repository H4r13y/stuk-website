<template>
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
            <a href="mailto:info@stuk-leipzig.de" style="color: var(--brand-red);">
              info@stuk-leipzig.de
            </a>
            oder komm einfach bei einem unserer Events vorbei!
          </p>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
useHead({
  title: 'StuK – Mitmachen',
  meta: [
    { name: 'description', content: 'Werde Teil des StuK Teams' }
  ]
})
</script>
