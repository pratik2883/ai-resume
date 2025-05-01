import { useState } from "react";
import { Helmet } from "react-helmet";
import MainLayout from "@/layouts/main-layout";
import AdminSidebar from "@/components/admin/admin-sidebar";
import ResumesTable from "@/components/admin/resumes-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

export default function ManageResumes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [templateFilter, setTemplateFilter] = useState("all");
  
  // Fetch resumes
  const { data: resumes, isLoading: resumesLoading } = useQuery({
    queryKey: ["/api/admin/resumes"],
  });

  // Fetch templates for filter
  const { data: templates } = useQuery({
    queryKey: ["/api/templates"],
    staleTime: Infinity,
  });

  // Filter resumes based on search and template
  const filteredResumes = resumes?.filter((resume: any) => {
    const matchesSearch = searchTerm === "" 
      ? true 
      : resume.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        resume.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.user.username.toLowerCase().includes(searchTerm.toLowerCase());
        
    const matchesTemplate = templateFilter === "all" 
      ? true 
      : resume.templateId === parseInt(templateFilter);
        
    return matchesSearch && matchesTemplate;
  });

  return (
    <MainLayout>
      <Helmet>
        <title>Manage Resumes - Admin Dashboard</title>
      </Helmet>

      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Manage Resumes</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Resume Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search resumes by name or user..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select
                    value={templateFilter}
                    onValueChange={setTemplateFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Templates</SelectItem>
                      {templates?.map((template: any) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <ResumesTable 
                resumes={filteredResumes || []} 
                isLoading={resumesLoading}
                templates={templates || []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
