import { db } from "./index";
import { users, resumeTemplates, apiKeys } from "@shared/schema";
import { hashPassword } from "../server/auth";

async function seed() {
  try {
    console.log("Starting database seed...");

    // Seed admin user
    const adminUserExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, "admin"),
    });

    if (!adminUserExists) {
      const adminPassword = await hashPassword("admin123");
      await db.insert(users).values({
        username: "admin",
        password: adminPassword,
        email: "admin@example.com",
        name: "Admin User",
        isAdmin: true,
      });
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists, skipping");
    }

    // Seed regular user
    const regularUserExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, "user"),
    });

    if (!regularUserExists) {
      const userPassword = await hashPassword("user123");
      await db.insert(users).values({
        username: "user",
        password: userPassword,
        email: "user@example.com",
        name: "Regular User",
        isAdmin: false,
      });
      console.log("Regular user created");
    } else {
      console.log("Regular user already exists, skipping");
    }

    // Seed resume templates
    const templatesCount = await db.query.resumeTemplates.findMany();
    
    if (templatesCount.length === 0) {
      await db.insert(resumeTemplates).values([
        {
          name: "Modern",
          description: "Clean and professional design",
          thumbnail: "https://cdn.jsdelivr.net/gh/creative-tim-official/public-assets@master/material-dashboard-react/material-dashboard-free.jpg",
          htmlTemplate: `
          <div class="font-sans max-w-[800px] mx-auto p-10 bg-white text-gray-800">
            <header class="text-center mb-8">
              <h1 class="text-3xl font-bold tracking-tight mb-1">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
              <p class="text-lg text-gray-600 mb-2">{{personalInfo.title}}</p>
              <div class="text-sm text-gray-500 flex justify-center flex-wrap gap-x-3">
                {{#if personalInfo.email}}<span>{{personalInfo.email}}</span>{{/if}}
                {{#if personalInfo.phone}}<span>{{personalInfo.phone}}</span>{{/if}}
                {{#if personalInfo.address}}<span>{{personalInfo.address}}</span>{{/if}}
              </div>
            </header>
            
            {{#if personalInfo.summary}}
            <section class="mb-6">
              <h2 class="text-xl font-semibold border-b border-gray-300 pb-1 mb-3">Summary</h2>
              <p>{{personalInfo.summary}}</p>
            </section>
            {{/if}}
            
            {{#if experience.length}}
            <section class="mb-6">
              <h2 class="text-xl font-semibold border-b border-gray-300 pb-1 mb-3">Experience</h2>
              {{#each experience}}
              <div class="mb-4">
                <div class="flex justify-between items-start">
                  <h3 class="font-medium">{{company}}</h3>
                  <p class="text-sm text-gray-600">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</p>
                </div>
                <p class="text-gray-700 italic">{{position}}</p>
                <p class="mt-1">{{description}}</p>
              </div>
              {{/each}}
            </section>
            {{/if}}
            
            {{#if education.length}}
            <section class="mb-6">
              <h2 class="text-xl font-semibold border-b border-gray-300 pb-1 mb-3">Education</h2>
              {{#each education}}
              <div class="mb-4">
                <div class="flex justify-between items-start">
                  <h3 class="font-medium">{{institution}}</h3>
                  <p class="text-sm text-gray-600">{{startDate}} - {{endDate}}</p>
                </div>
                <p class="text-gray-700">{{degree}}{{#if fieldOfStudy}}, {{fieldOfStudy}}{{/if}}</p>
                {{#if description}}<p class="mt-1">{{description}}</p>{{/if}}
              </div>
              {{/each}}
            </section>
            {{/if}}
            
            {{#if skills.length}}
            <section class="mb-6">
              <h2 class="text-xl font-semibold border-b border-gray-300 pb-1 mb-3">Skills</h2>
              <div class="flex flex-wrap gap-2">
                {{#each skills}}
                <span class="bg-gray-100 px-3 py-1 rounded-full text-sm">{{name}}</span>
                {{/each}}
              </div>
            </section>
            {{/if}}
            
            {{#if projects.length}}
            <section>
              <h2 class="text-xl font-semibold border-b border-gray-300 pb-1 mb-3">Projects</h2>
              {{#each projects}}
              <div class="mb-4">
                <div class="flex justify-between items-start">
                  <h3 class="font-medium">{{name}}</h3>
                  {{#if startDate}}<p class="text-sm text-gray-600">{{startDate}} - {{endDate}}</p>{{/if}}
                </div>
                <p class="mt-1">{{description}}</p>
                {{#if url}}<p class="text-blue-600 mt-1"><a href="{{url}}" target="_blank">{{url}}</a></p>{{/if}}
              </div>
              {{/each}}
            </section>
            {{/if}}
          </div>
          `,
        },
        {
          name: "Professional",
          description: "Perfect for senior positions",
          thumbnail: "https://cdn.jsdelivr.net/gh/themefisher/desktop-mockup/devices/bootstrap.png",
          htmlTemplate: `
          <div class="font-serif max-w-[800px] mx-auto p-10 bg-white text-gray-800">
            <header class="mb-8">
              <h1 class="text-3xl font-bold mb-1 text-gray-900">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
              <p class="text-lg text-gray-700 mb-2">{{personalInfo.title}}</p>
              <div class="text-sm text-gray-600 flex flex-wrap gap-x-4">
                {{#if personalInfo.email}}<span>Email: {{personalInfo.email}}</span>{{/if}}
                {{#if personalInfo.phone}}<span>Phone: {{personalInfo.phone}}</span>{{/if}}
                {{#if personalInfo.address}}<span>Location: {{personalInfo.address}}</span>{{/if}}
              </div>
            </header>
            
            {{#if personalInfo.summary}}
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-3">Professional Summary</h2>
              <p class="text-base leading-relaxed">{{personalInfo.summary}}</p>
            </section>
            {{/if}}
            
            {{#if experience.length}}
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Professional Experience</h2>
              {{#each experience}}
              <div class="mb-6">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="font-bold text-lg">{{position}}</h3>
                  <p class="text-sm font-medium text-gray-700">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</p>
                </div>
                <p class="text-base font-medium text-gray-800 mb-2">{{company}}</p>
                <p class="text-base leading-relaxed">{{description}}</p>
              </div>
              {{/each}}
            </section>
            {{/if}}
            
            {{#if education.length}}
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Education</h2>
              {{#each education}}
              <div class="mb-5">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="font-bold text-lg">{{institution}}</h3>
                  <p class="text-sm font-medium text-gray-700">{{startDate}} - {{endDate}}</p>
                </div>
                <p class="text-base font-medium text-gray-800 mb-1">{{degree}}{{#if fieldOfStudy}}, {{fieldOfStudy}}{{/if}}</p>
                {{#if description}}<p class="text-base leading-relaxed">{{description}}</p>{{/if}}
              </div>
              {{/each}}
            </section>
            {{/if}}
            
            {{#if skills.length}}
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-3">Skills</h2>
              <div class="flex flex-wrap gap-y-2 gap-x-4">
                {{#each skills}}
                <div class="flex items-center">
                  <span class="inline-block w-2 h-2 rounded-full bg-gray-800 mr-2"></span>
                  <span class="text-base">{{name}}</span>
                </div>
                {{/each}}
              </div>
            </section>
            {{/if}}
            
            {{#if projects.length}}
            <section>
              <h2 class="text-xl font-bold text-gray-900 mb-4">Projects</h2>
              {{#each projects}}
              <div class="mb-5">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="font-bold text-lg">{{name}}</h3>
                  {{#if startDate}}<p class="text-sm font-medium text-gray-700">{{startDate}} - {{endDate}}</p>{{/if}}
                </div>
                <p class="text-base leading-relaxed mb-1">{{description}}</p>
                {{#if url}}<p><a href="{{url}}" target="_blank" class="text-blue-700 hover:underline">{{url}}</a></p>{{/if}}
              </div>
              {{/each}}
            </section>
            {{/if}}
          </div>
          `,
        },
        {
          name: "Creative",
          description: "Stand out with style",
          thumbnail: "https://cdn.jsdelivr.net/gh/creativetimofficial/argon-dashboard/assets/img/theme/vue.jpg",
          htmlTemplate: `
          <div class="font-sans max-w-[800px] mx-auto bg-white text-gray-800">
            <div class="flex flex-col md:flex-row">
              <div class="bg-blue-600 text-white p-8 md:w-1/3">
                <div class="mb-8 text-center">
                  <h1 class="text-2xl font-bold tracking-wide mb-1">{{personalInfo.firstName}}<br>{{personalInfo.lastName}}</h1>
                  <p class="text-blue-100 text-sm tracking-wider uppercase">{{personalInfo.title}}</p>
                </div>
                
                <div class="mb-8">
                  <h2 class="text-lg font-bold mb-4 tracking-wide border-b border-blue-400 pb-2">CONTACT</h2>
                  <div class="text-sm space-y-2">
                    {{#if personalInfo.email}}<p>{{personalInfo.email}}</p>{{/if}}
                    {{#if personalInfo.phone}}<p>{{personalInfo.phone}}</p>{{/if}}
                    {{#if personalInfo.address}}<p>{{personalInfo.address}}</p>{{/if}}
                  </div>
                </div>
                
                {{#if skills.length}}
                <div class="mb-8">
                  <h2 class="text-lg font-bold mb-4 tracking-wide border-b border-blue-400 pb-2">SKILLS</h2>
                  <div class="text-sm space-y-1">
                    {{#each skills}}
                    <p>{{name}}</p>
                    {{/each}}
                  </div>
                </div>
                {{/if}}
              </div>
              
              <div class="p-8 md:w-2/3">
                {{#if personalInfo.summary}}
                <section class="mb-8">
                  <h2 class="text-xl font-bold text-blue-600 mb-3 tracking-wider uppercase">Profile</h2>
                  <p class="text-base">{{personalInfo.summary}}</p>
                </section>
                {{/if}}
                
                {{#if experience.length}}
                <section class="mb-8">
                  <h2 class="text-xl font-bold text-blue-600 mb-4 tracking-wider uppercase">Experience</h2>
                  {{#each experience}}
                  <div class="mb-6">
                    <div class="flex justify-between items-start mb-1">
                      <h3 class="font-bold text-gray-800">{{position}}</h3>
                      <p class="text-xs text-gray-600">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</p>
                    </div>
                    <p class="text-sm font-medium text-gray-700 mb-2">{{company}}</p>
                    <p class="text-sm">{{description}}</p>
                  </div>
                  {{/each}}
                </section>
                {{/if}}
                
                {{#if education.length}}
                <section class="mb-8">
                  <h2 class="text-xl font-bold text-blue-600 mb-4 tracking-wider uppercase">Education</h2>
                  {{#each education}}
                  <div class="mb-5">
                    <div class="flex justify-between items-start mb-1">
                      <h3 class="font-bold text-gray-800">{{institution}}</h3>
                      <p class="text-xs text-gray-600">{{startDate}} - {{endDate}}</p>
                    </div>
                    <p class="text-sm font-medium text-gray-700 mb-1">{{degree}}{{#if fieldOfStudy}}, {{fieldOfStudy}}{{/if}}</p>
                    {{#if description}}<p class="text-sm">{{description}}</p>{{/if}}
                  </div>
                  {{/each}}
                </section>
                {{/if}}
                
                {{#if projects.length}}
                <section>
                  <h2 class="text-xl font-bold text-blue-600 mb-4 tracking-wider uppercase">Projects</h2>
                  {{#each projects}}
                  <div class="mb-5">
                    <div class="flex justify-between items-start mb-1">
                      <h3 class="font-bold text-gray-800">{{name}}</h3>
                      {{#if startDate}}<p class="text-xs text-gray-600">{{startDate}} - {{endDate}}</p>{{/if}}
                    </div>
                    <p class="text-sm mb-1">{{description}}</p>
                    {{#if url}}<p class="text-sm"><a href="{{url}}" target="_blank" class="text-blue-600 hover:underline">{{url}}</a></p>{{/if}}
                  </div>
                  {{/each}}
                </section>
                {{/if}}
              </div>
            </div>
          </div>
          `,
        },
      ]);
      console.log("Resume templates created");
    } else {
      console.log("Resume templates already exist, skipping");
    }

    // Seed sample OpenRouter API key
    const openRouterKeyExists = await db.query.apiKeys.findFirst({
      where: (apiKeys, { eq }) => eq(apiKeys.provider, "openrouter"),
    });

    if (!openRouterKeyExists) {
      await db.insert(apiKeys).values({
        name: "OpenRouter API Key",
        key: "sk-or-v1-replace-with-your-api-key",
        provider: "openrouter",
        isActive: true,
      });
      console.log("OpenRouter API key created (placeholder)");
    } else {
      console.log("OpenRouter API key already exists, skipping");
    }

    console.log("Database seed completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
