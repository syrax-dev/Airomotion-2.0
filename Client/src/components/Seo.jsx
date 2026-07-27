import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Airomotion';
const SITE_URL = 'https://airomotion.com';
const DEFAULT_DESCRIPTION = 'Airomotion delivers smart home automation, security, and energy-management solutions for homes and businesses in India.';

const pageMetadata = {
  '/': {
    title: 'Smart Automation, Security & Energy Solutions',
    description: 'Airomotion delivers smart automation, connected security, and reliable energy solutions designed around your space.',
  },
  '/about': {
    title: 'About Us',
    description: 'Learn about Airomotion and our approach to intelligent automation, security, and energy-management solutions.',
  },
  '/products': {
    title: 'Smart Home Products',
    description: 'Explore Airomotion smart switches, lighting, sensors, security systems, solar solutions, and energy products.',
  },
  '/services': {
    title: 'Services & Product Registration',
    description: 'Register your Airomotion product, explore installation support, and find answers to service and warranty questions.',
  },
  '/contact': {
    title: 'Contact Us',
    description: 'Contact Airomotion to discuss smart automation, security, and energy solutions for your home or business.',
  },
};

const setMetaContent = (selector, content) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute('content', content);
};

const Seo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = pageMetadata[pathname] || {
      title: 'Smart Automation, Security & Energy Solutions',
      description: DEFAULT_DESCRIPTION,
    };
    const title = `${metadata.title} | ${SITE_NAME}`;
    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

    document.title = title;
    document.documentElement.lang = 'en-IN';
    setMetaContent('meta[name="description"]', metadata.description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', metadata.description);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', metadata.description);

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', canonicalUrl);
  }, [pathname]);

  return null;
};

export default Seo;
