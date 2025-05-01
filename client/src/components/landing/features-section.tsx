import {
  Zap,
  LayoutTemplate,
  PlusCircle,
  Download,
  FolderPlus,
  ShieldCheck,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      title: "AI-Powered Content Generation",
      description:
        "Let our AI suggest professional content for your resume based on your background and industry standards.",
    },
    {
      icon: <LayoutTemplate className="h-6 w-6 text-white" />,
      title: "Professional Templates",
      description:
        "Choose from a variety of professionally designed templates that are optimized for ATS systems.",
    },
    {
      icon: <PlusCircle className="h-6 w-6 text-white" />,
      title: "Customizable Sections",
      description:
        "Add, remove, and rearrange sections to highlight your most relevant experiences and skills.",
    },
    {
      icon: <Download className="h-6 w-6 text-white" />,
      title: "One-Click PDF Download",
      description:
        "Export your finished resume as a professional PDF ready to be sent to employers.",
    },
    {
      icon: <FolderPlus className="h-6 w-6 text-white" />,
      title: "Save Multiple Versions",
      description:
        "Create and save multiple resume versions tailored for different job applications.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      title: "Privacy Guaranteed",
      description:
        "Your data is securely stored and never shared with third parties.",
    },
  ];

  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Features that make resume building easy
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Everything you need to create, customize, and download professional resumes.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div className="pt-6" key={index}>
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
