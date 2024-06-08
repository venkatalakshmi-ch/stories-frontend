import jsPDF from "jspdf";
import "jspdf-autotable";
import { ref } from "vue";

export default {

  async  generateStoryPdf(story) {
    console.log("Generating PDF for story: ", story);

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
    });

    var img = new Image();
    img.src = "/oc-logo-white.png";

    // Ensure the image loads before adding to the PDF
    await new Promise((resolve) => {
        img.onload = resolve;
    });

    doc.addImage(img, "PNG", 0.4, 0.78, 0.975, 0.56);

    // Adding the story title
    doc.setFontSize(16).text(story.title, 1.0, 1.7);

    // Adding the author's name
    doc.setFontSize(12).text(`Author: ${story.user.firstName} ${story.user.lastName}`, 1.0, 2.0);

    // Adding the story content
    doc.setFontSize(12).text(story.story, 1.0, 2.3);

    // If you have additional steps or sections to add to the PDF, you can add them here
    // Example:
    const stepsHeading = [
        { title: "Title", dataKey: "title" },
        { title: "Story", dataKey: "story" }
    ];

    let startY = 3.0;  // Adjust this value based on where you want the table to start

    if (story.steps) {
        doc.autoTable({
            columns: stepsHeading,
            headStyles: {
                fillColor: [129, 20, 41],
                fontSize: 11,
            },
            startY: startY,
            body: story.steps,
            margin: { left: 0.5, top: 1.5 },
        });
    }

    // Creating footer
    let footer = `Generated on ${new Date(Date.now()).toLocaleDateString()}`;
    doc.setFontSize(10).text(footer, 0.5, doc.internal.pageSize.height - 0.5);

    // Save the PDF
    doc.save(`storyReport.pdf`);
}


}
