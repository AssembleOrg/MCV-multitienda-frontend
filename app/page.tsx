import TrustBadges from "@/components/layout/TrustBadges";
import WelcomeBanner from "@/components/landing/WelcomeBanner";
import PromoSlider from "@/components/landing/PromoSlider";
import CategoriesSection from "@/components/landing/CategoriesSection";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import SocialSection from "@/components/landing/SocialSection";

export default function HomePage() {
  return (
    <main>
      {/* Trust Badges - Línea con iconos animados */}
      <TrustBadges />

      {/* Hero Banner - Logo centrado con efectos WOW */}
      <WelcomeBanner />

      {/* Promo Slider - Marquee ofertas */}
      <PromoSlider />

      {/* Categorías - Badges con glow pulsante */}
      <CategoriesSection />

      {/* Productos Destacados */}
      <FeaturedProducts />

      {/* Social Section - Redes sociales */}
      <SocialSection />
    </main>
  );
}
