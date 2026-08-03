import { Category, Course, Review, PaymentMethodInfo } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'courses',
    name: 'অনলাইন কোর্সসমূহ',
    itemCount: '১২০+ কোর্স',
    iconName: 'GraduationCap',
    color: '#6D28D9',
    bgTint: '#F3E8FF',
    productType: 'Full Course',
    description: 'লাইভ ও রেকর্ডেড অনলাইন লার্নিং কোর্সসমূহ',
  },
  {
    id: 'ebooks',
    name: 'ই-বুক ও বই',
    itemCount: '২৫০+ ই-বুক',
    iconName: 'BookOpen',
    color: '#2563EB',
    bgTint: '#EFF6FF',
    productType: 'Simple Product',
    description: 'ডিজিটাল ই-বুক ও পিডিএফ রিসোর্স',
  },
  {
    id: 'source-code',
    name: 'প্রিমিয়াম রিসোর্স',
    itemCount: '৮৫+ আইটেম',
    iconName: 'Code',
    color: '#059669',
    bgTint: '#ECFDF5',
    productType: 'Simple Product',
    description: 'প্রোডাকশন রেডি ওয়েব ও মোবাইল সোর্স কোড ও প্রিমিয়াম রিসোর্স',
  },
  {
    id: 'design',
    name: 'ডিজাইন অ্যাসেট',
    itemCount: '৯০+ আইটেম',
    iconName: 'Palette',
    color: '#D97706',
    bgTint: '#FEF3C7',
    productType: 'Simple Product',
    description: 'ইউআই/ইউএক্স ও গ্রাফিক্স ডিজাইন রিসোর্স',
  },
  {
    id: 'ai-prompts',
    name: 'এআই প্রম্পট',
    itemCount: '৬০+ আইটেম',
    iconName: 'Sparkles',
    color: '#7C3AED',
    bgTint: '#F5F3FF',
    productType: 'Simple Product',
    description: 'মিডজার্নি ও জেমিনি প্রম্পট কালেকশন',
  },
  {
    id: 'templates',
    name: 'ওয়েব টেমপ্লেট',
    itemCount: '১১০+ আইটেম',
    iconName: 'Layout',
    color: '#DB2777',
    bgTint: '#FCE7F3',
    productType: 'Simple Product',
    description: 'এইচটিএমএল, টেলউইন্ড ও রিয়্যাক্ট টেমপ্লেট',
  },
];

export const POPULAR_COURSES: Course[] = [
  {
    id: 'python-zero-to-hero',
    title: 'Python প্রোগ্রামিং জিরো থেকে এডভান্স',
    categoryId: 'courses',
    category: 'প্রোগ্রামিং',
    rating: 4.8,
    reviewCount: 210,
    originalPrice: 800,
    discountPrice: 499,
    discountPercentage: 37,
    thumbnailTheme: 'python',
    thumbnailTitle: 'Python প্রোগ্রামিং মৌলিক থেকে এডভান্স',
    studentsCount: 380,
    lastUpdated: 'এপ্রিল ২০২৪',
    language: 'বাংলা',
    access: 'ইমেইলে সম্পূর্ণ এক্সেস (মোবাইল ও কম্পিউটার)',
    certificate: false,
    description: 'পাইথন একটি অত্যন্ত জনপ্রিয় ও সহজ প্রোগ্রামিং ল্যাঙ্গুয়েজ। এই কোর্সে আমরা একদম জিরো থেকে অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং, ডাটা স্ট্রাকচার এবং প্র্যাকটিক্যাল প্রজেক্ট বিল্ড করা শিখবো।',
    whatYouWillLearn: [
      'পাইথন সিনট্যাক্স ও মূল কনসেপ্ট',
      'ডাটা স্ট্রাকচার (List, Tuple, Dict, Set)',
      'অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং (OOP)',
      'ফাইল হ্যান্ডলিং ও এক্সেপশন হ্যান্ডলিং',
      'মিনি প্রজেক্ট: অটোমেশন স্ক্রিপ্ট তৈরি',
      'Tkinter দিয়ে জিইউআই অ্যাপ্লিকেশন'
    ],
    features: {
      videoHours: '১৮+ ঘণ্টা',
      projectsCount: '৬টি প্রজেক্ট',
      lifetimeAccess: true,
      certificate: false,
      mobileAccess: true
    },
    instructor: {
      name: 'তানভীর হোসেন',
      role: 'সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার',
      experience: '৬+ বছরের অভিজ্ঞতা',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    }
  },
  {
    id: 'web-dev-bootcamp',
    title: 'কমপ্লিট ওয়েব ডেভেলপমেন্ট বুটক্যাম্প ২০২৪',
    categoryId: 'courses',
    category: 'ওয়েব ডেভেলপমেন্ট',
    rating: 4.8,
    reviewCount: 280,
    originalPrice: 1200,
    discountPrice: 699,
    discountPercentage: 42,
    thumbnailTheme: 'webdev',
    thumbnailTitle: 'কমপ্লিট ওয়েব ডেভেলপমেন্ট বুটক্যাম্প',
    studentsCount: 450,
    lastUpdated: 'মে ২০২৪',
    language: 'বাংলা',
    access: 'ইমেইলে সম্পূর্ণ এক্সেস (মোবাইল ও কম্পিউটার)',
    certificate: false,
    description: 'এই কোর্সটিতে ওয়েব ডেভেলপমেন্ট এর বেসিক থেকে এডভান্স পর্যন্ত সবকিছু শিখতে পারবেন। HTML, CSS, JavaScript, Bootstrap, Tailwind CSS, React, Node.js, Express.js, MongoDB সহ একটি সম্পূর্ণ ওয়েব প্রজেক্ট তৈরি করা শিখবেন।',
    whatYouWillLearn: [
      'HTML, CSS, JavaScript সম্পূর্ণ মাস্টার করবেন',
      'Bootstrap & Tailwind CSS ডিজাইন ফ্রেমওয়ার্ক',
      'React JS দিয়ে আধুনিক Frontend ডেভেলপমেন্ট',
      'Node.js & Express.js দিয়ে Backend সার্ভিস',
      'MongoDB ডাটাবেজ ইন্টিগ্রেশন',
      'বাস্তব জীবনের ফুল-স্ট্যাক প্রজেক্ট তৈরি',
      'রেসপন্সিভ ওয়েবসাইট ডিজাইন টেকনিক',
      'আধুনিক UI/UX ডিজাইন প্রিন্সিপাল',
      'ইউজার অথেন্টিকেশন সিস্টেম (Login/Signup)',
      'লাইভ প্রজেক্ট ডিপ্লয়মেন্ট পদ্ধতি',
      'বেস্ট প্র্যাকটিস ও ক্যারিয়ার গাইড'
    ],
    features: {
      videoHours: '২৬+ ঘণ্টা ভিডিও কন্টেন্ট',
      projectsCount: '১০+ প্রজেক্ট হ্যান্ডস-অন',
      lifetimeAccess: true,
      certificate: false,
      mobileAccess: true
    },
    instructor: {
      name: 'জাহিদ হাসান',
      role: 'ফুল স্ট্যাক ডেভেলপার ও ইন্সট্রাক্টর',
      experience: '৫+ বছরের অভিজ্ঞতা',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    }
  },
  {
    id: 'freelancing-success',
    title: 'ফ্রিল্যান্সিং সাকসেস কোর্স A to Z',
    categoryId: 'courses',
    category: 'ফ্রিল্যান্সিং',
    rating: 4.9,
    reviewCount: 410,
    originalPrice: 1000,
    discountPrice: 599,
    discountPercentage: 40,
    thumbnailTheme: 'freelancing',
    thumbnailTitle: 'ফ্রিল্যান্সিং সাকসেস কোর্স A to Z',
    studentsCount: 820,
    lastUpdated: 'জুন ২০২৪',
    language: 'বাংলা',
    access: 'লাইফটাইম এক্সেস',
    certificate: true,
    description: 'Fiverr, Upwork এবং Direct Client Acquisition এর মাধ্যমে কীভাবে ইন্টারন্যাশনালি কাজ পাবেন এবং নিজের ফ্রিল্যান্সিং ক্যারিয়ার গড়ে তুলবেন তার সম্পূর্ণ নির্দেশিকা।',
    whatYouWillLearn: [
      'Fiverr একাউন্ট তৈরি ও গিগ অপ্টিমাইজেশন',
      'Upwork প্রোফাইল সেটআপ ও প্রপোজাল রাইটিং',
      'ডাইরেক্ট ক্লায়েন্ট আউটরিচ স্ট্র্যাটেজি',
      'আন্তর্জাতিক ক্লায়েন্টদের সাথে কমিউনিকেশন দক্ষতা',
      'পেমেন্ট রিসিভ করার উপায় (Payoneer/Bank)',
      'প্রোফাইল র্যাংকিং হ্যাকস ও পোর্টফোলিও তৈরি'
    ],
    features: {
      videoHours: '২০+ ঘণ্টা',
      projectsCount: '৫টি প্র্যাকটিক্যাল গাইড',
      lifetimeAccess: true,
      certificate: true,
      mobileAccess: true
    },
    instructor: {
      name: 'কামরুল ইসলাম',
      role: 'টপ রেটেড ফ্রিল্যান্সার ও মেন্টর',
      experience: '৭+ বছরের অভিজ্ঞতা',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    }
  },
  {
    id: 'digital-marketing-full',
    title: 'ডিজিটাল মার্কেটিং ফুল কোর্স মাস্টারক্লাস',
    categoryId: 'courses',
    category: 'ডিজিটাল মার্কেটিং',
    rating: 4.7,
    reviewCount: 190,
    originalPrice: 700,
    discountPrice: 399,
    discountPercentage: 43,
    thumbnailTheme: 'marketing',
    thumbnailTitle: 'ডিজিটাল মার্কেটিং ফুল কোর্স বাংলা',
    studentsCount: 510,
    lastUpdated: 'জুন ২০২৪',
    language: 'বাংলা',
    access: 'লাইফটাইম এক্সেস',
    certificate: true,
    description: 'Facebook Ads, Google Search Ads, SEO, Content Marketing এবং Email Automation নিয়ে প্র্যাকটিক্যাল ডিজিটাল মার্কেটিং মাস্টারক্লাস।',
    whatYouWillLearn: [
      'Facebook Ads Manager ও পিক্সেল সেটআপ',
      'Google PPC Ads ও YouTube মার্কেটিং',
      'সার্চ ইঞ্জিন অপটিমাইজেশন (SEO)',
      'সোশ্যাল মিডিয়া কন্টেন্ট স্ট্র্যাটেজি',
      'সেলস ফানেল ও কনভার্সন ট্র্যাকিং',
      'লোকাল বিজনেস গ্রোথ টেকনিক'
    ],
    features: {
      videoHours: '২২+ ঘণ্টা',
      projectsCount: '৮টি প্র্যাকটিক্যাল ক্যাম্পেইন',
      lifetimeAccess: true,
      certificate: true,
      mobileAccess: true
    },
    instructor: {
      name: 'নাদিয়া চৌধুরী',
      role: 'ডিজিটাল মার্কেটিং লিড',
      experience: '৪+ বছরের অভিজ্ঞতা',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    }
  },
  {
    id: 'js-secrets-ebook',
    title: 'JavaScript প্রফেশনাল সিক্রেটস ই-বুক',
    categoryId: 'ebooks',
    category: 'ই-বুক ও বই',
    rating: 4.9,
    reviewCount: 124,
    originalPrice: 300,
    discountPrice: 150,
    discountPercentage: 50,
    thumbnailTheme: 'webdev',
    thumbnailTitle: 'JavaScript প্রফেশনাল সিক্রেটস',
    studentsCount: 450,
    lastUpdated: 'জুলাই ২০২৪',
    language: 'বাংলা',
    access: 'ইমেইলে ডাউনলোড লিংক',
    certificate: false,
    description: 'জাভাস্ক্রিপ্ট এর এডভান্স কনসেপ্টসমূহ (Clousures, Promises, Async/Await) এবং রিয়েল-ওয়ার্ল্ড প্রজেক্টের সমাধান নিয়ে সাজানো প্রফেশনাল ই-বুক।',
    whatYouWillLearn: [
      'অ্যাডভান্সড ক্লোজার্স ও স্কোপ কনসেপ্ট',
      'অ্যাসিঙ্ক-অ্যাওয়েট ও প্রমিজ হ্যান্ডলিং',
      'ইভেন্ট লুপ ও মেমরি অপ্টিমাইজেশন',
      'জাভাস্ক্রিপ্ট সিকিউরিটি ও বেস্ট প্র্যাকটিস'
    ],
    features: {
      videoHours: '০ ঘণ্টা (ই-বুক)',
      projectsCount: '১৫+ প্রজেক্ট কোড সমাধান',
      lifetimeAccess: true,
      certificate: false,
      mobileAccess: true
    },
    instructor: {
      name: 'জাহিদ হাসান',
      role: 'ফুল স্ট্যাক ডেভেলপার ও লেখক',
      experience: '৫+ বছরের অভিজ্ঞতা',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    productType: 'Simple Product',
    deliveryMethodType: 'file',
    fileDownloadUrl: 'https://example.com/js-secrets.pdf'
  },
  {
    id: 'uiux-mastery-book',
    title: 'UI/UX ডিজাইন মাস্টারক্লাস গাইড বুক',
    categoryId: 'ebooks',
    category: 'ই-বুক ও বই',
    rating: 4.8,
    reviewCount: 89,
    originalPrice: 400,
    discountPrice: 199,
    discountPercentage: 50,
    thumbnailTheme: 'design',
    thumbnailTitle: 'UI/UX ডিজাইন মাস্টারক্লাস',
    studentsCount: 320,
    lastUpdated: 'মে ২০২৪',
    language: 'বাংলা',
    access: 'ইমেইলে পিডিএফ ফাইল',
    certificate: false,
    description: 'মোবাইল ও ওয়েব ইন্টারফেস ডিজাইন করার সমস্ত রুলস, কালার থিওরি এবং ইউজার সাইকোলজি নিয়ে রচিত একটি পূর্ণাঙ্গ গাইড বুক।',
    whatYouWillLearn: [
      'ইউজার ইন্টারফেস ডিজাইন রুলস',
      'কালার থিওরি ও টাইপোগ্রাফি স্কেলিং',
      'ইউজার জার্নি ও ওয়্যারফ্রেমিং গাইড',
      'Figma টুলস টিপস ও ট্রিকস'
    ],
    features: {
      videoHours: '০ ঘণ্টা (ই-বুক)',
      projectsCount: '৮টি প্র্যাকটিক্যাল কেস স্টাডি',
      lifetimeAccess: true,
      certificate: false,
      mobileAccess: true
    },
    instructor: {
      name: 'তানভীর হোসেন',
      role: 'ইউআই/ইউএক্স ডিজাইনার',
      experience: '৬+ বছরের অভিজ্ঞতা',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    productType: 'Simple Product',
    deliveryMethodType: 'file',
    fileDownloadUrl: 'https://example.com/uiux-mastery.pdf'
  },
  {
    id: 'mern-ecommerce-source',
    title: 'কমপ্লিট MERN ই-কমার্স সোর্স কোড',
    categoryId: 'source-code',
    category: 'প্রিমিয়াম রিসোর্স',
    rating: 4.9,
    reviewCount: 76,
    originalPrice: 1500,
    discountPrice: 799,
    discountPercentage: 46,
    thumbnailTheme: 'webdev',
    thumbnailTitle: 'MERN ই-কমার্স সোর্স কোড',
    studentsCount: 180,
    lastUpdated: 'জুলাই ২০২৪',
    language: 'বাংলা ডকুমেন্টেশন',
    access: 'গিটহাব রেপো এক্সেস',
    certificate: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400',
    galleryImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400'
    ],
    resourceBadgeText: '১০০০+ ফাইল',
    resourceHighlight1Count: '১০০০+ ফাইল',
    resourceHighlight1Label: 'রিসোর্স উপাদান',
    resourceHighlight2Count: '৫+ মডিউলস',
    resourceHighlight2Label: 'কমপ্লিট সেটআপ গাইড',
    resourceHighlight3Count: '১০০% লাইফটাইম',
    resourceHighlight3Label: 'ডাউনলোড এক্সেস',
    description: 'একটি পূর্ণাঙ্গ রিয়েল-ওয়ার্ল্ড ই-কমার্স ওয়েবসাইটের ফুল সোর্স কোড। এতে রয়েছে অ্যাডমিন প্যানেল, পেমেন্ট গেটওয়ে ইন্টিগ্রেশন এবং ফুল রেসপন্সিভ ডিজাইন।',
    whatYouWillLearn: [
      'কমপ্লিট এক্সপ্রেস ব্যাকেন্ড এপিআই',
      'রিয়্যাক্ট ফ্রন্টএন্ড উইথ টেলউইন্ড সিএসএস',
      'বিকাশ/নগদ/রকেট পেমেন্ট সিস্টেম কোড',
      'অ্যাডমিন ড্যাশবোর্ড ও ইনভেন্টরি কন্ট্রোল'
    ],
    features: {
      videoHours: '২+ ঘণ্টা সেটআপ ভিডিও',
      projectsCount: '১টি ফুল-স্ট্যাক প্রজেক্ট কোড',
      lifetimeAccess: true,
      certificate: false,
      mobileAccess: false
    },
    instructor: {
      name: 'জাহিদ হাসান',
      role: 'ফুল স্ট্যাক ডেভেলপার',
      experience: '৫+ বছরের অভিজ্ঞতা',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    productType: 'Simple Product',
    deliveryMethodType: 'external_link',
    externalAccessLink: 'https://github.com/example/mern-ecommerce'
  },
  {
    id: 'react-portfolio-template',
    title: 'প্রো পোর্টফোলিও রিয়্যাক্ট টেমপ্লেট',
    categoryId: 'source-code',
    category: 'প্রিমিয়াম রিসোর্স',
    rating: 4.8,
    reviewCount: 62,
    originalPrice: 500,
    discountPrice: 299,
    discountPercentage: 40,
    thumbnailTheme: 'design',
    thumbnailTitle: 'প্রো পোর্টফোলিও টেমপ্লেট',
    studentsCount: 290,
    lastUpdated: 'জুন ২০২৪',
    language: 'বাংলা ও ইংরেজি ডকুমেন্টেশন',
    access: 'ডাউনলোড জিপ ফাইল',
    certificate: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1541462608141-2f682d824c9a?auto=format&fit=crop&q=80&w=400',
    galleryImages: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1541462608141-2f682d824c9a?auto=format&fit=crop&q=80&w=400'
    ],
    resourceBadgeText: '১০০+ রিসোর্স',
    resourceHighlight1Count: '১০০+ রিসোর্স',
    resourceHighlight1Label: 'রিসোর্স উপাদান',
    resourceHighlight2Count: '১০+ সেকশন',
    resourceHighlight2Label: 'ইউনিক লেআউট',
    resourceHighlight3Count: '১০০% রেডি',
    resourceHighlight3Label: 'ইনস্ট্যান্ট রানিং',
    description: 'ডেভেলপার ও ডিজাইনারদের জন্য সম্পূর্ণ রেসপন্সিভ, এনিমেশন সমৃদ্ধ এবং সুপার-ফাস্ট রিয়্যাক্ট পোর্টফোলিও টেমপ্লেট সোর্স কোড।',
    whatYouWillLearn: [
      'Framers Motion রেডিমেড এনিমেশনস',
      'Tailwind CSS ডার্ক ও লাইট মোড কোড',
      'সহজ কাস্টমাইজেশন ও কনফিগারেশন গাইড',
      'কন্ট্যাক্ট ফর্ম ইমেইল সেন্ডিং ইন্টিগ্রেশন'
    ],
    features: {
      videoHours: '০ ঘণ্টা (সোর্স কোড)',
      projectsCount: '১টি পোর্টফোলিও টেমপ্লেট',
      lifetimeAccess: true,
      certificate: false,
      mobileAccess: true
    },
    instructor: {
      name: 'তানভীর হোসেন',
      role: 'সিনিয়র ডিজাইনার',
      experience: '৬+ বছরের অভিজ্ঞতা',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    productType: 'Simple Product',
    deliveryMethodType: 'file',
    fileDownloadUrl: 'https://example.com/portfolio-template.zip'
  },
  {
    id: 'figma-dashboard-kit',
    title: 'আল্টিমেট Figma ড্যাশবোর্ড ইউআই কিট',
    categoryId: 'design',
    category: 'ডিজাইন অ্যাসেট',
    rating: 4.8,
    reviewCount: 45,
    originalPrice: 600,
    discountPrice: 299,
    discountPercentage: 50,
    thumbnailTheme: 'design',
    thumbnailTitle: 'Figma ড্যাশবোর্ড ইউআই কিট',
    studentsCount: 190,
    lastUpdated: 'মে ২০২৪',
    language: 'ইংরেজি',
    access: 'ফিগমা ফাইল লিংক',
    certificate: false,
    description: '১০০+ ইউনিক উইজেট এবং ২০+ রেডিমেড পেজ ডিজাইন সহ প্রিমিয়াম ড্যাশবোর্ড ইউআই কিট ফিগমা ফাইল।',
    whatYouWillLearn: [
      'ফিগমা অটো-লেআউট মাস্টার কনসেপ্ট',
      'কালার এবং টেক্সট ভেরিয়েবলস সেটআপ',
      'রেডি-টু-ইউজ রেসপন্সিভ উইজেট সমূহ',
      'ডার্ক ও লাইট মোড ড্যাশবোর্ড ভেরিয়েশনস'
    ],
    features: {
      videoHours: '০ ঘণ্টা (ডিজাইন ফাইল)',
      projectsCount: '২০+ প্রি-ডিজাইনড পেজ',
      lifetimeAccess: true,
      certificate: false,
      mobileAccess: true
    },
    instructor: {
      name: 'তানভীর হোসেন',
      role: 'ইউআই/ইউএক্স ডিজাইনার',
      experience: '৬+ বছরের অভিজ্ঞতা',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    productType: 'Simple Product',
    deliveryMethodType: 'external_link',
    externalAccessLink: 'https://figma.com/example-dashboard-kit'
  },
  {
    id: 'midjourney-prompts-pack',
    title: '১০,০০০+ মিডজার্নি আর্ট জেনারেশন প্রম্পট',
    categoryId: 'ai-prompts',
    category: 'এআই প্রম্পট',
    rating: 4.7,
    reviewCount: 38,
    originalPrice: 400,
    discountPrice: 199,
    discountPercentage: 50,
    thumbnailTheme: 'ai',
    thumbnailTitle: 'মিডজার্নি আর্ট প্রম্পটস',
    studentsCount: 310,
    lastUpdated: 'জুলাই ২০২৪',
    language: 'ইংরেজি',
    access: 'গুগল শিট ও পিডিএফ এক্সেস',
    certificate: false,
    description: 'ফটোরিয়ালিস্টিক ইমেজ, ইউনিক লোগো, ইলাস্ট্রেশন এবং থ্রিডি ক্যারেক্টার তৈরির জন্য সেরা ১০,০০০+ প্রম্পট কালেকশন।',
    whatYouWillLearn: [
      'মিডজার্নি প্যারামিটার সেটিংস গাইড',
      'হাইপার-রিয়েলিস্টিক পোর্ট্রেট জেনারেট ট্রিকস',
      'লোগো ও ভেক্টর ডিজাইন স্পেসিফিক প্রম্পটস',
      'এআই ইমেজ থেকে আর্নিং করার মেথড'
    ],
    features: {
      videoHours: '০ ঘণ্টা (পিডিএফ ও স্প্রেডশিট)',
      projectsCount: '৫০+ ক্যাটাগরির প্রম্পটস',
      lifetimeAccess: true,
      certificate: false,
      mobileAccess: true
    },
    instructor: {
      name: 'তানভীর হোসেন',
      role: 'এআই প্রম্পট ইঞ্জিনিয়ার',
      experience: '৩+ বছরের অভিজ্ঞতা',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    productType: 'Simple Product',
    deliveryMethodType: 'external_link',
    externalAccessLink: 'https://docs.google.com/spreadsheets/example'
  },
  {
    id: 'tailwind-saas-template',
    title: 'SaaS ল্যান্ডিং পেজ টেলউইন্ড টেমপ্লেট',
    categoryId: 'templates',
    category: 'ওয়েব টেমপ্লেট',
    rating: 4.8,
    reviewCount: 52,
    originalPrice: 800,
    discountPrice: 399,
    discountPercentage: 50,
    thumbnailTheme: 'webdev',
    thumbnailTitle: 'Tailwind SaaS টেমপ্লেট',
    studentsCount: 240,
    lastUpdated: 'জুলাই ২০২৪',
    language: 'বাংলা ডকুমেন্টেশন',
    access: 'ডাউনলোড জিপ ফাইল',
    certificate: false,
    description: 'আপনার নতুন কোনো ডিজিটাল প্রোডাক্ট, টুল বা স্টার্টআপ লঞ্চ করার জন্য রেডি-টু-ইউজ অত্যন্ত রেসপন্সিভ আধুনিক ল্যান্ডিং পেজ।',
    whatYouWillLearn: [
      'Tailwind CSS অ্যানিমেশন ও ট্রানজিশন',
      'মোবাইল-ফার্স্ট রেসপন্সিভ ডিজাইন স্ট্রাকচার',
      'ক্লিন ও অপ্টিমাইজড এইচটিএমএল মার্কআপ',
      'SEO ফ্রেন্ডলি ট্যাগিং ও মেটা সেটিংস'
    ],
    features: {
      videoHours: '০ ঘণ্টা (টেমপ্লেট ফাইল)',
      projectsCount: '১টি কমপ্লিট ল্যান্ডিং পেজ',
      lifetimeAccess: true,
      certificate: false,
      mobileAccess: true
    },
    instructor: {
      name: 'জাহিদ হাসান',
      role: 'ফুল স্ট্যাক ডেভেলপার',
      experience: '৫+ বছরের অভিজ্ঞতা',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    productType: 'Simple Product',
    deliveryMethodType: 'file',
    fileDownloadUrl: 'https://example.com/saas-template.zip'
  }
];

export const TESTIMONIALS: Review[] = [
  {
    id: '1',
    name: 'Rasel Ahmed',
    handle: '@rasel_dev',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    comment: 'এই কোর্স থেকে আমি অনেক কিছু শিখেছি। দারুণ একটি কোর্স। ধন্যবাদ Skills Hub!',
    rating: 5,
    date: '2 weeks ago'
  },
  {
    id: '2',
    name: 'Nusrat Jahan',
    handle: '@nusrat_ui',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    comment: 'কোর্স কন্টেন্ট খুবই ভালো এবং সহজভাবে বোঝানো হয়েছে। অবশ্যই রিকমেন্ড করবো।',
    rating: 5,
    date: '1 month ago'
  },
  {
    id: '3',
    name: 'Mahmudul Hasan',
    handle: '@mahmud_dev',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
    comment: 'খুবই প্রফেশনাল এবং হেল্পফুল ছিল। সবার জন্য সেরা একটি প্ল্যাটফর্ম।',
    rating: 5,
    date: '3 weeks ago'
  }
];

export const PAYMENT_METHODS: Record<string, PaymentMethodInfo> = {
  bkash: {
    id: 'bkash',
    name: 'bKash',
    subtext: 'পেমেন্ট করুন',
    logoColor: '#E2136E',
    merchantNumber: '01909905849',
    ussdCode: '*247#',
    themeColor: '#E2136E',
    instructions: [
      '*247# ডায়াল করে আপনার bKash মোবাইল মেনু খুলুন',
      '"Send Money" এ ক্লিক করুন',
      'প্রাপক নাম্বার হিসেবে এই নাম্বারটি দিন: 01909905849',
      'পরিমাণ লিখে SUBMIT করুন',
      'এরপর উপরের বক্সে আপনার Transaction ID দিন এবং VERIFY করুন'
    ]
  },
  nagad: {
    id: 'nagad',
    name: 'Nagad',
    subtext: 'পেমেন্ট করুন',
    logoColor: '#F7931E',
    merchantNumber: '01909905849',
    ussdCode: '*167#',
    themeColor: '#F7931E',
    instructions: [
      '*167# ডায়াল করে আপনার Nagad মোবাইল মেনু খুলুন',
      '"Send Money" মেনুতে প্রবেশ করুন',
      'নগদ প্রাপক হিসেবে 01909905849 দিন',
      'নির্ধারিত টাকার পরিমাণ লিখে সাবমিট করুন',
      'প্রাপ্ত Transaction ID টি উপরের বক্সে লিখে VERIFY করুন'
    ]
  },
  rocket: {
    id: 'rocket',
    name: 'Rocket',
    subtext: 'পেমেন্ট করুন',
    logoColor: '#8C3494',
    merchantNumber: '01909905849',
    ussdCode: '*322#',
    themeColor: '#8C3494',
    instructions: [
      '*322# ডায়াল করে রকেট অ্যাপ বা ইউএসএসডি খুলুন',
      'Send Money নির্বাচন করে প্রাপক নাম্বার 01909905849 দিন',
      'নির্ধারিত সমপরিমাণ টাকা প্রদান করুন',
      'পেমেন্ট এর পর প্রাপ্ত TxID টাইপ করে VERIFY TRANSACTION চাপুন'
    ]
  }
};
