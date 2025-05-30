import arrow from "@/assets/icons/arrow.png";
import arrowBack from "@/assets/icons/arrowBack.png";
import email from "@/assets/icons/email.png";
import eyeOff from "@/assets/icons/eyeOff.png";
import eyeOpen from "@/assets/icons/eyeOpen.png";
import google from "@/assets/icons/google.png";
import key from "@/assets/icons/key.png";
import password from "@/assets/icons/password.png";
import phone from "@/assets/icons/phone.png";
import warning from "@/assets/icons/solidWarning.png";
import passwordSent from "@/assets/images/imagePasswordSent.png";
import logo from "@/assets/images/logo.png";
import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import onboarding4 from "@/assets/images/onboarding4.png";
import onboarding5 from "@/assets/images/onboarding5.png";
import welcome from "@/assets/images/welcome.png";

export const images = {
  passwordSent,
  welcome,
  logo,
  onboarding1,
  onboarding2,
  onboarding3,
  onboarding4,
  onboarding5,
};

export const icons = {
  email,
  password,
  eyeOpen,
  arrow,
  google,
  eyeOff,
  warning,
  arrowBack,
  key,
  phone,
};

export const onboarding = [
  {
    id: 1,
    title: "Personalize Your Health with Smart AI.",
    description:
      "Achieve your wellness goals with our AI-powered platform to your unique needs.",
    image: images.onboarding1,
  },

  {
    id: 2,
    title: "Your Intelligent Fitness Companion.",
    description:
      "Track your calory & fitness nutrition with AI and get special recommendations.",
    image: images.onboarding2,
  },

  {
    id: 3,
    title: "Emphatic AI Wellness Chatbot For All.",
    description:
      "Experience compassionate and personalized care with our AI chatbot.",
    image: images.onboarding3,
  },
  {
    id: 4,
    title: "Intuitive Nutrition & Med Tracker with AI",
    description:
      "Easily track your medication & nutrition with the power of AI.",
    image: images.onboarding4,
  },
  {
    id: 5,
    title: "Helpful Resources &  Community.",
    description:
      "Join a community of 5,000+ users dedicating to healthy life with AI/ML.",
    image: images.onboarding5,
  },
];
