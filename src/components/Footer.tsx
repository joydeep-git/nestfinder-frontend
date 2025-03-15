import React from 'react';
import Link from 'next/link';


const Footer = () => {


  return (
    <footer className="bg-card text-card-foreground py-12 mt-auto border-t">

      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div>
            <h3 className="text-lg font-bold mb-4">Nestfinder</h3>
            <p className="mb-4 text-muted-foreground">Find your dream property with our easy-to-use platform.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground flex flex-col">
              <Link href="/products" className="hover:text-primary transition">Properties</Link>
              <Link href="/about" className="hover:text-primary transition">About Us</Link>
              <Link href="/faqs" className="hover:text-primary transition">FAQs</Link>
            </ul>
          </div>

          {/* <div>
            <h3 className="text-lg font-bold mb-4">Property Types</h3>
            <ul className="space-y-2 text-muted-foreground">
              <Link href="/properties/houses" className="hover:text-primary transition">Houses</Link>
              <Link href="/properties/apartments" className="hover:text-primary transition">Apartments</Link>
              <Link href="/properties/land" className="hover:text-primary transition">Land</Link>
              <Link href="/properties/commercial" className="hover:text-primary transition">Commercial</Link>
            </ul>
          </div> */}

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-muted-foreground">
              <p>Hooghly</p>
              <p>West Bengal, 712148</p>
              <p className="mt-2">joydeepdas@zohomail.com</p>
              <p>+91 6290589624</p>
            </address>
          </div>
        </div>

        <div className="border-t border-muted mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Nestfinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer