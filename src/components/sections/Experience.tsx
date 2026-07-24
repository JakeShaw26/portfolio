import { Section } from "@/components/layout/Section";
import { Timeline } from "@/components/sections/Timeline";
import { getAllExperience } from "@/lib/cms/experience";

export async function Experience() {
  const experience = await getAllExperience();

  return (
    <Section id="experience" index="03" label="Experience">
      <Timeline experience={experience} />
    </Section>
  );
}
