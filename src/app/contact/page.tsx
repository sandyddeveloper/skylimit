import { SectionContainer } from "@/components/layout/section-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <SectionContainer>
      <h1 className="text-4xl font-bold">Contact Me</h1>
      <p className="mt-2 text-muted-foreground">
        Send a message using the form below. I will get back to you as soon as possible.
      </p>
      <form className="mt-8 max-w-md space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <Input id="name" name="name" type="text" placeholder="Your Name" required className="mt-1" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <Input id="email" name="email" type="email" placeholder="Your Email" required className="mt-1" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">Message</label>
          <Textarea id="message" name="message" placeholder="Your Message" required className="mt-1" />
        </div>
        <Button type="submit">Send Message</Button>
      </form>
    </SectionContainer>
  );
}
