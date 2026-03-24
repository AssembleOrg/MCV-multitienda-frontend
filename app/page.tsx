import TrustBadges from "@/components/layout/TrustBadges";
import WelcomeBanner from "@/components/landing/WelcomeBanner";
import PromoSlider from "@/components/landing/PromoSlider";
import CategoriesSection from "@/components/landing/CategoriesSection";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import SocialSection from "@/components/landing/SocialSection";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const store = await prisma.multitienda_store.findFirst().catch(() => null);

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
      <SocialSection
        instagram={store?.instagram}
        facebook={store?.facebook}
        tiktok={store?.tiktok}
      />
    </main>
  );
}
