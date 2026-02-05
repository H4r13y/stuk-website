<template>
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
</template>

<script setup lang="ts">
useHead({
  title: 'StuK – Kontakt',
  meta: [
    { name: 'description', content: 'Kontaktiere den StuK Leipzig' }
  ]
})
</script>
