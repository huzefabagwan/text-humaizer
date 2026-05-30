/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from "docx";

export interface DocBlock {
  id: string;
  type: 'heading1' | 'heading2' | 'paragraph' | 'list-item' | 'table';
  content: string;
  // For tables, we can store structured rows and cells as a JSON string or nested structure
  tableData?: string[][]; 
  style?: {
    bold?: boolean;
    italic?: boolean;
    listType?: 'bullet' | 'number';
  };
}

// Dynamically load an external script and return a promise
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

/**
 * Parses a TXT file into DocBlocks
 */
export function parseTxt(text: string): DocBlock[] {
  const lines = text.split(/\r?\n\r?\n/);
  const blocks: DocBlock[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const id = `txt-${index}-${Math.random().toString(36).substr(2, 9)}`;

    // Detect lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      blocks.push({
        id,
        type: 'list-item',
        content: trimmed.replace(/^[-*•]\s+/, ''),
        style: { listType: 'bullet' }
      });
    } else if (/^\d+\.\s+/.test(trimmed)) {
      blocks.push({
        id,
        type: 'list-item',
        content: trimmed.replace(/^\d+\.\s+/, ''),
        style: { listType: 'number' }
      });
    }
    // Detect headings
    else if (trimmed.startsWith('# ')) {
      blocks.push({
        id,
        type: 'heading1',
        content: trimmed.substring(2)
      });
    } else if (trimmed.startsWith('## ')) {
      blocks.push({
        id,
        type: 'heading2',
        content: trimmed.substring(3)
      });
    } else if (trimmed.length < 60 && trimmed === trimmed.toUpperCase() && !trimmed.endsWith('.')) {
      // Short uppercase line is likely a heading
      blocks.push({
        id,
        type: 'heading2',
        content: trimmed
      });
    }
    // Default to paragraph
    else {
      blocks.push({
        id,
        type: 'paragraph',
        content: trimmed
      });
    }
  });

  return blocks;
}

/**
 * Parses a PDF file using PDF.js CDN
 */
async function parsePdf(file: File): Promise<DocBlock[]> {
  try {
    // Load PDFJS CDN
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    
    // Configure worker
    const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const blocks: DocBlock[] = [];
    let blockIndex = 0;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      let lastY = -1;
      let currentParagraph = '';
      
      for (const item of textContent.items as any[]) {
        const text = item.str;
        const currentY = item.transform[5]; // Y coordinate
        
        // If Y changes significantly, it is a new line or paragraph
        if (lastY !== -1 && Math.abs(currentY - lastY) > 12) {
          if (currentParagraph.trim()) {
            const trimmed = currentParagraph.trim();
            const id = `pdf-${blockIndex++}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Check heading based on capitalization/length since font info is simplified
            if (trimmed.length < 80 && (trimmed === trimmed.toUpperCase() || item.transform[0] > 12)) {
              blocks.push({
                id,
                type: 'heading2',
                content: trimmed
              });
            } else if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
              blocks.push({
                id,
                type: 'list-item',
                content: trimmed.replace(/^[•-]\s*/, ''),
                style: { listType: 'bullet' }
              });
            } else {
              blocks.push({
                id,
                type: 'paragraph',
                content: trimmed
              });
            }
            currentParagraph = '';
          }
        }
        
        currentParagraph += (currentParagraph ? ' ' : '') + text;
        lastY = currentY;
      }
      
      // Flush last paragraph on page
      if (currentParagraph.trim()) {
        const trimmed = currentParagraph.trim();
        const id = `pdf-${blockIndex++}-${Math.random().toString(36).substr(2, 9)}`;
        blocks.push({
          id,
          type: 'paragraph',
          content: trimmed
        });
      }
    }
    
    return blocks.length > 0 ? blocks : [{ id: 'pdf-fallback', type: 'paragraph', content: 'No selectable text found in this PDF.' }];
  } catch (error) {
    console.error('PDF parsing error, using fallback:', error);
    return [{ id: 'pdf-error', type: 'paragraph', content: `Error reading PDF file: ${file.name}. Ensure it contains selectable text.` }];
  }
}

/**
 * Parses a DOCX file using JSZip to parse document.xml structure
 */
async function parseDocx(file: File): Promise<DocBlock[]> {
  try {
    // Load JSZip dynamically
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    const JSZip = (window as any).JSZip;
    
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    // Word documents contain word/document.xml
    const docXmlText = await zip.file("word/document.xml")?.async("text");
    if (!docXmlText) {
      throw new Error("Invalid DOCX: missing word/document.xml");
    }
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(docXmlText, "application/xml");
    const paragraphs = xmlDoc.getElementsByTagName("w:p");
    
    const blocks: DocBlock[] = [];
    let blockIndex = 0;
    
    for (let i = 0; i < paragraphs.length; i++) {
      const pNode = paragraphs[i];
      
      // Ignore if this paragraph is inside a table cell (handled separately if tables are found)
      // w:tc is Table Cell. If parent of parent etc. is w:tc, ignore here to avoid duplication.
      let isInsideTable = false;
      let parent = pNode.parentNode;
      while (parent) {
        if (parent.nodeName === 'w:tc' || parent.nodeName === 'w:tbl') {
          isInsideTable = true;
          break;
        }
        parent = parent.parentNode;
      }
      if (isInsideTable) continue;

      const block = parseParagraphNode(pNode, `docx-${blockIndex++}`);
      if (block) blocks.push(block);
    }
    
    // Now look for tables in the XML at root level and process them separately
    const tables = xmlDoc.getElementsByTagName("w:tbl");
    if (tables.length > 0) {
      for (let t = 0; t < tables.length; t++) {
        const tblNode = tables[t];
        const rows = tblNode.getElementsByTagName("w:tr");
        const tableData: string[][] = [];
        
        for (let r = 0; r < rows.length; r++) {
          const rowNode = rows[r];
          const cells = rowNode.getElementsByTagName("w:tc");
          const rowData: string[] = [];
          
          for (let c = 0; c < cells.length; c++) {
            const cellNode = cells[c];
            // Extract text from cells
            const cellParagraphs = cellNode.getElementsByTagName("w:p");
            let cellText = "";
            for (let cp = 0; cp < cellParagraphs.length; cp++) {
              const textNodes = cellParagraphs[cp].getElementsByTagName("w:t");
              for (let tn = 0; tn < textNodes.length; tn++) {
                cellText += textNodes[tn].textContent || "";
              }
              if (cp < cellParagraphs.length - 1) cellText += "\n";
            }
            rowData.push(cellText);
          }
          tableData.push(rowData);
        }
        
        if (tableData.length > 0) {
          blocks.push({
            id: `docx-tbl-${t}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'table',
            content: `[Table with ${tableData.length} rows and ${tableData[0]?.length || 0} columns]`,
            tableData
          });
        }
      }
    }
    
    return blocks.length > 0 ? blocks : [{ id: 'docx-fallback', type: 'paragraph', content: 'No readable paragraphs found in DOCX.' }];
  } catch (error) {
    console.error("DOCX parsing error:", error);
    return [{ id: 'docx-error', type: 'paragraph', content: `Error reading DOCX file: ${file.name}. XML structure may be encrypted or corrupted.` }];
  }
}

// Helper to parse a w:p XML node
function parseParagraphNode(pNode: Element, baseId: string): DocBlock | null {
  const textNodes = pNode.getElementsByTagName("w:t");
  let content = "";
  for (let j = 0; j < textNodes.length; j++) {
    content += textNodes[j].textContent || "";
  }
  
  const trimmed = content.trim();
  if (!trimmed) return null;
  
  const id = `${baseId}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Detect headings from style property
  const pPr = pNode.getElementsByTagName("w:pPr")[0];
  let isH1 = false;
  let isH2 = false;
  let isBullet = false;
  let isNumber = false;
  
  if (pPr) {
    const pStyle = pPr.getElementsByTagName("w:pStyle")[0];
    if (pStyle) {
      const val = pStyle.getAttribute("w:val");
      if (val && (val.includes("Heading1") || val === "1" || val.toLowerCase().includes("h1"))) {
        isH1 = true;
      } else if (val && (val.includes("Heading2") || val === "2" || val.toLowerCase().includes("h2"))) {
        isH2 = true;
      }
    }
    
    const numPr = pPr.getElementsByTagName("w:numPr")[0];
    if (numPr) {
      const numId = numPr.getElementsByTagName("w:numId")[0]?.getAttribute("w:val");
      // Check if bullet style or decimal numbering
      if (numId === "1" || numId === "2" || numId === "3") {
        isBullet = true;
      } else {
        isNumber = true;
      }
    }
  }
  
  // Style flags
  const rNodes = pNode.getElementsByTagName("w:r");
  let isBold = false;
  let isItalic = false;
  if (rNodes.length > 0) {
    // Check if the majority or first runs are bold/italic
    const rPr = rNodes[0].getElementsByTagName("w:rPr")[0];
    if (rPr) {
      isBold = rPr.getElementsByTagName("w:b").length > 0;
      isItalic = rPr.getElementsByTagName("w:i").length > 0;
    }
  }
  
  if (isH1) {
    return { id, type: 'heading1', content: trimmed };
  } else if (isH2) {
    return { id, type: 'heading2', content: trimmed };
  } else if (isBullet) {
    return { id, type: 'list-item', content: trimmed, style: { listType: 'bullet', bold: isBold, italic: isItalic } };
  } else if (isNumber) {
    return { id, type: 'list-item', content: trimmed, style: { listType: 'number', bold: isBold, italic: isItalic } };
  } else {
    return { id, type: 'paragraph', content: trimmed, style: { bold: isBold, italic: isItalic } };
  }
}

/**
 * Public document parsing dispatcher
 */
export async function parseDocument(file: File): Promise<DocBlock[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'txt') {
    const text = await file.text();
    return parseTxt(text);
  } else if (extension === 'pdf') {
    return parsePdf(file);
  } else if (extension === 'docx') {
    return parseDocx(file);
  }
  
  throw new Error(`Unsupported file format: .${extension}`);
}

/**
 * Exports DocBlocks to plain text format
 */
export function exportToTxt(blocks: DocBlock[]): string {
  return blocks.map(block => {
    if (block.type === 'heading1') {
      return `# ${block.content}`;
    } else if (block.type === 'heading2') {
      return `## ${block.content}`;
    } else if (block.type === 'list-item') {
      const bullet = block.style?.listType === 'number' ? '1. ' : '• ';
      return `${bullet}${block.content}`;
    } else if (block.type === 'table' && block.tableData) {
      // Build a text table
      const rowsText = block.tableData.map(row => `| ${row.join(' | ')} |`).join('\n');
      return rowsText;
    } else {
      return block.content;
    }
  }).join('\n\n');
}

/**
 * Exports DocBlocks to a valid DOCX file and triggers download
 */
export async function exportToDocx(blocks: DocBlock[], originalName: string): Promise<Blob> {
  const docChildren: any[] = [];
  
  blocks.forEach(block => {
    if (block.type === 'heading1') {
      docChildren.push(
        new Paragraph({
          text: block.content,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (block.type === 'heading2') {
      docChildren.push(
        new Paragraph({
          text: block.content,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (block.type === 'list-item') {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: block.content,
              bold: block.style?.bold,
              italics: block.style?.italic,
            }),
          ],
          bullet: block.style?.listType === 'bullet' ? { level: 0 } : undefined,
          numbering: block.style?.listType === 'number' ? { reference: "num-1", level: 0 } : undefined,
          spacing: { before: 60, after: 60 },
        })
      );
    } else if (block.type === 'table' && block.tableData) {
      const tableRows = block.tableData.map(row => {
        return new TableRow({
          children: row.map(cellText => {
            return new TableCell({
              children: [new Paragraph({ text: cellText })],
              margins: { top: 100, bottom: 100, left: 150, right: 150 },
            });
          }),
        });
      });
      
      docChildren.push(
        new Table({
          rows: tableRows,
          width: {
            size: 100,
            type: 'percent' as any,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 8, color: "CCCCCC" },
            bottom: { style: BorderStyle.SINGLE, size: 8, color: "CCCCCC" },
            left: { style: BorderStyle.SINGLE, size: 8, color: "CCCCCC" },
            right: { style: BorderStyle.SINGLE, size: 8, color: "CCCCCC" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "EAEAEA" },
            insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "EAEAEA" },
          },
        })
      );
    } else {
      // Regular paragraph
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: block.content,
              bold: block.style?.bold,
              italics: block.style?.italic,
            }),
          ],
          spacing: { before: 120, after: 120, line: 360 }, // 1.5 line spacing
        })
      );
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Downloads a Blob directly in the browser
 */
export function triggerFileDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
