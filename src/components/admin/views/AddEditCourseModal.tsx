import React, { useState, useEffect, useRef } from 'react';
import { Course, Category, CurriculumModule, CourseLesson, CourseInstructor, CourseReviewItem } from '../../../types';
import {
  X, Upload, Video, Image as ImageIcon, FileText, CheckSquare, List,
  User, DollarSign, Award, Clock, Plus, Trash2, Edit3, MoveUp, MoveDown,
  Bold, Italic, Underline, Strikethrough, ListOrdered, Link as LinkIcon,
  Quote, Code, Check, AlertCircle, Play, RefreshCw, GripVertical, CheckCircle,
  ChevronUp, ChevronDown, Sparkles, Layers, ArrowLeft, ArrowRight, ImagePlus,
  UserCheck, ShieldCheck, Smartphone, Monitor, Mail, MessageSquare, Star,
  Eye, EyeOff, Facebook, Youtube, Linkedin, Filter, PlusCircle, ArrowUpDown,
  Download, Package
} from 'lucide-react';

interface AddEditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Course | null;
  onSave: (product: Course) => void;
  categories?: Category[];
}

// Preset Instructor Library for quick selection
const PRESET_INSTRUCTORS: CourseInstructor[] = [
  {
    id: 'inst-1',
    name: 'Yasin Arfat',
    role: 'Lead Full Stack & Cloud Specialist',
    experience: '6+ Years Experience',
    bio: 'প্রফেশনাল সফটওয়্যার প্রকৌশলী ও মেন্টর। ১০০০+ এর বেশি স্টুডেন্টকে রিয়্যাক্ট, নোডজেএস এবং পাইথন শেখানোর অভিজ্ঞতা রয়েছে।',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    socials: {
      facebook: 'https://facebook.com/yasin',
      youtube: 'https://youtube.com/@yasin',
      linkedin: 'https://linkedin.com/in/yasin'
    }
  },
  {
    id: 'inst-2',
    name: 'Tanvir Ahmed',
    role: 'Senior UI/UX & Web Engineer',
    experience: '4+ Years Experience',
    bio: 'আন্তর্জাতিক মার্কেটপ্লেসে টপ র্যাঙ্কড ফ্রিল্যান্সার ও ইউজার এক্সপেরিয়েন্স প্রফেশনাল।',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    socials: {
      facebook: 'https://facebook.com/tanvir',
      youtube: 'https://youtube.com/@tanvir',
      linkedin: 'https://linkedin.com/in/tanvir'
    }
  },
  {
    id: 'inst-3',
    name: 'Nusrat Jahan',
    role: 'Digital Marketing & Content Strategist',
    experience: '5+ Years Experience',
    bio: 'ডিজিটাল মার্কেটিং, এসইও এবং গ্রোথ ট্রাফিকের বিশেষজ্ঞ প্রশিক্ষক।',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    socials: {
      facebook: 'https://facebook.com/nusrat',
      youtube: 'https://youtube.com/@nusrat',
      linkedin: 'https://linkedin.com/in/nusrat'
    }
  }
];

export const AddEditCourseModal: React.FC<AddEditCourseModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
  categories = [],
}) => {
  const [activeTab, setActiveTab] = useState<
    'media' | 'desc' | 'learn' | 'curriculum' | 'features' | 'instructor' | 'reviews' | 'pricing'
  >('media');

  // Product Type State ('Full Course' or 'Simple Product')
  const [productType, setProductType] = useState<'Full Course' | 'Simple Product'>('Full Course');
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  // Simple Product Specific States
  const [deliveryMethodType, setDeliveryMethodType] = useState<'file' | 'external_link'>('file');
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string>('');
  const [externalAccessLink, setExternalAccessLink] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [productStatus, setProductStatus] = useState<'Published' | 'Draft'>('Published');

  // Premium Resource Specific States
  const [resourceBadgeText, setResourceBadgeText] = useState('');
  const [resourceHighlight1Count, setResourceHighlight1Count] = useState('');
  const [resourceHighlight1Label, setResourceHighlight1Label] = useState('');
  const [resourceHighlight2Count, setResourceHighlight2Count] = useState('');
  const [resourceHighlight2Label, setResourceHighlight2Label] = useState('');
  const [resourceHighlight3Count, setResourceHighlight3Count] = useState('');
  const [resourceHighlight3Label, setResourceHighlight3Label] = useState('');

  // Basic Information
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('অনলাইন কোর্সসমূহ');
  const [categoryId, setCategoryId] = useState('courses');
  const [language, setLanguage] = useState<'Bangla' | 'English'>('Bangla');
  const [originalPrice, setOriginalPrice] = useState<number>(1200);
  const [discountPrice, setDiscountPrice] = useState<number>(699);
  const [studentsCount, setStudentsCount] = useState<number>(180);

  // Helper to update Category by ID and auto-switch Product Type
  const handleCategoryChangeById = (selectedCatId: string) => {
    setCategoryId(selectedCatId);
    const matched = categories.find((c) => c.id === selectedCatId);
    if (matched) {
      setCategory(matched.name);
      if (matched.productType) {
        setProductType(matched.productType);
      }
    } else {
      setCategory('অনলাইন কোর্সসমূহ');
      setProductType('Full Course');
    }
  };

  // 1. Media Upload State
  const [videoUrl, setVideoUrl] = useState('');
  const [videoSourceType, setVideoSourceType] = useState<'file' | 'youtube'>('file');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [isDragOverVideo, setIsDragOverVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingFileName, setUploadingFileName] = useState<string>('');

  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isDragOverThumb, setIsDragOverThumb] = useState(false);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Helper to parse YouTube URLs into embed links
  const parseYouTubeEmbed = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  // Preset Image Options for quick selection
  const presetThumbnails = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800',
  ];

  const presetGallery = [
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
  ];

  // 2. Description State & Rich Text
  const [description, setDescription] = useState('');
  const [editorMode, setEditorMode] = useState<'visual' | 'code' | 'preview'>('visual');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 3. What You Will Learn State
  const [learnPoints, setLearnPoints] = useState<string[]>([
    'এইচটিএমএল৫, সিএসএস৩ ও টেলউইন্ড সিএসএস এর মাস্টার ক্লাস',
    'রিয়্যাক্ট ১৯ ও নেক্সট জেএস দিয়ে প্রফেশনাল ওয়েব অ্যাপ তৈরি',
    'নোড জেএস, এক্সপ্রেস ও মঙ্গোডিবি ব্যাকএন্ড ডাটাবেস হ্যান্ডলিং',
    'রিয়েল-টাইম পেমেন্ট গেটওয়ে ইন্টিগ্রেশন (বিকাশ ও নগদ)',
    'প্রোডাকশন লেভেল প্রজেক্ট ডেপ্লয়মেন্ট ও সিডি/সিআই ড্যাশবোর্ড'
  ]);
  const [newLearnInput, setNewLearnInput] = useState('');
  const [editingPointIndex, setEditingPointIndex] = useState<number | null>(null);
  const [editingPointValue, setEditingPointValue] = useState('');

  // 4. Curriculum Modules & Lessons State
  const [modules, setModules] = useState<CurriculumModule[]>([
    {
      id: 'mod-1',
      title: 'মডিউল ১: এনভায়রনমেন্ট সেটআপ ও বেসিক ফান্ডামেন্টালস',
      lessons: [
        { id: 'les-1-1', title: '১.১ কোর্স পরিচিতি ও রোডম্যাপ', duration: '১০ মিনিট', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', isPreview: true },
        { id: 'les-1-2', title: '১.২ ভিএস কোড ও এক্সটেনশন ইনস্টলেশন', duration: '১৫ মিনিট', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', isPreview: false },
        { id: 'les-1-৩', title: '১.৩ গিটহাব প্রজেক্ট সেটআপ', duration: '১৮ মিনিট', videoUrl: '', isPreview: false },
      ]
    },
    {
      id: 'mod-2',
      title: 'মডিউল ২: ফ্রন্টএন্ড আর্কিটেকচার ও রিয়্যাক্ট কম্পোনেন্ট',
      lessons: [
        { id: 'les-2-1', title: '২.১ রিয়্যাক্ট জেএসএক্স ও স্টেট হ্যান্ডলিং', duration: '২৫ মিনিট', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', isPreview: true },
        { id: 'les-2-2', title: '২.২ টেলউইন্ড সিএসএস রেসপন্সিভ ডিজাইন', duration: '২০ মিনিট', videoUrl: '', isPreview: false }
      ]
    }
  ]);
  const [newModuleName, setNewModuleName] = useState('');
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string>('mod-1');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('১৫ মিনিট');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonIsPreview, setNewLessonIsPreview] = useState(false);

  // 5. Course Features State
  const [videoHours, setVideoHours] = useState('৩৬+ ঘন্টা');
  const [hasProjects, setHasProjects] = useState(true);
  const [projectsCount, setProjectsCount] = useState('৬টি বাস্তব প্রজেক্ট');
  const [deviceMobile, setDeviceMobile] = useState(true);
  const [deviceDesktop, setDeviceDesktop] = useState(true);
  const [hasCertificate, setHasCertificate] = useState(true);
  const [hasLifetimeAccess, setHasLifetimeAccess] = useState(true);
  const [deliveryEmail, setDeliveryEmail] = useState(true);
  const [deliveryWhatsapp, setDeliveryWhatsapp] = useState(true);

  // 6. Instructor State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('inst-1');
  const [instructorName, setInstructorName] = useState('Yasin Arfat');
  const [instructorRole, setInstructorRole] = useState('Lead Full Stack Specialist');
  const [instructorExp, setInstructorExp] = useState('6+ Years Experience');
  const [instructorBio, setInstructorBio] = useState('প্রফেশনাল সফটওয়্যার প্রকৌশলী ও মেন্টর। হাজারো শিক্ষার্থীকে সফলভাবে ফুলস্ট্যাক ডেভেলপমেন্টে গাইড করার অভিজ্ঞতা রয়েছে।');
  const [instructorAvatar, setInstructorAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
  const [socialFb, setSocialFb] = useState('https://facebook.com/yasin');
  const [socialYt, setSocialYt] = useState('https://youtube.com/@yasin');
  const [socialLi, setSocialLi] = useState('https://linkedin.com/in/yasin');

  // 7. Reviews Management State
  const [reviewsList, setReviewsList] = useState<CourseReviewItem[]>([
    {
      id: 'rev-1',
      userName: 'তানভীর হোসেন',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
      rating: 5,
      comment: 'অসাধারণ কোর্স! এত চমৎকার ও সহজ ভাষায় বাংলায় রিয়্যাক্ট বোঝানো হয়েছে যা আর কোথাও দেখিনি।',
      date: '১৬ জুলাই, ২০২৬',
      status: 'approved'
    },
    {
      id: 'rev-2',
      userName: 'মেহেদী হাসান',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      rating: 5,
      comment: 'সাপোর্ট এবং লাইভ প্রজেক্ট গাইডলাইনগুলোর জন্য ৫ স্টার দেওয়া বাধ্যবাধকতা। ধন্যবাদ ভাইয়া!',
      date: '২০ জুলাই, ২০২৬',
      status: 'approved'
    },
    {
      id: 'rev-3',
      userName: 'আরিফুর রহমান',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      rating: 4,
      comment: 'কোর্স কন্টেন্ট খুব রিচ। মডিউল ৩ এ আরও দুটো লাইভ ব্যাকএন্ড ভিডিও থাকলে ১০/১০ হতো।',
      date: '২২ জুলাই, ২০২৬',
      status: 'approved'
    },
    {
      id: 'rev-4',
      userName: 'সাবিহা সুলতানা',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      rating: 5,
      comment: 'আমি একদম বিগিনার থেকে শুরু করেছিলাম, এখন নিজের পোর্টফোলিও সাইট সম্পূর্ণ নিজে বানাতে পারি!',
      date: '২৪ জুলাই, ২০২৬',
      status: 'pending'
    }
  ]);

  // Form for manually adding new review
  const [newRevName, setNewRevName] = useState('');
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevComment, setNewRevComment] = useState('');

  // Load product data when editing or reset when adding
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setTitle(productToEdit.title || '');
        const catId = productToEdit.categoryId || categories.find((c) => c.name.toLowerCase() === (productToEdit.category || '').toLowerCase())?.id || categories[0]?.id || 'courses';
        setCategoryId(catId);
        
        const matched = categories.find((c) => c.id === catId);
        if (matched) {
          setCategory(matched.name);
          if (matched.productType) {
            setProductType(matched.productType);
          }
        } else {
          setCategory(productToEdit.category || categories[0]?.name || 'অনলাইন কোর্সসমূহ');
          setProductType('Full Course');
        }

        setLanguage((productToEdit.language as any) || 'Bangla');
        setOriginalPrice(productToEdit.originalPrice || 1200);
        setDiscountPrice(productToEdit.discountPrice || 699);
        setStudentsCount(productToEdit.studentsCount || 150);
        setDescription(productToEdit.description || '');

        // Download link / Video URL
        const vUrl = productToEdit.videoUrl || '';
        setVideoUrl(vUrl);
        setDownloadUrl(vUrl);
        if (vUrl.includes('youtube.com') || vUrl.includes('youtu.be')) {
          setVideoSourceType('youtube');
          setYoutubeInput(vUrl);
        } else {
          setVideoSourceType('file');
          setYoutubeInput('');
        }

        setThumbnailUrl(productToEdit.thumbnailUrl || '');
        setGalleryImages(productToEdit.galleryImages || []);
        setLearnPoints(productToEdit.whatYouWillLearn || ['মৌলিক ও অ্যাডভান্সড স্কিল শেখা', 'বাস্তব প্রজেক্ট বিল্ড করা']);
        
        // Features
        if (productToEdit.features) {
          setVideoHours(productToEdit.features.videoHours || '৩৬+ ঘন্টা');
          setHasProjects(productToEdit.features.hasProjects ?? true);
          setProjectsCount(productToEdit.features.projectsCount || '৬টি প্রজেক্ট');
          setDeviceMobile(productToEdit.features.mobileAccess ?? true);
          setDeviceDesktop(productToEdit.features.desktopAccess ?? true);
          setHasCertificate(productToEdit.features.certificate ?? true);
          setHasLifetimeAccess(productToEdit.features.lifetimeAccess ?? true);
          
          const methods = productToEdit.features.deliveryMethods || ['email', 'whatsapp'];
          setDeliveryEmail(methods.includes('email'));
          setDeliveryWhatsapp(methods.includes('whatsapp'));
        }

        // Instructor
        if (productToEdit.instructor) {
          setInstructorName(productToEdit.instructor.name || '');
          setInstructorRole(productToEdit.instructor.role || '');
          setInstructorExp(productToEdit.instructor.experience || '');
          setInstructorBio(productToEdit.instructor.bio || '');
          setInstructorAvatar(productToEdit.instructor.avatar || PRESET_INSTRUCTORS[0].avatar);
          setSocialFb(productToEdit.instructor.socials?.facebook || '');
          setSocialYt(productToEdit.instructor.socials?.youtube || '');
          setSocialLi(productToEdit.instructor.socials?.linkedin || '');
        }

        // Modules
        if (productToEdit.curriculumModules && productToEdit.curriculumModules.length > 0) {
          setModules(productToEdit.curriculumModules);
          setActiveModuleForLesson(productToEdit.curriculumModules[0].id);
        }

        // Reviews
        if (productToEdit.courseReviews && productToEdit.courseReviews.length > 0) {
          setReviewsList(productToEdit.courseReviews);
        }
        // Simple Product States
        setDeliveryMethodType(productToEdit.deliveryMethodType || 'file');
        setFileDownloadUrl(productToEdit.fileDownloadUrl || productToEdit.videoUrl || '');
        setExternalAccessLink(productToEdit.externalAccessLink || productToEdit.videoUrl || '');
        setUploadedFileName(productToEdit.fileDownloadUrl ? 'product-file.zip' : '');
        setTagsInput((productToEdit.tags || []).join(', '));
        setProductStatus(productToEdit.status || 'Published');

        // Premium Resource States
        setResourceBadgeText(productToEdit.resourceBadgeText || '');
        setResourceHighlight1Count(productToEdit.resourceHighlight1Count || '');
        setResourceHighlight1Label(productToEdit.resourceHighlight1Label || '');
        setResourceHighlight2Count(productToEdit.resourceHighlight2Count || '');
        setResourceHighlight2Label(productToEdit.resourceHighlight2Label || '');
        setResourceHighlight3Count(productToEdit.resourceHighlight3Count || '');
        setResourceHighlight3Label(productToEdit.resourceHighlight3Label || '');
      } else {
        // RESET FORM CLEANLY FOR NEW PRODUCT CREATION
        setTitle('');

        // Premium Resource States
        setResourceBadgeText('');
        setResourceHighlight1Count('');
        setResourceHighlight1Label('');
        setResourceHighlight2Count('');
        setResourceHighlight2Label('');
        setResourceHighlight3Count('');
        setResourceHighlight3Label('');
        const defaultCat = categories[0]?.name || 'অনলাইন কোর্সসমূহ';
        setCategory(defaultCat);
        setCategoryId(categories[0]?.id || 'courses');
        const defaultType = categories[0]?.productType || 'Full Course';
        setProductType(defaultType);
        setDownloadUrl('');
        setDeliveryMethodType('file');
        setFileDownloadUrl('');
        setExternalAccessLink('');
        setUploadedFileName('');
        setTagsInput('');
        setProductStatus('Published');
        setLanguage('Bangla');
        setOriginalPrice(1200);
        setDiscountPrice(699);
        setStudentsCount(100);
        setDescription('');
        setVideoUrl('');
        setVideoSourceType('file');
        setYoutubeInput('');
        setThumbnailUrl('');
        setGalleryImages([]);
        setLearnPoints([
          'এইচটিএমএল৫, সিএসএস৩ ও টেলউইন্ড সিএসএস এর মাস্টার ক্লাস',
          'রিয়্যাক্ট ১৯ ও নেক্সট জেএস দিয়ে প্রফেশনাল ওয়েব অ্যাপ তৈরি'
        ]);
        setModules([
          {
            id: 'mod-1',
            title: 'মডিউল ১: এনভায়রনমেন্ট সেটআপ ও বেসিক ফান্ডামেন্টালস',
            lessons: [
              { id: 'les-1-1', title: '১.১ কোর্স পরিচিতি ও রোডম্যাপ', duration: '১০ মিনিট', videoUrl: '', isPreview: true }
            ]
          }
        ]);
        setReviewsList([]);
      }
    }
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  // --- 1. MEDIA UPLOAD HANDLERS ---
  const handleDeviceVideoUpload = (file: File) => {
    if (!file || !file.type.startsWith('video/')) {
      alert('দয়া করে সঠিক ভিডিও ফাইল (MP4, WEBM, MOV) নির্বাচন করুন');
      return;
    }

    setUploadingFileName(file.name);
    setUploadProgress(10);

    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percent);
      }
    };

    reader.onload = (e) => {
      if (e.target?.result) {
        setVideoUrl(e.target.result as string);
        setUploadProgress(100);
        setTimeout(() => {
          setUploadProgress(null);
          setUploadingFileName('');
        }, 300);
      }
    };

    reader.onerror = () => {
      alert('ভিডিও ফাইল প্রসেস করতে সমস্যা হয়েছে, আবার চেষ্টা করুন');
      setUploadProgress(null);
      setUploadingFileName('');
    };

    reader.readAsDataURL(file);
  };

  const handleCoverImageUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('দয়া করে একটি ইমেজ ফাইল (JPG, PNG, WEBP) নির্বাচন করুন');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setThumbnailUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryImageUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setGalleryImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddGalleryImage = (urlToAdd?: string) => {
    const targetUrl = urlToAdd || newGalleryUrl;
    if (!targetUrl.trim()) return;
    setGalleryImages([...galleryImages, targetUrl.trim()]);
    if (!urlToAdd) setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleMoveGalleryImage = (index: number, direction: 'left' | 'right') => {
    if (
      (direction === 'left' && index === 0) ||
      (direction === 'right' && index === galleryImages.length - 1)
    ) return;

    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    const updated = [...galleryImages];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setGalleryImages(updated);
  };

  // --- 2. RICH TEXT EDITOR HANDLERS ---
  const applyRichTextFormat = (tagStart: string, tagEnd: string = '') => {
    if (!textareaRef.current) {
      setDescription((prev) => `${prev}\n${tagStart}আপনার টেক্সট${tagEnd}`);
      return;
    }

    const input = textareaRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selectedText = description.substring(start, end);
    const textToInsert = selectedText ? `${tagStart}${selectedText}${tagEnd}` : `${tagStart}আপনার টেক্সট${tagEnd}`;

    const newText = description.substring(0, start) + textToInsert + description.substring(end);
    setDescription(newText);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + tagStart.length, end + tagStart.length);
    }, 50);
  };

  // --- 3. WHAT YOU WILL LEARN HANDLERS ---
  const handleAddLearnPoint = () => {
    if (!newLearnInput.trim()) return;
    setLearnPoints([...learnPoints, newLearnInput.trim()]);
    setNewLearnInput('');
  };

  const handleRemoveLearnPoint = (index: number) => {
    setLearnPoints(learnPoints.filter((_, i) => i !== index));
  };

  const handleMoveLearnPoint = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === learnPoints.length - 1)
    ) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...learnPoints];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setLearnPoints(updated);
  };

  const handleSaveEditedPoint = (index: number) => {
    if (!editingPointValue.trim()) return;
    const updated = [...learnPoints];
    updated[index] = editingPointValue.trim();
    setLearnPoints(updated);
    setEditingPointIndex(null);
    setEditingPointValue('');
  };

  // --- 4. CURRICULUM MODULES & LESSONS HANDLERS ---
  const handleAddModule = () => {
    if (!newModuleName.trim()) return;
    const newMod: CurriculumModule = {
      id: `mod-${Date.now()}`,
      title: newModuleName.trim(),
      lessons: []
    };
    setModules([...modules, newMod]);
    setActiveModuleForLesson(newMod.id);
    setNewModuleName('');
  };

  const handleRemoveModule = (modId: string) => {
    setModules(modules.filter(m => m.id !== modId));
  };

  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === modules.length - 1)
    ) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...modules];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setModules(updated);
  };

  const handleAddLessonToModule = (modId: string) => {
    if (!newLessonTitle.trim()) return;
    const updated = modules.map(m => {
      if (m.id === modId) {
        const newLesson: CourseLesson = {
          id: `les-${Date.now()}`,
          title: newLessonTitle.trim(),
          duration: newLessonDuration.trim() || '১০ মিনিট',
          videoUrl: newLessonVideoUrl.trim(),
          isPreview: newLessonIsPreview
        };
        return { ...m, lessons: [...m.lessons, newLesson] };
      }
      return m;
    });
    setModules(updated);
    setNewLessonTitle('');
    setNewLessonVideoUrl('');
  };

  const handleRemoveLesson = (modId: string, lessonId: string) => {
    const updated = modules.map(m => {
      if (m.id === modId) {
        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
      }
      return m;
    });
    setModules(updated);
  };

  const handleMoveLesson = (modId: string, lessonIdx: number, direction: 'up' | 'down') => {
    const updated = modules.map(m => {
      if (m.id === modId) {
        if (
          (direction === 'up' && lessonIdx === 0) ||
          (direction === 'down' && lessonIdx === m.lessons.length - 1)
        ) return m;

        const targetIdx = direction === 'up' ? lessonIdx - 1 : lessonIdx + 1;
        const copyLessons = [...m.lessons];
        const temp = copyLessons[lessonIdx];
        copyLessons[lessonIdx] = copyLessons[targetIdx];
        copyLessons[targetIdx] = temp;
        return { ...m, lessons: copyLessons };
      }
      return m;
    });
    setModules(updated);
  };

  // --- 6. INSTRUCTOR SELECTION HANDLERS ---
  const handleSelectPresetInstructor = (instId: string) => {
    setSelectedPresetId(instId);
    if (instId === 'custom') {
      // Clear for new instructor
      setInstructorName('');
      setInstructorRole('');
      setInstructorExp('');
      setInstructorBio('');
      setInstructorAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
      setSocialFb('');
      setSocialYt('');
      setSocialLi('');
      return;
    }

    const found = PRESET_INSTRUCTORS.find(i => i.id === instId);
    if (found) {
      setInstructorName(found.name);
      setInstructorRole(found.role);
      setInstructorExp(found.experience);
      setInstructorBio(found.bio || '');
      setInstructorAvatar(found.avatar);
      setSocialFb(found.socials?.facebook || '');
      setSocialYt(found.socials?.youtube || '');
      setSocialLi(found.socials?.linkedin || '');
    }
  };

  // --- 7. REVIEW MANAGEMENT HANDLERS ---
  const handleUpdateReviewStatus = (id: string, newStatus: 'approved' | 'rejected' | 'hidden') => {
    setReviewsList(reviewsList.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleDeleteReview = (id: string) => {
    setReviewsList(reviewsList.filter(r => r.id !== id));
  };

  const handleAddNewReview = () => {
    if (!newRevName.trim() || !newRevComment.trim()) return;
    const newRev: CourseReviewItem = {
      id: `rev-${Date.now()}`,
      userName: newRevName.trim(),
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
      rating: newRevRating,
      comment: newRevComment.trim(),
      date: 'আজকে',
      status: 'approved'
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewRevName('');
    setNewRevComment('');
  };

  // Rating Stats Calculation
  const approvedReviews = reviewsList.filter(r => r.status === 'approved' || r.status === 'pending');
  const totalReviewsCount = approvedReviews.length;
  const avgRating = totalReviewsCount > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = approvedReviews.filter(r => r.rating === stars).length;
    const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
    return { stars, count, percentage };
  });

  // --- SUBMIT FINAL COURSE FORM ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const calculatedDiscount = originalPrice > discountPrice
      ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
      : 0;

    const deliveryMethods: string[] = [];
    if (deliveryEmail) deliveryMethods.push('email');
    if (deliveryWhatsapp) deliveryMethods.push('whatsapp');

    const matchedCat = categories.find((c) => c.id === categoryId);
    const finalCategoryName = matchedCat ? matchedCat.name : (category || 'অনলাইন কোর্সসমূহ');
    const finalCategoryId = categoryId || 'courses';

    const updatedCourse: Course = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      title: title || 'নতুন ডিজিটাল এডুকেশনাল কোর্স',
      category: finalCategoryName,
      categoryId: finalCategoryId,
      rating: Number(avgRating),
      reviewCount: totalReviewsCount > 0 ? totalReviewsCount : 12,
      originalPrice: Number(originalPrice) || 1200,
      discountPrice: Number(discountPrice) || 699,
      discountPercentage: calculatedDiscount,
      thumbnailTheme: 'webdev',
      studentsCount: Number(studentsCount) || 100,
      lastUpdated: 'July 2026',
      language,
      access: hasLifetimeAccess ? 'Lifetime Access' : '1 Year Access',
      certificate: hasCertificate,
      description: description || 'কোর্সের বিস্তারিত বিবরণী।',
      whatYouWillLearn: learnPoints,
      features: {
        videoHours,
        hasProjects,
        projectsCount: hasProjects ? projectsCount : 'প্রজেক্ট নেই',
        lifetimeAccess: hasLifetimeAccess,
        certificate: hasCertificate,
        mobileAccess: deviceMobile,
        desktopAccess: deviceDesktop,
        deliveryMethods
      },
      instructor: {
        name: instructorName || 'Yasin Arfat',
        role: instructorRole || 'Instructor',
        experience: instructorExp || '5+ Years',
        bio: instructorBio,
        avatar: instructorAvatar || PRESET_INSTRUCTORS[0].avatar,
        socials: {
          facebook: socialFb,
          youtube: socialYt,
          linkedin: socialLi
        }
      },
      videoUrl: deliveryMethodType === 'file' ? (fileDownloadUrl || downloadUrl) : (externalAccessLink || downloadUrl),
      thumbnailUrl,
      productType,
      deliveryMethodType,
      fileDownloadUrl: fileDownloadUrl || downloadUrl,
      externalAccessLink: externalAccessLink || downloadUrl,
      tags: tagsInput ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean) : [],
      status: productStatus,
      galleryImages,
      curriculumModules: modules,
      courseReviews: reviewsList,
      resourceBadgeText,
      resourceHighlight1Count,
      resourceHighlight1Label,
      resourceHighlight2Count,
      resourceHighlight2Label,
      resourceHighlight3Count,
      resourceHighlight3Label
    };

    onSave(updatedCourse);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5 overflow-y-auto font-sans">
      <div className="bg-white border border-slate-200/90 rounded-3xl max-w-5xl w-full shadow-2xl text-slate-800 my-auto overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {productToEdit ? `কোর্স এডিট: ${productToEdit.title}` : 'নতুন কোর্স বা ডিজিটাল প্রোডাক্ট যোগ করুন'}
              </h3>
              <p className="text-xs text-slate-500">মিডিয়া, রিচ ডেসক্রিপশন, কারিকুলাম, ফিচার, ইন্সট্রাক্টর, রিভিউ ও প্রাইসিং</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Type Indicator & Override Bar */}
        <div className="px-4 py-2.5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">Product Type:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-black text-[11px] flex items-center gap-1 ${
              productType === 'Full Course' ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {productType === 'Full Course' ? '🎓 Full Course (৮টি বিস্তারিত ট্যাব)' : '📦 Simple Product (হালকা সহজ ফর্ম)'}
            </span>
            <span className="text-[10px] text-slate-400 hidden md:inline">
              (ক্যাটাগরি পরিবর্তনের সাথে সাথে ফর্ম অটোমেটিক পরিবর্তন হয়)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">টাইপ সুইচার:</span>
            <div className="inline-flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setProductType('Full Course')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  productType === 'Full Course' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Full Course
              </button>
              <button
                type="button"
                onClick={() => setProductType('Simple Product')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  productType === 'Simple Product' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Simple Product
              </button>
            </div>
          </div>
        </div>

        {productType === 'Simple Product' ? (
          /* SIMPLE PRODUCT FORM */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs flex-1 bg-white">
            
            {/* Form Top Banner */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-xs sm:text-sm flex items-center gap-2">
                    <span>Simple Product ফর্ম সক্রিয়</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-mono">
                      {category}
                    </span>
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    ই-বুক, সোর্স কোড, ডিজাইন অ্যাসেট, প্রম্পট ও সফটওয়্যারের জন্য হালকা ও সহজ ফর্ম
                  </p>
                </div>
              </div>

              {/* Requirement 8: Publish / Draft Status Toggle */}
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-emerald-200 self-end sm:self-auto">
                <span className="text-[11px] font-bold text-slate-600 pl-1">স্ট্যাটাস:</span>
                <button
                  type="button"
                  onClick={() => setProductStatus('Published')}
                  className={`px-3 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                    productStatus === 'Published'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setProductStatus('Draft')}
                  className={`px-3 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                    productStatus === 'Draft'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>

            {/* Requirement 1 & 4: Basic Info (Title & Category) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-slate-800 font-extrabold text-xs">
                  ১. প্রোডাক্টের নাম / শিরোনাম (Title) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: Clean React Native UI Kit 2026 (Source Code)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-800 font-extrabold text-xs">
                  ৪. ক্যাটাগরি (Category)
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => handleCategoryChangeById(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-bold focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.productType || 'Simple Product'})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="courses">অনলাইন কোর্সসমূহ</option>
                      <option value="ebooks">ই-বুক ও বই</option>
                      <option value="source-code">প্রিমিয়াম রিসোর্স</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Premium Resource Special Panel (Editable Badge and Highlights) */}
            {categoryId === 'source-code' && (
              <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-purple-900">
                  <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                  <h5 className="font-extrabold text-xs sm:text-sm">
                    💎 প্রিমিয়াম রিসোর্স বান্ডেল সেটিংস (Premium Resource Bundle Settings)
                  </h5>
                </div>
                
                <p className="text-[11px] text-purple-800 leading-tight">
                  ক্যাটাগরি "প্রিমিয়াম রিসোর্স" হওয়ায় এই ফিল্ডগুলো সক্রিয় হয়েছে। এখান থেকে আপনি স্ট্যাকড কার্ডের ব্যাজ এবং ডিটেইল পেইজের বড় ৩টি হাইলাইট মান কাস্টমাইজ করতে পারবেন।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Badge Text */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-slate-800 font-extrabold text-[11px]">
                      কার্ডের বড় ব্যাজ টেক্সট (যেমন: ৫০০+ কোর্স বা ১০০০+ রিসোর্স)
                    </label>
                    <input
                      type="text"
                      value={resourceBadgeText}
                      onChange={(e) => setResourceBadgeText(e.target.value)}
                      placeholder="যেমন: ১০০০+ রিসোর্স"
                      className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-slate-900 font-bold text-xs focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  {/* Highlight 1 */}
                  <div className="space-y-1.5 p-3 bg-white/60 border border-purple-100 rounded-xl">
                    <span className="font-extrabold text-[11px] text-purple-950 block">হাইলাইট ১ (Highlight 1):</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold">সংখ্যা (যেমন: ৫০০+ ফাইল)</label>
                        <input
                          type="text"
                          value={resourceHighlight1Count}
                          onChange={(e) => setResourceHighlight1Count(e.target.value)}
                          placeholder="৫০০+ ফাইল"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold">লেবেল (যেমন: রিসোর্স উপাদান)</label>
                        <input
                          type="text"
                          value={resourceHighlight1Label}
                          onChange={(e) => setResourceHighlight1Label(e.target.value)}
                          placeholder="রিসোর্স উপাদান"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Highlight 2 */}
                  <div className="space-y-1.5 p-3 bg-white/60 border border-purple-100 rounded-xl">
                    <span className="font-extrabold text-[11px] text-purple-950 block">হাইলাইট ২ (Highlight 2):</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold">সংখ্যা (যেমন: ১০+ ক্যাটাগরি)</label>
                        <input
                          type="text"
                          value={resourceHighlight2Count}
                          onChange={(e) => setResourceHighlight2Count(e.target.value)}
                          placeholder="১০+ ক্যাটাগরি"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold">লেবেল (যেমন: টপিক কভারেজ)</label>
                        <input
                          type="text"
                          value={resourceHighlight2Label}
                          onChange={(e) => setResourceHighlight2Label(e.target.value)}
                          placeholder="টপিক কভারেজ"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Highlight 3 */}
                  <div className="space-y-1.5 p-3 bg-white/60 border border-purple-100 rounded-xl sm:col-span-2">
                    <span className="font-extrabold text-[11px] text-purple-950 block">হাইলাইট ৩ (Highlight 3):</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold">সংখ্যা (যেমন: ১০০% লাইফটাইম)</label>
                        <input
                          type="text"
                          value={resourceHighlight3Count}
                          onChange={(e) => setResourceHighlight3Count(e.target.value)}
                          placeholder="১০০% লাইফটাইম"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold">লেবেল (যেমন: ডাউনলোড এক্সেস)</label>
                        <input
                          type="text"
                          value={resourceHighlight3Label}
                          onChange={(e) => setResourceHighlight3Label(e.target.value)}
                          placeholder="ডাউনলোড এক্সেস"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Requirement 5: Pricing Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                ৫. মূল্য নির্ধারণ (Pricing & Discounts)
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">নিয়মিত দাম (৳ Regular Price)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">৳</span>
                    <input
                      type="number"
                      required
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-900 font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ডিসকাউন্ট দাম (৳ Special Price)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-emerald-600">৳</span>
                    <input
                      type="number"
                      required
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-emerald-600 font-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <div className="w-full p-2 bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl flex items-center justify-between font-bold text-xs">
                    <span>ছাড়ের হার (Auto %):</span>
                    <span className="bg-emerald-600 text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg">
                      {originalPrice > discountPrice ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0}% OFF
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirement 2: 3 Cover Images Upload / Slider Options */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                ২. ৩টি কভার ইমেজ আপলোড (স্লাইডার আকারে দেখাবে - স্বয়ংক্রিয়ভাবে ফিট হবে)
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cover 1 */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">কভার ইমেজ ১ (মূল থাম্বনেইল)</label>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono text-[10px] focus:outline-none"
                  />
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border">
                    {thumbnailUrl ? (
                      <img src={thumbnailUrl} alt="Cover 1" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">ইমেজ নেই</div>
                    )}
                  </div>
                </div>

                {/* Cover 2 */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">কভার ইমেজ ২ (স্লাইডার)</label>
                  <input
                    type="text"
                    value={galleryImages[0] || ''}
                    onChange={(e) => {
                      const newGallery = [...galleryImages];
                      newGallery[0] = e.target.value;
                      setGalleryImages(newGallery);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono text-[10px] focus:outline-none"
                  />
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border">
                    {galleryImages[0] ? (
                      <img src={galleryImages[0]} alt="Cover 2" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">ঐচ্ছিক (২য় ছবি)</div>
                    )}
                  </div>
                </div>

                {/* Cover 3 */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">কভার ইমেজ ৩ (স্লাইডার)</label>
                  <input
                    type="text"
                    value={galleryImages[1] || ''}
                    onChange={(e) => {
                      const newGallery = [...galleryImages];
                      newGallery[1] = e.target.value;
                      setGalleryImages(newGallery);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono text-[10px] focus:outline-none"
                  />
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border">
                    {galleryImages[1] ? (
                      <img src={galleryImages[1]} alt="Cover 3" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">ঐচ্ছিক (৩য় ছবি)</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Requirement 6: Delivery Method (File Upload vs External Link) */}
            <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-purple-950 text-xs flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-purple-600" />
                  ৬. ডেলিভারি মেথড (Delivery Method & Access Link) <span className="text-rose-500">*</span>
                </h5>
                <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-bold">
                  কেনার পর কাস্টমার এই অ্যাক্সেস পাবে
                </span>
              </div>

              {/* Radio options: File Upload vs External Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setDeliveryMethodType('file')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    deliveryMethodType === 'file'
                      ? 'bg-white border-purple-600 ring-2 ring-purple-200 shadow-sm'
                      : 'bg-white/60 border-purple-100 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery_method"
                    checked={deliveryMethodType === 'file'}
                    onChange={() => setDeliveryMethodType('file')}
                    className="mt-0.5 text-purple-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-extrabold text-slate-900 block text-xs">
                      📁 Direct File Upload (সরাসরি ফাইল আপলোড)
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                      সফটওয়্যার (.exe/.apk), টেমপ্লেট (.docx/.xlsx), ই-বুক (.pdf), জিপ (.zip) ইত্যাদি
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryMethodType('external_link')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    deliveryMethodType === 'external_link'
                      ? 'bg-white border-purple-600 ring-2 ring-purple-200 shadow-sm'
                      : 'bg-white/60 border-purple-100 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery_method"
                    checked={deliveryMethodType === 'external_link'}
                    onChange={() => setDeliveryMethodType('external_link')}
                    className="mt-0.5 text-purple-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-extrabold text-slate-900 block text-xs">
                      🔗 External Link (গুগল ড্রাইভ / টেবিবক্স / মেগা)
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                      Terabox, Google Drive, Mega বা Dropbox এর শেয়ারেবল লিংক পেস্ট করুন
                    </span>
                  </div>
                </label>
              </div>

              {/* Conditional Inputs */}
              {deliveryMethodType === 'file' ? (
                <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-3">
                  <label className="block text-slate-800 font-bold text-xs">
                    ডিভাইস থেকে প্রোডাক্টের ফাইল আপলোড করুন
                  </label>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs cursor-pointer inline-flex items-center justify-center gap-2 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>ফাইল ব্রাউজ করুন (.zip, .pdf, .exe, .apk, .docx)</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setUploadedFileName(file.name);
                            setFileDownloadUrl(`https://storage.cdn.com/files/${file.name}`);
                            setDownloadUrl(`https://storage.cdn.com/files/${file.name}`);
                          }
                        }}
                      />
                    </label>

                    {uploadedFileName && (
                      <span className="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-mono text-[11px] font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>আপলোড প্রস্তুত: {uploadedFileName}</span>
                      </span>
                    )}
                  </div>

                  <div className="pt-1">
                    <label className="block text-slate-600 font-bold text-[11px] mb-1">অথবা ফাইল সিডিএন / ডাউনলোড URL দিন:</label>
                    <input
                      type="text"
                      value={fileDownloadUrl || downloadUrl}
                      onChange={(e) => {
                        setFileDownloadUrl(e.target.value);
                        setDownloadUrl(e.target.value);
                      }}
                      placeholder="https://cdn.example.com/files/software-package-v2.zip"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-2">
                  <label className="block text-slate-800 font-bold text-xs">
                    গুগল ড্রাইভ / টেবিবক্স / মেগা ফাইল শেয়ারিং লিংক
                  </label>
                  <input
                    type="text"
                    value={externalAccessLink || downloadUrl}
                    onChange={(e) => {
                      setExternalAccessLink(e.target.value);
                      setDownloadUrl(e.target.value);
                    }}
                    placeholder="যেমন: https://terabox.com/s/1aBCxyz... অথবা https://drive.google.com/file/d/..."
                    className="w-full bg-slate-50 border border-purple-200 rounded-xl p-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-purple-600"
                  />
                  <p className="text-[10px] text-slate-500">
                    💡 ক্রয় সম্পন্ন করার পর ক্রেতার কাস্টমার ড্যাশবোর্ডে ও ইমেইলে এই লিংকটি স্বয়ংক্রিয়ভাবে দেওয়া হবে।
                  </p>
                </div>
              )}
            </div>

            {/* Requirement 1: Rich Text Description Box (Large, no character limit, bullet points, links) */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <label className="block text-slate-800 font-extrabold text-xs">
                  ৩. প্রোডাক্ট বিবরণী (Rich Text / বিস্তারিত বিবরণ - কোনো ক্যারেক্টার লিমিট নেই)
                </label>
                
                {/* Rich Format Helpers */}
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDescription((prev) => prev + '\n• ')}
                    className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold rounded-lg text-[10px] cursor-pointer flex items-center gap-1"
                  >
                    <span>• বুলেট পয়েন্ট</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription((prev) => prev + ' **বোল্ড টেক্সট** ')}
                    className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold rounded-lg text-[10px] cursor-pointer"
                  >
                    <b>B</b> বোল্ড
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription((prev) => prev + ' [লিংক টেক্সট](https://example.com) ')}
                    className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold rounded-lg text-[10px] cursor-pointer"
                  >
                    🔗 লিংক
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription((prev) => prev + '\n### নতুন সেকশন শিরোনাম\n')}
                    className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold rounded-lg text-[10px] cursor-pointer"
                  >
                    📑 হেডিং
                  </button>
                </div>
              </div>

              <textarea
                rows={12}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="প্রোডাক্টের বিস্তারিত বিবরণ লিখুন (লম্বা লেখা, বুলেট পয়েন্ট, লিংক ইত্যাদি দিতে পারবেন)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-xs leading-relaxed focus:outline-none focus:border-purple-600 font-sans shadow-inner"
              />
              <p className="text-[10px] text-slate-400 font-medium">
                💡 টিপস: উপরের বাটনগুলো ব্যবহার করে খুব সহজেই বুলেট পয়েন্ট, বোল্ড টেক্সট এবং হাইপারলিংক যুক্ত করতে পারেন।
              </p>
            </div>

            {/* Requirement 7: Tags / Keywords (Optional for search) */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-slate-800 font-extrabold text-xs">
                ৭. ট্যাগ / কীওয়ার্ড (Tags & Search Keywords - optional)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="কমা দিয়ে পৃথক করুন: React, Source Code, E-book, Template, UI Kit"
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs focus:outline-none focus:border-emerald-600"
              />

              {/* Tag Badges Preview */}
              {tagsInput.trim() && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold">ট্যাগ প্রিভিউ:</span>
                  {tagsInput.split(',').map((tag, idx) => {
                    const clean = tag.trim();
                    if (!clean) return null;
                    return (
                      <span key={idx} className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-extrabold text-[10px] flex items-center gap-1">
                        #{clean}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{productToEdit ? 'Save & Update Product' : 'Save & Publish Product'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* FULL COURSE FORM (8 TABS) */
          <>
            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-1 overflow-x-auto p-2 bg-slate-100 border-b border-slate-200 text-xs font-bold scrollbar-none">
          {[
            { id: 'media', label: '১. মিডিয়া আপলোড', icon: Video },
            { id: 'desc', label: '২. বিবরণ (Description)', icon: FileText },
            { id: 'learn', label: '৩. যা শিখবেন', icon: CheckSquare, badge: learnPoints.length },
            { id: 'curriculum', label: '৪. কারিকুলাম', icon: List, badge: `${modules.length} মডিউল` },
            { id: 'features', label: '৫. কোর্স ফিচার', icon: Award },
            { id: 'instructor', label: '৬. ইন্সট্রাক্টর', icon: User },
            { id: 'reviews', label: '৭. রিভিউ', icon: Star, badge: reviewsList.length },
            { id: 'pricing', label: '৮. প্রাইসিং', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#7C3AED] text-white shadow-md font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-purple-800 text-purple-100' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs flex-1 bg-white">

          {/* TAB 1: MEDIA UPLOAD */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-fade-in">

              {/* VIDEO SECTION */}
              <div className="p-5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Video className="w-4 h-4 text-purple-600" />
                      কোর্স / প্রোডাক্ট প্রিভিউ ভিডিও
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      শুধুমাত্র ডিভাইস থেকে ভিডিও ফাইল আপলোড করুন অথবা ইউটিউব ভিডিও লিংক ব্যবহার করুন
                    </p>
                  </div>

                  {videoUrl && (
                    <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-lg text-[10px] flex items-center gap-1 self-start sm:self-auto">
                      <CheckCircle className="w-3.5 h-3.5" /> ভিডিও যুক্ত আছে
                    </span>
                  )}
                </div>

                {/* Video Source Type Toggle (Radio Options) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-slate-200/70 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoSourceType('file');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      videoSourceType === 'file'
                        ? 'bg-white text-purple-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span>ডিভাইস থেকে ভিডিও ফাইল (Upload File)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVideoSourceType('youtube');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      videoSourceType === 'youtube'
                        ? 'bg-white text-rose-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Youtube className="w-4 h-4 text-rose-600" />
                    <span>ইউটিউব ভিডিও লিংক (YouTube Link)</span>
                  </button>
                </div>

                {/* Option A: Device Video Upload */}
                {videoSourceType === 'file' && (
                  <div className="space-y-3">
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOverVideo(true);
                      }}
                      onDragLeave={() => setIsDragOverVideo(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOverVideo(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleDeviceVideoUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-3 transition-all ${
                        isDragOverVideo
                          ? 'border-purple-600 bg-purple-50/70 scale-[1.01]'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <Video className="w-8 h-8 text-purple-600 mx-auto" />
                      <div>
                        <div className="text-slate-800 font-bold text-xs">
                          ডিভাইস থেকে ভিডিও ফাইল এখানে ড্রপ করুন অথবা ব্রাউজ করুন
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          সমর্থিত ফরম্যাট: MP4, MOV, WEBM
                        </p>
                      </div>

                      <div className="flex justify-center pt-1">
                        <label className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs transition-all">
                          <Upload className="w-4 h-4" />
                          <span>ডিভাইস থেকে ভিডিও বেছে নিন</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleDeviceVideoUpload(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Video Upload Progress Bar */}
                    {uploadProgress !== null && (
                      <div className="p-4 bg-white border border-purple-200 rounded-xl space-y-2 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>ফাইল প্রসেসিং হচ্ছে: {uploadingFileName}</span>
                          <span className="font-mono text-purple-700">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="bg-purple-600 h-full transition-all duration-200 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Device Uploaded Video Player Preview */}
                    {videoUrl && !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be') && (
                      <div className="bg-white border border-slate-200 rounded-2xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">
                            আপলোডকৃত ভিডিও প্রিভিউ:
                          </span>
                          <button
                            type="button"
                            onClick={() => setVideoUrl('')}
                            className="text-rose-600 hover:underline font-bold text-xs cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> মুছে ফেলুন
                          </button>
                        </div>
                        <div className="rounded-xl overflow-hidden bg-black max-h-64 flex items-center justify-center">
                          <video src={videoUrl} controls className="w-full max-h-64 object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Option B: YouTube Link */}
                {videoSourceType === 'youtube' && (
                  <div className="space-y-3 bg-white p-4 border border-slate-200 rounded-2xl">
                    <div>
                      <label className="block text-slate-800 font-bold mb-1">
                        ইউটিউব ভিডিও URL দিন:
                      </label>
                      <input
                        type="text"
                        value={youtubeInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setYoutubeInput(val);
                          const embed = parseYouTubeEmbed(val);
                          setVideoUrl(embed);
                        }}
                        placeholder="https://www.youtube.com/watch?v=EXAMPLE_ID"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-rose-500"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        ইউটিউবের যেকোনো ভিডিও লিংক পেস্ট করুন (যেমন: https://youtu.be/... অথবা https://www.youtube.com/watch?v=...)
                      </p>
                    </div>

                    {/* YouTube Embed Preview */}
                    {videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) && (
                      <div className="space-y-2">
                        <span className="font-bold text-slate-800 text-xs block">
                          ইউটিউব প্লেয়ার প্রিভিউ:
                        </span>
                        <div className="aspect-video w-full max-h-64 rounded-xl overflow-hidden border border-slate-200 bg-black">
                          <iframe
                            src={parseYouTubeEmbed(videoUrl)}
                            title="YouTube Preview"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* COVER THUMBNAIL IMAGE SECTION */}
              <div className="p-5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    কভার থাম্বনেইল ইমেজ (Cover Image)
                  </h4>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                    ডিভাইস থেকে আপলোড করুন
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Device Image Uploader */}
                  <div className="md:col-span-2 space-y-3">
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOverThumb(true);
                      }}
                      onDragLeave={() => setIsDragOverThumb(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOverThumb(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleCoverImageUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      className={`border-2 border-dashed rounded-2xl p-5 text-center space-y-2 transition-all ${
                        isDragOverThumb
                          ? 'border-purple-600 bg-purple-50 scale-[1.01]'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <ImageIcon className="w-7 h-7 text-purple-600 mx-auto" />
                      <div className="text-slate-800 font-bold text-xs">
                        ডিভাইস থেকে কভার ফটো ড্রপ করুন অথবা ব্রাউজ করুন
                      </div>
                      <p className="text-[10px] text-slate-500">
                        সমর্থিত: JPG, PNG, WEBP, GIF
                      </p>

                      <div className="flex justify-center pt-1">
                        <label className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>ডিভাইস থেকে ইমেজ বেছে নিন</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleCoverImageUpload(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Optional Direct URL input as alternative */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        অথবা সরাসরি ইমেজ লিঙ্ক (URL):
                      </label>
                      <input
                        type="text"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono text-[11px] focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Live Preview */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">
                      কভার ফটো প্রিভিউ:
                    </span>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
                      {thumbnailUrl ? (
                        <>
                          <img
                            src={thumbnailUrl}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setThumbnailUrl('')}
                            className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700 cursor-pointer shadow-md"
                            title="Remove Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-semibold text-xs">
                          কোনো কভার ইমেজ দেওয়া হয়নি
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* GALLERY IMAGES SECTION */}
              <div className="p-5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <ImagePlus className="w-4 h-4 text-purple-600" />
                    গ্যালারি ইমেজ (Gallery Images)
                  </h4>
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 font-extrabold rounded-full text-[10px]">
                    {galleryImages.length}টি ইমেজ
                  </span>
                </div>

                {/* Device Gallery Upload Button */}
                <div className="flex flex-col sm:flex-row gap-3 items-center bg-white p-4 border border-slate-200 rounded-2xl">
                  <label className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>ডিভাইস থেকে গ্যালারি ইমেজ আপলোড করুন</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleGalleryImageUpload(e.target.files);
                        }
                      }}
                    />
                  </label>

                  <div className="flex-1 w-full flex gap-2">
                    <input
                      type="text"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="অথবা ইমেজ URL দিন..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs focus:outline-none focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddGalleryImage()}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 rounded-xl flex items-center gap-1 cursor-pointer text-xs"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>

                {/* Gallery Images Grid */}
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {galleryImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-xl p-1.5 space-y-1.5 relative group shadow-xs"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx}`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 bg-slate-900/80 text-white font-mono text-[9px] px-1.5 py-0.2 rounded">
                            #{idx + 1}
                          </span>
                        </div>

                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, 'left')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-slate-100 hover:bg-purple-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                              title="Move Left"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, 'right')}
                              disabled={idx === galleryImages.length - 1}
                              className="p-1 rounded bg-slate-100 hover:bg-purple-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                              title="Move Right"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Remove Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    কোনো গ্যালারি ছবি যুক্ত করা হয়নি
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: DESCRIPTION (RICH TEXT EDITOR) */}
          {activeTab === 'desc' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    "এই কোর্সটি সম্পর্কে" বিবরণী (Rich Text Editor)
                  </h4>
                  <p className="text-[11px] text-slate-500">বোল্ড, বুলেট পয়েন্ট, হেডিং ও ফরম্যাটিং টুলস</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl text-[11px] font-bold border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditorMode('visual')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      editorMode === 'visual' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Visual Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('code')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      editorMode === 'code' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    HTML Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      editorMode === 'preview' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Live Preview
                  </button>
                </div>
              </div>

              {editorMode !== 'preview' && (
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 border border-slate-200 rounded-t-2xl text-slate-700">
                  <button type="button" onClick={() => applyRichTextFormat('<b>', '</b>')} className="p-1.5 hover:bg-slate-200 rounded font-bold cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => applyRichTextFormat('<i>', '</i>')} className="p-1.5 hover:bg-slate-200 rounded cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => applyRichTextFormat('<u>', '</u>')} className="p-1.5 hover:bg-slate-200 rounded cursor-pointer"><Underline className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => applyRichTextFormat('<s>', '</s>')} className="p-1.5 hover:bg-slate-200 rounded cursor-pointer"><Strikethrough className="w-3.5 h-3.5" /></button>
                  <div className="w-px h-4 bg-slate-300 mx-1" />
                  <button type="button" onClick={() => applyRichTextFormat('<h2>', '</h2>')} className="px-1.5 py-0.5 hover:bg-slate-200 rounded font-black cursor-pointer">H2</button>
                  <button type="button" onClick={() => applyRichTextFormat('<h3>', '</h3>')} className="px-1.5 py-0.5 hover:bg-slate-200 rounded font-black cursor-pointer">H3</button>
                  <div className="w-px h-4 bg-slate-300 mx-1" />
                  <button type="button" onClick={() => applyRichTextFormat('\n• ')} className="p-1.5 hover:bg-slate-200 rounded cursor-pointer"><List className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => applyRichTextFormat('\n1. ')} className="p-1.5 hover:bg-slate-200 rounded cursor-pointer"><ListOrdered className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => applyRichTextFormat('<blockquote>', '</blockquote>')} className="p-1.5 hover:bg-slate-200 rounded cursor-pointer"><Quote className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => applyRichTextFormat('<code>', '</code>')} className="p-1.5 hover:bg-slate-200 rounded cursor-pointer"><Code className="w-3.5 h-3.5" /></button>
                </div>
              )}

              {editorMode === 'visual' && (
                <textarea
                  ref={textareaRef}
                  rows={10}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="এই কোর্সটি সম্পর্কে বিস্তারিত বিবরণ লিখুন..."
                  className="w-full bg-white border border-slate-200 border-t-0 rounded-b-2xl p-4 text-slate-800 focus:outline-none focus:border-purple-600 text-xs leading-relaxed font-sans shadow-inner"
                />
              )}

              {editorMode === 'code' && (
                <textarea
                  rows={10}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-b-2xl p-4 text-emerald-400 focus:outline-none text-xs font-mono leading-relaxed"
                />
              )}

              {editorMode === 'preview' && (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-xs leading-relaxed min-h-[200px]">
                  <div className="whitespace-pre-line font-sans">
                    {description || 'কোনো বিবরণ লেখা হয়নি।'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WHAT YOU WILL LEARN */}
          {activeTab === 'learn' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-purple-600" />
                    যা শিখবেন (What Will You Learn) - ডাইনামিক পয়েন্ট লিস্ট
                  </h4>
                  <p className="text-[11px] text-slate-500">যতগুলো ইচ্ছা পয়েন্ট এড ও রিমুভ করুন</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLearnInput}
                  onChange={(e) => setNewLearnInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLearnPoint(); } }}
                  placeholder="নতুন পয়েন্ট টাইপ করুন (যেমন: নোড জেএস এক্সপ্রেস ব্যাকএন্ড API তৈরি)..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs focus:outline-none focus:border-purple-600"
                />
                <button
                  type="button"
                  onClick={handleAddLearnPoint}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-4 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Point
                </button>
              </div>

              {/* Learn Points List with Inline Edit & Reorder */}
              <div className="space-y-2 pt-1">
                {learnPoints.map((pt, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 group transition-all hover:bg-white hover:border-purple-300"
                  >
                    {editingPointIndex === index ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editingPointValue}
                          onChange={(e) => setEditingPointValue(e.target.value)}
                          className="flex-1 bg-white border border-purple-500 rounded-xl p-1.5 text-xs text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditedPoint(index)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 text-slate-800 font-semibold text-xs flex-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{pt}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleMoveLearnPoint(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-purple-700 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveLearnPoint(index, 'down')}
                        disabled={index === learnPoints.length - 1}
                        className="p-1 text-slate-400 hover:text-purple-700 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingPointIndex(index); setEditingPointValue(pt); }}
                        className="p-1 text-slate-500 hover:text-purple-700 cursor-pointer"
                        title="Edit Point"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveLearnPoint(index)}
                        className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="Remove Point"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CURRICULUM (MODULES & LESSONS) */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <List className="w-4 h-4 text-purple-600" />
                    কারিকুলাম (Curriculum - মডিউল ও লেসন ম্যানেজমেন্ট)
                  </h4>
                  <p className="text-[11px] text-slate-500">অধ্যায় তৈরি করুন এবং লেসন লিংক ও ডিউরেশন যুক্ত করুন</p>
                </div>
              </div>

              {/* Add Module Input */}
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
                <span className="font-bold text-purple-900 text-xs">নতুন মডিউল/অধ্যায় যোগ করুন:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="যেমন: মডিউল ৪: পেমেন্ট গেটওয়ে ইন্টিগ্রেশন (বিকাশ, নগদ API)"
                    className="flex-1 bg-white border border-purple-200 rounded-xl p-2.5 text-slate-800 text-xs focus:outline-none focus:border-purple-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-4 rounded-xl flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Add Module
                  </button>
                </div>
              </div>

              {/* Modules List */}
              <div className="space-y-4">
                {modules.map((module, modIdx) => (
                  <div key={module.id} className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center text-xs">
                          {modIdx + 1}
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{module.title}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-mono font-bold px-2 py-0.5 rounded-md">
                          {module.lessons.length}টি লেসন
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveModule(modIdx, 'up')}
                          disabled={modIdx === 0}
                          className="p-1 text-slate-500 hover:text-purple-700 disabled:opacity-20 cursor-pointer"
                          title="Move Module Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveModule(modIdx, 'down')}
                          disabled={modIdx === modules.length - 1}
                          className="p-1 text-slate-500 hover:text-purple-700 disabled:opacity-20 cursor-pointer"
                          title="Move Module Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(module.id)}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer"
                          title="Delete Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lessons inside Module */}
                    <div className="space-y-2 pl-2">
                      {module.lessons.map((lesson, lesIdx) => (
                        <div
                          key={lesson.id}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Video className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                            <span className="font-semibold text-slate-800">{lesson.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({lesson.duration})</span>
                            {lesson.isPreview && (
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded text-[9px]">
                                ফ্রি প্রিভিউ
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveLesson(module.id, lesIdx, 'up')}
                              disabled={lesIdx === 0}
                              className="p-1 text-slate-400 hover:text-purple-700 disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLesson(module.id, lesIdx, 'down')}
                              disabled={lesIdx === module.lessons.length - 1}
                              className="p-1 text-slate-400 hover:text-purple-700 disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveLesson(module.id, lesson.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Form to add new lesson to this module */}
                      <div className="p-3 bg-white border border-dashed border-slate-300 rounded-xl space-y-2 mt-2">
                        <span className="font-bold text-slate-700 text-[11px] block">+ নতুন লেসন যোগ করুন:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={activeModuleForLesson === module.id ? newLessonTitle : ''}
                            onChange={(e) => {
                              setActiveModuleForLesson(module.id);
                              setNewLessonTitle(e.target.value);
                            }}
                            placeholder="লেসন শিরোনাম"
                            className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 text-[11px]"
                          />
                          <input
                            type="text"
                            value={activeModuleForLesson === module.id ? newLessonDuration : '১৫ মিনিট'}
                            onChange={(e) => {
                              setActiveModuleForLesson(module.id);
                              setNewLessonDuration(e.target.value);
                            }}
                            placeholder="সময় (যেমন: ১৫ মিনিট)"
                            className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 text-[11px]"
                          />
                          <input
                            type="text"
                            value={activeModuleForLesson === module.id ? newLessonVideoUrl : ''}
                            onChange={(e) => {
                              setActiveModuleForLesson(module.id);
                              setNewLessonVideoUrl(e.target.value);
                            }}
                            placeholder="ভিডিও লিংক (ঐচ্ছিক)"
                            className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 text-[11px] font-mono"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-1.5 text-slate-700 font-semibold cursor-pointer text-[11px]">
                            <input
                              type="checkbox"
                              checked={activeModuleForLesson === module.id ? newLessonIsPreview : false}
                              onChange={(e) => {
                                setActiveModuleForLesson(module.id);
                                setNewLessonIsPreview(e.target.checked);
                              }}
                              className="rounded text-purple-600"
                            />
                            ফ্রি ট্রায়াল / ডেমো ক্লাস হিসেবে দেখাবে
                          </label>

                          <button
                            type="button"
                            onClick={() => handleAddLessonToModule(module.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                          >
                            + লেসন সেভ করুন
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COURSE FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    কোর্স বৈশিষ্ট্য ও এক্সেস সেটিংস (Editable Course Features)
                  </h4>
                  <p className="text-[11px] text-slate-500">সময়কাল, প্রজেক্ট সংখ্যা, সার্টিফিকেট, ডিভাইস ও ডেলিভারি অপশন</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 5.1 Video Tutorial Duration */}
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
                  <label className="block text-slate-800 font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    ভিডিও টিউটোরিয়াল সময়কাল (Total Hours)
                  </label>
                  <input
                    type="text"
                    value={videoHours}
                    onChange={(e) => setVideoHours(e.target.value)}
                    placeholder="যেমন: ৩৬+ ঘন্টা"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-purple-600"
                  />
                  <p className="text-[10px] text-slate-500">যেমন: "৩৬+ ঘন্টা" বা "৫০+ ভিডিও লেকচার"</p>
                </div>

                {/* 5.2 Projects Count (Yes/No Toggle + Input) */}
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      বাস্তব প্রজেক্ট অন্তর্ভুক্ত?
                    </label>
                    <button
                      type="button"
                      onClick={() => setHasProjects(!hasProjects)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        hasProjects ? 'bg-purple-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        hasProjects ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {hasProjects && (
                    <input
                      type="text"
                      value={projectsCount}
                      onChange={(e) => setProjectsCount(e.target.value)}
                      placeholder="যেমন: ৬টি বাস্তব প্রজেক্ট"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-purple-600"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 5.3 Device Compatibility Checkboxes */}
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                  <span className="font-bold text-slate-800 block">ডিভাইস কম্প্যাটিবিলিটি (Device Compatibility)</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold">
                      <input
                        type="checkbox"
                        checked={deviceMobile}
                        onChange={(e) => setDeviceMobile(e.target.checked)}
                        className="rounded text-purple-600 w-4 h-4"
                      />
                      <Smartphone className="w-4 h-4 text-purple-600" /> Mobile / Tablet
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold">
                      <input
                        type="checkbox"
                        checked={deviceDesktop}
                        onChange={(e) => setDeviceDesktop(e.target.checked)}
                        className="rounded text-purple-600 w-4 h-4"
                      />
                      <Monitor className="w-4 h-4 text-indigo-600" /> PC / Laptop
                    </label>
                  </div>
                </div>

                {/* 5.4 Language Selection */}
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
                  <label className="block font-bold text-slate-800">কোর্সের ভাষা (Language)</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="Bangla">বাংলা (Bangla)</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 5.5 Certificate Toggle */}
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <div>
                      <span className="font-bold text-slate-900 block">কোর্স শেষ সার্টিফিকেট</span>
                      <p className="text-[10px] text-slate-500">কোর্স শেষ করলে ভেরিফায়েড সার্টিফিকেট প্রদান</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasCertificate(!hasCertificate)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      hasCertificate ? 'bg-purple-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      hasCertificate ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* 5.6 Lifetime Access Toggle */}
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">লাইফটাইম অ্যাক্সেস</span>
                      <p className="text-[10px] text-slate-500">একবার কিনলে আজীবন অ্যাক্সেস থাকবে</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasLifetimeAccess(!hasLifetimeAccess)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      hasLifetimeAccess ? 'bg-purple-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      hasLifetimeAccess ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* 5.7 Delivery Method Multi-select Checkbox */}
              <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                <span className="font-bold text-slate-800 block">অ্যাক্সেস ডেলিভারি মেথড (Delivery Method)</span>
                <div className="flex flex-wrap gap-5 text-slate-700 font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deliveryEmail}
                      onChange={(e) => setDeliveryEmail(e.target.checked)}
                      className="rounded text-purple-600 w-4 h-4"
                    />
                    <Mail className="w-4 h-4 text-purple-600" /> Email এ পাঠানো হবে
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deliveryWhatsapp}
                      onChange={(e) => setDeliveryWhatsapp(e.target.checked)}
                      className="rounded text-purple-600 w-4 h-4"
                    />
                    <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp এ পাঠানো হবে
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: INSTRUCTOR */}
          {activeTab === 'instructor' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    ইন্সট্রাক্টর সিলেক্ট অথবা নতুন প্রোফাইল তৈরি করুন
                  </h4>
                  <p className="text-[11px] text-slate-500">মডেল বা পূর্বের নিবন্ধিত ইন্সট্রাক্টর বেছে নিন</p>
                </div>
              </div>

              {/* Preset Selector */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 block">বিদ্যমান ইন্সট্রাক্টর নির্বাচন করুন:</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {PRESET_INSTRUCTORS.map((inst) => (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => handleSelectPresetInstructor(inst.id!)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        selectedPresetId === inst.id
                          ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-200'
                          : 'border-slate-200 bg-slate-50 hover:bg-white'
                      }`}
                    >
                      <img src={inst.avatar} alt={inst.name} className="w-10 h-10 rounded-full object-cover border border-purple-300" />
                      <div className="overflow-hidden">
                        <div className="font-bold text-slate-900 text-xs truncate">{inst.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{inst.role}</div>
                      </div>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleSelectPresetInstructor('custom')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      selectedPresetId === 'custom'
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-dashed border-slate-300 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <PlusCircle className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">+ নতুন ইন্সট্রাক্টর</div>
                      <div className="text-[10px] text-slate-500">কাস্টম তথ্য দিন</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Instructor Form Fields */}
              <div className="p-5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">ইন্সট্রাক্টরের নাম</label>
                    <input
                      type="text"
                      value={instructorName}
                      onChange={(e) => setInstructorName(e.target.value)}
                      placeholder="e.g. Yasin Arfat"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">পদবী / ডেজিগনেশন</label>
                    <input
                      type="text"
                      value={instructorRole}
                      onChange={(e) => setInstructorRole(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">অভিজ্ঞতা (Experience)</label>
                    <input
                      type="text"
                      value={instructorExp}
                      onChange={(e) => setInstructorExp(e.target.value)}
                      placeholder="e.g. 5+ Years Experience"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">বায়ো / সংক্ষিপ্ত পরিচিতি</label>
                  <textarea
                    rows={3}
                    value={instructorBio}
                    onChange={(e) => setInstructorBio(e.target.value)}
                    placeholder="ইন্সট্রাক্টরের অভিজ্ঞতা ও ক্যারিয়ারের তথ্য..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>

                {/* Avatar URL & Social Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">প্রোফাইল ছবি URL</label>
                    <input
                      type="text"
                      value={instructorAvatar}
                      onChange={(e) => setInstructorAvatar(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="block text-slate-700 font-bold">সোশ্যাল মিডিয়া লিংক (Social Links):</span>
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <input
                        type="text"
                        value={socialFb}
                        onChange={(e) => setSocialFb(e.target.value)}
                        placeholder="Facebook URL"
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono text-[10px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <input
                        type="text"
                        value={socialYt}
                        onChange={(e) => setSocialYt(e.target.value)}
                        placeholder="YouTube Channel URL"
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono text-[10px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-sky-600 flex-shrink-0" />
                      <input
                        type="text"
                        value={socialLi}
                        onChange={(e) => setSocialLi(e.target.value)}
                        placeholder="LinkedIn Profile URL"
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    রিভিউ ম্যানেজমেন্ট ও অটো-ক্যালকুলেটেড স্ট্যাটস
                  </h4>
                  <p className="text-[11px] text-slate-500">অনুমোদন, বাতিল বা ফিল্টার করুন</p>
                </div>
              </div>

              {/* Auto-Calculated Rating Stats Card */}
              <div className="p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-black font-mono text-amber-400">{avgRating}</div>
                  <div className="flex justify-center sm:justify-start gap-1 text-amber-400 my-1">
                    {'★'.repeat(Math.round(Number(avgRating)))}
                  </div>
                  <div className="text-xs text-purple-200">{totalReviewsCount}টি অনুমোদিত রিভিউ এর ভিত্তিতে</div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2 text-[11px] font-mono">
                      <span className="w-8 text-amber-300 font-bold">{item.stars} ★</span>
                      <div className="flex-1 bg-purple-950/80 h-2 rounded-full overflow-hidden border border-purple-700">
                        <div className="bg-amber-400 h-full transition-all" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <span className="w-12 text-right text-purple-200">{item.count}টি ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Review Manually Form */}
              <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
                <span className="font-bold text-slate-800 text-xs">+ নতুন টেস্টিকাস্টমার রিভিউ ম্যানুয়ালি যোগ করুন:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newRevName}
                    onChange={(e) => setNewRevName(e.target.value)}
                    placeholder="কাস্টমারের নাম"
                    className="bg-white border border-slate-200 rounded-xl p-2 text-slate-800 text-xs"
                  />
                  <select
                    value={newRevRating}
                    onChange={(e) => setNewRevRating(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded-xl p-2 text-slate-800 text-xs font-bold"
                  >
                    <option value={5}>★★★★★ 5 Star</option>
                    <option value={4}>★★★★☆ 4 Star</option>
                    <option value={3}>★★★☆☆ 3 Star</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddNewReview}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl p-2 cursor-pointer"
                  >
                    + রিভিউ অ্যাড করুন
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={newRevComment}
                  onChange={(e) => setNewRevComment(e.target.value)}
                  placeholder="রিভিউ মতামত..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 text-xs"
                />
              </div>

              {/* Reviews Table / List */}
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{rev.userName}</span>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold font-mono text-xs">
                          {'★'.repeat(rev.rating)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          rev.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          rev.status === 'hidden' ? 'bg-slate-200 text-slate-600' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rev.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-700 text-xs italic leading-relaxed">"{rev.comment}"</p>

                    <div className="flex justify-end items-center gap-2 pt-1 border-t border-slate-200/60">
                      {rev.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateReviewStatus(rev.id, 'approved')}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== 'hidden' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateReviewStatus(rev.id, 'hidden')}
                          className="px-2.5 py-1 bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Hide
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateReviewStatus(rev.id, 'rejected')}
                          className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(rev.id)}
                        className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: PRICING & CATEGORY */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    প্রাইসিং ও বেসিক ক্যাটালগ
                  </h4>
                  <p className="text-[11px] text-slate-500">মূল্য নির্ধারণ করুন (কারেন্সি ৳ ফিক্সড)</p>
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">কোর্স শিরোনাম (Title)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Web Development with React & Node.js 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-purple-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ক্যাটাগরি</label>
                  <select
                    value={categoryId}
                    onChange={(e) => handleCategoryChangeById(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none cursor-pointer"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.productType || 'Full Course'})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="courses">অনলাইন কোর্সসমূহ</option>
                        <option value="ebooks">ই-বুক ও বই</option>
                        <option value="source-code">সোর্স কোড</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">শিক্ষার্থী সংখ্যা (Students Enrolled)</label>
                  <input
                    type="number"
                    value={studentsCount}
                    onChange={(e) => setStudentsCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">নিয়মিত মূল দাম (৳ Regular Price)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">৳</span>
                    <input
                      type="number"
                      required
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-slate-900 font-extrabold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">ডিসকাউন্ট বিশেষ দাম (৳ Discount Price)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-emerald-600">৳</span>
                    <input
                      type="number"
                      required
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-emerald-600 font-extrabold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Auto Calculated Discount Banner */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between text-purple-900 font-bold">
                <span>স্বয়ংক্রিয় হিসাবকৃত ছাড়ের হার (Calculated Discount):</span>
                <span className="px-3 py-1 bg-emerald-600 text-white font-mono font-black text-sm rounded-xl">
                  {originalPrice > discountPrice ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0}% OFF
                </span>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold shadow-md cursor-pointer transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{productToEdit ? 'Save & Update Course' : 'Save & Publish Course'}</span>
            </button>
          </div>

        </form>
      </>
    )}
  </div>
</div>
  );
};
