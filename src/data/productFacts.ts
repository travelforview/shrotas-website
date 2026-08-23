export const productFacts = {
  category: "Packaged drinking water",
  volume: "750 ml",
  tagline: "The Art of Hydration",
  mineralLine: "Crafted with essential minerals",
  ph: "pH 8+ with electrolytes",
  minerals: ["Magnesium", "Calcium", "Potassium"],
  ingredients: "Purified water, calcium chloride, magnesium sulphate & potassium bicarbonate.",
  recyclable: "Recyclable bottle",
  manufacturer: "Shrotas Beverages Private Limited",
  location: "Savli, Manjusar GIDC, Vadodara, Gujarat — 391775",
} as const;

export const businessContent = {
  heading: "Shrotas for business",
  categories: ["Corporate partnerships", "Hospitality", "Events", "Distribution", "Business enquiries"],
  contact: { phone: "+91 8690703455", phoneHref: "tel:+918690703455", email: "Sales@shrotas.com", emailHref: "mailto:Sales@shrotas.com" },
} as const;

export const assets = {
  front: "/assets/shrotas/bottle-front.png",
  side: "/assets/shrotas/bottle-side.png",
  back: "/assets/shrotas/bottle-back.png",
  spin: "/assets/shrotas/bottle-spin.mp4",
  logo: "/assets/shrotas/logo.png",
} as const;
