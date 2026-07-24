import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

// Experience/work content is fetched from Contentful; refresh hourly so edits
// land without a redeploy (see ARCHITECTURE.md).
export const revalidate = 3600;

/*
 * Static section scaffold with placeholder content (typed in src/lib/content).
 * GSAP motion primitives layer on in Phase 2; real copy swaps in via the
 * content layer with no component changes.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <About />
        <ProjectShowcase />
        <Experience />
        <Skills />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
