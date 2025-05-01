import { Helmet } from "react-helmet";
import MainLayout from "@/layouts/main-layout";
import HeroSection from "@/components/landing/hero-section";
import AiPromptDemo from "@/components/landing/ai-prompt-demo";
import FeaturesSection from "@/components/landing/features-section";
import TemplatesSection from "@/components/landing/templates-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import CtaSection from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <MainLayout>
      <Helmet>
        <title>AI Resume Builder - Create Professional Resumes with AI</title>
        <meta name="description" content="Create professional resumes in minutes with our AI-powered resume builder. Get tailored content suggestions and stand out from the crowd." />
      </Helmet>
      
      <HeroSection />
      <AiPromptDemo />
      <FeaturesSection />
      <TemplatesSection />
      <TestimonialsSection />
      <CtaSection />
    </MainLayout>
  );
}
