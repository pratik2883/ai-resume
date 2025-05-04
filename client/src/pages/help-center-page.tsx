import { Helmet } from "react-helmet";
import MainLayout from "@/layouts/main-layout";

export default function HelpCenterPage() {
  return (
    <MainLayout>
      <Helmet>
        <title>Help Center - AI Resume Builder</title>
        <meta
          name="description"
          content="Learn how to use AI Resume Builder effectively. Get help with creating and customizing your resume."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Help Center
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Everything you need to know about using AI Resume Builder
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 lg:col-span-1">
            <div className="sticky top-6">
              <nav className="space-y-1 bg-white shadow rounded-lg p-4">
                <a
                  href="#about"
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary bg-gray-50 hover:bg-gray-100"
                >
                  About the Project
                </a>
                <a
                  href="#technology"
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  Technology Stack
                </a>
                <a
                  href="#getting-started"
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  Getting Started
                </a>
                <a
                  href="#user-guide"
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  User Guide
                </a>
                <a
                  href="#admin-guide"
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  Admin Guide
                </a>
                <a
                  href="#faq"
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  FAQ
                </a>
              </nav>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2 space-y-10">
            <section id="about" className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Project</h2>
              <p className="text-gray-700 mb-4">
                AI Resume Builder is a full-stack web application designed to help job seekers create professional, 
                ATS-friendly resumes using artificial intelligence. The platform combines modern web technologies 
                with AI capabilities to provide a seamless resume creation experience.
              </p>
              <p className="text-gray-700 mb-4">
                This application allows users to generate resume content using AI, customize it to their needs, 
                and download the final document as a professional PDF. Multiple resume templates are available, 
                and all user data is securely stored in a database.
              </p>
              <p className="text-gray-700">
                Key features include:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                <li>AI-powered resume content generation</li>
                <li>Multiple professional resume templates</li>
                <li>Secure user authentication system</li>
                <li>PDF generation with customizable formatting</li>
                <li>Profile management and resume storage</li>
                <li>Admin dashboard for site management</li>
              </ul>
            </section>

            <section id="technology" className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Frontend</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                    <li>React.js - Frontend UI library</li>
                    <li>TypeScript - Type-safe JavaScript</li>
                    <li>Wouter - Lightweight routing solution</li>
                    <li>TanStack Query (React Query) - Data fetching and caching</li>
                    <li>Tailwind CSS - Utility-first CSS framework</li>
                    <li>Shadcn UI - Component library based on Radix UI</li>
                    <li>html2pdf.js - PDF generation from HTML</li>
                    <li>React Hook Form - Form state management</li>
                    <li>Zod - Schema validation</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Backend</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                    <li>Node.js - JavaScript runtime</li>
                    <li>Express.js - Web framework for Node.js</li>
                    <li>MySql - Relational database</li>
                    <li>Passport.js - Authentication middleware</li>
                    <li>Express Session - Session management</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Integration</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                    <li>OpenRouter API - Gateway to AI models</li>
                    <li>OpenAI GPT models - AI content generation</li>
                    <li>Handlebars - Templating engine for resume templates</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Development & Deployment</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                    <li>Vite - Build tool and development server</li>
                    <li>Replit - Development and hosting platform</li>
                    <li>Git - Version control</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="getting-started" className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Create an Account</h3>
              <p className="text-gray-700 mb-4">
                To use all features of AI Resume Builder, you need to create an account. Click the "Get Started" 
                button on the homepage or the "Sign Up" option in the navigation menu. Fill in your details 
                and create your account.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Login</h3>
              <p className="text-gray-700 mb-4">
                If you already have an account, click on "Login" and enter your credentials. Once logged in, 
                you'll have access to your dashboard where you can create and manage resumes.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Try the AI Generator</h3>
              <p className="text-gray-700 mb-4">
                You can try the AI resume generator directly from the landing page. Enter a description of 
                your background, skills, and experiences, and click "Generate Resume". If you're not logged in, 
                you'll be prompted to create an account to save your resume.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Note:</strong> The AI capabilities require an OpenRouter API key to be configured 
                      on the server by an administrator.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Default Login Credentials</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Password
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Admin
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        admin
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        admin123
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Regular User
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        user
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        user123
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="user-guide" className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Guide</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating a Resume</h3>
              <p className="text-gray-700 mb-4">
                There are two ways to create a resume:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                <li>
                  <strong>AI Generation:</strong> Use the AI prompt bar at the top of the dashboard to generate 
                  a complete resume based on your background description.
                </li>
                <li>
                  <strong>Manual Creation:</strong> Fill out the resume form sections manually with your 
                  personal information, education, experience, skills, and projects.
                </li>
              </ol>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecting a Template</h3>
              <p className="text-gray-700 mb-4">
                In the resume preview section, you can choose from different resume templates. Click on the 
                template selector to switch between available designs.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Downloading Your Resume</h3>
              <p className="text-gray-700 mb-4">
                Once you're satisfied with your resume, click the "Download PDF" button in the preview 
                section to save it as a PDF file ready for job applications.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Saving and Managing Resumes</h3>
              <p className="text-gray-700 mb-4">
                Click the "Save Resume" button to store your resume in your account. You can manage all 
                your saved resumes by navigating to the "My Resumes" tab in your dashboard.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Updating Your Profile</h3>
              <p className="text-gray-700 mb-4">
                You can update your profile information and change your password by clicking on your 
                username in the navigation bar and selecting "Profile".
              </p>
            </section>

            <section id="admin-guide" className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Guide</h2>
              
              <p className="text-gray-700 mb-4">
                Administrators have access to additional features for managing the application.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessing Admin Dashboard</h3>
              <p className="text-gray-700 mb-4">
                After logging in with admin credentials, you'll see an "Admin" link in the navigation 
                menu. Click on it to access the admin dashboard.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Managing Users</h3>
              <p className="text-gray-700 mb-4">
                Navigate to the "Users" section in the admin panel to view, manage, and delete user accounts.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Viewing All Resumes</h3>
              <p className="text-gray-700 mb-4">
                The "Resumes" section allows you to browse and manage all resumes created on the platform.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Managing API Keys</h3>
              <p className="text-gray-700 mb-4">
                The "API Keys" section is where you can configure external API credentials, such as the 
                OpenRouter API key required for AI functionality.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Important:</strong> You need to add a valid OpenRouter API key for the AI resume 
                      generation feature to work. Create an account at <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai</a> to 
                      obtain an API key.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="faq" className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Is my data secure?</h3>
                  <p className="text-gray-700">
                    Yes, all user data is stored securely in a PostgreSQL database. Passwords are hashed before 
                    storage, and sensitive operations require authentication.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">How does the AI generate resume content?</h3>
                  <p className="text-gray-700">
                    The application uses OpenRouter API to interact with AI models like GPT. When you provide a 
                    description of your background, the AI analyzes this information and generates structured 
                    resume content, including personal information, experience, education, and skills.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Can I edit the AI-generated content?</h3>
                  <p className="text-gray-700">
                    Yes, the AI-generated content is fully editable. After generation, you can modify any part 
                    of the resume using the form sections in the dashboard.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">What resume formats are available?</h3>
                  <p className="text-gray-700">
                    Currently, you can download your resume as a PDF document. Multiple design templates 
                    are available to choose from.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Is this resume ATS-friendly?</h3>
                  <p className="text-gray-700">
                    Yes, the resume templates are designed to be ATS (Applicant Tracking System) friendly with 
                    clear sections, proper headers, and standard formatting that can be easily parsed by most 
                    recruitment software.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Is this resume build Nikhil P?</h3>
                  <p className="text-gray-700">
                    Yes, the resume build nikhil.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}