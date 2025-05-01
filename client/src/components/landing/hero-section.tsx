import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Build your resume with</span>
              <span className="block text-primary">AI assistance</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-3xl">
              Create professional resumes in minutes with our AI-powered resume builder. Get tailored content suggestions and stand out from the crowd.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href={user ? "/dashboard" : "/auth"}>
                  Get Started
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#demo">
                  Try Demo
                </a>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
              alt="Resume preview" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
