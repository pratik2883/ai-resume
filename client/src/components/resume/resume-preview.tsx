import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Download, Save } from "lucide-react";
import TemplateSelector from "@/components/resume/template-selector";
import { generatePDF } from "@/lib/resume-pdf-generator";
import { ResumeContent } from "@shared/schema";

interface ResumePreviewProps {
  resumeContent: ResumeContent;
  selectedTemplate: number;
  setSelectedTemplate: (templateId: number) => void;
  templates: any[];
  resumeName: string;
  resumeId: number | null;
}

export default function ResumePreview({
  resumeContent,
  selectedTemplate,
  setSelectedTemplate,
  templates,
  resumeName,
  resumeId,
}: ResumePreviewProps) {
  const { toast } = useToast();
  const [isFullNameVisible, setIsFullNameVisible] = useState(true);
  
  const fullName = useMemo(() => {
    const firstName = resumeContent.personalInfo?.firstName || "";
    const lastName = resumeContent.personalInfo?.lastName || "";
    if (!firstName && !lastName) {
      return "Name not set";
    }
    return `${firstName} ${lastName}`.trim();
  }, [resumeContent.personalInfo]);
  
  // Show a placeholder if the name is not set
  const shouldShowPlaceholder = !resumeContent.personalInfo?.firstName && !resumeContent.personalInfo?.lastName;

  // Save resume mutation
  const saveResumeMutation = useMutation({
    mutationFn: async (data: { 
      name: string; 
      templateId: number; 
      content: ResumeContent;
      id?: number;
    }) => {
      const method = data.id ? "PUT" : "POST";
      const endpoint = data.id ? `/api/resumes/${data.id}` : "/api/resumes";
      
      const res = await apiRequest(method, endpoint, {
        name: data.name,
        templateId: data.templateId,
        content: data.content,
      });
      
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Resume saved",
        description: `${resumeName} has been saved successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      
      if (!resumeId) {
        // If this was a new resume, update the current ID
        // This would be handled by the parent component
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveResume = () => {
    if (!resumeContent.personalInfo.firstName || !resumeContent.personalInfo.lastName) {
      toast({
        title: "Missing information",
        description: "Please add at least your first and last name before saving.",
        variant: "destructive",
      });
      return;
    }
    
    if (!resumeName.trim()) {
      toast({
        title: "Missing resume name",
        description: "Please name your resume before saving.",
        variant: "destructive",
      });
      return;
    }
    
    saveResumeMutation.mutate({ 
      name: resumeName, 
      templateId: selectedTemplate, 
      content: resumeContent,
      id: resumeId || undefined
    });
  };

  const handleDownloadPDF = async () => {
    if (!resumeContent.personalInfo.firstName || !resumeContent.personalInfo.lastName) {
      toast({
        title: "Missing information",
        description: "Please add at least your first and last name before downloading.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get the selected template
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) {
        throw new Error("Template not found");
      }
      
      await generatePDF(resumeContent, template, resumeName);
      
      toast({
        title: "PDF generated",
        description: "Your resume has been downloaded as a PDF.",
      });
    } catch (error) {
      toast({
        title: "PDF generation failed",
        description: error instanceof Error ? error.message : "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  if (!templates) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Preview</CardTitle>
        <TemplateSelector
          templates={templates || []}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
        />
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-4 min-h-[400px] mb-4">
          <div className="text-center mb-6">
            <h1 
              className={`text-2xl font-bold ${shouldShowPlaceholder ? "text-gray-400" : "text-gray-900"}`}
              onClick={() => setIsFullNameVisible(!isFullNameVisible)}
            >
              {fullName}
            </h1>
            <p className="text-gray-600">{resumeContent.personalInfo?.title || "Position"}</p>
            <div className="text-sm text-gray-500 mt-1 flex justify-center flex-wrap gap-x-2">
              {resumeContent.personalInfo?.email && <span>{resumeContent.personalInfo.email}</span>}
              {resumeContent.personalInfo?.phone && (
                <>
                  {resumeContent.personalInfo?.email && <span>•</span>}
                  <span>{resumeContent.personalInfo.phone}</span>
                </>
              )}
              {resumeContent.personalInfo?.address && (
                <>
                  {(resumeContent.personalInfo?.email || resumeContent.personalInfo?.phone) && <span>•</span>}
                  <span>{resumeContent.personalInfo.address}</span>
                </>
              )}
            </div>
          </div>
          
          {resumeContent.personalInfo?.summary && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Summary</h2>
              <p className="text-gray-700 text-sm">
                {resumeContent.personalInfo.summary}
              </p>
            </div>
          )}
          
          {resumeContent.experience && resumeContent.experience.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Experience</h2>
              {resumeContent.experience.map((exp, index) => (
                <div className="mb-3" key={index}>
                  <div className="flex justify-between">
                    <span className="font-medium">{exp.company}</span>
                    <span className="text-gray-500 text-sm">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="font-medium text-gray-700">{exp.position}</div>
                  <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          
          {resumeContent.education && resumeContent.education.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Education</h2>
              {resumeContent.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{edu.institution}</span>
                    <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-gray-700">
                    {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                  </div>
                  {edu.description && <p className="text-gray-700 text-sm mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          )}
          
          {resumeContent.skills && resumeContent.skills.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeContent.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {resumeContent.projects && resumeContent.projects.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Projects</h2>
              {resumeContent.projects.map((project, index) => (
                <div className="mb-3" key={index}>
                  <div className="flex justify-between">
                    <span className="font-medium">{project.name}</span>
                    {project.startDate && (
                      <span className="text-gray-500 text-sm">
                        {project.startDate} - {project.endDate}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-blue-600 text-sm hover:underline"
                    >
                      {project.url}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button 
            variant="default" 
            onClick={handleDownloadPDF}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSaveResume}
            disabled={saveResumeMutation.isPending}
            className="w-full"
          >
            {saveResumeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Resume
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
