import { ContactForm } from 'app/components/contact-form';

export default function ContactPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Contact Me</h1>
      <div className="max-w-xl">
        <p className="mb-8 text-neutral-800 dark:text-neutral-200">
          Have a question or want to work together? Fill out the form below and I'll get back to you
          as soon as possible.
        </p>
        <ContactForm />
      </div>
    </section>
  );
}
