import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Leaf, Award, CheckCircle2, Factory, Truck, Phone, MapPin,
  ArrowRight, Sparkles, Wheat, Cog, PackageCheck, Menu, X, Star, Mail
} from "lucide-react";

/**
 * Public landing page for Hindustan Besan Mill.
 *
 * Route: "/" (public) — shown before login. The "Login" / "Enter Management
 * Portal" buttons below link to "/login"; after signing in, the app opens at
 * "/app" (the management platform). See src/App.jsx for the routing.
 *
 * This file is intentionally self-contained (styling, content, and small
 * sub-components all live here) so the whole landing page is one file to
 * edit. To customize:
 *   - Update BRANDS, PURITY_POINTS, MACHINES, and CONTACT below.
 *   - Brand packshots live in /public/brands/ — replace those image files
 *     (or point brand.image at new files) to update the label photos.
 *   - Machine photos: drop real photos in /public/machines/ and set each
 *     entry's `image` field below (currently placeholders with icons).
 */

// ---- Indian tricolor palette (kept local to this file) --------------------
const SAFFRON = "#FF9933";
const INDIA_GREEN = "#138808";
const NAVY = "#0B3557";

// ---- Content — edit here ---------------------------------------------------
const BRANDS = [
  {
    name: "ShuddhSwastik",
    tagline: "स्वाद से सेहत तक",
    taglineEnglish: "From Taste to Health",
    product: "Chana Besan",
    productHindi: "चना बेसन",
    madeFrom: "Made from 100% Pure Chana Dal",
    color: INDIA_GREEN,
    image: "/brands/shuddhswastik.png",
  },
  {
    name: "SuvarnaBharat",
    tagline: "स्वाद से सेहत तक",
    taglineEnglish: "From Taste to Health",
    product: "Watana Peeth",
    productHindi: "वटाणा पीठ",
    madeFrom: "Made from Premium Quality Watana Dal",
    color: NAVY,
    image: "/brands/suvarnabharat.png",
  },
];

const PURITY_POINTS = [
  { icon: ShieldCheck, title: "100% Pure, No Adulteration", desc: "Every batch is milled from pure, unmixed dal — nothing added, nothing hidden." },
  { icon: Award, title: "FSSAI Certified", desc: "Licensed and certified under FSSAI (Lic. No. 21526088009707) for food safety." },
  { icon: Leaf, title: "Traditional Stone Grinding", desc: "Slow, traditional grinding preserves natural flavour, aroma and nutrition." },
  { icon: CheckCircle2, title: "Rigorous Quality Checks", desc: "Every batch is checked for purity, moisture and consistency before packing." },
  { icon: Factory, title: "Hygienic, Modern Processing", desc: "Clean, well-maintained facility from raw dal intake to final packing." },
  { icon: Truck, title: "Fresh, Direct Supply", desc: "Wholesale packs move quickly from mill to market — no long storage." },
];

const FOUNDERS = [
  {
    name: "Sarfaraz Shaikh",
    designation: "Founder",
    phone: "+91 9860205003",
    image: "/founders/founder1.jpg",
    description:
      "Leading Hindustan Besan Mill with a commitment to quality, purity and customer trust.",
  },
  {
    name: "Khalid Mandrupkar",
    designation: "Co-Founder",
    phone: "+91 9673287272",
    image: "/founders/founder2.jpg",
    description:
      "Driving the vision of the mill with a focus on authentic products and long-term relationships.",
  },
];


// Placeholder gallery — replace `image` with a real photo path (e.g.
// "/machines/roaster.jpg") once you add files to /public/machines/, and the
// photo will show in place of the icon automatically.
const MACHINES = [
  { label: "Destoner", icon: Cog, image: "/machines/destoner.jpg" },
  { label: "Hammer", icon: Factory, image: "/machines/hammer.jpg" },
  { label: "Pin Machine", icon: Wheat, image: "/machines/pinmachine.jpg" },
  { label: "Main Grinding Unit", icon: Cog, image: "/machines/pin2.jpg" },
  { label: "Centrifugal : Sieving & Grading", icon: PackageCheck, image: "/machines/centrifugal.jpg" },
//   { label: "Quality Testing Lab", icon: ShieldCheck, image: null },
];

const CONTACT = {
  companyName: "Hindustan Besan Mill",
  address: "A17/2, Chincholi MIDC, Solapur, Maharashtra",
  phones: ["9860205003", "9673287272"],
  email: "hindustanbesanmill@gmail.com", // add your business email here to show it in the contact section
};

const NAV_LINKS = [
  { href: "#brands", label: "Our Brands" },
  { href: "#purity", label: "Purity" },
  { href: "#machines", label: "Our Machines" },
  { href: "#contact", label: "Contact" },
];

export default function Landing() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-wheat-50 text-ink-900">
      {/* Tricolor top strip */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1" style={{ backgroundColor: SAFFRON }} />
        <div className="flex-1 bg-white" />
        <div className="flex-1" style={{ backgroundColor: INDIA_GREEN }} />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-wheat-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-20 h-9 rounded-lg flex items-center justify-center text-white font-display font-bold">
              <img src="/logo2.jpeg" alt="" />
            </div>
            <div>
              <p className="font-display font-semibold leading-tight text-xl sm:text-base">Hindustan Besan Mill</p>
              <p className="text-[15px] sm:text-xs text-ink-800/50 leading-tight">Swad se sehat tak</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-ink-800/70 hover:text-ink-900">
                {l.label}
              </a>
            ))}
          </nav>

          {/* <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-card"
              style={{ backgroundColor: INDIA_GREEN }}
            >
              Login <ArrowRight size={15} />
            </Link>
            <button className="md:hidden text-ink-900" onClick={() => setMobileNavOpen((o) => !o)}>
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div> */}
        </div>

        {mobileNavOpen && (
          <div className="md:hidden border-t border-wheat-200 px-4 py-3 space-y-1 bg-white">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileNavOpen(false)}
                className="block px-2 py-2 text-sm font-medium text-ink-800 rounded-lg hover:bg-wheat-100"
              >
                {l.label}
              </a>
            ))}
            {/* <Link
              to="/login"
              className="block text-center mt-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: INDIA_GREEN }}
            >
              Login */}
            {/* </Link> */}
          </div>
        )}
      </header>

      {/* Hero */}
<section
  className="relative overflow-hidden"
  style={{
    background: `linear-gradient(180deg, ${SAFFRON}14 0%, #ffffff 45%, ${INDIA_GREEN}14 100%)`,
  }}
>
  <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-20 sm:pt-19 sm:pb-28">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

      {/* Logo */}
      <div className="relative flex items-center justify-center order-1 lg:order-2">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">

          {/* Outer circle */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${SAFFRON}, ${INDIA_GREEN})`,
              opacity: 0.98,
            }}
          />

          {/* Inner circle */}
          <div className="absolute inset-4 rounded-full bg-white shadow-card flex items-center justify-center border border-wheat-200">
            <img
              src="/logo1.png"
              alt="Hindustan Besan Mill"
              className="w-[85%] h-[85%] object-contain"
            />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="order-2 lg:order-1 text-center lg:text-left">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
          style={{
            backgroundColor: `${INDIA_GREEN}1A`,
            color: INDIA_GREEN,
          }}
        >
          <Sparkles size={13} />
          100% Pure &middot; FSSAI Certified &middot; Made in India
        </span>

        <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight text-ink-900">
          Pure Grains.
          <br />
          <span style={{ color: SAFFRON }}>Trusted</span>{" "}
          <span style={{ color: INDIA_GREEN }}>Tradition.</span>
        </h1>

        <p className="mt-5 text-ink-800/70 text-base sm:text-lg max-w-md mx-auto lg:mx-0">
          From our mill in Solapur, Maharashtra, <br />
          Hindustan Besan Mill produces <br />

          <strong className="text-ink-900">ShuddhSwastik</strong> Chana Besan and{" "}
          <br />

          <strong className="text-ink-900">SuvarnaBharat</strong> Watana Peeth
          <br />

          two brands built on one promise:
          <br />

          <strong className="text-white px-2 rounded-xl bg-green-800">Swad se Sehat tak</strong>
        </p>

        <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
          <a
            href="#brands"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-card"
            style={{ backgroundColor: SAFFRON }}
          >
            Explore Our Brands
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Brands */}
      <section id="brands" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <SectionHeading eyebrow="Our Brands" title="Two Brands, One Promise of Purity" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-10">
          {BRANDS.map((brand) => (
            <div key={brand.name} className="rounded-2xl border border-wheat-200 bg-white overflow-hidden shadow-card flex flex-col">
              <div className="p-5 sm:p-6 flex items-center justify-center bg-wheat-50" style={{ borderBottom: `4px solid ${brand.color}` }}>
                <img
                  src={brand.image}
                  alt={`${brand.name} — ${brand.product} packaging`}
                  className="w-full max-w-[260px] h-auto rounded-lg shadow-sm"
                />
              </div>
              <div className="p-6 sm:p-7 flex-1 flex flex-col">
                <h3 className="font-display text-2xl font-bold" style={{ color: brand.color }}>{brand.name}</h3>
                <p className="text-sm text-ink-800/60 mt-0.5">{brand.tagline} &middot; {brand.taglineEnglish}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="font-display font-semibold text-lg">{brand.product}</span>
                  <span className="text-ink-800/40 text-sm">({brand.productHindi})</span>
                </div>
                <p className="text-sm text-ink-800/70 mt-1">{brand.madeFrom}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge color={brand.color} icon={ShieldCheck} label="100% Shuddh" />
                  <Badge color={brand.color} icon={Award} label="FSSAI Certified" />
                  <Badge color={brand.color} icon={Star} label="Wholesale Pack" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Purity */}
      <section id="purity" className="py-16 sm:py-24" style={{ backgroundColor: `${INDIA_GREEN}0D` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading eyebrow="Our Purity" title="Why Our Besan & Peeth Stand Apart" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {PURITY_POINTS.map((p) => (
              <div key={p.title} className="bg-white rounded-xl border border-wheat-200 p-5 shadow-card">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${INDIA_GREEN}1A`, color: INDIA_GREEN }}>
                  <p.icon size={20} />
                </div>
                <h4 className="font-display font-semibold text-ink-900">{p.title}</h4>
                <p className="text-sm text-ink-800/60 mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Machines */}
<section id="machines" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 overflow-hidden">
  <SectionHeading eyebrow="Behind the Scenes" title="Our Machines & Production Line" />

  <p className="text-center text-ink-800/60 text-sm max-w-xl mx-auto mt-3">
    A look at the equipment we use to clean, grind, roast and pack every batch.
  </p>

  {/* Self rotating carousel */}
  <div className="relative mt-10 overflow-hidden">
    <div className="flex w-max animate-machine-scroll hover:[animation-play-state:paused]">
      {/* First set */}
      {MACHINES.map((m, index) => (
        <div
          key={`machine-1-${index}`}
          className="w-[180px] sm:w-[220px] lg:w-[250px] flex-shrink-0 mr-4 sm:mr-6"
        >
          <div className="rounded-xl overflow-hidden border border-wheat-200 bg-white shadow-card">
            <div
              className="aspect-square flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${SAFFRON}1A, ${INDIA_GREEN}1A)`,
              }}
            >
              {m.image ? (
                <img
                  src={m.image}
                  alt={m.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <m.icon size={36} className="text-ink-800/30" />
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-center py-2.5 px-2 text-ink-800">
              {m.label}
            </p>
          </div>
        </div>
      ))}

      {/* Duplicate set for seamless infinite scrolling */}
      {MACHINES.map((m, index) => (
        <div
          key={`machine-2-${index}`}
          className="w-[180px] sm:w-[220px] lg:w-[250px] flex-shrink-0 mr-4 sm:mr-6"
        >
          <div className="rounded-xl overflow-hidden border border-wheat-200 bg-white shadow-card">
            <div
              className="aspect-square flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${SAFFRON}1A, ${INDIA_GREEN}1A)`,
              }}
            >
              {m.image ? (
                <img
                  src={m.image}
                  alt={m.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <m.icon size={36} className="text-ink-800/30" />
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-center py-2.5 px-2 text-ink-800">
              {m.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ================= FOUNDERS SECTION ================= */}
<section
  id="founders"
  className="relative overflow-hidden py-16 sm:py-24"
  style={{
    background: `linear-gradient(180deg, #ffffff 0%, ${SAFFRON}0A 50%, ${INDIA_GREEN}0A 100%)`,
  }}
>
  <div className="max-w-6xl mx-auto px-4 sm:px-6">

    {/* Section Heading */}
    <SectionHeading
      eyebrow="The People Behind Our Journey"
      title="Meet Our Founders"
    />

    <p className="text-center text-ink-800/60 text-sm sm:text-base max-w-xl mx-auto mt-3">
      Built on generations of trust, quality and dedication to bringing
      pure and authentic products to every home.
    </p>

    {/* Founders */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mt-10">

      {FOUNDERS.map((founder) => (
        <div
          key={founder.name}
          className="group bg-white rounded-2xl border border-wheat-200 shadow-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >

          {/* Founder Image */}
          <div
            className="relative aspect-[4/3] flex items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${SAFFRON}14, ${INDIA_GREEN}14)`,
            }}
          >
            {founder.image ? (
              <img
                src={founder.image}
                alt={founder.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <founder.icon
                size={70}
                className="text-ink-800/20"
              />
            )}
          </div>

          {/* Founder Details */}
          <div className="p-5 sm:p-6 text-center">

            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-900">
              {founder.name}
            </h3>

            <p
              className="text-sm font-semibold mt-1"
              style={{ color: SAFFRON }}
            >
              {founder.designation}
            </p>

            <p className="text-sm text-ink-800/60 mt-3 leading-relaxed">
              {founder.description}
            </p>

            {/* Contact */}
            <div className="flex justify-center mt-5">
              <a
                href={`tel:${founder.phone}`}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold border transition-colors hover:bg-wheat-50"
                style={{
                  borderColor: `${INDIA_GREEN}55`,
                  color: INDIA_GREEN,
                }}
              >
                <Phone size={15} />
                {founder.phone}
              </a>
            </div>

          </div>
        </div>
      ))}

    </div>
  </div>
</section>

      {/* <section id="machines" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <SectionHeading eyebrow="Behind the Scenes" title="Our Machines & Production Line" />
        <p className="text-center text-ink-800/60 text-sm max-w-xl mx-auto mt-3">
          A look at the equipment we use to clean, grind, roast and pack every batch.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mt-10">
          {MACHINES.map((m) => (
            <div key={m.label} className="rounded-xl overflow-hidden border border-wheat-200 bg-white shadow-card">
              <div
                className="aspect-square flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${SAFFRON}1A, ${INDIA_GREEN}1A)` }}
              >
                {m.image ? (
                  <img src={m.image} alt={m.label} className="w-full h-full object-cover" />
                ) : (
                  <m.icon size={36} className="text-ink-800/30" />
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-center py-2.5 px-2 text-ink-800">{m.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-ink-800/40 mt-6">
          Add your own machine photos by placing image files in <code className="bg-wheat-100 px-1.5 py-0.5 rounded">frontend/public/machines/</code> and
          setting the <code className="bg-wheat-100 px-1.5 py-0.5 rounded">image</code> field for each entry in this page's <code className="bg-wheat-100 px-1.5 py-0.5 rounded">MACHINES</code> list.
        </p>
      </section> */}


      {/* Contact / Footer */}
      <footer id="contact" className="text-white" style={{ backgroundColor: NAVY }}>
        <div className="h-1.5 w-full flex">
          <div className="flex-1" style={{ backgroundColor: SAFFRON }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ backgroundColor: INDIA_GREEN }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div>
            <p className="font-display text-xl font-bold">{CONTACT.companyName}</p>
            <p className="text-white/60 text-sm mt-2 max-w-xs">
              Makers of ShuddhSwastik Chana Besan and SuvarnaBharat Watana Peeth — pure,
              traditionally milled, and FSSAI certified.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3">Get in Touch</p>
            <div className="space-y-2.5 text-sm">
              <p className="flex items-start gap-2 text-white/80"><MapPin size={16} className="shrink-0 mt-0.5" /> {CONTACT.address}</p>
              {CONTACT.phones.map((phone) => (
                <p key={phone} className="flex items-center gap-2 text-white/80">
                  <Phone size={16} className="shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-white">{phone}</a>
                </p>
              ))}
              {CONTACT.email && (
                <p className="flex items-center gap-2 text-white/80">
                  <Mail   size={16} className="shrink-0"/>
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a>
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-3">Management Portal</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-ink-900 bg-white"
            >
              Login <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {CONTACT.companyName}. Made in India.
        </div>
      </footer>
    </div>
  );
}

const SectionHeading = ({ eyebrow, title }) => (
  <div className="text-center">
    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: INDIA_GREEN }}>{eyebrow}</span>
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 mt-2">{title}</h2>
  </div>
);

const Badge = ({ color, icon: Icon, label }) => (
  <span
    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
    style={{ backgroundColor: `${color}1A`, color }}
  >
    <Icon size={12} /> {label}
  </span>
);