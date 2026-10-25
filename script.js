/* ==========================================================
   PORTFOLIO D'ISMAËL BAKAYOGO — script.js
   JavaScript pur (vanilla), sans bibliothèque.
   ========================================================== */

// Indique au CSS que JavaScript fonctionne
// (sans JS, les sections restent visibles)
document.documentElement.classList.add("js");

/* ---------- 1. Menu mobile (hamburger) ---------- */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

function fermerMenu() {
  menu.classList.remove("open");
  burger.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
}

burger.addEventListener("click", () => {
  const ouvert = menu.classList.toggle("open");
  burger.classList.toggle("open", ouvert);
  burger.setAttribute("aria-expanded", String(ouvert));
});

// Referme le menu quand on clique sur un lien
menu.querySelectorAll("a").forEach((lien) => lien.addEventListener("click", fermerMenu));

/* ---------- 2. Apparition des sections au défilement ---------- */
const observateur = new IntersectionObserver(
  (entrees) => {
    entrees.forEach((entree) => {
      if (!entree.isIntersecting) return;
      entree.target.classList.add("visible");

      // Remplit les barres de compétences de la section visible
      entree.target.querySelectorAll(".bar-fill").forEach((barre) => {
        barre.style.width = barre.dataset.level + "%";
      });

      observateur.unobserve(entree.target); // une seule fois
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((section) => observateur.observe(section));

/* ---------- 3. Bouton « Retour en haut » ---------- */
const boutonHaut = document.getElementById("to-top");

window.addEventListener("scroll", () => {
  boutonHaut.classList.toggle("show", window.scrollY > 500);
});

boutonHaut.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- 4. Formulaire de contact ---------- */
// Les messages arrivent directement dans votre boîte Gmail grâce à Formspree
// (gratuit, fonctionne sur GitHub Pages et Netlify).
//
// MISE EN PLACE (2 minutes) :
//  1. Créez un compte sur formspree.io avec ismaelbakayogo1@gmail.com
//  2. Cliquez sur « New Form » et copiez l'adresse obtenue,
//     par exemple : https://formspree.io/f/abcdwxyz
//  3. Collez-la ci-dessous à la place des guillemets vides.
//
// Tant que FORMSPREE_URL est vide, le formulaire ouvre l'application
// e-mail du visiteur avec le message déjà rempli (solution de secours).
const FORMSPREE_URL = "https://formspree.io/f/mdeeaajo";
const MON_EMAIL = "ismaelbakayogo1@gmail.com";

const formulaire = document.getElementById("contact-form");
const note = document.getElementById("form-note");
const boutonEnvoi = formulaire.querySelector("button[type='submit']");

formulaire.addEventListener("submit", async (evenement) => {
  evenement.preventDefault(); // empêche le rechargement de la page
  const donnees = new FormData(formulaire);

  // Anti-spam : ce champ caché doit rester vide (les robots le remplissent)
  if (donnees.get("_gotcha")) return;

  // --- Solution de secours : mailto ---
  if (!FORMSPREE_URL) {
    const sujet = "Message depuis votre portfolio - " + donnees.get("nom");
    const corps = donnees.get("message") + "\n\nDe : " + donnees.get("nom") + " (" + donnees.get("email") + ")";
    window.location.href =
      "mailto:" + MON_EMAIL + "?subject=" + encodeURIComponent(sujet) + "&body=" + encodeURIComponent(corps);
    note.textContent = "Votre application e-mail va s'ouvrir pour envoyer le message.";
    return;
  }

  // --- Envoi réel via Formspree ---
  boutonEnvoi.disabled = true;
  boutonEnvoi.textContent = "Envoi en cours...";
  note.textContent = "";

  try {
    const reponse = await fetch(FORMSPREE_URL, {
      method: "POST",
      body: donnees,
      headers: { Accept: "application/json" },
    });
    if (!reponse.ok) throw new Error("Erreur " + reponse.status);

    note.textContent = "Merci ! Votre message a bien été envoyé.";
    formulaire.reset();
  } catch (erreur) {
    note.textContent = "L'envoi a échoué. Écrivez-moi directement à " + MON_EMAIL + ".";
  } finally {
    boutonEnvoi.disabled = false;
    boutonEnvoi.textContent = "Envoyer le message";
  }
});

/* ---------- 5. Liens GitHub et LinkedIn ---------- */
// Remplacez les valeurs vides par vos adresses, par exemple :
// const GITHUB = "https://github.com/votre-nom";
const GITHUB = "https://github.com/ismaelbakayogo-dev";
const LINKEDIN = "";

function configurerLien(id, adresse) {
  const lien = document.getElementById(id);
  if (!adresse) return; // reste « À compléter » tant qu'il est vide
  lien.href = adresse;
  lien.textContent = adresse.replace("https://", "");
  lien.target = "_blank";
  lien.rel = "noopener";
}
configurerLien("link-github", GITHUB);
configurerLien("link-linkedin", LINKEDIN);

/* ---------- 6. Année automatique dans le pied de page ---------- */
document.getElementById("annee").textContent = new Date().getFullYear();
