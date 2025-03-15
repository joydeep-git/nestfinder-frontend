"use client";

import React from "react";
import { MotionDiv, MotionHeading, MotionText } from "@/components/utils/motionWrapper";

const About = () => {
  return (
    <MotionDiv className="space-y-6 p-6"> {/* Add spacing and padding */}
      <div className="space-y-4"> {/* Ensures gap between heading and text */}
        <MotionHeading>About Us</MotionHeading>

        <MotionText >
          <strong>About Nest Finder 🏡</strong>
          <br />
          Welcome to Nest Finder - your go-to platform for finding and listing properties effortlessly. Whether you are buying, selling, or renting, we make the process simple, transparent, and hassle-free.
          <br /><br />
          Our goal is to connect property seekers with their perfect home while helping sellers and landlords reach the right buyers. With a seamless user experience, powerful search filters, and verified listings, Nest Finder ensures you make informed decisions with confidence.
          <br /><br />
          Start your journey today and find your dream home with Nest Finder!
        </MotionText>
      </div>
    </MotionDiv>
  );
};

export default About;
