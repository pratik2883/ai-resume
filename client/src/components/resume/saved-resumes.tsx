import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileText, Edit, Download, Trash2, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { generatePDF } from "@/lib/resume-pdf-generator";

interface SavedResumesProps {
  onLoadResume: (resume: any) => void;
  onCreateNewResume: () => void;
}

export default function SavedResumes({ onLoadResume, onCreateNewResume }: SavedResumesProps) {
  const { toast } = useToast();
  const [resumeToDelete, setResumeToDelete] = useState<number | null>(null);
  
  // Fetch user's resumes
  const { data: resumes, isLoading } = useQuery({
    queryKey: ["/api/resumes"],
  });

  // Fetch templates for PDF generation
  const { data: templates } = useQuery({
    queryKey: ["/api/templates"],
    staleTime: Infinity,
  });

  // Delete resume mutation
  const deleteResumeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/resumes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Resume deleted",
        description: "The resume has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteResume = (id: number) => {
    setResumeToDelete(id);
  };

  const confirmDelete = () => {
    if (resumeToDelete) {
      deleteResumeMutation.mutate(resumeToDelete);
      setResumeToDelete(null);
    }
  };

  const handleDownloadPDF = async (resume: any) => {
    try {
      // Get the template
      const template = templates?.find((t: any) => t.id === resume.templateId);
      if (!template) {
        throw new Error("Template not found");
      }
      
      await generatePDF(resume.content, template, resume.name);
      
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading resumes...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Saved Resumes</h2>
        <Button onClick={onCreateNewResume}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Resume
        </Button>
      </div>
      
      {resumes?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No resumes yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              You haven't created any resumes yet. Create your first resume to get started.
            </p>
            <Button onClick={onCreateNewResume}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Resume
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume: any) => (
            <Card key={resume.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      {resume.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Template: {templates?.find((t: any) => t.id === resume.templateId)?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Modified: {format(new Date(resume.updatedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  
                  {resume.content.personalInfo.firstName && (
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {resume.content.personalInfo.firstName[0] + (resume.content.personalInfo.lastName?.[0] || "")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLoadResume(resume)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadPDF(resume)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{resume.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteResume(resume.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={!!resumeToDelete} onOpenChange={() => setResumeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={deleteResumeMutation.isPending}
            >
              {deleteResumeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
