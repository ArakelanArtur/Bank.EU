export type NavItem = {
  href: string;
  label: string;
};

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Главная' },
  { href: '/how-it-works', label: 'Как это работает' },
  { href: '/business', label: 'Для бизнеса' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/login', label: 'Личный кабинет' },
];

export const FOOTER_NAV_GROUPS = [
  {
    title: 'Компания',
    items: [
      { href: '/#about', label: 'О компании' },
      { href: '/how-it-works', label: 'Как это работает' },
      { href: '/business', label: 'Для бизнеса' },
    ],
  },
  {
    title: 'Поддержка',
    items: [
      { href: '/faq', label: 'Часто задаваемые вопросы' },
      { href: '/contacts', label: 'Обратная связь' },
      { href: '/contacts#contact-info', label: 'Контакты' },
    ],
  },
  {
    title: 'Документы',
    items: [
      { href: '/privacy-policy', label: 'Политика конфиденциальности' },
      { href: '/cookie-policy', label: 'Cookie Policy' },
      { href: '/credit-policy', label: 'Credit Policy' },
      { href: '/aml-kyc-policy', label: 'AML/KYC Policy' },
      { href: '/terms', label: 'Условия использования' },
    ],
  },
] as const;
