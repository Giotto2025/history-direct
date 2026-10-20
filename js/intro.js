
// HISTORY DIRECT — INTRODUZIONE BIG BANG

const intro = document.querySelector("#big-bang-intro");

if (intro) {
  const skipButton = intro.querySelector(".intro-skip");
  const universe = intro.querySelector(".intro-universe");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let finished = false;
  let finishTimer;

  
function finishIntro() {
  if (finished) return;

  finished = true;
  clearTimeout(finishTimer);

  // Rispetta la preferenza per le animazioni ridotte.
  if (reducedMotion) {
    intro.remove();
    return;
  }

  // Avvia la dissolvenza cinematografica.
  intro.classList.add("is-exiting");

  // Quando la dissolvenza è finita, mostra la homepage
  // e avvia le sue animazioni d'ingresso.
  window.setTimeout(() => {
    intro.classList.add("is-hidden");

    document.body.classList.add("homepage-entering");
  }, 900);

  // Rimuove l'introduzione dal documento.
  window.setTimeout(() => {
    intro.remove();
  }, 1800);
}


  if (!reducedMotion && universe) {
    for (let i = 0; i < 65; i++) {
      const particle = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 550;

      particle.className = "intro-particle";

      if (i % 5 === 0) {
        particle.classList.add("is-red");
      }

      particle.style.setProperty(
        "--dx",
        `${Math.cos(angle) * distance}px`
      );

      particle.style.setProperty(
        "--dy",
        `${Math.sin(angle) * distance}px`
      );

      particle.style.animationDelay =
        `${Math.random() * 0.35}s`;

      universe.append(particle);
    }
  }

  skipButton?.addEventListener("click", finishIntro);

  if (reducedMotion) {
    finishIntro();
  } else {
    // Tempo prima dell'inizio della dissolvenza.
    finishTimer = window.setTimeout(finishIntro, 4000);
  }
}
