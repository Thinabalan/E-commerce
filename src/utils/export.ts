import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ExportFormat = 'EXCEL' | 'PDF';

/*Export utility for table data.*/
export const exportData = <T>(
  data: T[],
  columns: { id: any; label: string }[],
  format: ExportFormat,
  filename: string = "table-export"
) => {
  const section = [
    {
      name: "Data",        // for Excel sheet name
      title: filename.replace(/_/g, " "), // for PDF title
      data,
      columns
    }
  ];

  if (format === "EXCEL") {
    exportExcel(section, filename);
  } else {
    exportPDF(section, filename);
  }
};
//Global Excel Export(Multi-Sheet Support)
export const exportExcel = (
  sheets: {
    name: string;
    data: any[];
    columns: { id: any; label: string }[];
  }[],
  filename: string = "export"
) => {
  const workbook = XLSX.utils.book_new();

  sheets.forEach(sheet => {
    const excelData = sheet.data.map(item => {
      const row: any = {};
      sheet.columns.forEach(col => {
        const value = item[col.id];
        row[col.label] =
          value == null || String(value).trim() === ""
            ? "-"
            : value;
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto column width 
    const columnWidths = sheet.columns.map(col => ({
      wch: Math.max(
        col.label.length,
        ...excelData.map(r => String(r[col.label] || "").length)
      ) + 2
    }));
    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  });

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Global PDF Export(Multi-Section Support) 
export const exportPDF = (
  sections: {
    title: string;
    data: any[];
    columns: { id: any; label: string }[];
  }[],
  filename: string = "report"
) => {
  const doc = new jsPDF("l", "mm", "a4");
  const downloadDate = new Date().toLocaleString();

  sections.forEach((section, index) => {
    if (index > 0) {
      doc.addPage();
    }

    const headers = section.columns.map(col => col.label);
    const rows = section.data.map(row =>
      section.columns.map(col => {
        const val = row[col.id];
        return val == null || String(val).trim() === "" ? "-" : String(val);
      })
    );

    // Section Title
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, 14, 15);

    // Download date only on first page
    if (index === 0) {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont("helvetica", "normal");
      doc.text(`Download Date: ${downloadDate}`, 14, 22);
    }

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 28,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center"
      },
      alternateRowStyles: {
        fillColor: [245, 248, 255]
      },
      margin: { top: 28, bottom: 20 }
    });
  });

  // Page numbers 
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);

    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height
      ? pageSize.height
      : pageSize.getHeight();
    const pageWidth = pageSize.width
      ? pageSize.width
      : pageSize.getWidth();

    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - 14,
      pageHeight - 10,
      { align: "right" }
    );
  }

  doc.save(`${filename}.pdf`);
};

