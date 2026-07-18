import Header from "@/components/Header";
import NeedleLoader from "@/components/NeedleLoader";
import HeroTypographicField from "@/components/HeroTypographicField";
import ServiceTickerBridge from "@/components/ServiceTickerBridge";
import HomeCinema from "@/components/HomeCinema";

/**
 * V3 locked homepage order:
 * NeedleLoader -> Header -> HeroTypographicField -> ServiceTickerBridge
 * -> HomeCinema (desktop: pinned CinemaSequence / mobile: MobileCinema),
 * each including the ConversionBridge + FooterPayoff.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <NeedleLoader />
        <HeroTypographicField />
        <ServiceTickerBridge />
        <HomeCinema />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
