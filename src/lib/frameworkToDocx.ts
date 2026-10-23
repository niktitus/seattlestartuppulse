import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';

/** Parse inline **bold** segments into TextRuns. */
function textRuns(text: string): TextRun[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return new TextRun({ text: part.slice(2, -2), bold: true });
    }
    return new TextRun({ text: part });
  });
}

function isTableSeparator(line: string): boolean {
  return /^\|?[\s:|-]+\|?$/.test(line) && line.includes('-');
}

function splitRow(line: string): string[] {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

const cellBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
};

function buildTable(lines: string[]): Table {
  const rows = lines.filter((l) => !isTableSeparator(l));
  const [headerLine, ...bodyLines] = rows;

  const makeRow = (line: string, header: boolean) =>
    new TableRow({
      tableHeader: header,
      children: splitRow(line).map(
        (cell) =>
          new TableCell({
            borders: cellBorders,
            width: { size: Math.floor(100 / splitRow(line).length), type: WidthType.PERCENTAGE },
            shading: header ? { fill: 'F0F4F1' } : undefined,
            children: [
              new Paragraph({
                children: header
                  ? [new TextRun({ text: cell, bold: true })]
                  : textRuns(cell),
              }),
            ],
          }),
      ),
    });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [makeRow(headerLine, true), ...bodyLines.map((l) => makeRow(l, false))],
  });
}

/** Convert the framework markdown (between the markers) into a .docx Blob. */
export async function frameworkToDocxBlob(markdown: string): Promise<Blob> {
  const lines = markdown.split('\n');
  const children: (Paragraph | Table)[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Pipe table: consecutive lines starting with |
    if (trimmed.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        children.push(buildTable(tableLines));
        children.push(new Paragraph({ text: '' }));
      }
      continue;
    }

    if (trimmed.startsWith('### ')) {
      children.push(
        new Paragraph({ heading: HeadingLevel.HEADING_3, children: textRuns(trimmed.slice(4)) }),
      );
    } else if (trimmed.startsWith('## ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 320 },
          children: textRuns(trimmed.slice(3)),
        }),
      );
    } else if (trimmed.startsWith('# ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 240 },
          children: textRuns(trimmed.slice(2)),
        }),
      );
    } else if (trimmed.startsWith('- ')) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: textRuns(trimmed.slice(2)),
        }),
      );
    } else {
      children.push(new Paragraph({ children: textRuns(trimmed) }));
    }
    i++;
  }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 22 } },
      },
    },
    sections: [{ properties: {}, children }],
  });

  return Packer.toBlob(doc);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/** Extract the framework markdown from an assistant message, if complete. */
export function extractFramework(text: string): string | null {
  const start = text.indexOf('<<<FRAMEWORK_START>>>');
  const end = text.indexOf('<<<FRAMEWORK_END>>>');
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start + '<<<FRAMEWORK_START>>>'.length, end).trim();
}

/** Strip framework markers (and the framework body) from chat display text. */
export function stripFramework(text: string): string {
  const start = text.indexOf('<<<FRAMEWORK_START>>>');
  if (start === -1) return text;
  const end = text.indexOf('<<<FRAMEWORK_END>>>');
  const before = text.slice(0, start).trim();
  const after = end === -1 ? '' : text.slice(end + '<<<FRAMEWORK_END>>>'.length).trim();
  return [before, after].filter(Boolean).join('\n\n');
}
