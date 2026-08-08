import {
  Order,
  Customer,
  AdminReview,
  Coupon,
  WithdrawRequest,
  BlogPost,
  Subscriber,
  Announcement,
  StaffMember,
  GeneralSettings,
  PaymentSettingsData,
  WebsiteSettingsData,
  WhatsAppSettingsData,
  SystemAuditLog,
  Bundle,
} from '../types';

export const INITIAL_BUNDLES: Bundle[] = [
  {
    id: 'bundle-web-marketing-combo',
    title: 'Web Dev + Digital Marketing Mega Combo',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
    description: 'ওয়েব ডেভেলপমেন্ট এবং ডিজিটাল মার্কেটিং একসাথে শিখে ফ্রিল্যান্সিং মার্কেটপ্লেসে দ্বিগুণ আয় শুরু করুন।',
    productIds: ['web-dev-bootcamp', 'digital-marketing-pro'],
    originalTotalPrice: 2200,
    bundlePrice: 999,
    savingsPercentage: 55,
    expiryDate: '2026-12-31',
    status: 'Active',
    createdAt: '2026-07-01',
  },
  {
    id: 'bundle-python-freelancing-pack',
    title: 'Python Programmer & Freelancer Starter Bundle',
    coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600',
    description: 'পাইথন প্রোগ্রামিং আয়ত্ত করুন এবং ফাইভার-আপওয়ার্কে আর্নিং শুরু করার জন্য সঠিক গাইডলাইন পান।',
    productIds: ['python-zero-to-hero', 'freelancing-success'],
    originalTotalPrice: 1800,
    bundlePrice: 850,
    savingsPercentage: 53,
    expiryDate: '2026-12-31',
    status: 'Active',
    createdAt: '2026-07-05',
  },
];

export const ADMIN_SEED_CREDENTIALS = {
  email: 'Admin1829@gmail.com',
  phone: '01861612289',
  password: '12342580',
  pin: '1829',
  role: 'Super Admin',
  name: 'Admin',
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1003',
    customerName: 'Rasel Ahmed',
    customerEmail: 'rasel@gmail.com',
    customerPhone: '01812345678',
    productTitle: 'Full Stack MERN E-commerce Source Code',
    productId: 'mern-ecommerce-source',
    amount: 799,
    paymentMethod: 'bkash',
    transactionId: 'TRX9A8B7C6',
    status: 'Pending',
    date: '2026-07-27 09:30',
    itemCategory: 'Source Code',
  },
  {
    id: 'ORD-1002',
    customerName: 'Rasel Ahmed',
    customerEmail: 'rasel@gmail.com',
    customerPhone: '01812345678',
    productTitle: 'Python Programming Masterclass',
    productId: 'python-masterclass',
    amount: 499,
    paymentMethod: 'nagad',
    transactionId: 'NGD8827110',
    status: 'Processing',
    date: '2026-07-25 14:15',
    itemCategory: 'Development',
  },
  {
    id: 'ORD-1001',
    customerName: 'Rasel Ahmed',
    customerEmail: 'rasel@gmail.com',
    customerPhone: '01812345678',
    productTitle: 'Web Development Bootcamp 2026',
    productId: 'web-dev-bootcamp',
    amount: 599,
    paymentMethod: 'bkash',
    transactionId: 'BK77218942',
    status: 'Completed',
    date: '2026-07-20 11:00',
    itemCategory: 'Development',
  },
  {
    id: 'ORD-1000',
    customerName: 'Rasel Ahmed',
    customerEmail: 'rasel@gmail.com',
    customerPhone: '01812345678',
    productTitle: 'UI/UX Design Fundamentals E-book',
    productId: 'uiux-design-ebook',
    amount: 299,
    paymentMethod: 'rocket',
    transactionId: 'RCK1029384',
    status: 'Cancelled',
    date: '2026-07-15 16:20',
    itemCategory: 'E-Books',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-1001',
    name: 'Rasel Ahmed',
    email: 'rasel@gmail.com',
    phone: '01812345678',
    joinedDate: '2026-06-10',
    totalOrders: 4,
    totalSpent: 2196,
    status: 'Active',
    lastOrderDate: '2026-07-27 09:30',
  },
];

export const INITIAL_REVIEWS: AdminReview[] = [];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'CPN-1',
    code: 'EID50',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 500,
    applicableProducts: ['all'],
    perUserLimit: 1,
    usageLimit: 200,
    usedCount: 84,
    startDate: '2026-06-01',
    expiryDate: '2026-08-15',
    status: 'Active',
  },
  {
    id: 'CPN-2',
    code: 'PROMO100',
    discountType: 'flat',
    discountValue: 100,
    minOrderAmount: 399,
    applicableProducts: ['Web Development Bootcamp', 'Python Programming'],
    perUserLimit: 2,
    usageLimit: 500,
    usedCount: 312,
    startDate: '2026-07-01',
    expiryDate: '2026-09-01',
    status: 'Active',
  },
  {
    id: 'CPN-3',
    code: 'NEWUSER20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 0,
    applicableProducts: ['all'],
    perUserLimit: 1,
    usageLimit: 100,
    usedCount: 100,
    startDate: '2026-05-01',
    expiryDate: '2026-06-30',
    status: 'Expired',
  },
];

export const INITIAL_WITHDRAWALS: WithdrawRequest[] = [
  {
    id: 'WDR-301',
    instructorName: 'Tanvir Hossain',
    email: 'tanvir.instructor@gmail.com',
    amount: 14500,
    method: 'bkash',
    accountDetails: '01711223344 (Personal)',
    requestDate: '2026-07-25 02:00 PM',
    status: 'Pending',
    referenceId: 'REF-88123',
  },
  {
    id: 'WDR-302',
    instructorName: 'Jahid Hasan',
    email: 'jahid.dev@gmail.com',
    amount: 28900,
    method: 'nagad',
    accountDetails: '01822334455 (Personal)',
    requestDate: '2026-07-24 11:30 AM',
    status: 'Approved',
    referenceId: 'REF-88122',
  },
  {
    id: 'WDR-303',
    instructorName: 'Nadia Chowdhury',
    email: 'nadia.mkt@gmail.com',
    amount: 9200,
    method: 'bank',
    accountDetails: 'DBBL Acc: 110.120.99823',
    requestDate: '2026-07-20 05:00 PM',
    status: 'Approved',
    referenceId: 'REF-88119',
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'BLOG-1',
    title: 'ফ্রি কোর্স: HTML & CSS ফুল ক্র্যাশ কোর্স ২০২৬ (ভিডিও টিউটোরিয়াল)',
    category: 'Free Course',
    author: 'Yasin Arfat',
    date: '2026-07-26',
    status: 'Published',
    excerpt: 'ওয়েব ডেভেলপমেন্ট শুরুর জন্য সম্পূর্ণ ফ্রি HTML & CSS কোর্স। কোনো অভিজ্ঞতার প্রয়োজন নেই, আজই দেখা শুরু করুন।',
    content: `ওয়েব ডেভেলপমেন্টের জগতে পা রাখার প্রথম ধাপ হলো HTML ও CSS শেখা। এই ফ্রি ক্র্যাশ কোর্সে আমরা একদম জিরো থেকে প্রফেশনাল ওয়েবসাইট লেআউট ডিজাইন করা শিখবো।

**কোর্সে যা যা শিখবেন:**
• HTML5 এর সকল প্রয়োজনীয় ট্যাগের ব্যবহার
• CSS3 Flexbox এবং Grid সিস্টেম
• রেসপনসিভ ওয়েবসাইট ডিজাইন
• পোর্টফোলিও প্রজেক্ট তৈরি

উপরে বা নিচে দেওয়া **"🎬 ভিডিও দেখুন"** বাটনে ক্লিক করে Terabox লিঙ্ক থেকে সম্পূর্ণ ভিডিও কোর্স ফ্রিতে অ্যাক্সেস করুন।`,
    views: 3420,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600',
    teraboxLink: 'https://www.terabox.com/s/1_example_free_course_link',
  },
  {
    id: 'BLOG-2',
    title: 'জরুরী নোটিশ: নতুন ব্যাচের ওরিয়েন্টেশন ক্লাস এবং সিস্টেম আপডেট',
    category: 'Notice',
    author: 'Admin Team',
    date: '2026-07-25',
    status: 'Published',
    excerpt: 'সকল নিবন্ধিত শিক্ষার্থীদের অবগতির জন্য জানানো যাচ্ছে আগামী ৩০শে জুলাই আমাদের নতুন ব্যাচের ওরিয়েন্টেশন ক্লাস অনুষ্ঠিত হবে।',
    content: `প্রিয় শিক্ষার্থীবৃন্দ,
আমাদের প্ল্যাটফর্মে সম্প্রতি কিছু গুরুত্বপূর্ণ আপডেট আনা হয়েছে।

**গুরুত্বপূর্ণ তথ্যসমূহ:**
১. ওরিয়েন্টেশন ক্লাস অনুষ্ঠিত হবে আগামী ৩০শে জুলাই রাত ৯:০০ টায়।
২. ড্যাশবোর্ডে "Order History" ও লাইভ ট্র্যাকিং সিস্টেম যুক্ত করা হয়েছে।
৩. কোর্সের ভিডিও দ্রুত লোড হওয়ার জন্য সার্ভার স্পিড বাড়ানো হয়েছে।

যেকোনো সহায়তার জন্য আমাদের হোয়াটসঅ্যাপ সাপোর্টে যোগাযোগ করুন।`,
    views: 1890,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'BLOG-3',
    title: 'টিউটোরিয়াল: কীভাবে Tailwind CSS দিয়ে আধুনিক ড্যাশবোর্ড তৈরি করবেন',
    category: 'Tutorial',
    author: 'Jahid Hasan',
    date: '2026-07-22',
    status: 'Published',
    excerpt: 'স্ট্রেচ না হয়ে রেসপনসিভ ও আকর্ষণীয় ওয়েবসাইট ড্যাশবোর্ড বানানোর ধাপে ধাপে গাইডলাইন।',
    content: `Tailwind CSS হলো একটি ইউটিলিটি-ফার্স্ট সিএসএস ফ্রেমওয়ার্ক যা দ্রুত ওয়েবসাইট তৈরিতে দারুণ সাহায্য করে।

**টিউটোরিয়ালের মূল বিষয়বস্তু:**
• ফ্লেক্সবক্স ও গ্রিডের নিখুঁত প্রয়োগ
• ডার্ক মোড এবং লাইট মোড কাস্টমাইজেশন
• সাশ্রয়ী ক্লাসনম কমানোর কৌশল

ভিডিও টিউটোরিয়াল এবং কোড স্নাইপেট খুব শীঘ্রই আপলোড করা হবে।`,
    views: 2510,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'BLOG-4',
    title: 'সিস্টেম আপডেট: ইন্সট্যান্ট পেমেন্ট ও নতুন ড্যাশবোর্ড লঞ্চ',
    category: 'Update',
    author: 'Tech Team',
    date: '2026-07-20',
    status: 'Published',
    excerpt: 'বিকাশ, নগদ ও রকেটের মাধ্যমে পেমেন্ট অটো-ভেরিফিকেশন এবং কাস্টমার অর্ডার হিস্ট্রি ফিচারের সুসংবাদ।',
    content: `আমরা অত্যন্ত আনন্দের সাথে জানাচ্ছি যে আমাদের লার্নিং প্ল্যাটফর্মে নতুন কিছু চমৎকার ফিচার যোগ করা হয়েছে।

**নতুন ফিচারসমূহ:**
• অর্ডার ট্র্যাকিং ও ডেলিভারি স্ট্যাটাস দেখা
• গুগল এবং ইমেইল দ্রুত লগইন সুবিধা
• পার্সোনাল কাস্টমার প্রোফাইল পেজ`,
    views: 1120,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'BLOG-5',
    title: 'কীভাবে Fiverr-এ প্রথম অর্ডার পাবেন? ১০টি জাদুকরী টিপস',
    category: 'Freelancing',
    author: 'Kamrul Islam',
    date: '2026-07-18',
    status: 'Published',
    excerpt: 'Fiverr-এ গিগ অপটিমাইজেশন, কি-ওয়ার্ড রিসার্চ এবং প্রফেশনাল পোর্টফোলিও থাকলে খুব দ্রুত প্রথম ক্লায়েন্ট পাওয়া যায়।',
    content: `ফ্রিহ্যান্সিং শুরু করার পর প্রথম অর্ডার পাওয়া অনেকের জন্যই চ্যালেঞ্জিং হয়ে দাঁড়ায়।

**১০টি জাদুকরী টিপস:**
১. গিগ টাইটেল এবং ট্যাগে লো-কম্পিটিশন কি-ওয়ার্ড ব্যবহার করুন।
২. আকর্ষণীয় গিগ ইমেজ ও ভিডিও যুক্ত করুন।
৩. নিয়মিত অনলাইন থাকুন এবং বায় রিকোয়েস্টের সঠিক উত্তর দিন।`,
    views: 4150,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
  },
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: 'SUB-1', email: 'student1@gmail.com', subscribedDate: '2026-06-10', status: 'Active' },
  { id: 'SUB-2', email: 'rahim@yahoo.com', subscribedDate: '2026-06-14', status: 'Active' },
  { id: 'SUB-3', email: 'karim@gmail.com', subscribedDate: '2026-07-02', status: 'Active' },
  { id: 'SUB-4', email: 'sabrina@hotmail.com', subscribedDate: '2026-07-12', status: 'Active' },
  { id: 'SUB-5', email: 'oldsubscriber@gmail.com', subscribedDate: '2026-01-15', status: 'Unsubscribed' },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANC-1',
    title: 'ঈদ মেগা ডিসকাউন্ট ৫০% ছাড়!',
    message: 'সব কোর্সে ৫০% ছাড় পেতে ব্যবহার করুন "EID50" কুপন কোড। অফার সীমিত সময়ের জন্য!',
    type: 'banner',
    status: 'Active',
    targetPages: 'All Pages',
    startDate: '2026-07-20',
    endDate: '2026-08-15',
  },
  {
    id: 'ANC-2',
    title: 'নতুন কোর্স রিলিজ: Python Zero to Hero',
    message: 'পাইথন প্রোগ্রামিং জিরো থেকে এডভান্স কোর্সটি রিলিজ হয়েছে। আজই এনরোল করুন!',
    type: 'popup',
    status: 'Inactive',
    targetPages: 'Home Page',
    startDate: '2026-07-01',
    endDate: '2026-07-10',
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'STF-1',
    name: 'Yasin Arfat (Admin)',
    email: 'iyasinarfat560@gmail.com',
    phone: '01861612289',
    role: 'Super Admin',
    status: 'Active',
    permissions: ['All Permissions', 'Manage Staff', 'Financial Access'],
  },
  {
    id: 'STF-2',
    name: 'Rahim Support',
    email: 'rahim.support@skillshub.com',
    phone: '01700112233',
    role: 'Support Staff',
    status: 'Active',
    permissions: ['Manage Orders', 'Manage Reviews', 'WhatsApp/Email'],
  },
  {
    id: 'STF-3',
    name: 'Nusrat Content Manager',
    email: 'nusrat.content@skillshub.com',
    phone: '01800223344',
    role: 'Content Editor',
    status: 'Active',
    permissions: ['Manage Products', 'Manage Blog', 'Manage Categories'],
  },
];

export const INITIAL_WHATSAPP_SETTINGS: WhatsAppSettingsData = {
  whatsappNumber: '01861612289',
  supportEmail: 'iyasinarfat560@gmail.com',
  whatsappChannelLink: 'https://whatsapp.com/channel/0029Vac16F63gvWeYTvZgL3E',
  autoReplyOrderTemplate:
    'ধন্যবাদ! আপনার অর্ডারটি সফলভাবে জমা হয়েছে। পেমেন্ট ভেরিফিকেশন শেষে কয়েক মিনিটের মধ্যেই ইমেইলে কোর্স এক্সেস লিংক পাঠিয়ে দেওয়া হবে।',
  whatsappChatLink: 'https://wa.me/8801861612289',
};

export const INITIAL_GENERAL_SETTINGS: GeneralSettings = {
  siteName: 'Skills Hub',
  tagline: 'Premium Digital Products & Online Courses Marketplace',
  logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=120',
  faviconUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=32',
  currency: 'BDT (৳)',
  timezone: 'Asia/Dhaka (GMT+6)',
  defaultLanguage: 'BN',
  contactEmail: 'iyasinarfat560@gmail.com',
  contactPhone: '01861612289',
};

export const INITIAL_PAYMENT_SETTINGS: PaymentSettingsData = {
  bkashNumber: '01861612289',
  bkashType: 'Personal',
  bkashActive: true,
  nagadNumber: '01861612289',
  nagadType: 'Personal',
  nagadActive: true,
  rocketNumber: '01861612289',
  rocketType: 'Personal',
  rocketActive: true,
  commissionRate: 15,
  manualInstructions: 'অর্ডার নিশ্চিত করতে আপনার বিকাশ/নগদ/রকেট থেকে Send Money করে Transaction ID প্রদান করুন।',
};

export const INITIAL_WEBSITE_SETTINGS: WebsiteSettingsData = {
  heroTitle: 'Build Skills. Change Future.',
  heroSubtitle: 'Premium Digital Products, Online Courses & E-books All in One Place.',
  bannerNotice: '⚡ ৫০% ছাড়ের বিশেষ অফার চলছে! কুপন কোড: EID50',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  footerText: '© 2024 Skills Hub. All rights reserved. Built for Bangladeshi learners.',
};

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'LOG-101',
    timestamp: '2026-07-26 11:30 AM',
    adminUser: 'Yasin Arfat (Super Admin)',
    action: 'Admin Login Successful',
    details: 'Logged in via 2-step PIN authentication',
  },
  {
    id: 'LOG-102',
    timestamp: '2026-07-26 10:15 AM',
    adminUser: 'Rahim Support',
    action: 'Order Status Updated',
    details: 'Order ORD-9818 status changed to Completed',
  },
  {
    id: 'LOG-103',
    timestamp: '2026-07-25 04:20 PM',
    adminUser: 'Yasin Arfat (Super Admin)',
    action: 'Coupon Code Created',
    details: 'Created EID50 with 50% discount',
  },
];
