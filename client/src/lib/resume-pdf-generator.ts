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

    // Register the 'each' helper explicitly
    Handlebars.registerHelper('each', function(context, options) {
      let ret = "";
      
      if (context && context.length > 0) {
        for (let i = 0; i < context.length; i++) {
          ret = ret + options.fn(context[i]);
        }
      } else {
        ret = options.inverse(this);
      }
      
      return ret;
    });

    // Compile the template
    const compiledTemplate = Handlebars.compile(template.htmlTemplate);
    
    // Generate HTML with the resume data
    const html = compiledTemplate(resumeContent);

    // Create a temporary div to render the HTML
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 width in pixels at 96 DPI
    container.style.height = 'auto';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    
    // Add necessary styles for proper rendering
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
      }
    `;
    
    container.appendChild(style);
    document.body.appendChild(container);

    // Set up html2pdf options with improved settings
    const options = {
      margin: 10,
      filename: `${resumeName || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: true,
        backgroundColor: '#ffffff',
        letterRendering: true,
        allowTaint: true,
        foreignObjectRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        precision: 16,
        putOnlyUsedFonts: true
      }
    };

    console.log('Generating PDF with template:', template.name);
    console.log('Container HTML:', container.innerHTML.substring(0, 200) + '...');

    // Generate PDF
    try {
      const pdf = await html2pdf().from(container).set(options).save();
      document.body.removeChild(container);
      return pdf;
    } catch (error) {
      console.error('PDF generation error details:', error);
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

    // Register the 'each' helper explicitly
    Handlebars.registerHelper('each', function(context, options) {
      let ret = "";
      
      if (context && context.length > 0) {
        for (let i = 0; i < context.length; i++) {
          ret = ret + options.fn(context[i]);
        }
      } else {
        ret = options.inverse(this);
      }
      
      return ret;
    });

    // Compile the template
    const compiledTemplate = Handlebars.compile(template.htmlTemplate);
    
    // Generate HTML with the resume data
    const html = compiledTemplate(resumeContent);

    // Create a temporary div to render the HTML
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 width in pixels at 96 DPI
    container.style.height = 'auto';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    
    // Add necessary styles for proper rendering
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
      }
    `;
    
    container.appendChild(style);
    document.body.appendChild(container);

    // Use html2canvas to create an image
    try {
      const canvas = await html2pdf.html2canvas(container, { 
        scale: 1, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        letterRendering: true,
        allowTaint: true,
        width: 800,
        height: 1132 // A4 ratio
      });
      document.body.removeChild(container);
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      console.error('Preview generation error details:', error);
      document.body.removeChild(container);
      throw error;
    }
  } catch (error) {
    console.error('Error generating preview image:', error);
    throw new Error('Failed to generate preview image.');
  }
}
