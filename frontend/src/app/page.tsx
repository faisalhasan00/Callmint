"use client";

import React, { useEffect } from "react";
import { getToken } from "@/lib/api";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import RoundTheClock from "@/components/landing/RoundTheClock";
import MultiLanguage from "@/components/landing/MultiLanguage";
import HandlesItAll from "@/components/landing/HandlesItAll";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  // Keeping the token check just in case we need it here, though it's not strictly necessary for UI rendering right now unless we redirect.
  useEffect(() => {
    const token = getToken();
    // if (token) {
    //   setIsAuthenticated(true);
    // }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <Hero />
      <FeaturesGrid />
      <RoundTheClock />
      <MultiLanguage />
      <HandlesItAll />
      <HowItWorks />
      <Footer />
    </div>
  );
}
