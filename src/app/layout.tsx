import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import ClientLayoutHandler from "../components/ClientLayoutHandler";



export const metadata: Metadata = {
  title: "NestFinder",
  description: "Buy, Sell or Rent properties directly from owners.",
};


const RootLayout = ({ children }: { children: Readonly<ReactNode> }) => {

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <StoreProvider>
          <ClientLayoutHandler>{children}</ClientLayoutHandler>
          <Toaster position="top-center" reverseOrder={false} />
        </StoreProvider>
      </body>
    </html >
  );
};

export default RootLayout;