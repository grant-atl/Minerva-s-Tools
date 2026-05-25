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
    <section className="border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <h2 className="text-lg font-bold text-foreground mb-4">About This Tool</h2>
        <div
          className="prose prose-sm text-muted-foreground leading-relaxed mb-10 [&_p]:mb-3"
          dangerouslySetInnerHTML={{ __html: about }}
        />

        {faqs.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>
                    <p>{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
      </div>
    </section>
  );
}
