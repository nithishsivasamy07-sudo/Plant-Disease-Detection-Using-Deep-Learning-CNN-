import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.title': 'LeafSense',
    'app.tagline': 'Smart Plant Disease Detection',
    'nav.home': 'Home',
    'nav.detect': 'Detect',
    'nav.history': 'My History',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'hero.title': 'Protect Your Plants with AI',
    'hero.subtitle': 'Advanced disease detection using deep learning to keep your garden healthy',
    'hero.cta': 'Start Detection',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullname': 'Full Name',
    'auth.phone': 'Phone Number (optional)',
    'auth.hasAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'detect.title': 'Upload Leaf Image',
    'detect.subtitle': 'Upload a clear image of the affected leaf for analysis',
    'detect.upload': 'Choose Image',
    'detect.analyze': 'Analyze',
    'detect.analyzing': 'Analyzing...',
    'history.title': 'Detection History',
    'history.empty': 'No detections yet',
    'chatbot.title': 'Plant Expert',
    'chatbot.placeholder': 'Ask about plant diseases...',
  },
  hi: {
    'app.title': 'लीफसेंस',
    'app.tagline': 'स्मार्ट पौधे की बीमारी का पता लगाना',
    'nav.home': 'होम',
    'nav.detect': 'पता लगाएं',
    'nav.history': 'मेरा इतिहास',
    'nav.login': 'लॉग इन',
    'nav.logout': 'लॉग आउट',
    'hero.title': 'AI के साथ अपने पौधों की रक्षा करें',
    'hero.subtitle': 'आपके बगीचे को स्वस्थ रखने के लिए डीप लर्निंग का उपयोग करके उन्नत रोग का पता लगाना',
    'hero.cta': 'डिटेक्शन शुरू करें',
    'auth.login': 'लॉग इन',
    'auth.signup': 'साइन अप',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.fullname': 'पूरा नाम',
    'auth.phone': 'फ़ोन नंबर (वैकल्पिक)',
    'auth.hasAccount': 'पहले से खाता है?',
    'auth.noAccount': 'खाता नहीं है?',
    'detect.title': 'पत्ती की छवि अपलोड करें',
    'detect.subtitle': 'विश्लेषण के लिए प्रभावित पत्ती की स्पष्ट छवि अपलोड करें',
    'detect.upload': 'छवि चुनें',
    'detect.analyze': 'विश्लेषण करें',
    'detect.analyzing': 'विश्लेषण हो रहा है...',
    'history.title': 'पता लगाने का इतिहास',
    'history.empty': 'अभी तक कोई पता नहीं चला',
    'chatbot.title': 'पौधे विशेषज्ञ',
    'chatbot.placeholder': 'पौधों की बीमारियों के बारे में पूछें...',
  },
  ta: {
    'app.title': 'லீஃப்சென்ஸ்',
    'app.tagline': 'ஸ்மார்ட் தாவர நோய் கண்டறிதல்',
    'nav.home': 'முகப்பு',
    'nav.detect': 'கண்டறி',
    'nav.history': 'எனது வரலாறு',
    'nav.login': 'உள்நுழை',
    'nav.logout': 'வெளியேறு',
    'hero.title': 'AI மூலம் உங்கள் தாவரங்களைப் பாதுகாக்கவும்',
    'hero.subtitle': 'உங்கள் தோட்டத்தை ஆரோக்கியமாக வைத்திருக்க ஆழ்ந்த கற்றலைப் பயன்படுத்தி மேம்பட்ட நோய் கண்டறிதல்',
    'hero.cta': 'கண்டறிதலைத் தொடங்கவும்',
    'auth.login': 'உள்நுழை',
    'auth.signup': 'பதிவு செய்',
    'auth.email': 'மின்னஞ்சல்',
    'auth.password': 'கடவுச்சொல்',
    'auth.fullname': 'முழு பெயர்',
    'auth.phone': 'தொலைபேசி எண் (விருப்பம்)',
    'auth.hasAccount': 'ஏற்கனவே கணக்கு உள்ளதா?',
    'auth.noAccount': 'கணக்கு இல்லையா?',
    'detect.title': 'இலை படத்தைப் பதிவேற்றவும்',
    'detect.subtitle': 'பகுப்பாய்வுக்காக பாதிக்கப்பட்ட இலையின் தெளிவான படத்தைப் பதிவேற்றவும்',
    'detect.upload': 'படத்தைத் தேர்ந்தெடு',
    'detect.analyze': 'பகுப்பாய்வு செய்',
    'detect.analyzing': 'பகுப்பாய்வு செய்யப்படுகிறது...',
    'history.title': 'கண்டறிதல் வரலாறு',
    'history.empty': 'இதுவரை கண்டறிதல்கள் இல்லை',
    'chatbot.title': 'தாவர நிபுணர்',
    'chatbot.placeholder': 'தாவர நோய்கள் பற்றி கேளுங்கள்...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
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
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};