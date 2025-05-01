import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayoutTemplate } from "lucide-react";

interface TemplateSelectorProps {
  templates: Array<{
    id: number;
    name: string;
    description: string;
  }>;
  selectedTemplate: number;
  onSelectTemplate: (templateId: number) => void;
}

export default function TemplateSelector({
  templates,
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const handleTemplateChange = (value: string) => {
    onSelectTemplate(parseInt(value));
  };

  // Get the currently selected template
  const currentTemplate = templates.find(
    (template) => template.id === selectedTemplate
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Select
              value={selectedTemplate.toString()}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger className="w-[180px]">
                <LayoutTemplate className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {currentTemplate?.description || "Choose a template design for your resume"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
