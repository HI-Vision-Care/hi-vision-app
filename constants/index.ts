import activityWalking from "@/assets/icons/activityWalking.png";
import add from "@/assets/icons/add.png";
import apple from "@/assets/icons/apple.png";
import arrow from "@/assets/icons/arrow.png";
import arrowBack from "@/assets/icons/arrowBack.png";
import bed from "@/assets/icons/bed.png";
import bell from "@/assets/icons/bell.png";
import calendar from "@/assets/icons/calendar.png";
import chevronLeft from "@/assets/icons/chevronleft.png";
import chevronRight from "@/assets/icons/chevronRight.png";
import close from "@/assets/icons/close.png";
import dinner from "@/assets/icons/dinner.png";
import email from "@/assets/icons/email.png";
import eyeOff from "@/assets/icons/eyeOff.png";
import eyeOpen from "@/assets/icons/eyeOpen.png";
import gear from "@/assets/icons/gear.png";
import google from "@/assets/icons/google.png";
import healthPlus from "@/assets/icons/healthPlus.png";
import heart from "@/assets/icons/heart.svg";
import heartBeat from "@/assets/icons/heartBeat.svg";
import home2 from "@/assets/icons/home2.png";
import key from "@/assets/icons/key.png";
import outline from "@/assets/icons/outline.png";
import password from "@/assets/icons/password.png";
import phone from "@/assets/icons/phone.png";
import question from "@/assets/icons/question.png";
import search from "@/assets/icons/search.png";
import warning from "@/assets/icons/solidWarning.png";
import sportsBallel from "@/assets/icons/sportsBallel.png";
import star from "@/assets/icons/star.png";
import stats from "@/assets/icons/stats.png";
import passwordSent from "@/assets/images/imagePasswordSent.png";
import logo from "@/assets/images/logo.png";
import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import onboarding4 from "@/assets/images/onboarding4.png";
import onboarding5 from "@/assets/images/onboarding5.png";
import otp from "@/assets/images/otp.png";
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
  otp,
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
  chevronRight,
  close,
  chevronLeft,
  bell,
  calendar,
  search,
  healthPlus,
  star,
  heart,
  heartBeat,
  apple,
  activityWalking,
  sportsBallel,
  bed,
  question,
  home2,
  add,
  dinner,
  stats,
  gear,
  outline,
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

export const resetOptions = [
  {
    id: 1,
    title: "Send via Email",
    description: "Reset password via email.",
    icon: icons.email,
    // bạn có thể thêm route hoặc key để xử lý navigation:
    // route: "ResetWithEmail"
  },
  {
    id: 2,
    title: "Send via 2FA",
    description: "Reset password via 2FA.",
    icon: icons.password,
    // route: "ResetWith2FA"
  },
  {
    id: 3,
    title: "Send via Google Auth",
    description: "Reset password via G-Auth.",
    icon: icons.key,
    // route: "ResetWithGoogle"
  },
  {
    id: 4,
    title: "Send via SMS",
    description: "Reset password via SMS.",
    icon: icons.phone,
    // route: "ResetWithSMS"
  },
];

export const data = {
  onboarding,
  resetOptions,
};
