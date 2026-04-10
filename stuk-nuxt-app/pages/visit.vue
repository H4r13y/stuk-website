<template>
  <main>
    <section class="visit-hero">
      <div class="visit-content">
        <h1>Hey, schön dass du da bist!</h1>

        <p class="message">
          Hey, schön dass du neugierig warst und den QR-Code gescannt hast. Diese Seite soll als kurze Vorwarnung dienen, erstmal nichts von dem sonderlich Ernst zu nehmen, was dir derjenige, der dir die Karte gegeben hat, so erzählt. Entweder wollte die Person witzig sein, war betrunken... oder wahrscheinlich sogar beides.
        </p>

        <p class="message">
          Falls du uns einfach super sympathisch fandest, eure Gespräche doch irgendwie Hand und Fuß hatten oder du uns anderweitig kontaktieren willst, stöbere gerne hier herum :)
        </p>

        <NuxtLink to="/mitmachen" class="btn">Mitmachen</NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'StuK – Visit',
  meta: [
    { name: 'description', content: 'Schön dass du neugierig warst! Lerne das StuK kennen.' }
  ]
})
</script>

<style scoped>
.visit-hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}
.visit-content {
  max-width: 800px;
  padding: 40px;
  background: linear-gradient(180deg, rgba(188,43,37,0.15), rgba(36,58,92,0.15));
  border: 2px solid rgba(188,43,37,0.5);
  border-radius: var(--radius);
  box-shadow: 0 20px 60px rgba(188,43,37,0.3);
}
.visit-content h1 {
  color: var(--brand-red);
  font-size: 1.6rem;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.visit-content .message {
  color: var(--text);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 24px;
}
.visit-content .btn {
  margin-top: 8px;
}
@media (max-width: 640px) {
  .visit-content h1 {
    font-size: 1.3rem;
  }
  .visit-content .message {
    font-size: 0.9rem;
  }
}
</style>
