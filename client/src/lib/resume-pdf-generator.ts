import html2pdf from 'html2pdf.js';
import Handlebars from 'handlebars';
import { ResumeContent } from '@shared/schema';

/**
 * Generate PDF from resume content and template
 * @param resumeContent The resume content object
 * @param template The template object with HTML template
 * @param resumeName The name of the resume (used for the filename)
 */
export async function generatePDF(
  resumeContent: ResumeContent,
  template: { htmlTemplate: string; name: string },
  resumeName: string
): Promise<void> {
  try {
    // Register Handlebars helpers
    Handlebars.registerHelper('if', function(conditional, options) {
      if (conditional) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    // Compile the template
    const compiledTemplate = Handlebars.compile(template.htmlTemplate);
    
    // Generate HTML with the resume data
    const html = compiledTemplate(resumeContent);

    // Create a temporary div to render the HTML
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.visibility = 'hidden';
    document.body.appendChild(container);

    // Set up html2pdf options
    const options = {
      margin: 10,
      filename: `${resumeName || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate PDF
    try {
      const pdf = await html2pdf().from(container).set(options).save();
      document.body.removeChild(container);
      return pdf;
    } catch (error) {
      document.body.removeChild(container);
      throw error;
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Generate a preview image of the resume
 * This can be used to show a thumbnail of the resume
 * @param resumeContent The resume content object
 * @param template The template object with HTML template
 */
export async function generatePreviewImage(
  resumeContent: ResumeContent,
  template: { htmlTemplate: string }
): Promise<string> {
  try {
    // Register Handlebars helpers
    Handlebars.registerHelper('if', function(conditional, options) {
      if (conditional) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    // Compile the template
    const compiledTemplate = Handlebars.compile(template.htmlTemplate);
    
    // Generate HTML with the resume data
    const html = compiledTemplate(resumeContent);

    // Create a temporary div to render the HTML
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.visibility = 'hidden';
    document.body.appendChild(container);

    // Use html2canvas to create an image
    try {
      const canvas = await html2pdf.html2canvas(container, { 
        scale: 1, 
        useCORS: true,
        logging: false,
        width: 800,
        height: 1132 // A4 ratio
      });
      document.body.removeChild(container);
      return canvas.toDataURL('image/jpeg', 0.7);
    } catch (error) {
      document.body.removeChild(container);
      throw error;
    }
  } catch (error) {
    console.error('Error generating preview image:', error);
    throw new Error('Failed to generate preview image.');
  }
}
