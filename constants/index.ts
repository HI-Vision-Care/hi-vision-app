import {
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import virus103 from "@/assets/icons/103 virus.png";
import activityWalking from "@/assets/icons/activityWalking.png";
import add from "@/assets/icons/add.png";
import apple from "@/assets/icons/apple.png";
import arrow from "@/assets/icons/arrow.png";
import arrowBack from "@/assets/icons/arrowBack.png";
import bed from "@/assets/icons/bed.png";
import bell from "@/assets/icons/bell.png";
import calendar from "@/assets/icons/calendar.png";
import checkbox from "@/assets/icons/checkbox.png";
import chevronLeft from "@/assets/icons/chevronleft.png";
import chevronRight from "@/assets/icons/chevronRight.png";
import close from "@/assets/icons/close.png";
import dinner from "@/assets/icons/dinner.png";
import dropletWater from "@/assets/icons/dropletWater.png";
import email from "@/assets/icons/email.png";
import eyeOff from "@/assets/icons/eyeOff.png";
import eyeOpen from "@/assets/icons/eyeOpen.png";
import female from "@/assets/icons/female.png";
import gear from "@/assets/icons/gear.png";
import google from "@/assets/icons/google.png";
import healthPlus from "@/assets/icons/healthPlus.png";
import heart from "@/assets/icons/heart.svg";
import heartBeat from "@/assets/icons/heartBeat.svg";
import home2 from "@/assets/icons/home2.png";
import key from "@/assets/icons/key.png";
import male from "@/assets/icons/male.png";
import medicine from "@/assets/icons/medicine.png";
import outline from "@/assets/icons/outline.png";
import password from "@/assets/icons/password.png";
import phone from "@/assets/icons/phone.png";
import phone2 from "@/assets/icons/phone2.png";
import plus from "@/assets/icons/plus.png";
import question from "@/assets/icons/question.png";
import robotIcon from "@/assets/icons/robot.png";
import search from "@/assets/icons/search.png";
import warning from "@/assets/icons/solidWarning.png";
import sportsBallel from "@/assets/icons/sportsBallel.png";
import star from "@/assets/icons/star.png";
import stats from "@/assets/icons/stats.png";
import transgender from "@/assets/icons/transgender.png";
import turing from "@/assets/icons/turing.png";
import user from "@/assets/icons/user.png";
import avatarPlaceholder from "@/assets/images/avatarPlaceholder.jpg";
import chlamydia from "@/assets/images/chlamydia.jpg";
import combo from "@/assets/images/combo.png";
import femaleImage from "@/assets/images/femaleImage.png";
import gonorrhea from "@/assets/images/gonorrhea .png";
import hivtest from "@/assets/images/hivtest.png";
import passwordSent from "@/assets/images/imagePasswordSent.png";
import logo from "@/assets/images/logo.png";
import maleImage from "@/assets/images/maleImage.png";
import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import onboarding4 from "@/assets/images/onboarding4.png";
import onboarding5 from "@/assets/images/onboarding5.png";
import otp from "@/assets/images/otp.png";
import robot from "@/assets/images/robot.png";
import symptoms from "@/assets/images/symptoms.png";
import syphilis from "@/assets/images/syphilis.png";
import transgenderImage from "@/assets/images/transgenderImage.png";
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
  robot,
  hivtest,
  chlamydia,
  gonorrhea,
  syphilis,
  combo,
  maleImage,
  femaleImage,
  transgenderImage,
  symptoms,
  avatarPlaceholder,
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
  dropletWater,
  virus103,
  robotIcon,
  plus,
  turing,
  medicine,
  phone2,
  checkbox,
  male,
  female,
  transgender,
  user,
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

// constants/fitnessTracker.js
export const fitnessTracker = [
  {
    id: 1,
    title: "Calories Burned",
    icon: { name: "flame", color: "#EF4444", bg: "bg-red-100" },
    currentValue: 500,
    targetValue: 2000,
    unit: "kcal",
    type: "linear",
  },
  {
    id: 2,
    title: "Steps Taken",
    icon: { name: "walk", color: "#3B82F6", bg: "bg-blue-100" },
    description: "You've taken 1000 steps",
    type: "status",
  },
  {
    id: 3,
    title: "Nutrition",
    icon: { name: "nutrition", color: "#10B981", bg: "bg-green-100" },
    tags: ["Vitamin A", "Ibuprofen", "2x"],
    type: "tags",
  },
  {
    id: 4,
    title: "Sleep",
    icon: { name: "moon", color: "#8B5CF6", bg: "bg-purple-100" },
    currentValue: 11,
    targetValue: 36,
    unit: "Monthly Circadian",
    progress: 0.25,
    type: "circular",
  },
  {
    id: 5,
    title: "Hydration",
    icon: { name: "water", color: "#3B82F6", bg: "bg-blue-100" },
    currentValue: 700,
    targetValue: 2000,
    unit: "ml",
    type: "linear",
  },
];

export const goals = [
  {
    id: "healthy",
    label: "I wanna get healthy",
    icon: icons.plus,
    color: "#6B7280",
  },
  {
    id: "lose_weight",
    label: "I wanna lose weight",
    icon: icons.turing,
    color: "#3B82F6",
  },
  {
    id: "chatbot",
    label: "I wanna try AI Chatbot",
    icon: icons.robotIcon,
    color: "#6B7280",
  },
  {
    id: "manage_meds",
    label: "I wanna manage meds",
    icon: icons.medicine,
    color: "#6B7280",
  },
  {
    id: "try_app",
    label: "Just trying out the app",
    icon: icons.phone2,
    color: "#6B7280",
  },
];

export const eatingOptions = [
  {
    key: "balanced",
    label: "Balanced Diet",
    iconLibrary: FontAwesome5,
    iconName: "apple-alt",
    iconSize: 24,
    iconColor: "#242e49",
  },
  {
    key: "vegetarian",
    label: "Mostly Vegetarian",
    iconLibrary: MaterialCommunityIcons,
    iconName: "leaf",
    iconSize: 24,
    iconColor: "#242e49",
  },
  {
    key: "lowcarb",
    label: "Low Carb",
    iconLibrary: Ionicons,
    iconName: "restaurant",
    iconSize: 24,
    iconColor: "#242e49",
  },
  {
    key: "glutenfree",
    label: "Gluten Free",
    iconLibrary: FontAwesome6,
    iconName: "bone",
    iconSize: 24,
    iconColor: "#242e49",
  },
];

export const MEDICATIONS = [
  "Abilify",
  "Abilify Maintena",
  "Abiraterone",
  "Acetaminophen",
  "Actemra",
  "Apxelliarmus",
  "Aspirin",
  "Ibuprofen",
  "Amoxicillin",
  "Atorvastatin",
  "Azithromycin",
  // …thêm nếu cần
];

export const ALPHABET = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

export const menuItems = [
  {
    key: "hiv-test",
    title: "HIV Test",
    icon: icons.virus103,
    bgColor: "#F8FAFC",
    iconBgColor: "#3B82F6",
    duration: "15 minutes",
    price: "300,000₫",
    illustration: images.hivtest,
  },
  {
    key: "chlamydia-test",
    title: "Chlamydia Test",
    icon: icons.virus103,
    bgColor: "#F8FAFC",
    iconBgColor: "#F59E0B",
    duration: "15 minutes",
    price: "350,000₫",
    illustration: images.chlamydia,
  },
  {
    key: "syphilis-test",
    title: "Syphilis Test",
    icon: icons.virus103,
    bgColor: "#F8FAFC",
    iconBgColor: "#10B981",
    duration: "15 minutes",
    price: "320,000₫",
    illustration: images.syphilis,
  },
  {
    key: "gonorrhea-test",
    title: "Gonorrhea Test",
    icon: icons.virus103,
    bgColor: "#F8FAFC",
    iconBgColor: "#EC4899",
    duration: "15 minutes",
    price: "330,000₫",
    illustration: images.gonorrhea,
  },
  {
    key: "std-consult",
    title: "STD Test Combo",
    icon: icons.virus103,
    bgColor: "#F8FAFC",
    iconBgColor: "#8B5CF6",
    duration: "30 minutes",
    price: "200,000₫",
    illustration: images.combo,
  },
];

export const featureCards = [
  { id: "gold", title: "Gold", icon: "👑" },
  {
    id: "activity-history",
    title: "Lịch sử hoạt động",
    icon: "📅",
    hasBadge: true,
    badgeCount: 1,
  },
];

export const menuSections = [
  {
    title: "General Settings",
    items: [
      { id: "personal", title: "Personal Info", icon: "👤", hasArrow: true },
      {
        id: "notification",
        title: "Notification",
        icon: "🔔",
        hasArrow: true,
      },
      { id: "preferences", title: "Preferences", icon: "⚙️", hasArrow: true },
      { id: "security", title: "Security", icon: "🔒", hasArrow: true },
    ],
  },
  {
    title: "Accessibility",
    items: [
      { id: "language", title: "Language", icon: "🌐", hasArrow: true },
      {
        id: "darkmode",
        title: "Dark Mode",
        icon: "👁️",
        isToggle: true,
        toggleValue: false,
      },
    ],
  },
  {
    title: "Help & Support",
    items: [
      { id: "about", title: "About", icon: "ℹ️", hasArrow: true },
      { id: "help", title: "Help Center", icon: "💬", hasArrow: true },
      { id: "contact", title: "Contact Us", icon: "📞", hasArrow: true },
    ],
  },
  {
    title: "Sign Out",
    items: [{ id: "signout", title: "Sign Out", icon: "🚪", hasArrow: true }],
  },
  {
    title: "Danger Zone",
    items: [
      {
        id: "delete",
        title: "Delete Account",
        icon: "🗑️",
        hasArrow: true,
        isDanger: true,
      },
    ],
  },
];

export const data = {
  onboarding,
  resetOptions,
  goals,
  eatingOptions,
  menuItems,
};
