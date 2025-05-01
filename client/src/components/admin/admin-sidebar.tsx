import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  FileText,
  Key,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/admin",
  },
  {
    title: "Manage Users",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/users",
  },
  {
    title: "Manage Resumes",
    icon: <FileText className="h-5 w-5" />,
    href: "/admin/resumes",
  },
  {
    title: "API Keys",
    icon: <Key className="h-5 w-5" />,
    href: "/admin/api-keys",
  },
];

export default function AdminSidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex flex-col w-64 bg-sidebar p-4 text-sidebar-foreground border-r border-border min-h-screen">
      <div className="py-4">
        <h2 className="px-4 text-lg font-semibold flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Admin Panel
        </h2>
      </div>
      
      <nav className="space-y-1 mt-4">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex items-center px-4 py-2.5 text-sm font-medium rounded-md",
                location === item.href
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </a>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto mb-4">
        <Link href="/dashboard">
          <a className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary">
            <FileText className="mr-3 h-5 w-5" />
            Back to Dashboard
          </a>
        </Link>
      </div>
    </div>
  );
}
