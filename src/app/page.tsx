"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useTheme } from "@/hooks/use-theme";
import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about-section";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { ContactSection } from "@/components/sections/contact-section";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const { theme } = useTheme();
  const cloudsRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cloudsEffect: any = null;
    let ringsEffect: any = null;
    let isCleanedUp = false;

    const initVanta = async () => {
      try {
        const THREE_COMPAT: any = { ...THREE };
        THREE_COMPAT.PlaneBufferGeometry = THREE.PlaneGeometry;
        THREE_COMPAT.VertexColors = true;

        if (typeof window !== "undefined") {
          (window as any).THREE = THREE_COMPAT;
        }

        const CLOUDS = (await import("vanta/dist/vanta.clouds.min")).default;
        const RINGS = (await import("vanta/dist/vanta.rings.min")).default;

        const isDark = theme === "dark";

        if (!isCleanedUp) {
          if (cloudsRef.current) {
            cloudsEffect = CLOUDS({
              el: cloudsRef.current,
              THREE: THREE_COMPAT,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              backgroundColor: isDark ? 0x06070a : 0xf8fafc,
              skyColor: isDark ? 0x0c1020 : 0xc0e0ff,
              cloudColor: isDark ? 0x1e1b4b : 0xffffff,
            });
          }

          if (ringsRef.current) {
            ringsEffect = RINGS({
              el: ringsRef.current,
              THREE: THREE_COMPAT,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
              backgroundColor: isDark ? 0x06070a : 0xf8fafc,
              color: isDark ? 0x6366f1 : 0x3b82f6,
            });
          }
        }
      } catch (err) {
        console.error("Vanta initialization error: ", err);
      }
    };

    initVanta();

    return () => {
      isCleanedUp = true;
      if (cloudsEffect) cloudsEffect.destroy();
      if (ringsEffect) ringsEffect.destroy();
    };
  }, [theme]);

  useEffect(() => {
    // 1. Cross-fade background canvases on scroll using GSAP ScrollTrigger
    gsap.fromTo(
      cloudsRef.current,
      { opacity: 0.95 },
      {
        opacity: 0,
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "35% top",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      ringsRef.current,
      { opacity: 0 },
      {
        opacity: 0.8,
        scrollTrigger: {
          trigger: "body",
          start: "15% top",
          end: "55% top",
          scrub: true,
        },
      }
    );

    // 2. Animate sections as they scroll into view
    if (!sectionsRef.current) return;
    const sections = sectionsRef.current.querySelectorAll(".scroll-section");
    sections.forEach((sec) => {
      gsap.fromTo(
        sec,
        {
          opacity: 0,
          y: 70,
          scale: 0.95,
          rotateX: 5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <div className={`relative min-h-screen text-foreground overflow-x-hidden transition-colors duration-500 ${theme === "dark" ? "bg-[#06070a]" : "bg-[#f8fafc]"}`}>
      {/* Global Vanta Canvas Layers (No overlays on top) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div ref={cloudsRef} className="absolute inset-0 transition-opacity duration-300" style={{ opacity: 0.95 }} />
        <div ref={ringsRef} className="absolute inset-0 transition-opacity duration-300" style={{ opacity: 0 }} />
      </div>

      {/* Main content sections */}
      <div ref={sectionsRef} className="relative z-10 flex flex-col gap-16 md:gap-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="scroll-section">
          <Hero />
        </div>
        <div className="scroll-section">
          <AboutSection />
        </div>
        <div className="scroll-section">
          <Skills />
        </div>
        <div className="scroll-section">
          <Experience />
        </div>
        <div className="scroll-section">
          <FeaturedProjects />
        </div>
        <div className="scroll-section">
          <ContactSection />
        </div>
      </div>
    </div>
  );
}
