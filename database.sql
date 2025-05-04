-- Create the database
CREATE DATABASE IF NOT EXISTS `aic-resume`;
USE `aic-resume`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_admin` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_unique` (`username`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- API Keys table
CREATE TABLE IF NOT EXISTS `api_keys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `is_active` boolean NOT NULL DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Resume Templates table
CREATE TABLE IF NOT EXISTS `resume_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `html_template` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Resumes table
CREATE TABLE IF NOT EXISTS `resumes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `template_id` int NOT NULL,
  `content` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`template_id`) REFERENCES `resume_templates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sessions table
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert admin user (password: admin123)
INSERT INTO `users` (`username`, `password`, `email`, `name`, `is_admin`, `created_at`) 
VALUES ('admin', '$2b$10$RQib8zCvaKGJX3PNkqM6B.yH5Y1D3y5pZJ3uv9B3V8P3j8xF5K2Gy', 'admin@example.com', 'Admin User', true, CURRENT_TIMESTAMP);

-- Insert regular user (password: user123)
INSERT INTO `users` (`username`, `password`, `email`, `name`, `is_admin`, `created_at`)
VALUES ('user', '$2b$10$RQib8zCvaKGJX3PNkqM6B.yH5Y1D3y5pZJ3uv9B3V8P3j8xF5K2Gy', 'user@example.com', 'Regular User', false, CURRENT_TIMESTAMP);

-- Insert OpenRouter API key
INSERT INTO `api_keys` (`name`, `key`, `provider`, `is_active`, `created_at`, `updated_at`)
VALUES ('OpenRouter API Key', 'sk-or-v1-replace-with-your-api-key', 'openrouter', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert resume templates
INSERT INTO `resume_templates` (`name`, `description`, `thumbnail`, `html_template`, `created_at`)
VALUES 
('Modern', 'Clean and professional design', 'https://cdn.jsdelivr.net/gh/creative-tim-official/public-assets@master/material-dashboard-react/material-dashboard-free.jpg', '
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
          ', CURRENT_TIMESTAMP),
('Professional', 'Perfect for senior positions', 'https://cdn.jsdelivr.net/gh/themefisher/desktop-mockup/devices/bootstrap.png', '
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
          ', CURRENT_TIMESTAMP),
('Creative', 'Stand out with style', 'https://cdn.jsdelivr.net/gh/creativetimofficial/argon-dashboard/assets/img/theme/vue.jpg', '
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
          ', CURRENT_TIMESTAMP);