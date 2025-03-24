"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Page = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>

      <Accordion type="single" collapsible className="w-full">

        <AccordionItem value="zero-brokerage">
          <AccordionTrigger className="text-left">Is Nest Finder a zero-brokerage platform?</AccordionTrigger>
          <AccordionContent>
            Yes! Nest Finder ensures **zero brokerage** for buyers and tenants. We connect you directly to property owners or dealers.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="connects-buyers">
          <AccordionTrigger className="text-left">How does Nest Finder connect buyers with dealers?</AccordionTrigger>
          <AccordionContent>
            We provide a **direct connection** between buyers and verified dealers, ensuring a smooth and hassle-free property transaction.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="list-properties">
          <AccordionTrigger className="text-left">Can I list my property for free?</AccordionTrigger>
          <AccordionContent>
            Yes! You can list your property **for free** on Nest Finder and reach thousands of potential buyers and tenants.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verified-listings">
          <AccordionTrigger className="text-left">Are the property listings verified?</AccordionTrigger>
          <AccordionContent>
            Absolutely! Our team verifies each listing to ensure authenticity, so you can **trust every property** on our platform.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="support">
          <AccordionTrigger className="text-left">How can I contact support?</AccordionTrigger>
          <AccordionContent>
            You can reach out to our **24/7 customer support** via email at joydeepdas@zohomail.com or call us at +91-6290589624.
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
};

export default Page;
