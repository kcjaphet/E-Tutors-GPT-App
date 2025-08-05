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
  },
  de: {
    translation: {
      // Navigation
      "nav.home": "Startseite",
      "nav.products": "Produkte",
      "nav.pricing": "Preise",
      "nav.account": "Konto",
      "nav.dashboard": "Dashboard",
      "nav.login": "Anmelden",
      "nav.signup": "Registrieren",
      "nav.logout": "Abmelden",
      
      // Hero section
      "hero.title": "KI-gestützte Texttools für Alle",
      "hero.subtitle": "Verwandeln Sie Ihr Schreiben mit fortschrittlicher KI-Technologie. Erkennen Sie KI-Inhalte, humanisieren Sie Text und greifen Sie auf leistungsstarke Schreibtools zu.",
      "hero.cta": "Kostenlos Starten",
      "hero.learnMore": "Mehr Erfahren",
      
      // Features
      "features.title": "Leistungsstarke Funktionen",
      "features.subtitle": "Alles was Sie brauchen, um Ihr Schreiben zu verbessern",
      
      // Text Tools
      "tools.title": "Textverarbeitungstools",
      "tools.subtitle": "Wählen Sie ein Tool zum Starten",
      "tools.inputLabel": "Geben Sie Ihren Text ein",
      "tools.charactersCount": "Zeichen",
      "tools.processing": "Verarbeitung...",
      "tools.processText": "Text Verarbeiten",
      "tools.copy": "Kopieren",
      "tools.copied": "Kopiert!",
      
      // Language selector
      "language.translateTo": "Übersetzen nach:",
      "language.spanish": "Spanisch",
      "language.french": "Französisch",
      "language.german": "Deutsch",
      "language.italian": "Italienisch",
      "language.portuguese": "Portugiesisch",
      "language.japanese": "Japanisch",
      "language.chinese": "Chinesisch",
      
      // Tone selector
      "tone.selectTone": "Ton auswählen:",
      "tone.professional": "Professionell",
      "tone.casual": "Leger",
      "tone.friendly": "Freundlich",
      "tone.formal": "Formal",
      
      // Footer
      "footer.allRights": "Alle Rechte vorbehalten.",
      
      // Common
      "common.loading": "Laden...",
      "common.error": "Ein Fehler ist aufgetreten",
      "common.tryAgain": "Erneut versuchen",
      "common.cancel": "Abbrechen",
      "common.save": "Speichern",
      "common.edit": "Bearbeiten",
      "common.delete": "Löschen",
      "common.confirm": "Bestätigen"
    }
  },
  pt: {
    translation: {
      // Navigation
      "nav.home": "Início",
      "nav.products": "Produtos",
      "nav.pricing": "Preços",
      "nav.account": "Conta",
      "nav.dashboard": "Painel",
      "nav.login": "Entrar",
      "nav.signup": "Cadastrar",
      "nav.logout": "Sair",
      
      // Hero section
      "hero.title": "Ferramentas de Texto com IA para Todos",
      "hero.subtitle": "Transforme sua escrita com tecnologia de IA avançada. Detecte conteúdo de IA, humanize texto e acesse ferramentas de escrita poderosas.",
      "hero.cta": "Começar Grátis",
      "hero.learnMore": "Saiba Mais",
      
      // Features
      "features.title": "Recursos Poderosos",
      "features.subtitle": "Tudo que você precisa para melhorar sua escrita",
      
      // Text Tools
      "tools.title": "Ferramentas de Processamento de Texto",
      "tools.subtitle": "Escolha uma ferramenta para começar",
      "tools.inputLabel": "Digite seu texto",
      "tools.charactersCount": "caracteres",
      "tools.processing": "Processando...",
      "tools.processText": "Processar Texto",
      "tools.copy": "Copiar",
      "tools.copied": "Copiado!",
      
      // Language selector
      "language.translateTo": "Traduzir para:",
      "language.spanish": "Espanhol",
      "language.french": "Francês",
      "language.german": "Alemão",
      "language.italian": "Italiano",
      "language.portuguese": "Português",
      "language.japanese": "Japonês",
      "language.chinese": "Chinês",
      
      // Tone selector
      "tone.selectTone": "Selecionar tom:",
      "tone.professional": "Profissional",
      "tone.casual": "Casual",
      "tone.friendly": "Amigável",
      "tone.formal": "Formal",
      
      // Footer
      "footer.allRights": "Todos os direitos reservados.",
      
      // Common
      "common.loading": "Carregando...",
      "common.error": "Ocorreu um erro",
      "common.tryAgain": "Tentar novamente",
      "common.cancel": "Cancelar",
      "common.save": "Salvar",
      "common.edit": "Editar",
      "common.delete": "Excluir",
      "common.confirm": "Confirmar"
    }
  },
  ar: {
    translation: {
      // Navigation
      "nav.home": "الرئيسية",
      "nav.products": "المنتجات",
      "nav.pricing": "الأسعار",
      "nav.account": "الحساب",
      "nav.dashboard": "لوحة التحكم",
      "nav.login": "تسجيل الدخول",
      "nav.signup": "إنشاء حساب",
      "nav.logout": "تسجيل الخروج",
      
      // Hero section
      "hero.title": "أدوات نصوص مدعومة بالذكاء الاصطناعي للجميع",
      "hero.subtitle": "حوّل كتابتك بتقنية الذكاء الاصطناعي المتقدمة. اكتشف محتوى الذكاء الاصطناعي، وأضف الطابع البشري للنص، واحصل على أدوات كتابة قوية.",
      "hero.cta": "ابدأ مجاناً",
      "hero.learnMore": "اعرف المزيد",
      
      // Features
      "features.title": "ميزات قوية",
      "features.subtitle": "كل ما تحتاجه لتحسين كتابتك",
      
      // Text Tools
      "tools.title": "أدوات معالجة النصوص",
      "tools.subtitle": "اختر أداة للبدء",
      "tools.inputLabel": "أدخل نصك",
      "tools.charactersCount": "حرف",
      "tools.processing": "جاري المعالجة...",
      "tools.processText": "معالجة النص",
      "tools.copy": "نسخ",
      "tools.copied": "تم النسخ!",
      
      // Language selector
      "language.translateTo": "ترجمة إلى:",
      "language.spanish": "الإسبانية",
      "language.french": "الفرنسية",
      "language.german": "الألمانية",
      "language.italian": "الإيطالية",
      "language.portuguese": "البرتغالية",
      "language.japanese": "اليابانية",
      "language.chinese": "الصينية",
      
      // Tone selector
      "tone.selectTone": "اختر النبرة:",
      "tone.professional": "مهني",
      "tone.casual": "غير رسمي",
      "tone.friendly": "ودود",
      "tone.formal": "رسمي",
      
      // Footer
      "footer.allRights": "جميع الحقوق محفوظة.",
      
      // Common
      "common.loading": "جاري التحميل...",
      "common.error": "حدث خطأ",
      "common.tryAgain": "حاول مرة أخرى",
      "common.cancel": "إلغاء",
      "common.save": "حفظ",
      "common.edit": "تحرير",
      "common.delete": "حذف",
      "common.confirm": "تأكيد"
    }
  },
  it: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.products": "Prodotti",
      "nav.pricing": "Prezzi",
      "nav.account": "Account",
      "nav.dashboard": "Dashboard",
      "nav.login": "Accedi",
      "nav.signup": "Registrati",
      "nav.logout": "Esci",
      
      // Hero section
      "hero.title": "Strumenti di Testo AI per Tutti",
      "hero.subtitle": "Trasforma la tua scrittura con tecnologia AI avanzata. Rileva contenuti AI, umanizza il testo e accedi a potenti strumenti di scrittura.",
      "hero.cta": "Inizia Gratis",
      "hero.learnMore": "Scopri di Più",
      
      // Features
      "features.title": "Funzionalità Potenti",
      "features.subtitle": "Tutto ciò di cui hai bisogno per migliorare la tua scrittura",
      
      // Text Tools
      "tools.title": "Strumenti di Elaborazione Testo",
      "tools.subtitle": "Scegli uno strumento per iniziare",
      "tools.inputLabel": "Inserisci il tuo testo",
      "tools.charactersCount": "caratteri",
      "tools.processing": "Elaborazione...",
      "tools.processText": "Elabora Testo",
      "tools.copy": "Copia",
      "tools.copied": "Copiato!",
      
      // Language selector
      "language.translateTo": "Traduci in:",
      "language.spanish": "Spagnolo",
      "language.french": "Francese",
      "language.german": "Tedesco",
      "language.italian": "Italiano",
      "language.portuguese": "Portoghese",
      "language.japanese": "Giapponese",
      "language.chinese": "Cinese",
      
      // Tone selector
      "tone.selectTone": "Seleziona tono:",
      "tone.professional": "Professionale",
      "tone.casual": "Casual",
      "tone.friendly": "Amichevole",
      "tone.formal": "Formale",
      
      // Footer
      "footer.allRights": "Tutti i diritti riservati.",
      
      // Common
      "common.loading": "Caricamento...",
      "common.error": "Si è verificato un errore",
      "common.tryAgain": "Riprova",
      "common.cancel": "Annulla",
      "common.save": "Salva",
      "common.edit": "Modifica",
      "common.delete": "Elimina",
      "common.confirm": "Conferma"
    }
  },
  ko: {
    translation: {
      // Navigation
      "nav.home": "홈",
      "nav.products": "제품",
      "nav.pricing": "가격",
      "nav.account": "계정",
      "nav.dashboard": "대시보드",
      "nav.login": "로그인",
      "nav.signup": "회원가입",
      "nav.logout": "로그아웃",
      
      // Hero section
      "hero.title": "모든 사람을 위한 AI 텍스트 도구",
      "hero.subtitle": "고급 AI 기술로 글쓰기를 변화시키세요. AI 콘텐츠를 감지하고, 텍스트를 인간화하며, 강력한 글쓰기 도구에 액세스하세요.",
      "hero.cta": "무료로 시작하기",
      "hero.learnMore": "더 알아보기",
      
      // Features
      "features.title": "강력한 기능",
      "features.subtitle": "글쓰기 향상을 위한 모든 것",
      
      // Text Tools
      "tools.title": "텍스트 처리 도구",
      "tools.subtitle": "시작할 도구를 선택하세요",
      "tools.inputLabel": "텍스트를 입력하세요",
      "tools.charactersCount": "글자",
      "tools.processing": "처리 중...",
      "tools.processText": "텍스트 처리",
      "tools.copy": "복사",
      "tools.copied": "복사됨!",
      
      // Language selector
      "language.translateTo": "번역할 언어:",
      "language.spanish": "스페인어",
      "language.french": "프랑스어",
      "language.german": "독일어",
      "language.italian": "이탈리아어",
      "language.portuguese": "포르투갈어",
      "language.japanese": "일본어",
      "language.chinese": "중국어",
      
      // Tone selector
      "tone.selectTone": "톤 선택:",
      "tone.professional": "전문적",
      "tone.casual": "캐주얼",
      "tone.friendly": "친근한",
      "tone.formal": "공식적",
      
      // Footer
      "footer.allRights": "모든 권리 보유.",
      
      // Common
      "common.loading": "로딩 중...",
      "common.error": "오류가 발생했습니다",
      "common.tryAgain": "다시 시도",
      "common.cancel": "취소",
      "common.save": "저장",
      "common.edit": "편집",
      "common.delete": "삭제",
      "common.confirm": "확인"
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