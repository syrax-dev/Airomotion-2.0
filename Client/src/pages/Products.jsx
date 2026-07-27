import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import './Products.css';
import smartSwitchImage from '../assets/images/products/automation/switches/Smart_Switches.webp';
import retroSwitchImage from '../assets/images/products/automation/switches/Retro_Switches.webp';
import touchPanelImage from '../assets/images/products/automation/switches/Touch_Panels.webp';
import ledPanelImage from '../assets/images/products/automation/lighting/LED_Panel.webp';
import ambientStripLightsImage from '../assets/images/products/automation/lighting/Ambient_Strip-Lights.webp';
import downlightsImage from '../assets/images/products/automation/lighting/Downlights.webp';
import ledBulbStripLightImage from '../assets/images/products/automation/lighting/LED-Bulb_&_Strip-Light.webp';
import trackSpotLightImage from '../assets/images/products/automation/lighting/Track-Spot_Light.webp';
import motionSensorImage from '../assets/images/products/automation/sensors/Motion_Sensor.webp';
import doorWindowSensorImage from '../assets/images/products/automation/sensors/Door-Window_Sensor.webp';
import environmentSensorImage from '../assets/images/products/automation/sensors/Environment_Sensor.webp';
import presenceSensorImage from '../assets/images/products/automation/sensors/Presence_Sensor.webp';
import vibrationSensorImage from '../assets/images/products/automation/sensors/Vibration_Sensor.webp';
import waterLeakSensorImage from '../assets/images/products/automation/sensors/Water_Leak_Sensor.webp';
import smartGasDetectorImage from '../assets/images/products/automation/sensors/Smart_Gas_Detector.webp';
import smokeDetectorImage from '../assets/images/products/automation/sensors/Smoke_Detector.webp';
import hubControllerImage from '../assets/images/products/automation/hub/HUB_Controller.webp';
import liteControllerImage from '../assets/images/products/automation/shading/Lite_Controller.webp';
import deluxeControllerImage from '../assets/images/products/automation/shading/Deluxe_Controller.webp';
import premiumControllerImage from '../assets/images/products/automation/shading/Premium_Controller.webp';
import mechanicalLimitImage from '../assets/images/products/automation/shading/Mechanical_Limit.webp';
import electronicLimitImage from '../assets/images/products/automation/shading/Electronic_Limit.webp';
import handheldTransmitterImage from '../assets/images/products/automation/shading/Handheld_Transmitter.webp';
import wallMountTransmitterImage from '../assets/images/products/automation/shading/Wall-Mount_Transmitter.webp';
import premiumHandheldTransmitterImage from '../assets/images/products/automation/shading/Premium_Handheld_Transmitter.webp';
import trackVersionImage from '../assets/images/products/automation/shading/Track_Version.webp';
import rodVersionImage from '../assets/images/products/automation/shading/Rod_Version.webp';
import skylightBlindsImage from '../assets/images/products/automation/shading/Skylight_Blinds.webp';
import windproofExteriorBlindImage from '../assets/images/products/automation/shading/Windproof_Exterior_Blind.webp';
import solarUpsImage from '../assets/images/products/energy/Solar_UPS.webp';
import solarPanel01Image from '../assets/images/products/energy/Solar_Panel_01.webp';
import solarPanel02Image from '../assets/images/products/energy/Solar_Panel_02.webp';
import lithiumIonImage from '../assets/images/products/energy/Lithium_ION.webp';
import deepCycleImage from '../assets/images/products/energy/Deep_Cycle.webp';
import solarDCCablingImage from '../assets/images/products/energy/Solar_DC_Cabling.webp';
import conduitHardwareImage from '../assets/images/products/energy/Conduit_&_Hardware.webp';
import doorLockImage from '../assets/images/products/security/Door_Lock.webp';
import cctvImage from '../assets/images/products/security/CCTV.webp';
import videoBellImage from '../assets/images/products/security/Video_Bell.webp';
import gateImage from '../assets/images/products/security/Gate.webp';

// SVG Icons
const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 6H13M13 6L8 1M13 6L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Custom Reveal component matching the reference site's lx-reveal behavior
const Reveal = ({ children, delay = 0, className = '' }) => {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current);
        }
      },
      { threshold: 0.05 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`lx-reveal ${isVisible ? 'in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : {}}
    >
      {children}
    </div>
  );
};

// Data Schema
const productCategories = {
  automation: {
    hero: "/cat-automation.jpg",
    groups: [
      { title: 'Switches', items: ['Smart Touch Switches', 'Smart Control Panel', 'Retrofit Switches Module'] },
      { title: 'Smart Lighting', items: ['Smart LED Panel', 'Ambient Strip Lights', 'Smart Downlights', 'Track Spot Light', 'LED Bulb & Strip Light'] },
      { title: 'Sensors', items: ['Motion Sensor', 'Door / Window Sensor', 'Environment Sensor', 'Presence Sensor', 'Vibration Sensor', 'Water Leak Sensor', 'Smart Gas Detector', 'Smoke Detector'] },
      { title: 'Hub', items: ['Smart Hub Controller'] },
      {
        title: 'Shading', items: [
          { sub: 'Curtain Controller', items: ['Lite', 'Deluxe', 'Premium'] },
          { sub: 'Roller Shade Controller', items: ['Mechanical Limit', 'Electronic Limit'] },
          { sub: 'Remote', items: ['Handheld Transmitter', 'Wall Mount Transmitter', 'Premium Handheld Transmitter'] },
          { sub: 'Curtain Driver', items: ['Track Version', 'Rod Version'] },
          { sub: 'Roller Shade Driver', items: ['Windproof Exterior Blind', 'Skylight Blinds'] }
        ]
      }
    ],
    products: [
      { img: "/prod-switch.jpg", name: 'Smart Touch Switch', desc: 'Black-glass capacitive panel.', cat: 'Switches' },
      { img: "/cat-automation.jpg", name: 'Smart Control Panel', desc: 'Wall-mounted scene controller.', cat: 'Switches' },
      { img: "/prod-switch.jpg", name: 'Ambient Strip Light', desc: 'Tunable architectural strip.', cat: 'Lighting' },
      { img: "/prod-switch.jpg", name: 'Smart Downlight', desc: 'Dimmable recessed downlight.', cat: 'Lighting' },
      { img: "/prod-switch.jpg", name: 'Motion Sensor', desc: 'Ceiling-mount PIR sensor.', cat: 'Sensors' },
      { img: "/prod-switch.jpg", name: 'Curtain Driver', desc: 'Whisper-quiet track motor.', cat: 'Shading' }
    ]
  },
  security: {
    hero: "/cat-security.jpg",
    groups: [
      { title: 'Smart Door Lock', items: ['Fingerprint', 'PIN & RFID', 'Auto-Lock Timer', 'Tamper Alerts'] },
      { title: 'HD CCTV System', items: ['4K Resolution', 'Night Vision', 'Cloud Storage', 'Live App View'] },
      { title: 'Smart Video Bell', items: ['Two-Way Audio', 'Motion Detection', 'Cloud Recording', 'Face Recognition'] },
      { title: 'Gate Automation', items: ['Boom Barrier', 'Sliding Gate Controller'] }
    ],
    products: [
      { img: "/prod-lock.jpg", name: 'Smart Door Lock', desc: 'Fingerprint + PIN + RFID.', cat: 'Locks' },
      { img: "/prod-cctv.jpg", name: '4K Dome Camera', desc: 'Night vision, cloud storage.', cat: 'CCTV' },
      { img: "/prod-cctv.jpg", name: 'Bullet Camera', desc: 'Long-range surveillance.', cat: 'CCTV' },
      { img: "/prod-lock.jpg", name: 'Smart Video Bell', desc: 'Two-way audio, face recognition.', cat: 'Video Bell' },
      { img: "/prod-lock.jpg", name: 'Sliding Gate Controller', desc: 'Heavy-duty gate automation.', cat: 'Gate' },
      { img: "/prod-cctv.jpg", name: 'Boom Barrier', desc: 'Commercial access control.', cat: 'Gate' }
    ]
  },
  energy: {
    hero: "/cat-energy.jpg",
    groups: [
      { title: 'Solar Hybrid UPS', items: ['LT-300VA', 'LT-350VA', 'LT-550VA', 'LT-850VA', 'LT-1250VA', 'LT-2000VA', 'LT-2500VA', 'LT-3000VA'] },
      { title: 'Solar Panels', items: ['Monocrystalline', 'Bifacial Modules'] },
      { title: 'Solar Battery', items: ['Lithium-Ion', 'Deep-Cycle'] },
      { title: 'Wiring', items: ['Solar DC Cabling', 'Conduit & Hardware'] }
    ],
    products: [
      { img: "/prod-ups.jpg", name: 'LT-1250VA Hybrid UPS', desc: 'Mid-range residential backup.', cat: 'UPS' },
      { img: "/prod-ups.jpg", name: 'LT-3000VA Hybrid UPS', desc: 'Whole-home solar backup.', cat: 'UPS' },
      { img: "/prod-ups.jpg", name: 'LT-550VA Hybrid UPS', desc: 'Compact apartment unit.', cat: 'UPS' },
      { img: "/cat-energy.jpg", name: 'Monocrystalline Panel', desc: 'High-efficiency PV module.', cat: 'Panels' },
      { img: "/cat-energy.jpg", name: 'Lithium Battery', desc: 'Long-cycle home battery.', cat: 'Battery' },
      { img: "/cat-energy.jpg", name: 'Solar DC Cabling', desc: 'UV-rated solar wiring.', cat: 'Wiring' }
    ]
  }
};

const tabs = [
  { id: 'automation', label: 'Smart Automation' },
  { id: 'security', label: 'Smart Security' },
  { id: 'energy', label: 'Energy Management' }
];

const automationGroupByHash = {
  '#switches': 'Switches',
  '#lighting': 'Smart Lighting',
  '#sensors': 'Sensors',
  '#hub': 'Hub',
  '#shading': 'Shading'
};

const productTargetByCategoryAndHash = {
  security: {
    '#lock': { group: 'Smart Door Lock', product: 'Smart Door Lock' },
    '#cctv': { group: 'HD CCTV System', product: 'HD CCTV System' },
    '#doorbell': { group: 'Smart Video Bell', product: 'Smart Video Bell' },
    '#gate': { group: 'Gate Automation', product: 'Gate Automation' }
  },
  energy: {
    '#ups': { group: 'Solar Hybrid UPS', product: 'Solar Hybrid UPS' },
    '#panels': { group: 'Solar Panels', product: 'Monocrystalline' },
    '#battery': { group: 'Solar Battery', product: 'Lithium-Ion' },
    '#wiring': { group: 'Wiring', product: 'Solar DC Cabling' }
  }
};

const automationSwitchImages = {
  'Smart Touch Switches': smartSwitchImage,
  'Smart Control Panel': touchPanelImage,
  'Retrofit Switches Module': retroSwitchImage
};

const automationLightingImages = {
  'Smart LED Panel': ledPanelImage,
  'Ambient Strip Lights': ambientStripLightsImage,
  'Smart Downlights': downlightsImage,
  'Track Spot Light': trackSpotLightImage,
  'LED Bulb & Strip Light': ledBulbStripLightImage
};

const automationSensorImages = {
  'Motion Sensor': motionSensorImage,
  'Door / Window Sensor': doorWindowSensorImage,
  'Environment Sensor': environmentSensorImage,
  'Presence Sensor': presenceSensorImage,
  'Vibration Sensor': vibrationSensorImage,
  'Water Leak Sensor': waterLeakSensorImage,
  'Smart Gas Detector': smartGasDetectorImage,
  'Smoke Detector': smokeDetectorImage
};

const automationHubImages = {
  'Smart Hub Controller': hubControllerImage
};

const automationShadingImages = {
  'Lite': liteControllerImage,
  'Deluxe': deluxeControllerImage,
  'Premium': premiumControllerImage,
  'Mechanical Limit': mechanicalLimitImage,
  'Electronic Limit': electronicLimitImage,
  'Handheld Transmitter': handheldTransmitterImage,
  'Wall Mount Transmitter': wallMountTransmitterImage,
  'Premium Handheld Transmitter': premiumHandheldTransmitterImage,
  'Track Version': trackVersionImage,
  'Rod Version': rodVersionImage,
  'Windproof Exterior Blind': windproofExteriorBlindImage,
  'Skylight Blinds': skylightBlindsImage
};

const energyManagementImages = {
  'Solar UPS': solarUpsImage,
  'LT-300VA': solarUpsImage,
  'LT-350VA': solarUpsImage,
  'LT-550VA': solarUpsImage,
  'LT-850VA': solarUpsImage,
  'LT-1250VA': solarUpsImage,
  'LT-2000VA': solarUpsImage,
  'LT-2500VA': solarUpsImage,
  'LT-3000VA': solarUpsImage,
  'Monocrystalline': solarPanel01Image,
  'Bifacial Modules': solarPanel02Image,
  'Lithium-Ion': lithiumIonImage,
  'Deep-Cycle': deepCycleImage,
  'Solar DC Cabling': solarDCCablingImage,
  'Conduit & Hardware': conduitHardwareImage
};

const automationProductDetails = {
  'Smart Touch Switches': {
    desc: 'Minimalist touch control for every room.',
    specs: [['Module options', '2, 4, 6, 8, 12, 16'], ['Finish', 'Custom colour options'], ['Control', 'Touch automation']]
  },
  'Smart Control Panel': {
    desc: 'Dedicated wall control for your connected home.',
    specs: [['Mounting', 'Wall mounted'], ['Control', 'Lighting, climate & scenes'], ['Interface', 'High-quality display']]
  },
  'Retrofit Switches Module': {
    desc: 'Turn existing switches into smart controls.',
    specs: [['Installation', 'Behind existing switch'], ['Use case', 'Retrofit automation'], ['Control', 'Smart switching']]
  },
  'Smart LED Panel': {
    desc: 'Vibrant smart lighting for modern interiors.',
    specs: [['Colours', '16M colours'], ['Control', 'Voice control'], ['Efficiency', 'Up to 60% energy saving'], ['Scenes', 'Dimming & scenes']]
  },
  'Ambient Strip Lights': {
    desc: 'Flexible colour lighting for every space.',
    specs: [['Colour zones', 'RGB+W'], ['Sync', 'Music sync'], ['Control', 'App control'], ['Protection', 'Waterproof IP67']]
  },
  'Smart Downlights': {
    desc: 'Adaptive downlighting from warm to cool.',
    specs: [['Colour temperature', 'Warm to cool'], ['Dimming', 'Auto sunset dim'], ['Scenes', 'Scene grouping'], ['Control', 'Alexa ready']]
  },
  'Track Spot Light': {
    desc: 'Directional smart lighting for focal areas.',
    specs: [['Beam control', 'Adjustable direction'], ['Dimming', 'App controlled'], ['Scenes', 'Programmable presets']]
  },
  'LED Bulb & Strip Light': {
    desc: 'Everyday lighting with smart dimming.',
    specs: [['Brightness', 'Dimmable output'], ['Colour temperature', 'Warm to cool'], ['Control', 'App & voice control']]
  },
  'Motion Sensor': {
    desc: 'Motion sensing for instant automations.',
    specs: [['Detection', '120° coverage'], ['Detection filter', 'Pet immune'], ['Power', 'Long battery life'], ['Automation', 'Trigger enabled']]
  },
  'Door / Window Sensor': {
    desc: 'Instant alerts for doors and windows.',
    specs: [['Alerts', 'Instant alerts'], ['Power', 'Battery powered'], ['Design', 'Compact design'], ['Automation', 'Scene triggers']]
  },
  'Environment Sensor': {
    desc: 'Comfort and air-quality monitoring.',
    specs: [['Monitoring', 'Temperature & humidity'], ['Air quality', 'Air quality AQI'], ['CO₂', 'CO₂ monitor'], ['Automation', 'Auto AC trigger']]
  },
  'Presence Sensor': {
    desc: 'Precise occupancy detection for any room.',
    specs: [['Technology', '60 GHz mmWave'], ['Detection', 'Micro-motion sensing'], ['Coverage', 'Configurable zones']]
  },
  'Vibration Sensor': {
    desc: 'Detects impact and unwanted movement.',
    specs: [['Sensing', 'Tri-axis vibration'], ['Sensitivity', 'Adjustable'], ['Power', 'Long-life battery']]
  },
  'Water Leak Sensor': {
    desc: 'Early leak detection for wet areas.',
    specs: [['Detection', 'Conductive probe'], ['Alerts', 'Instant app alert'], ['Power', 'Battery powered']]
  },
  'Smart Gas Detector': {
    desc: 'Early gas warnings for safer living.',
    specs: [['Detection', 'LPG & natural gas'], ['Alerts', 'Audible & app alert'], ['Status', 'Self-test indicator']]
  },
  'Smoke Detector': {
    desc: 'Reliable early smoke detection.',
    specs: [['Sensor type', 'Photoelectric'], ['Alerts', 'Siren & app alert'], ['Power', 'Long-life battery']]
  },
  'Smart Hub Controller': {
    desc: 'The central hub for every automation.',
    specs: [['Connectivity', 'Ethernet & Wi-Fi'], ['Automation', 'Local processing'], ['Integration', 'Multi-protocol hub']]
  }
};

const securityProductDetails = {
  'Smart Door Lock': {
    desc: 'Secure keyless entry for modern homes.',
    specs: [['Access', 'Fingerprint'], ['Credentials', 'PIN & RFID'], ['Locking', 'Auto-lock timer'], ['Security', 'Tamper alerts']]
  },
  'HD CCTV System': {
    desc: 'Clear, connected surveillance around the clock.',
    specs: [['Resolution', '4K resolution'], ['Visibility', 'Night vision'], ['Storage', 'Cloud storage'], ['Monitoring', 'Live app view']]
  },
  'Smart Video Bell': {
    desc: 'See, speak to and monitor every visitor.',
    specs: [['Audio', 'Two-way audio'], ['Detection', 'Motion detection'], ['Recording', 'Cloud recording'], ['Recognition', 'Face recognition']]
  },
  'Gate Automation': {
    desc: 'Reliable, controlled access for every entrance.',
    specs: [['Barrier', 'Boom barrier'], ['Gate control', 'Sliding gate controller'], ['Access', 'Smart access control']]
  }
};

const energyProductDetails = {
  'LT-300VA': { desc: 'Compact off-grid backup for essential loads.', specs: [['Capacity', '300VA'], ['System', 'Off-grid solar hybrid'], ['Use case', 'Essential backup']] },
  'LT-350VA': { desc: 'Efficient solar backup for compact spaces.', specs: [['Capacity', '350VA'], ['System', 'Off-grid solar hybrid'], ['Use case', 'Small-home backup']] },
  'LT-550VA': { desc: 'Reliable power support for everyday loads.', specs: [['Capacity', '550VA'], ['System', 'Off-grid solar hybrid'], ['Use case', 'Apartment backup']] },
  'LT-850VA': { desc: 'Flexible solar backup for larger essentials.', specs: [['Capacity', '850VA'], ['System', 'Off-grid solar hybrid'], ['Use case', 'Home backup']] },
  'LT-1250VA': { desc: 'Balanced solar backup for connected homes.', specs: [['Capacity', '1250VA'], ['System', 'Off-grid solar hybrid'], ['Use case', 'Residential backup']] },
  'LT-2000VA': { desc: 'High-capacity power for demanding homes.', specs: [['Capacity', '2000VA'], ['System', 'Off-grid solar hybrid'], ['Use case', 'Whole-home essentials']] },
  'LT-2500VA': { desc: 'Robust off-grid backup for extended loads.', specs: [['Capacity', '2500VA'], ['System', 'Off-grid solar hybrid'], ['Use case', 'Large-home backup']] },
  'LT-3000VA': { desc: 'Powerful solar backup for complete resilience.', specs: [['Capacity', '3000VA'], ['System', 'Off-grid solar hybrid'], ['Use case', 'Whole-home backup']] },
  Monocrystalline: {
    desc: 'High-efficiency panels for dependable solar generation.',
    specs: [['Durability', 'UV resistant'], ['Transfer', 'High current capacity'], ['Lifespan', '25+ years outdoors']]
  },
  'Bifacial Modules': {
    desc: 'Dual-sided modules that capture reflected sunlight.',
    specs: [['Durability', 'UV resistant'], ['Generation', 'Front & rear capture'], ['Lifespan', '25+ years outdoors']]
  },
  'Lithium-Ion': {
    desc: 'Long-life energy storage with rapid charge response.',
    specs: [['Chemistry', 'Lithium-ion'], ['Cycle life', 'High-cycle performance'], ['Management', 'Integrated battery protection']]
  },
  'Deep-Cycle': {
    desc: 'Dependable storage built for regular solar cycling.',
    specs: [['Type', 'Deep-cycle battery'], ['Use', 'Solar energy storage'], ['Service', 'Low-maintenance design']]
  },
  'Solar DC Cabling': {
    desc: 'UV-rated cabling for safe, efficient solar transfer.',
    specs: [['Rating', 'Solar DC rated'], ['Protection', 'UV resistant'], ['Installation', 'Outdoor suitable']]
  },
  'Conduit & Hardware': {
    desc: 'Durable installation hardware for protected wiring.',
    specs: [['Protection', 'Weather resistant'], ['Use', 'Cable routing'], ['Installation', 'Professional grade']]
  }
};

// Each entry in the sidebar is a product.  Keep the sidebar data as the single
// source of truth so a product can never be hidden simply because it was not
// added to a separate card list.
const createProductsFromGroups = (groups, heroImage, productDetails = {}, imageMap = {}) => (
  groups.flatMap(group => {
    if (group.title === 'Solar Hybrid UPS') {
      return [{
        img: imageMap['LT-300VA'] || heroImage,
        name: 'Solar Hybrid UPS',
        desc: 'Solar hybrid UPS with various capacities available.',
        specs: [['Capacity', 'Various capacities available'], ['System', 'Solar hybrid'], ['Use case', 'Home backup']],
        cat: group.title,
        group: group.title
      }];
    }

    return group.items.flatMap(item => {
      if (typeof item === 'string') {
        const details = productDetails[item];
        return [{
          img: imageMap[item] || heroImage,
          name: item,
          desc: details?.desc || `${group.title} smart solution.`,
          specs: details?.specs || [['Category', group.title], ['Control', 'Smart enabled'], ['Installation', 'Professional']],
          cat: group.title,
          group: group.title
        }];
      }

      return item.items.map(subItem => ({
        img: imageMap[subItem] || heroImage,
        name: subItem,
        desc: `${subItem} ${item.sub.toLowerCase()} option.`,
        specs: [['Product line', item.sub], ['Variant', subItem], ['Installation', 'Professional']],
        cat: group.title,
        group: group.title
      }));
    });
  })
);

// Security sidebar items are feature lists, so each sidebar group is the
// product card and its listed features become that card's technical data.
const securityProductImages = {
  'Smart Door Lock': doorLockImage,
  'HD CCTV System': cctvImage,
  'Smart Video Bell': videoBellImage,
  'Gate Automation': gateImage
};

const createGroupProducts = (groups, heroImage, productDetails, imageMap = {}) => (
  groups.map(group => {
    const details = productDetails[group.title];
    return {
      img: imageMap[group.title] || heroImage,
      name: group.title,
      desc: details.desc,
      specs: details.specs,
      cat: 'Security',
      group: group.title
    };
  })
);

Object.values(productCategories).forEach(category => {
  if (category === productCategories.security) {
    category.products = createGroupProducts(category.groups, category.hero, securityProductDetails, securityProductImages);
    return;
  }

  const details = category === productCategories.automation
    ? automationProductDetails
    : category === productCategories.energy
      ? energyProductDetails
      : undefined;

  category.products = createProductsFromGroups(
    category.groups,
    category.hero,
    details,
    category === productCategories.automation
      ? { ...automationSwitchImages, ...automationLightingImages, ...automationSensorImages, ...automationHubImages, ...automationShadingImages }
      : category === productCategories.energy
        ? energyManagementImages
        : {}
  );
});

const Products = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = ['automation', 'security', 'energy'].includes(searchParams.get('category'))
    ? searchParams.get('category')
    : 'automation';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [hasChangedCategory, setHasChangedCategory] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 900px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && ['automation', 'security', 'energy'].includes(category) && category !== activeCategory) {
      setActiveCategory(category);
    }
  }, [searchParams, activeCategory]);
  // One selected group per main category. Selecting a new group replaces the
  // visible cards instead of adding them to the previous group's cards.
  const [selectedGroups, setSelectedGroups] = useState({
    automation: 'Switches',
    security: 'Smart Door Lock',
    energy: 'Solar Hybrid UPS'
  });
  const catalogRef = useRef(null);
  const productGridRef = useRef(null);
  const productCardRefs = useRef({});

  useEffect(() => {
    if (location.hash !== '#category-start') return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!productGridRef.current) return;

        const offset = window.matchMedia('(max-width: 480px)').matches
          ? 120
          : window.matchMedia('(max-width: 900px)').matches
            ? 130
            : 150;
        const gridTop = productGridRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(gridTop - offset, 0), behavior: 'smooth' });
      });
    });
  }, [location.hash, activeCategory]);

  useEffect(() => {
    const target = productTargetByCategoryAndHash[activeCategory]?.[location.hash];
    if (!target) return;

    setSelectedGroups(prev => (
      prev[activeCategory] === target.group ? prev : { ...prev, [activeCategory]: target.group }
    ));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const card = productCardRefs.current[`${activeCategory}-${target.product}`];
        if (!card) return;

        const offset = window.matchMedia('(max-width: 480px)').matches
          ? 120
          : window.matchMedia('(max-width: 900px)').matches
            ? 130
            : 150;
        const cardTop = card.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(cardTop - offset, 0), behavior: 'smooth' });
      });
    });
  }, [location.hash, activeCategory]);

  useEffect(() => {
    const group = automationGroupByHash[location.hash];
    if (activeCategory !== 'automation' || !group) return;

    setSelectedGroups(prev => (
      prev.automation === group ? prev : { ...prev, automation: group }
    ));

    // Wait for the selected group's product cards before measuring their start.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!productGridRef.current) return;

        const offset = window.matchMedia('(max-width: 480px)').matches
          ? 120
          : window.matchMedia('(max-width: 900px)').matches
            ? 130
            : 150;
        const gridTop = productGridRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(gridTop - offset, 0), behavior: 'smooth' });
      });
    });
  }, [location.hash, activeCategory]);

  const categoryData = productCategories[activeCategory];
  const selectedGroup = selectedGroups[activeCategory];
  // On mobile the sidebar is hidden, so show all automation products at once.
  const visibleProducts = activeCategory === 'security' || activeCategory === 'energy' || (activeCategory === 'automation' && isMobile)
    ? categoryData.products
    : categoryData.products.filter(product => product.group === selectedGroup);
  // Security and Energy always show their full product grids.  Do not remount
  // those cards when only the sidebar's open group changes, which caused a blink.
  const productGridKey = activeCategory === 'automation'
    ? (isMobile ? 'automation-all' : `${activeCategory}-${selectedGroup}`)
    : activeCategory;
  const shouldDisableCategoryMotion = true;

  const scrollToCategoryStart = () => {
    // Measure after the selected category's cards have rendered.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!productGridRef.current) return;

        const offset = window.matchMedia('(max-width: 480px)').matches
          ? 120
          : window.matchMedia('(max-width: 900px)').matches
            ? 130
            : 150;
        const gridTop = productGridRef.current.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: Math.max(gridTop - offset, 0),
          behavior: 'smooth'
        });
      });
    });
  };

  const handleCategoryChange = (categoryId) => {
    if (categoryId !== activeCategory) {
      setHasChangedCategory(true);
      setActiveCategory(categoryId);
      setSearchParams({ category: categoryId });
    }

    scrollToCategoryStart();

  };

  const toggleGroup = (title) => {
    setSelectedGroups(prev => ({
      ...prev,
      [activeCategory]: title
    }));

    if (activeCategory !== 'automation') {
      return;
    }

    scrollToCategoryStart();
  };

  return (
    <div className="lx-page">
      <section className="bw-page-header">
        <div className="lx-container">
          <Reveal>
            <span className="bw-eyebrow">Catalogue</span>
            <h1>
              The <em>AIROMOTION</em> Collection.
            </h1>
            <p>
              Hardware engineered to disappear into the architecture and last as long as it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="lx-section" style={{ paddingTop: 80 }}>
        <Reveal>
          <div className="lx-container">
            <div className="lx-tabs" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeCategory === tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`lx-tab ${activeCategory === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={`lx-catalog ${shouldDisableCategoryMotion ? 'lx-catalog--no-transition' : ''} ${activeCategory === 'automation' ? 'lx-catalog--automation' : ''} ${hasChangedCategory ? 'lx-catalog--category-entry' : ''}`} ref={catalogRef}>
            <aside className="lx-side">
              {categoryData.groups.map(group => {
                const isOpen = selectedGroup === group.title;
                return (
                  <div className={`lx-side__group ${isOpen ? 'open' : ''}`} key={group.title}>
                    <button className="lx-side__head" onClick={() => toggleGroup(group.title)}>
                      <span>{group.title}</span>
                      <span className="chev">
                        <PlusIcon />
                      </span>
                    </button>
                    <div className="lx-side__list">
                      <ul>
                        {group.items.map(item => (
                          typeof item === 'string' ? (
                            <li key={item}>{item}</li>
                          ) : (
                            <li key={item.sub} style={{ listStyle: 'none', paddingLeft: 0 }}>
                              <div className="lx-side__sub">{item.sub}</div>
                              <ul>
                                {item.items.map(subItem => (
                                  <li key={subItem}>{subItem}</li>
                                ))}
                              </ul>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </aside>

            <div className="lx-grid" key={productGridKey} ref={productGridRef}>
              {visibleProducts.map((product, idx) => (
                <article
                  className="lx-prod"
                  key={product.name + idx}
                  ref={(element) => {
                    if (element) productCardRefs.current[`${activeCategory}-${product.name}`] = element;
                  }}
                >
                  <div className="lx-prod__img">
                    <img src={product.img} alt={product.name} loading="lazy" />
                  </div>
                  <div className="lx-prod__body">
                    <h3 className="lx-prod__name">{product.name}</h3>
                    <p className="lx-prod__desc">{product.desc}</p>
                    <dl className="lx-prod__details">
                      {product.specs.map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <Link to="/contact" className="lx-prod__link">
                      Enquire{' '}
                      <span>
                        <ArrowIcon />
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Products;
