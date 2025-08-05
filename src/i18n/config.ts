import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.products": "Products", 
      "nav.pricing": "Pricing",
      "nav.account": "Account",
      "nav.dashboard": "Dashboard",
      "nav.login": "Login",
      "nav.signup": "Sign Up",
      "nav.logout": "Logout",
      
      // Hero section
      "hero.title": "AI-Powered Text Tools for Everyone",
      "hero.subtitle": "Transform your writing with advanced AI technology. Detect AI content, humanize text, and access powerful writing tools.",
      "hero.cta": "Get Started Free",
      "hero.learnMore": "Learn More",
      
      // Features
      "features.title": "Powerful Features",
      "features.subtitle": "Everything you need to enhance your writing",
      
      // Text Tools
      "tools.title": "Text Processing Tools",
      "tools.subtitle": "Choose a tool to get started",
      "tools.inputLabel": "Enter your text",
      "tools.charactersCount": "characters",
      "tools.processing": "Processing...",
      "tools.processText": "Process Text",
      "tools.copy": "Copy",
      "tools.copied": "Copied!",
      
      // Language selector
      "language.translateTo": "Translate to:",
      "language.spanish": "Spanish",
      "language.french": "French", 
      "language.german": "German",
      "language.italian": "Italian",
      "language.portuguese": "Portuguese",
      "language.japanese": "Japanese",
      "language.chinese": "Chinese",
      
      // Tone selector
      "tone.selectTone": "Select tone:",
      "tone.professional": "Professional",
      "tone.casual": "Casual",
      "tone.friendly": "Friendly",
      "tone.formal": "Formal",
      
      // Footer
      "footer.allRights": "All rights reserved.",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "An error occurred",
      "common.tryAgain": "Try again",
      "common.cancel": "Cancel",
      "common.save": "Save",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.confirm": "Confirm"
    }
  },
  es: {
    translation: {
      // Navigation
      "nav.home": "Inicio",
      "nav.products": "Productos",
      "nav.pricing": "Precios", 
      "nav.account": "Cuenta",
      "nav.dashboard": "Panel",
      "nav.login": "Iniciar Sesión",
      "nav.signup": "Registrarse",
      "nav.logout": "Cerrar Sesión",
      
      // Hero section
      "hero.title": "Herramientas de Texto con IA para Todos",
      "hero.subtitle": "Transforma tu escritura con tecnología de IA avanzada. Detecta contenido de IA, humaniza texto y accede a potentes herramientas de escritura.",
      "hero.cta": "Comenzar Gratis",
      "hero.learnMore": "Saber Más",
      
      // Features
      "features.title": "Características Potentes",
      "features.subtitle": "Todo lo que necesitas para mejorar tu escritura",
      
      // Text Tools
      "tools.title": "Herramientas de Procesamiento de Texto",
      "tools.subtitle": "Elige una herramienta para comenzar",
      "tools.inputLabel": "Ingresa tu texto",
      "tools.charactersCount": "caracteres",
      "tools.processing": "Procesando...",
      "tools.processText": "Procesar Texto",
      "tools.copy": "Copiar",
      "tools.copied": "¡Copiado!",
      
      // Language selector
      "language.translateTo": "Traducir a:",
      "language.spanish": "Español",
      "language.french": "Francés",
      "language.german": "Alemán", 
      "language.italian": "Italiano",
      "language.portuguese": "Portugués",
      "language.japanese": "Japonés",
      "language.chinese": "Chino",
      
      // Tone selector
      "tone.selectTone": "Seleccionar tono:",
      "tone.professional": "Profesional",
      "tone.casual": "Casual",
      "tone.friendly": "Amigable",
      "tone.formal": "Formal",
      
      // Footer
      "footer.allRights": "Todos los derechos reservados.",
      
      // Common
      "common.loading": "Cargando...",
      "common.error": "Ocurrió un error",
      "common.tryAgain": "Intentar de nuevo",
      "common.cancel": "Cancelar",
      "common.save": "Guardar",
      "common.edit": "Editar",
      "common.delete": "Eliminar",
      "common.confirm": "Confirmar"
    }
  },
  fr: {
    translation: {
      // Navigation
      "nav.home": "Accueil",
      "nav.products": "Produits",
      "nav.pricing": "Tarifs",
      "nav.account": "Compte",
      "nav.dashboard": "Tableau de Bord",
      "nav.login": "Se Connecter",
      "nav.signup": "S'inscrire",
      "nav.logout": "Se Déconnecter",
      
      // Hero section
      "hero.title": "Outils de Texte IA pour Tous",
      "hero.subtitle": "Transformez votre écriture avec une technologie IA avancée. Détectez le contenu IA, humanisez le texte et accédez à de puissants outils d'écriture.",
      "hero.cta": "Commencer Gratuitement",
      "hero.learnMore": "En Savoir Plus",
      
      // Features
      "features.title": "Fonctionnalités Puissantes",
      "features.subtitle": "Tout ce dont vous avez besoin pour améliorer votre écriture",
      
      // Text Tools
      "tools.title": "Outils de Traitement de Texte",
      "tools.subtitle": "Choisissez un outil pour commencer",
      "tools.inputLabel": "Entrez votre texte",
      "tools.charactersCount": "caractères",
      "tools.processing": "Traitement...",
      "tools.processText": "Traiter le Texte",
      "tools.copy": "Copier",
      "tools.copied": "Copié!",
      
      // Language selector
      "language.translateTo": "Traduire vers:",
      "language.spanish": "Espagnol",
      "language.french": "Français",
      "language.german": "Allemand",
      "language.italian": "Italien",
      "language.portuguese": "Portugais",
      "language.japanese": "Japonais", 
      "language.chinese": "Chinois",
      
      // Tone selector
      "tone.selectTone": "Sélectionner le ton:",
      "tone.professional": "Professionnel",
      "tone.casual": "Décontracté",
      "tone.friendly": "Amical",
      "tone.formal": "Formel",
      
      // Footer
      "footer.allRights": "Tous droits réservés.",
      
      // Common
      "common.loading": "Chargement...",
      "common.error": "Une erreur s'est produite",
      "common.tryAgain": "Réessayer",
      "common.cancel": "Annuler",
      "common.save": "Sauvegarder",
      "common.edit": "Modifier",
      "common.delete": "Supprimer",
      "common.confirm": "Confirmer"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;