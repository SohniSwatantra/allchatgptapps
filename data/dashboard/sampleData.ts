export interface Product {
  id: string;
  name: string;
  description: string;
  rank: number;
  upvotes: number;
  iconUrl: string;
  category: string;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  gradient: 'blue' | 'lavender' | 'green';
}

export interface StatItem {
  label: string;
  value: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'ChatGPT Code Assistant',
    description: 'AI-powered coding companion for developers',
    rank: 1,
    upvotes: 847,
    iconUrl: '/static/images/placeholder-icon.png',
    category: 'Development',
  },
  {
    id: '2',
    name: 'GPT Content Writer',
    description: 'Generate blog posts, emails, and marketing copy',
    rank: 2,
    upvotes: 623,
    iconUrl: '/static/images/placeholder-icon.png',
    category: 'Writing',
  },
  {
    id: '3',
    name: 'AI Image Generator',
    description: 'Create stunning visuals with DALL-E integration',
    rank: 3,
    upvotes: 512,
    iconUrl: '/static/images/placeholder-icon.png',
    category: 'Design',
  },
  {
    id: '4',
    name: 'Smart Data Analyzer',
    description: 'Transform spreadsheets into insights with ChatGPT',
    rank: 4,
    upvotes: 445,
    iconUrl: '/static/images/placeholder-icon.png',
    category: 'Business',
  },
  {
    id: '5',
    name: 'Language Tutor GPT',
    description: 'Learn any language with personalized AI lessons',
    rank: 5,
    upvotes: 389,
    iconUrl: '/static/images/placeholder-icon.png',
    category: 'Education',
  },
];

export const posts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      avatar: '/static/images/avatar-1.png',
    },
    content: 'Just launched my first GPT app! Check out @SmartAssistant - it helps organize your daily tasks using natural language.',
    timeAgo: '2h ago',
    likes: 24,
    comments: 8,
  },
  {
    id: '2',
    author: {
      name: 'Marcus Dev',
      avatar: '/static/images/avatar-2.png',
    },
    content: 'The new ChatGPT API update is amazing. Building something exciting with it 🚀',
    timeAgo: '4h ago',
    likes: 56,
    comments: 12,
  },
  {
    id: '3',
    author: {
      name: 'Emily Rose',
      avatar: '/static/images/avatar-3.png',
    },
    content: 'Reading "Building AI Products" - highly recommend for anyone in this space!',
    timeAgo: '6h ago',
    likes: 18,
    comments: 5,
  },
];

export const partners: Partner[] = [
  {
    id: '1',
    name: 'OpenAI',
    description: 'The creators of ChatGPT and GPT-4',
    icon: 'brain',
    url: 'https://openai.com',
    gradient: 'blue',
  },
  {
    id: '2',
    name: 'Vercel',
    description: 'Deploy your GPT apps instantly',
    icon: 'triangle',
    url: 'https://vercel.com',
    gradient: 'lavender',
  },
  {
    id: '3',
    name: 'Supabase',
    description: 'Backend for your AI applications',
    icon: 'database',
    url: 'https://supabase.com',
    gradient: 'green',
  },
];

export const statistics: StatItem[] = [
  { label: 'Total Apps', value: '2,847' },
  { label: 'Active Users', value: '43,000+' },
];

export const navItems = [
  { label: 'Launchpad', href: '/dashboard', isActive: true },
  { label: 'Community', href: '/community' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Products', href: '#', hasMegaMenu: true, menuType: 'products' as const },
  { label: 'More', href: '#', hasMegaMenu: true, menuType: 'more' as const },
];

export const megaMenuProducts = [
  { label: 'For Sale', icon: 'tag', href: '/products/for-sale' },
  { label: 'Design', icon: 'palette', href: '/products/design' },
  { label: 'Business', icon: 'briefcase', href: '/products/business' },
  { label: 'Best by Tag', icon: 'star', href: '/products/best-by-tag' },
  { label: 'Development', icon: 'code', href: '/products/development' },
  { label: 'Marketing', icon: 'megaphone', href: '/products/marketing' },
  { label: 'Personal Life', icon: 'heart', href: '/products/personal-life' },
  { label: 'Tags', icon: 'hash', href: '/products/tags' },
];

export const megaMenuMore = [
  { label: 'Guidelines', icon: 'book', href: '/guidelines' },
  { label: 'Blog', icon: 'file-text', href: '/blog' },
  { label: 'How it Works', icon: 'help-circle', href: '/how-it-works' },
  { label: 'FAQs', icon: 'message-circle', href: '/faqs' },
  { label: 'Affiliates', icon: 'users', href: '/affiliates' },
  { label: 'Newsletter', icon: 'mail', href: '/newsletter' },
  { label: 'Leaderboard', icon: 'trophy', href: '/leaderboard' },
  { label: 'Contact', icon: 'phone', href: '/contact' },
];

export const timeRangeTabs = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
