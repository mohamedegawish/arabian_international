/* 
   Bilingual Support (AR | EN)
   Loads lang translations from provided JSON files
*/

let langData = {
    ar: {},
    en: {}
};

let currentLang = 'ar';

// Handle local file protocol CORS issues by defining fallback Data if fetch fails
const fallbackAr = {
    "companyName": "Arabian International",
    "tagline": "التميز في خدمات النقل الفاخر في المملكة العربية السعودية",
    "heroTitle": "Luxury Travel & Mobility",
    "navWhoWeAre": "عن الشركة",
    "navVision": "رؤيتنا",
    "navGoals": "أهدافنا",
    "navFeatures": "مميزاتنا",
    "navServices": "خدماتنا",
    "navFleet": "أسطول المركبات",
    "navClients": "عملاؤنا",
    "navPhilosophy": "فلسفة الشراكة",
    "navContact": "تواصل معنا",
    "whoWeAreTitle": "عن الشركة",
    "whoWeAreText": "في عالمٍ تتسارع فيه كل شيء، تبقى الفخامة في التفاصيل والراحة في النقل قيمة لا تُقدّر بثمن. من هنا وُلدت العربية العالمية لتأجير النقل لتقدم تجربة نقل لا تشبه سواها، حيث يلتقي الرقي مع الاحتراف، لتكون شريكًا يُعتمد عليه في كل رحلة.",
    "visionTitle": "رؤيتنا",
    "visionSubtitle": "Setting New Standards of Luxury and Excellence",
    "visionText": "في العربية العالمية نسعى لتعزيز رحلتك في عالم النقل برؤية راقية تضع معايير جديدة للفخامة والتميز، لنكون الخيار الأول للنخبة وكبار الشخصيات داخل المملكة وخارجها. نقدم تجربة لا تُنسى تقوم على الاحترافية والراحة والدقة.",
    "goalsTitle": "أهدافنا",
    "goalsSubtitle": "Strategic Objectives Driving Our Growth",
    "goal1Title": "التميز في الخدمة",
    "goal1Text": "تقديم خدمات نقل فاخرة بمعايير عالمية تلبي تطلعات عملائنا المميزين.",
    "goal2Title": "التوسع الاستراتيجي",
    "goal2Text": "التوسع الذكي في المدن الرئيسية داخل المملكة لضمان تغطية أوسع.",
    "goal3Title": "تطوير الأسطول",
    "goal3Text": "تطوير أسطول فاخر متجدد يواكب أحدث تقنيات الراحة والسلامة.",
    "goal4Title": "شراكات استراتيجية",
    "goal4Text": "بناء شراكات استراتيجية مع الجهات الحكومية والخاصة لتعزيز نطاق الخدمة.",
    "goal5Title": "تجربة العميل",
    "goal5Text": "تعزيز تجربة العميل من خلال احترافية السائقين ودقة المواعيد وجودة التفاصيل.",
    "featuresTitle": "مميزاتنا",
    "feat1Title": "التفرد",
    "feat1Text": "نمنح عملاءنا تجربة لا تشبه سواها مصممة بعناية لتليق بذوقهم الرفيع وتطلعاتهم الخاصة.",
    "feat2Title": "الفخامة والرفاهية",
    "feat2Text": "نعتمد على معايير الذوق والاحتراف في كل تفصيل من استقبال العميل حتى نهاية الرحلة.",
    "feat3Title": "الخصوصية",
    "feat3Text": "نحترم المساحة الشخصية ونضمن سرية التعامل لأن الراحة لا تكتمل دون ثقة مطلقة.",
    "feat4Title": "الدقة والانضباط",
    "feat4Text": "ندير الوقت بثقة واهتمام وانضباط لا يخطئ.",
    "feat5Title": "الحضور الرفيع",
    "feat5Text": "كل تفاعل معنا يعكس هويتنا المتميزة بدءًا من الزي الرسمي وحتى أسلوب التواصل.",
    "servicesTitle": "خدماتنا",
    "srv1": "خدمة سائق VIP",
    "srv2": "المواصلات",
    "srv3": "المشاريع والمعارض",
    "srv4": "الحافلات الكلاسيكية + VIP",
    "srv5": "خدمة نقل من وإلى المطار",
    "srv6": "خدمة الاستقبال والتوديع",
    "srv7": "توفير مركبات مخصصة لذوي الهمم",
    "fleetTitle": "أسطول المركبات",
    "fleetSubtitle": "World-Class Vehicles for Every Need",
    "filterAll": "الكل",
    "filterFirstClass": "الدرجة الأولى",
    "filterBusinessClass": "درجة رجال الأعمال",
    "filterSuv": "سيارات الدفع الرباعي",
    "filterSedan": "سيارات السيدان",
    "filterCoaches": "الحافلات والعربات",
    "filterEconomy": "سيارات اقتصادية",
    "clientsTitle": "عملاؤنا",
    "clientGovSector": "Government & Public Sector",
    "clientGov1": "وزارة الصحة",
    "clientGov2": "وزارة الثقافة",
    "clientGov3": "الهيئة العامة للترفيه",
    "clientGov4": "الهيئة السعودية للسياحة",
    "clientCorpSector": "Major Corporations",
    "clientCorp1": "أرامكو السعودية",
    "clientCorp2": "مجموعة MBC",
    "clientCorp3": "Ascend Healthcare Solutions",
    "clientCorp4": "Sync",
    "clientCorp5": "Richard Attias & Associates",
    "clientEventSector": "Major Events",
    "clientEv1": "كأس العالم فيفا قطر 2022",
    "clientEv2": "برنامج الرياض آرت (نور الرياض)",
    "clientEv3": "مهرجان أفلام السعودية",
    "clientEv4": "جوائز صنّاع الترفيه (Joy Awards)",
    "clientEv5": "Bona Fide JTEX - Event Transportation",
    "clientEv6": "موسم الدرعية 23/24",
    "clientEv7": "نادي القادسية",
    "clientEv8": "إثراء - مركز الملك عبدالعزيز الثقافي العالمي",
    "philosophyTitle": "فلسفة الشراكة",
    "philosophySubtitle": "Building Success Through Trust",
    "philosophyText": "نؤمن أن الشراكات الناجحة تُبنى على الثقة والرؤية المشتركة والتميز في التنفيذ. في العربية العالمية نفخر بعلاقاتنا مع شركائنا الذين يشاركوننا الطموح لصناعة تجربة نقل فاخرة بمعايير عالمية.",
    "contactTitle": "تواصل معنا",
    "contactSubtitle": "لنصنع التميز معًا",
    "emailLabel": "البريد الإلكتروني:",
    "websiteLabel": "الموقع الإلكتروني:",
    "addressLabel": "العنوان:",
    "addressText1": "الرياض – الملقا",
    "addressText2": "طريق الأمير محمد بن سعد",
    "addressText3": "رقم المبنى: 8582",
    "addressText4": "رقم الصندوق: 5600",
    "addressText5": "الرمز البريدي: 13525",
    "footerCopyright": "© 2024 Arabian International. جميع الحقوق محفوظة."
};

const fallbackEn = {
    "companyName": "Arabian International",
    "tagline": "Luxury Transportation Excellence in Saudi Arabia",
    "heroTitle": "Luxury Travel & Mobility",
    "navWhoWeAre": "Who We Are",
    "navVision": "Our Vision",
    "navGoals": "Our Goals",
    "navFeatures": "Features",
    "navServices": "Services",
    "navFleet": "Our Fleet",
    "navClients": "Clients",
    "navPhilosophy": "Philosophy",
    "navContact": "Contact Us",
    "whoWeAreTitle": "Who We Are",
    "whoWeAreText": "Arabian International delivers unparalleled luxury transportation services where elegance meets professionalism. We craft complete journeys that embody sophistication and exclusivity, tailored to meet the refined tastes of our distinguished clientele. With premium vehicles, highly trained chauffeurs, and an unwavering commitment to excellence, we serve those who seek nothing but the finest.",
    "visionTitle": "Our Vision",
    "visionSubtitle": "Setting New Standards of Luxury and Excellence",
    "visionText": "At Al Arabia Al Alamiah, we strive to enhance your journey in the world of transportation with a refined vision that sets new standards of luxury and excellence, making us the first choice for elite clients and VIPs within the Kingdom and beyond. We deliver an unforgettable experience built on professionalism, comfort, and precision.",
    "goalsTitle": "Our Goals",
    "goalsSubtitle": "Strategic Objectives Driving Our Growth",
    "goal1Title": "Service Excellence",
    "goal1Text": "Provide luxury transportation services that meet international standards and exceed client expectations.",
    "goal2Title": "Strategic Expansion",
    "goal2Text": "Expand strategically across major cities within the Kingdom to ensure wider coverage.",
    "goal3Title": "Fleet Development",
    "goal3Text": "Continuously develop a premium fleet equipped with the latest comfort and safety technologies.",
    "goal4Title": "Strategic Partnerships",
    "goal4Text": "Build strategic partnerships with both government and private sectors to enhance service reach.",
    "goal5Title": "Customer Experience",
    "goal5Text": "Elevate customer experience through professional chauffeurs and punctual service.",
    "featuresTitle": "Our Distinctive Features",
    "feat1Title": "Uniqueness",
    "feat1Text": "Our clients experience unmatched service designed with care to meet their refined taste and special aspirations.",
    "feat2Title": "Luxury and Elegance",
    "feat2Text": "We rely on the highest standards of taste and professionalism in every detail, from vehicle selection to journey completion.",
    "feat3Title": "Privacy",
    "feat3Text": "We respect personal space and ensure confidentiality of dealings, as comfort is never compromised.",
    "feat4Title": "Precision and Discipline",
    "feat4Text": "We manage time with confidence, interest, and discipline that never falters.",
    "feat5Title": "Premium Presence",
    "feat5Text": "Every interaction with us reflects our distinguished identity, from formal style to communication method.",
    "servicesTitle": "Our Services",
    "srv1": "VIP Chauffeur Service",
    "srv2": "Taxi Service",
    "srv3": "Projects & Exhibitions",
    "srv4": "Buses: Classic & Normal",
    "srv5": "Airport Transfer Service",
    "srv6": "Meet and Greet Service",
    "srv7": "Special Needs Transportation",
    "fleetTitle": "Our Premium Fleet",
    "fleetSubtitle": "World-Class Vehicles for Every Need",
    "filterAll": "All",
    "filterFirstClass": "First Class",
    "filterBusinessClass": "Business Class",
    "filterSuv": "SUV Fleet",
    "filterSedan": "Sedan Fleet",
    "filterCoaches": "Coaches & Vans",
    "filterEconomy": "Economy Cars",
    "clientsTitle": "Our Prestigious Clients",
    "clientGovSector": "Government & Public Sector",
    "clientGov1": "Ministry of Health",
    "clientGov2": "Ministry of Culture",
    "clientGov3": "General Entertainment Authority",
    "clientGov4": "Saudi Tourism Authority",
    "clientCorpSector": "Major Corporations",
    "clientCorp1": "Saudi Aramco",
    "clientCorp2": "MBC Group",
    "clientCorp3": "Ascend Healthcare Solutions",
    "clientCorp4": "Sync",
    "clientCorp5": "Richard Attias & Associates",
    "clientEventSector": "Major Events",
    "clientEv1": "FIFA World Cup Qatar 2022",
    "clientEv2": "Noor Riyadh Art Program",
    "clientEv3": "Saudi Film Festival",
    "clientEv4": "Joy Awards",
    "clientEv5": "Bona Fide JTEX - Event Transportation",
    "clientEv6": "Diriyah Season 23/24",
    "clientEv7": "Al Qadisiyah Club",
    "clientEv8": "Ithra - Aramco King Abdulaziz Foundation",
    "philosophyTitle": "Partnership Philosophy",
    "philosophySubtitle": "Building Success Through Trust",
    "philosophyText": "We believe that successful partnerships are built on trust, shared vision, and excellence in execution. At Arabian International, we take pride in our relationships with partners who share our ambition to create a luxurious transportation experience that meets world-class standards.",
    "contactTitle": "Contact Us",
    "contactSubtitle": "Let's Create Excellence Together",
    "emailLabel": "Email:",
    "websiteLabel": "Website:",
    "addressLabel": "Address:",
    "addressText1": "Riyadh - Al-Malqa",
    "addressText2": "Prince Mohammed Bin Saad Road",
    "addressText3": "Building No.: 8582",
    "addressText4": "P.O. Box: 5600",
    "addressText5": "Postal Code: 13525",
    "footerCopyright": "© 2024 Arabian International. All rights reserved."
};

// Try to fetch, if failed on local file:// protocol, use fallback
Promise.all([
    fetch('ar.json').then(r => r.json()),
    fetch('en.json').then(r => r.json())
]).then(([arJson, enJson]) => {
    langData.ar = arJson;
    langData.en = enJson;
    initApp();
}).catch(err => {
    console.warn("Using inline fallback data due to standard fetch failure:", err);
    langData.ar = fallbackAr;
    langData.en = fallbackEn;
    initApp();
});

function initApp() {
    applyLanguage(currentLang);
    if (typeof window.renderFleetCards === 'function') {
        window.renderFleetCards();
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    window.currentLang = currentLang;  // keep global in sync
    applyLanguage(currentLang);
}

function applyLanguage(lang) {
    // Switch direction
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.body.className = `lang-${lang}`;

    // Switch texts
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    elementsToTranslate.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[lang] && langData[lang][key]) {
            el.innerHTML = langData[lang][key];
        } else if (langData['en'] && langData['en'][key] && lang === 'en') {
            el.innerHTML = langData['en'][key];
        } else if (langData['ar'] && langData['ar'][key] && lang === 'ar') {
            el.innerHTML = langData['ar'][key];
        }
    });

    // Re-render fleet cards to pick up new language
    if (typeof window.renderFleetCards === 'function') {
        window.renderFleetCards();
    }
}

// Map the keys exactly as written in the JSON for the fleet categories
function getCategoryTranslateKey(catKey) {
    if (catKey === 'firstClass') return "filterFirstClass";
    if (catKey === 'businessClass') return "filterBusinessClass";
    if (catKey === 'suvFleet') return "filterSuv";
    if (catKey === 'sedanFleet') return "filterSedan";
    if (catKey === 'coachesVans') return "filterCoaches";
    if (catKey === 'economyCars') return "filterEconomy";
    return "";
}

// Fleet Data matching exactly the user's prompt groupings
const fleetData = [
    { id: 1, category: "firstClass", nameEn: "Mercedes S-Class (Maybach)", nameAr: "مرسيدس S-Class (مايباخ)", descEn: "The ultimate luxury sedan.", descAr: "أرقى سيارة سيدان فاخرة.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.18%20PM%20(1).jpeg", tripRate: 350, price4h: 1200, price8h: 2000, price12h: 2800, extraHour: 220 },
    { id: 2, category: "firstClass", nameEn: "BMW 7 Series", nameAr: "بي إم دبليو الفئة 7", descEn: "Sophisticated styling and state-of-the-art tech.", descAr: "تصميم متطور وتكنولوجيا حديثة.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.19%20PM%20(1).jpeg", tripRate: 300, price4h: 1100, price8h: 1800, price12h: 2500, extraHour: 200 },
    { id: 3, category: "firstClass", nameEn: "Mercedes E-Class", nameAr: "مرسيدس الفئة E", descEn: "Elegant and reliable transit.", descAr: "نقل أنيق وموثوق.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.23%20PM%20(1).jpeg", tripRate: 250, price4h: 900, price8h: 1500, price12h: 2100, extraHour: 175 },
    { id: 4, category: "firstClass", nameEn: "BMW 5 Series", nameAr: "بي إم دبليو الفئة 5", descEn: "Dynamics and comfort combined.", descAr: "الديناميكية والراحة معاً.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.23%20PM%20(2).jpeg", tripRate: 220, price4h: 850, price8h: 1400, price12h: 1950, extraHour: 160 },
    { id: 5, category: "businessClass", nameEn: "Mercedes E-Class", nameAr: "مرسيدس الفئة E", descEn: "Elegant and reliable transit.", descAr: "نقل أنيق وموثوق.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.23%20PM%20(1).jpeg", tripRate: 200, price4h: 750, price8h: 1250, price12h: 1750, extraHour: 150 },
    { id: 6, category: "businessClass", nameEn: "BMW 5 Series", nameAr: "بي إم دبليو الفئة 5", descEn: "Dynamics and comfort combined.", descAr: "الديناميكية والراحة معاً.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.23%20PM%20(2).jpeg", tripRate: 190, price4h: 720, price8h: 1200, price12h: 1700, extraHour: 145 },
    { id: 7, category: "suvFleet", nameEn: "Chevrolet Suburban", nameAr: "شيفروليه سوبربان", descEn: "Spacious VIP seating capability.", descAr: "قدرة جلوس رحبة ومريحة.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.20%20PM%20(1).jpeg", tripRate: 280, price4h: 1000, price8h: 1700, price12h: 2400, extraHour: 190 },
    { id: 8, category: "suvFleet", nameEn: "GMC Yukon XL", nameAr: "جي إم سي يوكون XL", descEn: "Commanding road presence.", descAr: "حضور قوي ومتميز.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.20%20PM.jpeg", tripRate: 270, price4h: 980, price8h: 1650, price12h: 2300, extraHour: 185 },
    { id: 9, category: "suvFleet", nameEn: "Ford Taurus", nameAr: "فورد توروس", descEn: "Efficient and strong.", descAr: "قوة وكفاءة عالية.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.23%20PM%20(3).jpeg", tripRate: 180, price4h: 650, price8h: 1100, price12h: 1550, extraHour: 130 },
    { id: 10, category: "suvFleet", nameEn: "Lexus ES 350", nameAr: "لكزس ES 350", descEn: "Supreme silence and comfort.", descAr: "الهدوء المطلق والراحة.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.19%20PM.jpeg", tripRate: 230, price4h: 850, price8h: 1400, price12h: 1950, extraHour: 165 },
    { id: 11, category: "sedanFleet", nameEn: "Ford Taurus", nameAr: "فورد توروس", descEn: "Efficient and strong.", descAr: "قوة وكفاءة عالية.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.23%20PM%20(3).jpeg", tripRate: 160, price4h: 580, price8h: 980, price12h: 1380, extraHour: 115 },
    { id: 12, category: "sedanFleet", nameEn: "Lexus ES 350", nameAr: "لكزس ES 350", descEn: "Supreme silence and comfort.", descAr: "الهدوء المطلق والراحة.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.19%20PM.jpeg", tripRate: 200, price4h: 720, price8h: 1200, price12h: 1700, extraHour: 145 },
    { id: 13, category: "coachesVans", nameEn: "Luxury Buses", nameAr: "حافلات فاخرة", descEn: "Premium comfort for group travels.", descAr: "راحة فائقة للسفر الجماعي.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.19%20PM%20(2).jpeg", tripRate: 500, price4h: 1800, price8h: 3000, price12h: 4200, extraHour: 350 },
    { id: 14, category: "coachesVans", nameEn: "Mercedes Vans", nameAr: "فانات مرسيدس", descEn: "High-capacity VIP transport.", descAr: "نقل كبار الشخصيات بمساحة أكبر.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.22%20PM%20(3).jpeg", tripRate: 350, price4h: 1200, price8h: 2000, price12h: 2800, extraHour: 240 },
    { id: 15, category: "economyCars", nameEn: "Modern Economy Vehicles", nameAr: "سيارات اقتصادية حديثة", descEn: "Cost-effective modern travel.", descAr: "نقل حديث بتكلفة اقتصادية.", image: "gallary/WhatsApp%20Image%202026-02-19%20at%209.40.21%20PM.jpeg", tripRate: 120, price4h: 420, price8h: 700, price12h: 980, extraHour: 85 }
];

// Re-expose to global scope for script.js
window.toggleLanguage = toggleLanguage;
window.currentLang = currentLang;
window.langData = langData;
window.fleetData = fleetData;
window.getCategoryTranslateKey = getCategoryTranslateKey;
