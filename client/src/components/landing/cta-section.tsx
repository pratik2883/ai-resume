import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function CtaSection() {
  const { user } = useAuth();

  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to boost your job search?</span>
          <span className="block text-blue-200">Start creating your AI-powered resume today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Button className="bg-white text-primary hover:bg-gray-50" size="lg" asChild>
              <Link href={user ? "/dashboard" : "/auth"}>
                Get started
              </Link>
            </Button>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Button variant="secondary" size="lg" asChild>
              <a href="#features">
                Learn more
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
