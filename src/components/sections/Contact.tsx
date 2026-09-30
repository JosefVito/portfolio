import { ContactForm } from "@/components/contact/ContactForm";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";
import { whatsappHref } from "@/lib/whatsapp";

export function Contact() {
  return (
    <section id="contact" className="section overflow-hidden">
      <Marquee word="SAY HELLO" position="top" />
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow text="Get in touch" />
            <SectionHeading lead="Let's build" accent="something." />
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm"><span aria-hidden className="size-2 rounded-full bg-accent" />{profile.availabilityWindow}</span>
            <p className="label mt-2 text-muted">~24h reply · GMT+8, EU overlap</p>
          </div>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="card border-accent/60 p-8 md:p-10">
            <p className="label text-accent">Fastest reply</p>
            <h3 className="display mt-3 text-3xl font-bold">Chat on WhatsApp</h3>
            <p className="mt-3 text-muted">Tell me what you&apos;re building. I reply within a day, usually much faster.</p>
            <div className="mt-6"><Button href={whatsappHref()} external>Open WhatsApp →</Button></div>
            <p className="label mt-8 text-muted">Or email</p>
            <p className="mt-2 flex flex-wrap items-center gap-3 font-mono text-sm"><span className="select-all">{profile.email}</span><CopyButton text={profile.email} /></p>
            <div className="mt-6 flex gap-4 label text-muted">
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-fg">LinkedIn</a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="hover:text-fg">GitHub</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><ContactForm /></Reveal>
        </div>
      </div>
    </section>
  );
}
