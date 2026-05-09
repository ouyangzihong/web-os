// src/i18n/en.js
export default {
  navbar: {
    home: 'Home',
    about: 'About Us',
    services: 'Design Services',
    products: 'Products',
    projects: 'Projects',
    industries: 'Industries',
    contact: 'Contact'
  },
  hero: {
    title: 'Design Beyond Products',
    subtitle: 'Integrated Interior Solutions for Global Spaces',
    desc: 'Creating immersive environments that redefine spatial experiences.'
  },
  services: {
    design: 'Design Services',
    surfaces: 'Wallcovering & Surfaces',
    furniture: 'Soft Furnishing & Furniture'
  },
  // --- 修改部分开始 ---
  process: {
    stats: [
      { num: '150+', title: 'COMPLETED PROJECTS', desc: 'From private residences to public and commercial spaces.' },
      { num: '80%', title: 'CLIENT REFERRALS', desc: 'Built on long-term trust and collaboration.' },
      { num: '10+', title: 'YEARS OF EXPERIENCE', desc: 'Design-led integrated interior solutions.' },
      { num: '20+', title: 'CORE EXPERTS', desc: 'Design, material, and technical specialists.' }
    ],
    timeline: [
      { step: 'Design Development', sub: '' }, // 移除重复的副标题，保持简洁
      { step: 'Material Selection', sub: '' },
      { step: 'Specification', sub: '' },
      { step: 'Custom Production', sub: '' },
      { step: 'Quality Control', sub: '' },
      { step: 'Delivery', sub: '' }
    ]
  },
  projects: {
    realScene: 'Project Real Scene Picture', // 新增
    residence: {
      title: 'Contemporary Private Residence',
      desc: 'A calm residential space defined by bespoke wallcovering and tailored soft furnishings.',
      location: 'Shanghai, China',
      type: 'Residential'
    },
    hotel: {
      title: 'Luxury Hospitality Interior',
      desc: 'A hospitality interior shaped by material-driven design and custom furnishing solutions.',
      location: 'Dubai, UAE',
      type: 'Hospitality'
    },
    showroom: {
      title: 'Commercial Showroom',
      desc: 'A commercial space expressing brand identity through integrated wall and furnishing systems.',
      location: 'Guangzhou, China',
      type: 'Commercial'
    },
    resort: {
      title: 'Resort Hospitality Interior',
      desc: 'A resort interior shaped by natural textures and bespoke furnishing solutions.',
      location: 'Bali, Indonesia',
      type: 'Hospitality'
    }
  },
  whyChooseUs: {
    title: "Why Choose Us",
    subtitle: "Design-Driven. Globally Delivered",
    items: [
      {
        title: "Bespoke Design",
        desc: "Each project is tailored to its spatial conditions and functional goals. No templates. Only purpose-built solutions."
      },
      {
        title: "Integrated Supply Chain",
        desc: "Design, manufacturing, and delivery operate as one integrated system, ensuring efficiency, consistency, and quality across every stage."
      },
      {
        title: "International Standard",
        desc: "We follow international standards throughout design development, material selection, and project execution worldwide."
      },
      {
        title: "One-Stop Solution",
        desc: "From design services and FF&E to final installation, we deliver fully integrated turnkey solutions under one team."
      }
    ]
  },
  contact: {
    subTitle: 'Common questions',
    title: 'Have questions?\nGet in touch!',
    description: 'We are here to assist you with any questions or concerns you may have. Feel free to reach out to us anytime.',
    location: 'Room 1202, Jinhai Creative Center, Foshan, Guangdong, China',
    email: 'cyc183545@gmail.com',
    phone: '+86 132 4621 0619',
    form: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      privacy: 'I agree that my submitted data is being collected and stored.',
      emailError: 'Please enter a valid email address',
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.'
    }
  },
  footer: {
    slogan: 'Turn your home into something beautiful',
    desc: 'KAIROS is a design-led FF&E and soft furnishing brand specializing in furniture, lighting, textiles, and bespoke interior solutions, delivering integrated services for residential, hospitality, and commercial projects worldwide.',
    office: 'Office',
    location: 'China—',
    links: 'Links',
    getInTouch: 'Get in Touch',   // 按钮文字
    socialTitle: 'Get in Touch',  // 社交媒体栏标题
    rights: 'All Rights Reserved.'
  },
  about: {
    title: 'About Living Architecture',
    intro: 'LIGNE ATELIER is not just a design studio; it is a laboratory of living. We believe that space is an extension of the self, and materials are the language of emotions.',
    
    // 对应设计稿中间的文本段落
    philosophy: {
      title: 'Our Philosophy',
      content: 'Design acts as a bridge between human perception and physical space. We discard rigid templates in favor of a narrative-driven approach. By orchestrating light, texture, and form, we create environments that breathe—spaces that are not merely seen, but deeply felt.'
    },

    // 对应设计稿下方的文本段落
    craft: {
      title: 'Craft & Detail',
      content: 'True luxury lies in the unseen details. From the tactile warmth of a hand-woven fabric to the precision of a joinery detail, every element is curated to harmonize with the whole. We collaborate with global artisans to bring bespoke solutions that stand the test of time.'
    },
    
    viewMore: 'View Selected Projects'
  },
  industries: {
    realScene: 'Project Real Scene Picture',
    villas: {
      title: 'Villas & Luxury Residences',
      tags: 'Private / Bespoke / Material-driven',
      cta: 'View Residential Projects'
    },
    hotels: {
      title: 'Hotels & Resorts',
      tags: 'Atmosphere / Durability / Experience',
      cta: 'Explore Hospitality Solutions'
    },
    showroom: {
      title: 'Sales Gallery & Showroom',
      tags: 'Brand Expression / Visual Impact',
      cta: 'View Commercial Projects'
    },
    office: {
      title: 'Office & Commercial',
      tags: 'Function / Identity / Consistency',
      cta: 'Discover Office Solutions'
    }
  },
}