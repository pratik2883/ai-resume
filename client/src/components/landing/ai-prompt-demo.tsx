import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function AiPromptDemo() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<any | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter details about your background to generate a resume.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please create an account or login first to use the AI resume generator.",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          type: "complete",
        }),
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          // User is not authenticated or session expired
          throw new Error("Please log in to generate resume content");
        } else {
          throw new Error("Failed to generate resume content");
        }
      }

      const data = await response.json();
      
      // If user is logged in, redirect to dashboard with the prompt
      if (user) {
        // Store the prompt in session storage to use in the dashboard
        sessionStorage.setItem('resumePrompt', prompt);
        setLocation('/dashboard');
        return;
      }

      setGeneratedResume(data.content);

      // Scroll to result
      setTimeout(() => {
        document.getElementById("ai-result-preview")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate resume content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = () => {
    toast({
      title: "Create an account",
      description: "Sign up to edit and save this resume.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Create an account",
      description: "Sign up to download this resume as PDF.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Create an account",
      description: "Sign up to save this resume to your account.",
    });
  };

  return (
    <div id="demo" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ask AI to build your resume
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Simply describe your background and let our AI generate a professional resume for you.
          </p>
        </div>
        
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 p-4 bg-white rounded-lg shadow-md">
            <Textarea
              className="flex-1 p-3 min-h-[100px]"
              placeholder="Describe your experience, skills, and education. For example: 'I'm a software engineer with 5 years of experience in React and Node.js. I graduated from MIT with a Computer Science degree and worked at Google and Amazon...'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
            <div className="flex items-end">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()}
                className="w-full md:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Sample generated resume result */}
        {generatedResume && (
          <div className="mt-8 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md" id="ai-result-preview">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Generated Resume</h3>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleEdit}>
                  Edit
                </Button>
                <Button size="sm" onClick={handleDownload}>
                  Download PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {generatedResume.personalInfo?.firstName} {generatedResume.personalInfo?.lastName}
                </h1>
                <p className="text-gray-600">{generatedResume.personalInfo?.title}</p>
                <div className="text-sm text-gray-500 mt-1">
                  {generatedResume.personalInfo?.email} | {generatedResume.personalInfo?.phone} | {generatedResume.personalInfo?.address}
                </div>
              </div>
              
              {generatedResume.personalInfo?.summary && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Summary</h2>
                  <p className="text-gray-700">
                    {generatedResume.personalInfo.summary}
                  </p>
                </div>
              )}
              
              {generatedResume.experience && generatedResume.experience.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Experience</h2>
                  {generatedResume.experience.map((exp: any, index: number) => (
                    <div className="mb-3" key={index}>
                      <div className="flex justify-between">
                        <span className="font-medium">{exp.company}</span>
                        <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="font-medium text-gray-700">{exp.position}</div>
                      <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {generatedResume.education && generatedResume.education.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Education</h2>
                  {generatedResume.education.map((edu: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between">
                        <span className="font-medium">{edu.institution}</span>
                        <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
                      </div>
                      <div className="text-gray-700">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</div>
                      {edu.description && <p className="text-gray-700 text-sm mt-1">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              )}
              
              {generatedResume.skills && generatedResume.skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {generatedResume.skills.map((skill: any, index: number) => (
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm" key={index}>{skill.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {generatedResume.projects && generatedResume.projects.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Projects</h2>
                  {generatedResume.projects.map((project: any, index: number) => (
                    <div className="mb-3" key={index}>
                      <div className="flex justify-between">
                        <span className="font-medium">{project.name}</span>
                        {project.startDate && (
                          <span className="text-gray-500 text-sm">{project.startDate} - {project.endDate}</span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">
                          {project.url}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
