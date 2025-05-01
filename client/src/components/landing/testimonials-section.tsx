import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Specialist",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      quote: "The AI suggestions helped me highlight achievements I hadn't even thought to include. I got three interview calls within a week of sending out my new resume!",
    },
    {
      name: "Michael Chen",
      role: "Software Developer",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      quote: "As a developer, I wanted a clean, straightforward resume. This tool helped me organize my technical skills and projects perfectly. The templates are ATS-friendly too!",
    },
    {
      name: "Emily Rodriguez",
      role: "Recent Graduate",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      quote: "As a recent graduate, I was struggling to make my limited experience look professional. The AI suggestions helped me emphasize my relevant coursework and projects. Got my first job!",
    },
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What our users say
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm" key={index}>
              <div className="flex items-center mb-4">
                <img 
                  className="h-12 w-12 rounded-full" 
                  src={testimonial.image} 
                  alt={`${testimonial.name} avatar`}
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.quote}</p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
