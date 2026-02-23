import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    if (!payload.name || !payload.email || !payload.message) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-enquiry", { body: payload });
      if (error) throw error;
      toast({ title: "Message sent", description: "We'll get back to you shortly." });
      form.reset();
    } catch (err: any) {
      toast({ title: "Failed to send", description: err.message || "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }, []);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      <div className="px-6 md:px-12">
        <p className="micro-text text-muted-foreground mb-4">Reach Out</p>
        <h1 className="editorial-heading text-foreground mb-16 md:mb-24" style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}>
          Contact
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {/* Map */}
          <div>
            <div className="aspect-square md:aspect-[4/3] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1!2d88.3631!3d22.5726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027683b5a1e1e1%3A0x1!2sChittaranjan%20Avenue%2C%20Kolkata%2C%20West%20Bengal%20700073!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "grayscale(100%) contrast(1.05) opacity(0.9)",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Art at Central — Kolkata location"
              />
            </div>
          </div>

          {/* Contact Info & Form */}
          <div>
            <div className="mb-16">
              <p className="micro-text text-muted-foreground mb-6">Visit Us</p>
              <p className="font-serif text-foreground leading-tight" style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}>
                Building No. 112, 4th Floor,<br />
                Lohia House Building,<br />
                Near By ICICI Bank,<br />
                Chittaranjan Avenue (Central Ave),<br />
                Kolkata Central, Kolkata-700073,<br />
                West Bengal
              </p>
              <div className="mt-8 flex flex-col gap-2">
                <p className="body-text text-muted-foreground">info@artatcentral.com</p>
                <p className="body-text text-muted-foreground">+91 33 000 0000</p>
              </div>
            </div>

            <div>
              <p className="micro-text text-muted-foreground mb-8">Send a Message</p>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" className="input-editorial w-full" required />
                <input type="email" name="email" placeholder="Email" className="input-editorial w-full" required />
                <input type="text" name="subject" placeholder="Subject" className="input-editorial w-full" />
                <textarea name="message" placeholder="Message" rows={5} className="input-editorial w-full resize-none" required />
                <button
                  type="submit"
                  disabled={submitting}
                  className="micro-text border border-foreground text-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-500 self-start mt-4 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
};

export default Contact;
