import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ExportFormat } from '../../utils/export';

/* Export for a SINGLE registration including all nested "collapsible" data*/
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
