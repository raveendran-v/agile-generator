
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { Epic } from '@/pages/Index';

export const exportEpicsToDocx = async (
  allEpics: Epic[], 
  epicsWithStories: Set<string>
): Promise<void> => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "Project Epics",
          heading: HeadingLevel.TITLE,
        }),
        new Paragraph({
          text: `Generated on: ${new Date().toLocaleDateString()}`,
          spacing: { after: 400 },
        }),
        ...allEpics.flatMap((epic, index) => [
          new Paragraph({
            text: `Epic ${index + 1}: ${epic.epic_name}`,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Description: ", bold: true }),
              new TextRun({ text: epic.epic_description }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Status: ", bold: true }),
              new TextRun({ 
                text: epicsWithStories.has(epic.id) ? "Completed" : "Pending",
                color: epicsWithStories.has(epic.id) ? "00AA00" : "FF6600"
              }),
            ],
            spacing: { after: 400 },
          }),
        ])
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const element = document.createElement('a');
  element.href = URL.createObjectURL(blob);
  element.download = 'project-epics.docx';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
