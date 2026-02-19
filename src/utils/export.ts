import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ExportFormat = 'EXCEL' | 'PDF';

/* Common export utility for simple table data.*/
export const exportData = <T>(
    data: T[],
    columns: { id: any; label: string }[],
    format: ExportFormat,
    filename: string = "table-export"
) => {
    const headers = columns.map(col => col.label);
    const rows = data.map(row =>
        columns.map(col => {
            const val = (row as any)[col.id];
            if (val === null || val === undefined) return "";
            if (typeof val === 'object') return JSON.stringify(val);
            return String(val);
        })
    );

    switch (format) {
        case 'EXCEL':
            downloadExcel(data, columns, `${filename}.xlsx`);
            break;
        case 'PDF':
            downloadPDF(headers, rows, `${filename}.pdf`);
            break;
    }
};

/* Specialized export for a SINGLE registration including all nested "collapsible" data.*/
export const exportRegistrationDetails = (registration: any, format: ExportFormat) => {
    const filename = `Registration_Detail_${registration.id}`;

    if (format === 'PDF') {
        renderDetailedPDF(registration, filename);
    } else if (format === 'EXCEL') {
        renderDetailedExcel(registration, filename);
    }
};

// PDF Detailed Layout 
const renderDetailedPDF = (reg: any, filename: string) => {
    const doc = new jsPDF();
    let currentY = 15;

    // 1. Header
    doc.setFontSize(18);
    doc.text("Business Registration Report", 14, currentY);
    currentY += 10;

    // 2. Seller Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Seller Information", 14, currentY);
    currentY += 5;

    autoTable(doc, {
        startY: currentY,
        body: [
            ["Name:", reg.seller.name],
            ["Email:", reg.seller.email],
            ["Submitted At:", reg.submittedAt || "N/A"]
        ],
        theme: 'plain',
        styles: { fontSize: 10 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;

    // 3. Warehouses
    doc.setFontSize(12);
    doc.text(`Warehouses (${reg.seller.warehouses.length})`, 14, currentY);
    currentY += 5;

    const warehouseRows = reg.seller.warehouses.map((w: any) => [w.warehouseName, w.city, w.pincode, w.upload || "None"]);
    autoTable(doc, {
        startY: currentY,
        head: [["Name", "City", "Pincode", "Document"]],
        body: warehouseRows,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [44, 62, 80] }
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;

    // 4. Businesses & Products
    doc.setFontSize(12);
    doc.text(`Businesses (${reg.businesses.length})`, 14, currentY);
    currentY += 5;

    reg.businesses.forEach((biz: any, index: number) => {
        if (currentY > 250) { doc.addPage(); currentY = 15; }

        doc.setFontSize(10);
        doc.text(`${index + 1}. ${biz.businessName} (${biz.businessEmail})`, 14, currentY);
        currentY += 3;

        const productRows = biz.products.map((p: any) => [p.productName, p.category, p.price, p.stock]);
        autoTable(doc, {
            startY: currentY,
            head: [["Product Name", "Category", "Price (₹)", "Stock"]],
            body: productRows,
            styles: { fontSize: 8 },
            margin: { left: 20 },
            headStyles: { fillColor: [52, 152, 219] }
        });
        currentY = (doc as any).lastAutoTable.finalY + 8;
    });

    doc.save(`${filename}.pdf`);
};

// Excel Detailed Layout (Multiple Sheets) 
const renderDetailedExcel = (reg: any, filename: string) => {
    const workbook = XLSX.utils.book_new();

    // Combine everything into one array for a single-sheet report
    const reportData = [
        ["BUSINESS REGISTRATION REPORT"],
        [],
        ["SELLER INFORMATION"],
        ["Field", "Value"],
        ["Registration ID", reg.id],
        ["Seller Name", reg.seller.name],
        ["Seller Email", reg.seller.email],
        ["Submitted At", reg.submittedAt || "N/A"],
        [],
        ["WAREHOUSES"],
        ["Name", "City", "Pincode", "Document"],
        ...reg.seller.warehouses.map((w: any) => [w.warehouseName, w.city, w.pincode, w.upload || "None"]),
        [],
        ["BUSINESSES & PRODUCTS"],
        ["Business Name", "Product Name", "Category", "Price", "Stock"]
    ];

    reg.businesses.forEach((biz: any) => {
        biz.products.forEach((p: any) => {
            reportData.push([biz.businessName, p.productName, p.category, p.price, p.stock]);
        });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(reportData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Registration Report");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};





const downloadExcel = (data: any[], columns: any[], filename: string) => {
    const excelData = data.map(item => {
        const row: any = {};
        columns.forEach((col: any) => {
            row[col.label] = (item as any)[col.id];
        });
        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, filename);
};

/* Export multiple data sets into one Excel file with multiple sheets.*/
export const exportMultiSheetData = (
    sheets: { name: string; data: any[]; columns: { id: any; label: string }[] }[],
    filename: string = "multi-sheet-export"
) => {
    const workbook = XLSX.utils.book_new();

    sheets.forEach(sheet => {
        const excelData = sheet.data.map(item => {
            const row: any = {};
            sheet.columns.forEach((col: any) => {
                row[col.label] = (item as any)[col.id];
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    });

    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/* Export multiple data sets into one PDF file with multiple sections. */
export const exportMultiTablePDF = (
    sections: { title: string; data: any[]; columns: { id: any; label: string }[] }[],
    filename: string = "multi-section-report"
) => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const downloadDate = new Date().toLocaleString();
    let startY = 28;

    sections.forEach((section, index) => {
        if (index > 0) {
            doc.addPage();
            startY = 28;
        }

        const headers = section.columns.map(col => col.label);
        const rows = section.data.map(row =>
            section.columns.map(col => {
                const val = (row as any)[col.id];
                return val == null || String(val).trim() === "" ? "-" : String(val);
            })
        );

        // Section Title
        doc.setFontSize(14);
        doc.setTextColor(25, 118, 210);
        doc.setFont("helvetica", "bold");
        doc.text(section.title, 14, index === 0 ? 15 : 15);

        if (index === 0) {
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.setFont("helvetica", "normal");
            doc.text(`Download Date: ${downloadDate}`, 14, 22);
        }

        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: startY,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 3,
                valign: 'middle',
                lineWidth: 0.1,
                lineColor: [200, 200, 200]
            },
            headStyles: {
                fillColor: [25, 118, 210],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center'
            },
            alternateRowStyles: {
                fillColor: [245, 248, 255]
            },
            margin: { top: 28, bottom: 20 },
        });
    });

    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        doc.text(
            `Page ${i} of ${totalPages}`,
            pageWidth - 14,
            pageHeight - 10,
            { align: 'right' }
        );
    }

    doc.save(`${filename}.pdf`);
};


const downloadPDF = (headers: string[], rows: string[][], filename: string) => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const title = filename.replace(/_/g, ' ').replace(/\.pdf$/, '');
    const downloadDate = new Date().toLocaleString();

    // Header
    doc.setFontSize(16);
    doc.setTextColor(25, 118, 210);
    doc.text(title, 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Download Date: ${downloadDate}`, 14, 22);
    const formattedRows = rows.map(row =>
        row.map(cell =>
            cell == null || String(cell).trim() === ""
                ? "-"
                : String(cell)
        )
    );
    autoTable(doc, {
        head: [headers],
        body: formattedRows,
        startY: 28,
        theme: 'grid',
        styles: {
            fontSize: 8,
            cellPadding: 3,
            valign: 'middle',
            lineWidth: 0.1,
            lineColor: [200, 200, 200]
        },
        headStyles: {
            fillColor: [25, 118, 210],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [245, 248, 255]
        },
        margin: { top: 28, bottom: 20 },
    });

    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        doc.text(
            `Page ${i} of ${totalPages}`,
            pageWidth - 14,
            pageHeight - 10,
            { align: 'right' }
        );
    }
    doc.save(filename);
};

