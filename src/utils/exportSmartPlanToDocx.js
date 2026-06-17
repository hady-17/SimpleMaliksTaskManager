// Builds a .docx file from a generated Smart Plan and triggers a browser
// download. The "docx" library is dynamically imported so its (sizeable)
// code only loads when the user actually exports, not on every page load.

export async function exportSmartPlanToDocx(data, dateLabel) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');

  const children = [
    new Paragraph({ text: `Smart Plan — ${dateLabel}`, heading: HeadingLevel.TITLE }),
  ];

  if (data.raw) {
    for (const line of data.raw.split('\n')) {
      children.push(new Paragraph({ text: line }));
    }
  } else {
    if (data.plan?.length) {
      children.push(new Paragraph({ text: "Today's Plan", heading: HeadingLevel.HEADING_1 }));
      for (const step of data.plan) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${step.time}  `, bold: true }),
              new TextRun({ text: step.task }),
            ],
          })
        );
        if (step.note) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: step.note, italics: true, color: '666666' })],
            })
          );
        }
      }
    }

    if (data.tips?.length) {
      children.push(
        new Paragraph({
          text: 'Tips to Save Energy & Work Smart',
          heading: HeadingLevel.HEADING_1,
        })
      );
      for (const tip of data.tips) {
        children.push(new Paragraph({ text: tip, bullet: { level: 0 } }));
      }
    }
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smart-plan-${dateLabel}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
