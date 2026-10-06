import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { DeferRelease } from "@/components/home/defer-release";
import { Experience } from "@/components/home/experience";
import { PromoVideo } from "@/components/home/promo-video";
import { Toolbox } from "@/components/home/toolbox";
import { Work } from "@/components/home/work";
import { SiteFooter } from "@/components/site-footer";

/** The first screen is the AMYGO promo, full-bleed; About introduces me right after it. */
export default function Home() {
  return (
    <>
      <DeferRelease />
      <PromoVideo />
      <main id="main" className="page-shell relative z-[2]">
        <About />
        <Work />
        <Experience />
        <Toolbox />
        <Contact />
      </main>
      <SiteFooter variant="home" />
    </>
  );
}
