import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.brand': 'Motion Graphics Studio',
    'nav.about': 'About',
    'nav.portfolio': 'Portfolio',
    'nav.studio': 'Studio',
    'nav.contact': 'Contact',
    'hero.subtitle': 'MOTION GRAPHICS DESIGNER',
    'about.label': 'About Me',
    'about.p1': 'I am a Motion Graphic Designer with 3 years of experience dedicated to bringing static ideas to life through dynamic storytelling. My expertise spans 8 distinct motion styles, allowing me to adapt to any project\'s needs—from high-impact commercials and social media content to intricate UX/UI animations and kinetic typography.',
    'about.p2': 'I specialize in creating everything from minimalist "Dan Koe style" narratives to complex logo animations and dynamic backgrounds. My focus is always on blending technical precision with creative flair to ensure every frame serves a purpose. I’m constantly exploring new visual languages to keep my work at the forefront of industry trends.',
    'about.bg_text': 'Creator',
    'studio.philosophy': 'The Philosophy',
    'studio.p1': 'Breathing life into the inanimate. Our practice goes beyond moving objects;',
    'studio.p2': 'We transform inertia into emotion, granting pulse and purpose to every pixel until an image becomes an experience.',
    'studio.services': 'Services',
    'studio.location': 'Location',
    'contact.inquiries': 'Inquiries',
    'contact.title': 'Get In Touch',
    'footer.rights': 'All Rights Reserved',
    'projects.title': 'Design Styles',
    'projects.label': 'Selected Work',
    'projects.view': 'View Reel'
  },
  es: {
    'nav.brand': 'Estudio de Motion Graphics',
    'nav.about': 'Sobre mí',
    'nav.portfolio': 'Portafolio',
    'nav.studio': 'Estudio',
    'nav.contact': 'Contacto',
    'hero.subtitle': 'DISEÑADOR DE MOTION GRAPHICS',
    'about.label': 'Sobre Mí',
    'about.p1': 'Soy un Diseñador de Motion Graphics con 3 años de experiencia dedicado a dar vida a ideas estáticas a través de narrativas dinámicas. Mi experiencia abarca 8 estilos de movimiento distintos, lo que me permite adaptarme a las necesidades de cualquier proyecto, desde comerciales de alto impacto y contenido para redes sociales hasta intrincadas animaciones UX/UI y tipografía cinética.',
    'about.p2': 'Me especializo en crear de todo, desde narrativas minimalistas al "estilo Dan Koe" hasta complejas animaciones de logotipos y fondos dinámicos. Mi enfoque siempre está en combinar la precisión técnica con el talento creativo para asegurar que cada fotograma tenga un propósito. Exploro constantemente nuevos lenguajes visuales para mantener mi trabajo a la vanguardia de las tendencias de la industria.',
    'about.bg_text': 'Creador',
    'studio.philosophy': 'La Filosofía',
    'studio.p1': 'Dando vida a lo inanimado. Nuestra práctica va más allá de mover objetos;',
    'studio.p2': 'Transformamos la inercia en emoción, otorgando pulso y propósito a cada píxel hasta que una imagen se convierte en una experiencia.',
    'studio.services': 'Servicios',
    'studio.location': 'Ubicación',
    'contact.inquiries': 'Consultas',
    'contact.title': 'Ponete en contacto',
    'footer.rights': 'Todos los derechos reservados',
    'projects.title': 'Estilos de Diseño',
    'projects.label': 'Trabajo Seleccionado',
    'projects.view': 'Ver Reel'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
