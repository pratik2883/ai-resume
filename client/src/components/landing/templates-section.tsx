import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function TemplatesSection() {
  const { user } = useAuth();
  const { toast } = useToast();

  const templates = [
    {
      name: "Modern",
      description: "Clean and professional design",
      image: "https://images.unsplash.com/photo-1586282023338-52aa50afb12c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Executive",
      description: "Perfect for senior positions",
      image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Creative",
      description: "Stand out with style",
      image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const handleUseTemplate = (templateName: string) => {
    if (user) {
      toast({
        title: "Template selected",
        description: `${templateName} template will be used in your dashboard.`,
      });
    } else {
      toast({
        title: "Login required",
        description: "Please login or register to use this template.",
      });
    }
  };

  return (
    <div id="templates" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Professional Resume Templates
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Choose from our collection of professionally designed templates.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <div className="group relative" key={index}>
              <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white">
                <img 
                  src={template.image} 
                  alt={`${template.name} template`} 
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 opacity-50"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{template.name}</h3>
                  <p className="text-sm text-gray-200">{template.description}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button variant="link" asChild>
                  <a href="#preview">Preview</a>
                </Button>
                <Button 
                  onClick={() => handleUseTemplate(template.name)}
                  asChild={!!user}
                >
                  {user ? (
                    <Link href="/dashboard">
                      Use this template
                    </Link>
                  ) : (
                    <Link href="/auth">
                      Use this template
                    </Link>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
