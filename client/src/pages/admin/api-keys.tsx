import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/layouts/main-layout";
import AdminSidebar from "@/components/admin/admin-sidebar";
import ApiKeyForm from "@/components/admin/api-key-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Key, Plus } from "lucide-react";
import { format } from "date-fns";

export default function ApiKeys() {
  const { toast } = useToast();
  const [selectedKey, setSelectedKey] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch API keys
  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ["/api/admin/api-keys"],
  });

  // Toggle key active status
  const toggleKeyStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number, isActive: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/api-keys/${id}`, { isActive });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/api-keys"] });
      toast({
        title: "API key updated",
        description: "API key status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete API key
  const deleteKeyMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/api-keys/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/api-keys"] });
      toast({
        title: "API key deleted",
        description: "API key has been deleted successfully.",
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

  const handleToggleActive = (id: number, currentStatus: boolean) => {
    toggleKeyStatusMutation.mutate({ id, isActive: !currentStatus });
  };

  const handleEditKey = (key: any) => {
    setSelectedKey(key);
    setIsDialogOpen(true);
  };

  const handleDeleteKey = (id: number) => {
    deleteKeyMutation.mutate(id);
  };

  const handleAddNewKey = () => {
    setSelectedKey(null);
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>API Keys - Admin Dashboard</title>
      </Helmet>

      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">API Keys</h1>
            <Button onClick={handleAddNewKey}>
              <Plus className="mr-2 h-4 w-4" />
              Add New API Key
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>
                Manage OpenRouter and other API keys for AI integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-6">Loading API keys...</div>
              ) : apiKeys?.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No API Keys Found</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    You haven't added any API keys yet.
                  </p>
                  <Button onClick={handleAddNewKey}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add API Key
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Added Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys?.map((key: any) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>{key.provider}</TableCell>
                        <TableCell>
                          <span className="font-mono">
                            {key.key.substring(0, 8)}
                            {"•".repeat(16)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(key.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={key.isActive}
                              onCheckedChange={() => handleToggleActive(key.id, key.isActive)}
                            />
                            <span className={key.isActive ? "text-green-600" : "text-gray-500"}>
                              {key.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditKey(key)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this API key? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteKey(key.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedKey ? "Edit API Key" : "Add New API Key"}
                </DialogTitle>
                <DialogDescription>
                  {selectedKey
                    ? "Update the details of this API key."
                    : "Add a new API key for AI functionality."}
                </DialogDescription>
              </DialogHeader>
              <ApiKeyForm
                apiKey={selectedKey}
                onComplete={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  );
}
