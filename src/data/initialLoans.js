// Helper to generate dates relative to today
const getRelativeDateStr = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const getInitialLoans = () => [
  // 1. OVERDUE ACTIVE LOAN (7 days overdue) -> Belongs to Ananya Deshmukh (MEM-001)
  {
    id: 'LN-2026-001',
    bookId: 'b-101',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    bookIsbn: '978-0132350884',
    memberId: 'MEM-001',
    memberName: 'Ananya Deshmukh',
    memberEmail: 'ananya.deshmukh@iitb.ac.in',
    issueDate: getRelativeDateStr(-21),
    dueDate: getRelativeDateStr(-7),
    returnDate: null,
    status: 'Overdue',
    fineAmount: 70.0, // 7 days * ₹10
    finePaid: false,
    fineWaived: false,
    waiverReason: '',
    librarianNote: 'First reminder notice sent via email on ' + getRelativeDateStr(-3)
  },
  // 2. OVERDUE ACTIVE LOAN (3 days overdue) -> Belongs to Priya Nair (MEM-004)
  {
    id: 'LN-2026-002',
    bookId: 'b-503',
    bookTitle: 'Atomic Habits',
    bookIsbn: '978-0735211292',
    memberId: 'MEM-004',
    memberName: 'Priya Nair',
    memberEmail: 'priya.nair@delhiuniv.ac.in',
    issueDate: getRelativeDateStr(-17),
    dueDate: getRelativeDateStr(-3),
    returnDate: null,
    status: 'Overdue',
    fineAmount: 30.0, // 3 days * ₹10
    finePaid: false,
    fineWaived: false,
    waiverReason: '',
    librarianNote: 'Patron requested 1-day extension, passed grace limit'
  },
  // 3. ACTIVE LOAN - ON TIME -> Belongs to Prof. Rajesh Kulkarni (MEM-002)
  {
    id: 'LN-2026-003',
    bookId: 'b-701',
    bookTitle: 'Dune',
    bookIsbn: '978-0441013593',
    memberId: 'MEM-002',
    memberName: 'Prof. Rajesh Kulkarni',
    memberEmail: 'r.kulkarni@iisc.ac.in',
    issueDate: getRelativeDateStr(-8),
    dueDate: getRelativeDateStr(6),
    returnDate: null,
    status: 'Active',
    fineAmount: 0,
    finePaid: false,
    fineWaived: false,
    waiverReason: '',
    librarianNote: 'Issued for faculty semester reading seminar'
  },
  // 4. ACTIVE LOAN - ISSUED TODAY -> Belongs to Aarav Mehta (MEM-003)
  {
    id: 'LN-2026-004',
    bookId: 'b-401',
    bookTitle: 'Sapiens: A Brief History of Humankind',
    bookIsbn: '978-0062316097',
    memberId: 'MEM-003',
    memberName: 'Aarav Mehta',
    memberEmail: 'aarav.mehta@techlab.in',
    issueDate: getRelativeDateStr(0),
    dueDate: getRelativeDateStr(14),
    returnDate: null,
    status: 'Active',
    fineAmount: 0,
    finePaid: false,
    fineWaived: false,
    waiverReason: '',
    librarianNote: 'Regular loan checkout at circulation counter'
  },
  // 5. RETURNED TODAY - ON TIME -> Belongs to Kabir Sen (MEM-005)
  {
    id: 'LN-2026-005',
    bookId: 'b-201',
    bookTitle: 'To Kill a Mockingbird',
    bookIsbn: '978-0060935467',
    memberId: 'MEM-005',
    memberName: 'Kabir Sen',
    memberEmail: 'kabir.sen@jnu.ac.in',
    issueDate: getRelativeDateStr(-10),
    dueDate: getRelativeDateStr(4),
    returnDate: getRelativeDateStr(0),
    status: 'Returned',
    fineAmount: 0,
    finePaid: true,
    fineWaived: false,
    waiverReason: '',
    librarianNote: 'Returned in pristine condition'
  },
  // 6. RETURNED TODAY - WITH FINE PAID -> Belongs to Dr. Vikramaditya Verma (MEM-006)
  {
    id: 'LN-2026-006',
    bookId: 'b-102',
    bookTitle: 'Designing Data-Intensive Applications',
    bookIsbn: '978-1449373320',
    memberId: 'MEM-006',
    memberName: 'Dr. Vikramaditya Verma',
    memberEmail: 'v.verma@heritage.org.in',
    issueDate: getRelativeDateStr(-18),
    dueDate: getRelativeDateStr(-4),
    returnDate: getRelativeDateStr(0),
    status: 'Returned',
    fineAmount: 40.0,
    finePaid: true,
    paymentMethod: 'UPI / QR',
    fineWaived: false,
    waiverReason: '',
    librarianNote: 'Late return by 4 days. Fine of ₹40 collected via UPI.'
  },
  // 7. RETURNED YESTERDAY - FINE WAIVED -> Belongs to Ananya Deshmukh (MEM-001)
  {
    id: 'LN-2026-007',
    bookId: 'b-601',
    bookTitle: 'The Silent Patient',
    bookIsbn: '978-1250301696',
    memberId: 'MEM-001',
    memberName: 'Ananya Deshmukh',
    memberEmail: 'ananya.deshmukh@iitb.ac.in',
    issueDate: getRelativeDateStr(-20),
    dueDate: getRelativeDateStr(-6),
    returnDate: getRelativeDateStr(-1),
    status: 'Returned',
    fineAmount: 50.0,
    finePaid: false,
    fineWaived: true,
    waiverReason: 'Medical emergency certificate provided',
    librarianNote: 'Waived ₹50.00 late fee per Dr. Sunita Sharma approval'
  }
];

export const INITIAL_SETTINGS = {
  finePerDay: 10.0, // default ₹10 per day overdue
  gracePeriodDays: 1, // 1 day grace period
  loanDurationDays: 14,
  currency: '₹',
  libraryName: 'Athena Central Library & Knowledge Stacks',
  librarianName: 'Dr. Sunita Sharma, MLS',
  maxBooksPerMember: 5
};
