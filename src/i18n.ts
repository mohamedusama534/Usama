import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to WorkBridge",
      "login": "Login",
      "signup": "Sign Up",
      "role_selection": "Select Your Role",
      "business": "Business",
      "helper": "Helper",
      "normal": "Normal User",
      "post_job": "Post a Job",
      "post_offer": "Post an Offer",
      "search_jobs": "Search Jobs",
      "my_applications": "My Applications",
      "dashboard": "Dashboard",
      "profile": "Profile",
      "chat": "Chat",
      "logout": "Logout",
      "apply": "Apply",
      "status": "Status",
      "applicants": "Applicants",
      "salary": "Salary",
      "location": "Location",
      "skills": "Required Skills",
      "description": "Description",
      "expiry": "Expiry Date",
      "home": "Home",
      "offers": "Offers",
      "jobs": "Jobs",
      "no_jobs": "No jobs available at the moment.",
      "no_offers": "No offers available at the moment.",
      "admin_panel": "Admin Panel",
    }
  },
  ta: {
    translation: {
      "welcome": "WorkBridge-க்கு உங்களை வரவேற்கிறோம்",
      "login": "உள்நுழை",
      "signup": "பதிவு செய்",
      "role_selection": "உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்",
      "business": "வணிகம்",
      "helper": "உதவியாளர்",
      "normal": "சாதாரண பயனர்",
      "post_job": "வேலை வாய்ப்பை பதிவிடு",
      "post_offer": "சலுகையை பதிவிடு",
      "search_jobs": "வேலைகளைத் தேடு",
      "my_applications": "எனது விண்ணப்பங்கள்",
      "dashboard": "டாஷ்போர்டு",
      "profile": "சுயவிவரம்",
      "chat": "அரட்டை",
      "logout": "வெளியேறு",
      "apply": "விண்ணப்பி",
      "status": "நிலை",
      "applicants": "விண்ணப்பதாரர்கள்",
      "salary": "சம்பளம்",
      "location": "இடம்",
      "skills": "தேவையான திறன்கள்",
      "description": "விளக்கம்",
      "expiry": "காலாவதி தேதி",
      "home": "முகப்பு",
      "offers": "சலுகைகள்",
      "jobs": "வேலைகள்",
      "no_jobs": "தற்போது வேலைகள் எதுவும் இல்லை.",
      "no_offers": "தற்போது சலுகைகள் எதுவும் இல்லை.",
      "admin_panel": "நிர்வாக குழு",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
