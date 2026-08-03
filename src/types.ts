export type ViewMode = 'home' | 'courses' | 'course-details' | 'checkout' | 'ebooks' | 'source-code' | 'bundles' | 'blog' | 'admin' | 'profile';

export type AdminTab = 
  | 'dashboard'
  | 'products'
  | 'bundles'
  | 'orders'
  | 'customers'
  | 'reviews'
  | 'categories'
  | 'coupons'
  | 'withdrawals'
  | 'blog'
  | 'subscribers'
  | 'announcements'
  | 'whatsapp-email'
  | 'payment-settings'
  | 'general-settings'
  | 'website-settings'
  | 'admin-staff'
  | 'backup-tools';

export interface Bundle {
  id: string;
  title: string;
  coverImage?: string;
  description: string;
  productIds: string[];
  originalTotalPrice: number;
  bundlePrice: number;
  savingsPercentage: number;
  expiryDate?: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface AdminUser {
  email: string;
  phone: string;
  role: string;
  name: string;
  avatar?: string;
  isLoggedIn: boolean;
  pinVerified: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productTitle: string;
  productId: string;
  amount: number;
  paymentMethod: 'bkash' | 'nagad' | 'rocket';
  transactionId: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  date: string;
  itemCategory?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Blocked';
  avatar?: string;
  lastOrderDate?: string;
}

export interface AdminReview extends Review {
  status: 'Approved' | 'Pending' | 'Rejected';
  productName: string;
  adminReply?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderAmount?: number;
  applicableProducts?: string[]; // ['all'] or specific course names/IDs
  perUserLimit?: number;
  usageLimit: number;
  usedCount: number;
  startDate?: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Inactive' | 'Disabled';
}

export interface WithdrawRequest {
  id: string;
  instructorName: string;
  email: string;
  amount: number;
  method: 'bkash' | 'nagad' | 'bank';
  accountDetails: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  referenceId: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft';
  content: string;
  views: number;
  image: string;
  excerpt?: string;
  teraboxLink?: string;
  showButton?: boolean;
  buttonText?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedDate: string;
  status: 'Active' | 'Unsubscribed';
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'banner' | 'popup';
  status: 'Active' | 'Inactive';
  targetPages: string;
  startDate?: string;
  endDate?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Manager' | 'Support Staff' | 'Content Editor';
  status: 'Active' | 'Inactive';
  permissions: string[];
}

export interface WhatsAppSettingsData {
  whatsappNumber: string;
  supportEmail: string;
  whatsappChannelLink: string;
  autoReplyOrderTemplate: string;
  whatsappChatLink?: string;
}

export interface GeneralSettings {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  currency: string;
  timezone: string;
  defaultLanguage: 'BN' | 'EN';
  contactEmail: string;
  contactPhone: string;
}

export interface PaymentSettingsData {
  bkashNumber: string;
  bkashType: 'Personal' | 'Merchant' | 'Agent';
  bkashActive: boolean;
  nagadNumber: string;
  nagadType: 'Personal' | 'Merchant' | 'Agent';
  nagadActive: boolean;
  rocketNumber: string;
  rocketType: 'Personal' | 'Merchant' | 'Agent';
  rocketActive: boolean;
  commissionRate: number;
  manualInstructions: string;
}

export interface WebsiteSettingsData {
  heroTitle: string;
  heroSubtitle: string;
  bannerNotice: string;
  facebookUrl: string;
  youtubeUrl: string;
  footerText: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  details: string;
}

export interface Category {
  id: string;
  name: string;
  itemCount: string;
  iconName: string;
  color: string;
  bgTint: string;
  productType?: 'Full Course' | 'Simple Product';
  description?: string;
  thumbnailUrl?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  isPreview?: boolean;
}

export interface CurriculumModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseReviewItem {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  status: 'approved' | 'rejected' | 'pending' | 'hidden';
}

export interface CourseInstructor {
  id?: string;
  name: string;
  role: string;
  experience: string;
  bio?: string;
  avatar: string;
  socials?: {
    facebook?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface Course {
  id: string;
  title: string;
  categoryId: string; // Add this
  category: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  thumbnailTheme: 'python' | 'webdev' | 'freelancing' | 'marketing' | 'design' | 'ai';
  thumbnailTitle?: string;
  studentsCount: number;
  lastUpdated: string;
  language: string;
  access: string;
  certificate: boolean;
  description: string;
  whatYouWillLearn: string[];
  features: {
    videoHours: string;
    hasProjects?: boolean;
    projectsCount: string;
    lifetimeAccess: boolean;
    certificate: boolean;
    mobileAccess: boolean;
    desktopAccess?: boolean;
    deliveryMethods?: string[]; // e.g. ['email', 'whatsapp']
  };
  instructor: CourseInstructor;
  videoUrl?: string;
  thumbnailUrl?: string;
  productType?: 'Full Course' | 'Simple Product';
  deliveryMethodType?: 'file' | 'external_link';
  fileDownloadUrl?: string;
  externalAccessLink?: string;
  tags?: string[];
  status?: 'Published' | 'Draft';
  galleryImages?: string[];
  curriculumModules?: CurriculumModule[];
  courseReviews?: CourseReviewItem[];
  resourceBadgeText?: string;
  resourceHighlight1Count?: string;
  resourceHighlight1Label?: string;
  resourceHighlight2Count?: string;
  resourceHighlight2Label?: string;
  resourceHighlight3Count?: string;
  resourceHighlight3Label?: string;
}

export interface Review {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  comment: string;
  rating: number;
  date?: string;
}

export interface CartItem {
  course: Course;
  quantity: number;
}

export type PaymentMethodType = 'bkash' | 'nagad' | 'rocket';

export interface PaymentMethodInfo {
  id: PaymentMethodType;
  name: string;
  subtext: string;
  logoColor: string;
  merchantNumber: string;
  ussdCode: string;
  themeColor: string;
  instructions: string[];
}

export interface UserDetails {
  fullName: string;
  whatsapp: string;
  email: string;
  country: string;
  notes: string;
}
