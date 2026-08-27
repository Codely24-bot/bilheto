import { Hero } from "../components/sections/Hero";
import { QuickInfoCards } from "../components/sections/QuickInfoCards";
import { About } from "../components/sections/About";
import { Services } from "../components/sections/Services";
import { Ministries } from "../components/sections/Ministries";
import { Events } from "../components/sections/Events";
import { Media } from "../components/sections/Media";
import { JoinUs } from "../components/sections/JoinUs";
import { Location } from "../components/sections/Location";

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
      <JoinUs />
      <Location />
    </>
  );
}
