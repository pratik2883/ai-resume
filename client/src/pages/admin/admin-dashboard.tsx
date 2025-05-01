import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/main-layout";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RecentUsersSkeleton,
  RecentResumesSkeleton,
} from "@/components/admin/loading-skeletons";
import { Link } from "wouter";
import { User, FileText, Key, BarChart3 } from "lucide-react";
import { formatDistance } from "date-fns";

export default function AdminDashboard() {
  // Fetch users count
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Fetch resumes count
  const { data: resumes, isLoading: resumesLoading } = useQuery({
    queryKey: ["/api/admin/resumes"],
  });

  // Fetch API keys
  const { data: apiKeys, isLoading: apiKeysLoading } = useQuery({
    queryKey: ["/api/admin/api-keys"],
  });

  const totalUsers = users?.length || 0;
  const totalResumes = resumes?.length || 0;
  const totalApiKeys = apiKeys?.length || 0;
  const activeApiKeys = apiKeys?.filter((key: any) => key.isActive).length || 0;

  // Get recent users
  const recentUsers = users
    ?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get recent resumes
  const recentResumes = resumes
    ?.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <MainLayout>
      <Helmet>
        <title>Admin Dashboard - AI Resume Builder</title>
      </Helmet>

      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {usersLoading ? "..." : totalUsers}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  <Link href="/admin/users" className="text-blue-500 hover:underline">
                    View all users
                  </Link>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resumesLoading ? "..." : totalResumes}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  <Link href="/admin/resumes" className="text-blue-500 hover:underline">
                    View all resumes
                  </Link>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">API Keys</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {apiKeysLoading ? "..." : totalApiKeys}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  <span className="text-green-500 font-medium">{activeApiKeys} active</span> / {totalApiKeys} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Resumes per User</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {usersLoading || resumesLoading || totalUsers === 0
                    ? "0"
                    : (totalResumes / totalUsers).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on total users and resumes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList>
              <TabsTrigger value="users">Recent Users</TabsTrigger>
              <TabsTrigger value="resumes">Recent Resumes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Registered Users</CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <RecentUsersSkeleton />
                  ) : (
                    <div className="space-y-4">
                      {recentUsers?.length ? (
                        recentUsers.map((user: any) => (
                          <div key={user.id} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center space-x-3">
                              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Joined {formatDistance(new Date(user.createdAt), new Date(), { addSuffix: true })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No users found</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resumes">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Updated Resumes</CardTitle>
                </CardHeader>
                <CardContent>
                  {resumesLoading ? (
                    <RecentResumesSkeleton />
                  ) : (
                    <div className="space-y-4">
                      {recentResumes?.length ? (
                        recentResumes.map((resume: any) => (
                          <div key={resume.id} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center space-x-3">
                              <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{resume.name}</p>
                                <p className="text-xs text-muted-foreground">by {resume.user.name}</p>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Updated {formatDistance(new Date(resume.updatedAt), new Date(), { addSuffix: true })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No resumes found</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}


