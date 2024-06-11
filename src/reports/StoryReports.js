import jsPDF from "jspdf";
import "jspdf-autotable";
import { ref } from "vue";

export default {
  async generateStoryPdf(story) {
    console.log("Generating PDF for story: ", story);

    // Initialize jsPDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter",
    });

    // Load the logo image
    const img = new Image();
    img.src = "/oc-logo-white.png";

    // Ensure the image loads before adding to the PDF
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Add the logo to the PDF
    doc.addImage(img, "PNG", 0.4, 0.78, 0.975, 0.56);

    // Adding the story title
    doc.setFontSize(16).text(story.title, 1.0, 1.7);

    // Adding the author's name
    doc.setFontSize(12).text(`Author: ${story.user.firstName} ${story.user.lastName}`, 1.0, 2.0);

    // Adding the story content
    doc.setFontSize(12).text(story.story, 1.0, 2.3, { maxWidth: 7.5 });

    // Additional sections: Steps (if any)
    const stepsHeading = [
      { title: "Title", dataKey: "title" },
      { title: "Story", dataKey: "story" },
    ];

    let startY = 3.0;  
    if (story.steps && story.steps.length > 0) {
      doc.autoTable({
        columns: stepsHeading,
        headStyles: {
          fillColor: [129, 20, 41],
          fontSize: 11,
        },
        startY: startY,
        body: story.steps.map(step => ({
          title: step.title,
          story: step.story,
        })),
        margin: { left: 0.5, top: 1.5 },
      });
    }

    // Creating footer
    const footer = `Generated on ${new Date().toLocaleDateString()}`;
    doc.setFontSize(10).text(footer, 0.5, doc.internal.pageSize.height - 0.5);

    // Save the PDF
    doc.save(`storyReport.pdf`);
  },
};
