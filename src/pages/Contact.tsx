const Contact = () => {
  return (
    <div className="min-h-screen pt-32 md:pt-40">
      <div className="px-6 md:px-12">
        <p className="micro-text text-muted-foreground mb-4">Reach Out</p>
        <h1 className="editorial-heading text-foreground text-5xl md:text-8xl mb-16 md:mb-24">
          Contact
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {/* Map */}
          <div>
            <div className="aspect-square md:aspect-[4/3] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.2!2d18.4241!3d-33.9249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU1JzI5LjYiUyAxOMKwMjUnMjYuOCJF!5e0!3m2!1sen!2sza!4v1"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "grayscale(100%) contrast(1.1) brightness(1.05)",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Art at Central location"
              />
            </div>
          </div>

          {/* Contact Info & Form */}
          <div>
            <div className="mb-16">
              <p className="micro-text text-muted-foreground mb-6">Visit Us</p>
              <p className="font-serif text-foreground text-3xl md:text-5xl leading-tight">
                Building No. 112, 4th Floor,<br />
                Lohia House Building,<br />
                Near By ICICI Bank,<br />
                Chittaranjan Avenue (Central Ave),<br />
                Kolkata Central, Kolkata-700073,<br />
                West Bengal
              </p>
              <div className="mt-8 flex flex-col gap-2">
                <p className="body-text text-muted-foreground">info@artatcentral.com</p>
                <p className="body-text text-muted-foreground">+27 21 000 0000</p>
              </div>
            </div>

            <div>
              <p className="micro-text text-muted-foreground mb-8">Send a Message</p>
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Name" className="input-editorial w-full" />
                <input type="email" placeholder="Email" className="input-editorial w-full" />
                <input type="text" placeholder="Subject" className="input-editorial w-full" />
                <textarea placeholder="Message" rows={5} className="input-editorial w-full resize-none" />
                <button
                  type="submit"
                  className="micro-text border border-foreground text-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-500 self-start mt-4"
                >
                  Send Message
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
