import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export interface FAQ {
  q: string;
  a: string;
}

interface ToolContentProps {
  about: string;
  faqs: FAQ[];
}

export default function ToolContent({ about, faqs }: ToolContentProps) {
  return (
    <section className="tool-content container mx-auto mt-12 border-t border-border px-4 py-10 sm:px-6">
      <div className={`grid grid-cols-1 gap-10 ${faqs.length > 0 ? "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]" : ""}`}>
        <article>
          <h2 className="mb-5 text-xl font-medium tracking-tight text-foreground">
            About this tool
          </h2>
          <div
            className="prose prose-sm max-w-none leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_p]:mb-3 [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: about }}
          />
        </article>

        {faqs.length > 0 && (
          <article>
            <h2 className="mb-5 text-xl font-medium tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <Accordion type="multiple" className="bg-card">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-relaxed text-muted-foreground">{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </article>
        )}
      </div>
    </section>
  );
}
