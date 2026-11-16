export const downloadCSV = (filename, csvContent) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportDailyReportCSV = (dateStr, metrics, issuesToday, returnsToday, overdueList, currency = '₹') => {
  let rows = [];

  rows.push(['DAILY LIBRARIAN REPORT', dateStr]);
  rows.push(['Generated On', new Date().toLocaleString()]);
  rows.push([]);

  rows.push(['--- DAILY SUMMARY METRICS ---']);
  rows.push(['Metric', 'Value']);
  rows.push(['Books Issued Today', metrics.issuedTodayCount]);
  rows.push(['Books Returned Today', metrics.returnedTodayCount]);
  rows.push(['Fines Collected Today', `${currency}${metrics.finesCollectedToday.toFixed(2)}`]);
  rows.push(['Active Overdue Books (System-wide)', metrics.activeOverdueCount]);
  rows.push(['Total Outstanding Fines', `${currency}${metrics.totalOutstandingFines.toFixed(2)}`]);
  rows.push([]);

  rows.push(['--- BOOKS ISSUED ON THIS DATE ---']);
  rows.push(['Loan ID', 'Book Title', 'ISBN', 'Borrower Name', 'Borrower Email', 'Due Date', 'Status']);
  if (issuesToday.length === 0) {
    rows.push(['No books were issued on this date.']);
  } else {
    issuesToday.forEach(l => {
      rows.push([
        l.id,
        `"${l.bookTitle.replace(/"/g, '""')}"`,
        l.bookIsbn,
        `"${l.memberName.replace(/"/g, '""')}"`,
        l.memberEmail,
        l.dueDate,
        l.status
      ]);
    });
  }
  rows.push([]);

  rows.push(['--- BOOKS RETURNED ON THIS DATE ---']);
  rows.push(['Loan ID', 'Book Title', 'Borrower Name', 'Issue Date', 'Return Date', 'Fine Amount', 'Payment / Waiver Status']);
  if (returnsToday.length === 0) {
    rows.push(['No books were returned on this date.']);
  } else {
    returnsToday.forEach(l => {
      let fineStatus = 'No Fine';
      if (l.fineAmount > 0) {
        if (l.fineWaived) fineStatus = `Waived: ${l.waiverReason || 'Librarian discretion'}`;
        else if (l.finePaid) fineStatus = `Paid (${l.paymentMethod || 'Cash'})`;
        else fineStatus = 'Unpaid';
      }
      rows.push([
        l.id,
        `"${l.bookTitle.replace(/"/g, '""')}"`,
        `"${l.memberName.replace(/"/g, '""')}"`,
        l.issueDate,
        l.returnDate,
        `${currency}${Number(l.fineAmount || 0).toFixed(2)}`,
        `"${fineStatus}"`
      ]);
    });
  }
  rows.push([]);

  rows.push(['--- CURRENTLY OVERDUE BOOKS REQUIRING ATTENTION ---']);
  rows.push(['Loan ID', 'Book Title', 'Borrower Name', 'Email', 'Due Date', 'Overdue Days', 'Accrued Fine']);
  if (overdueList.length === 0) {
    rows.push(['No overdue books currently.']);
  } else {
    overdueList.forEach(l => {
      rows.push([
        l.id,
        `"${l.bookTitle.replace(/"/g, '""')}"`,
        `"${l.memberName.replace(/"/g, '""')}"`,
        l.memberEmail,
        l.dueDate,
        l.overdueDays || 'N/A',
        `${currency}${Number(l.currentFine || l.fineAmount || 0).toFixed(2)}`
      ]);
    });
  }

  const csvString = rows.map(r => r.join(',')).join('\r\n');
  downloadCSV(`Library_Daily_Report_${dateStr}.csv`, csvString);
};

export const exportCatalogCSV = (books) => {
  let rows = [];
  rows.push(['ID', 'Title', 'Author', 'Theme', 'ISBN', 'Published Year', 'Shelf Location', 'Total Copies', 'Available Copies', 'Rating']);
  books.forEach(b => {
    rows.push([
      b.id,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      b.theme,
      b.isbn,
      b.publishedYear,
      `"${b.shelfLocation}"`,
      b.totalCopies,
      b.availableCopies,
      b.rating
    ]);
  });
  const csvString = rows.map(r => r.join(',')).join('\r\n');
  downloadCSV(`Library_Book_Catalog_${new Date().toISOString().split('T')[0]}.csv`, csvString);
};

