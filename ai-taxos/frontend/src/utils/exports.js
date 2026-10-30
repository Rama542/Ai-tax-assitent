// Export utilities
export function exportToCSV(data, filename) {
  if (!data.length) return;
  const keys = Object.keys(data[0]).filter(k => k !== 'id' && k !== 'createdAt' && k !== 'updatedAt');
  const header = keys.join(',');
  const rows = data.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
}

export async function exportToPDF(data, title, columns) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, 14, 18);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 25);
  doc.line(14, 28, 280, 28);

  const colW = Math.floor((280 - 14) / columns.length);
  let y = 34;

  // Header
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
  columns.forEach((c, i) => doc.text(String(c).toUpperCase(), 14 + i * colW, y));
  y += 6;
  doc.line(14, y, 280, y); y += 4;

  // Rows
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  data.forEach(row => {
    if (y > 195) { doc.addPage(); y = 20; }
    columns.forEach((c, i) => {
      const val = row[c] != null ? String(row[c]) : '';
      doc.text(val.length > 22 ? val.slice(0,22) + '…' : val, 14 + i * colW, y);
    });
    y += 7;
  });

  doc.save(`${title.replace(/\s/g,'_')}_${new Date().toISOString().slice(0,10)}.pdf`);
}

export function exportToExcel(data, filename) {
  import('xlsx').then(XLSX => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0,10)}.xlsx`);
  }).catch(() => {
    // Fallback to CSV
    exportToCSV(data, filename);
  });
}
