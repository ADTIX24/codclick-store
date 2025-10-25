// FIX: Added .ts extension to module import.
import type { HeroSlide, Category, Product } from './types.ts';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: '1',
    title: 'مركز بطاقاتك الرقمية',
    subtitle: 'احصل فورًا على بطاقات الهدايا وأكواد الألعاب والمزيد. سريع وآمن ومتوفر دائمًا.',
    type: 'image',
    image_url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9e?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'الألعاب تبدأ من هنا',
    subtitle: 'اشحن ألعابك المفضلة. بلايستيشن، إكس بوكس، ستيم، والمزيد في متناول يدك.',
    type: 'image',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'ترفيه عند الطلب',
    subtitle: 'شاهد الأفلام، استمع إلى الموسيقى، واستمتع بتطبيقاتك المفضلة مع بطاقاتنا الرقمية.',
    type: 'image',
    image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974&auto=format&fit=crop',
  },
];

export const PRODUCT_CATEGORIES: Category[] = [];
export const NEW_PRODUCTS: Product[] = [];