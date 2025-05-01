import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResumeContent } from "@shared/schema";

interface AiPromptBarProps {
  onGenerateContent: (content: ResumeContent | string) => void;
}

export default function AiPromptBar({ onGenerateContent }: AiPromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("complete");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter details about your background to generate content.",
        variant: "destructive",
      });
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
          type: contentType,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      onGenerateContent(data.content);
      
      toast({
        title: "Content generated",
        description: contentType === "complete" 
          ? "A full resume has been generated based on your information." 
          : "AI-generated content has been created.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">AI Resume Assistant</label>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="w-full md:w-32">
          <Select 
            value={contentType} 
            onValueChange={setContentType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="complete">Full Resume</SelectItem>
              <SelectItem value="summary">Summary</SelectItem>
              <SelectItem value="experience">Job Description</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          className="flex-1 min-h-[80px]"
          placeholder={contentType === "complete" 
            ? "Describe your professional background, education, skills, and experience for a complete resume..." 
            : contentType === "summary" 
              ? "Describe your background for a professional summary..." 
              : "Describe your job role and responsibilities..."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex items-end">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full md:w-auto whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate with AI
              </>
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {contentType === "complete" 
          ? "Generate a full resume based on your background information." 
          : contentType === "summary" 
            ? "Create a professional summary for your resume." 
            : "Write detailed bullet points for a job position."}
      </p>
    </div>
  );
}
