import { Hero } from "../components/sections/Hero";
import { QuickInfoCards } from "../components/sections/QuickInfoCards";
import { About } from "../components/sections/About";
import { Services } from "../components/sections/Services";
import { Ministries } from "../components/sections/Ministries";
import { Events } from "../components/sections/Events";
import { Media } from "../components/sections/Media";
import { Gallery } from "../components/sections/Gallery";
import { JoinUs } from "../components/sections/JoinUs";
import { Location } from "../components/sections/Location";
import { Contact } from "../components/sections/Contact";

export function Home() {
  return (
    <>
      <Hero />
      <QuickInfoCards />
      <About />
      <Services />
      <Ministries />
      <Events />
      <Media />
      <Gallery />
      <JoinUs />
      <Location />
      <Contact />
    </>
  );
}
