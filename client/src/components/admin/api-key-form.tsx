import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const apiKeySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  key: z.string().min(10, "API key is required and must be at least 10 characters"),
  provider: z.string().min(2, "Provider is required"),
  isActive: z.boolean().default(true),
});

interface ApiKeyFormProps {
  apiKey?: any;
  onComplete: () => void;
}

export default function ApiKeyForm({ apiKey, onComplete }: ApiKeyFormProps) {
  const { toast } = useToast();
  const isEditing = !!apiKey;
  
  const form = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: apiKey ? {
      name: apiKey.name,
      key: apiKey.key,
      provider: apiKey.provider,
      isActive: apiKey.isActive,
    } : {
      name: "",
      key: "",
      provider: "openrouter",
      isActive: true,
    },
  });
  
  // API key mutation
  const apiKeyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof apiKeySchema>) => {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing ? `/api/admin/api-keys/${apiKey.id}` : "/api/admin/api-keys";
      const res = await apiRequest(method, endpoint, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/api-keys"] });
      toast({
        title: isEditing ? "API key updated" : "API key added",
        description: isEditing 
          ? "The API key has been updated successfully." 
          : "The API key has been added successfully.",
      });
      onComplete();
    },
    onError: (error: Error) => {
      toast({
        title: isEditing ? "Update failed" : "Adding failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof apiKeySchema>) => {
    apiKeyMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="OpenRouter API Key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <FormControl>
                <Input placeholder="openrouter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input placeholder="sk-or-v1-..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Activate this API key for use in the application
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onComplete}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={apiKeyMutation.isPending}
          >
            {apiKeyMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              isEditing ? "Update API Key" : "Add API Key"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
