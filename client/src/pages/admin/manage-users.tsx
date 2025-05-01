import { useState } from "react";
import { Helmet } from "react-helmet";
import MainLayout from "@/layouts/main-layout";
import AdminSidebar from "@/components/admin/admin-sidebar";
import UsersTable from "@/components/admin/users-table";
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

export default function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Filter users based on search and role
  const filteredUsers = users?.filter((user: any) => {
    const matchesSearch = searchTerm === "" 
      ? true 
      : user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
    const matchesRole = filterRole === "all" 
      ? true 
      : filterRole === "admin" 
        ? user.isAdmin 
        : !user.isAdmin;
        
    return matchesSearch && matchesRole;
  });

  return (
    <MainLayout>
      <Helmet>
        <title>Manage Users - Admin Dashboard</title>
      </Helmet>

      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search users by name, username or email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select
                    value={filterRole}
                    onValueChange={setFilterRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                      <SelectItem value="user">Regular Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <UsersTable 
                users={filteredUsers || []} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
