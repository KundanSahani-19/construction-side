import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import {
  Labour,
  LabourService
} from '../../services/labour';

import {
  Site,
  SiteService
} from '../../services/site';

import {
  Payment,
  PaymentService
} from '../../services/payment';


// ======================================================
// INTERFACES
// ======================================================

interface AttendanceRecord {

  _id?: string;

  labour:
    | string
    | {
        _id?: string;
        name?: string;
        labourType?: string;
        dailyRate?: number;
        overtimeRate?: number;
      };

  site:
    | string
    | {
        _id?: string;
        siteName?: string;
        location?: string;
      };

  attendanceDate: string;

  status:
    | 'Present'
    | 'Half Day'
    | 'Absent'
    | 'Leave';

  dayValue: number;

  overtimeHours?: number;

  overtimeAmount?: number;

  attendanceUnit?:
    | 'Individual'
    | 'Couple Together';

  notes?: string;
}


interface SiteOption {
  _id?: string;
  siteName: string;
  location?: string;
}


// ======================================================
// COMPONENT
// ======================================================

@Component({
  selector: 'app-labour-statement',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './labour-statement.html',

  styleUrl: './labour-statement.css'
})
export class LabourStatement implements OnInit {


  // ====================================================
  // BASIC DATA
  // ====================================================

  labourId = '';

  labour: Labour | null = null;

  sites: SiteOption[] = [];

  attendances: AttendanceRecord[] = [];

  payments: Payment[] = [];


  // ====================================================
  // FILTERED DATA
  // ====================================================

  filteredAttendances: AttendanceRecord[] = [];

  filteredPayments: Payment[] = [];


  // ====================================================
  // UI
  // ====================================================

  loading = true;

  errorMessage = '';


  // ====================================================
  // FILTER
  // ====================================================

  selectedSiteId = '';

  fromDate = '';

  toDate = '';


  // ====================================================
  // SUMMARY
  // ====================================================

  totalWorkDays = 0;

  totalWorkingDays = 0;

  presentDays = 0;

  halfDays = 0;

  totalOvertimeHours = 0;

  totalLabourAmount = 0;

  totalOvertimeAmount = 0;

  grossAmount = 0;

  totalPaid = 0;

  remainingBalance = 0;


  // ====================================================
  // API
  // ====================================================

  private attendanceApi =
    'http://localhost:5001/api/attendance';


  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private http: HttpClient,

    private labourService: LabourService,

    private siteService: SiteService,

    private paymentService: PaymentService

  ) {}


  // ====================================================
  // INIT
  // ====================================================

  ngOnInit(): void {

    this.labourId =
      this.route.snapshot.paramMap.get('id') || '';

    if (!this.labourId) {

      this.errorMessage =
        'Labour ID nahi mila.';

      this.loading = false;

      return;
    }

    this.loadStatement();

  }


  // ====================================================
  // LOAD COMPLETE STATEMENT
  // ====================================================

  loadStatement(): void {

    this.loading = true;

    this.errorMessage = '';

    if (!this.labourId) {

      this.errorMessage =
        'Labour ID nahi mila.';

      this.loading = false;

      return;
    }


    // -----------------------------------------------
    // Labour
    // -----------------------------------------------

    this.labourService
      .getLabour(this.labourId)
      .subscribe({

        next: (response) => {

          this.labour =
            response?.data || null;

          if (!this.labour) {

            this.errorMessage =
              'Labour nahi mila.';

            this.loading = false;

            return;
          }


          this.loadSites();

          this.loadAttendance();

          this.loadPayments();

        },

        error: (error) => {

          console.error(
            'Labour loading failed:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Labour statement load nahi hua.';

          this.loading = false;

        }

      });

  }


  // ====================================================
  // LOAD SITES
  // ====================================================

  loadSites(): void {

    this.siteService
      .getSites()
      .subscribe({

        next: (response) => {

          this.sites =
            response?.data || [];

        },

        error: (error) => {

          console.error(
            'Sites loading failed:',
            error
          );

          this.sites = [];

        }

      });

  }


  // ====================================================
  // LOAD ATTENDANCE
  // ====================================================

  loadAttendance(): void {

    this.http
      .get<any>(this.attendanceApi)
      .subscribe({

        next: (response) => {

          const allAttendance =
            Array.isArray(response?.data)
              ? response.data
              : [];


          this.attendances =
            allAttendance.filter(
              (item: AttendanceRecord) => {

                const labour =
                  item.labour;

                if (
                  typeof labour === 'string'
                ) {

                  return labour === this.labourId;

                }


                return (
                  labour?._id === this.labourId
                );

              }
            );


          this.applyFilters();

          this.checkLoadingComplete();

        },

        error: (error) => {

          console.error(
            'Attendance loading failed:',
            error
          );

          this.attendances = [];

          this.applyFilters();

          this.checkLoadingComplete();

        }

      });

  }


  // ====================================================
  // LOAD PAYMENTS
  // ====================================================

  loadPayments(): void {

    this.paymentService
      .getLabourPayments(this.labourId)
      .subscribe({

        next: (response) => {

          this.payments =
            Array.isArray(response?.data)
              ? response.data
              : [];

          this.applyFilters();

          this.checkLoadingComplete();

        },

        error: (error) => {

          console.error(
            'Payment loading failed:',
            error
          );

          this.payments = [];

          this.applyFilters();

          this.checkLoadingComplete();

        }

      });

  }


  // ====================================================
  // LOADING CONTROL
  // ====================================================

  private labourLoaded = false;

  private attendanceLoaded = false;

  private paymentLoaded = false;


  private checkLoadingComplete(): void {

    if (this.labour) {

      this.labourLoaded = true;

    }

    this.attendanceLoaded =
      true;

    this.paymentLoaded =
      true;


    if (
      this.labourLoaded &&
      this.attendanceLoaded &&
      this.paymentLoaded
    ) {

      this.loading = false;

      this.applyFilters();

    }

  }


  // ====================================================
  // SITE CHANGE
  // ====================================================

  onSiteChange(): void {

    this.applyFilters();

  }


  // ====================================================
  // APPLY FILTERS
  // ====================================================

  applyFilters(): void {

    // -----------------------------------------------
    // Attendance
    // -----------------------------------------------

    this.filteredAttendances =
      this.attendances.filter(
        (attendance) => {

          // Site filter
          if (this.selectedSiteId) {

            const attendanceSiteId =
              this.getId(
                attendance.site
              );

            if (
              attendanceSiteId !==
              this.selectedSiteId
            ) {

              return false;

            }

          }


          // Date filter
          const date =
            this.toDateOnly(
              attendance.attendanceDate
            );


          if (
            this.fromDate &&
            date < this.fromDate
          ) {

            return false;

          }


          if (
            this.toDate &&
            date > this.toDate
          ) {

            return false;

          }


          return true;

        }
      );


    // -----------------------------------------------
    // Payments
    // -----------------------------------------------

    this.filteredPayments =
      this.payments.filter(
        (payment) => {

          // Site filter
          if (this.selectedSiteId) {

            const paymentSiteId =
              this.getId(
                payment.site
              );

            if (
              paymentSiteId !==
              this.selectedSiteId
            ) {

              return false;

            }

          }


          // Date filter
          const date =
            this.toDateOnly(
              payment.paymentDate
            );


          if (
            this.fromDate &&
            date < this.fromDate
          ) {

            return false;

          }


          if (
            this.toDate &&
            date > this.toDate
          ) {

            return false;

          }


          return true;

        }
      );


    this.calculateSummary();

  }


  // ====================================================
  // CLEAR FILTER
  // ====================================================

  clearFilters(): void {

    this.selectedSiteId = '';

    this.fromDate = '';

    this.toDate = '';

    this.applyFilters();

  }


  // ====================================================
  // CALCULATE SUMMARY
  // ====================================================

  calculateSummary(): void {

    let workDays = 0;

    let present = 0;

    let half = 0;

    let overtimeHours = 0;

    let labourAmount = 0;

    let overtimeAmount = 0;


    // -----------------------------------------------
    // Attendance calculation
    // -----------------------------------------------

    for (
      const attendance
      of this.filteredAttendances
    ) {

      const dayValue =
        Number(
          attendance.dayValue || 0
        );


      workDays += dayValue;


      if (
        attendance.status ===
        'Present'
      ) {

        present++;

      }


      if (
        attendance.status ===
        'Half Day'
      ) {

        half++;

      }


      overtimeHours +=
        Number(
          attendance.overtimeHours || 0
        );


      overtimeAmount +=
        Number(
          attendance.overtimeAmount || 0
        );


      labourAmount +=
        this.getAttendanceAmount(
          attendance
        );

    }


    this.totalWorkDays =
      workDays;


    this.totalWorkingDays =
      workDays;


    this.presentDays =
      present;


    this.halfDays =
      half;


    this.totalOvertimeHours =
      overtimeHours;


    this.totalLabourAmount =
      labourAmount;


    this.totalOvertimeAmount =
      overtimeAmount;


    this.grossAmount =
      labourAmount +
      overtimeAmount;


    // -----------------------------------------------
    // Payments
    // -----------------------------------------------

    this.totalPaid =
      this.filteredPayments.reduce(
        (
          total,
          payment
        ) => {

          return (
            total +
            Number(
              payment.amount || 0
            )
          );

        },
        0
      );


    this.remainingBalance =
      this.grossAmount -
      this.totalPaid;

  }


  // ====================================================
  // GET ATTENDANCE AMOUNT
  // ====================================================

  getAttendanceAmount(
    attendance: AttendanceRecord
  ): number {

    const rate =
      Number(
        this.labour?.dailyRate || 0
      );


    const dayValue =
      Number(
        attendance.dayValue || 0
      );


    return rate * dayValue;

  }


  // ====================================================
  // GET ATTENDANCE TOTAL
  // ====================================================

  getAttendanceTotal(
    attendance: AttendanceRecord
  ): number {

    const amount =
      this.getAttendanceAmount(
        attendance
      );


    const overtime =
      Number(
        attendance.overtimeAmount || 0
      );


    return amount + overtime;

  }


  // ====================================================
  // GET SITE NAME
  // ====================================================

  getSiteName(
    site:
      | string
      | {
          _id?: string;
          siteName?: string;
          location?: string;
        }
      | null
      | undefined
  ): string {

    if (!site) {

      return 'No Site';

    }


    if (
      typeof site === 'object'
    ) {

      return (
        site.siteName ||
        'No Site'
      );

    }


    const found =
      this.sites.find(
        item =>
          item._id === site
      );


    return (
      found?.siteName ||
      'Unknown Site'
    );

  }


  // ====================================================
  // GET ID FROM OBJECT / STRING
  // ====================================================

  private getId(
    value:
      | string
      | { _id?: string }
      | null
      | undefined
  ): string {

    if (!value) {

      return '';

    }


    if (
      typeof value === 'string'
    ) {

      return value;

    }


    return value._id || '';

  }


  // ====================================================
  // DATE ONLY
  // ====================================================

  private toDateOnly(
    value: string
  ): string {

    if (!value) {

      return '';

    }


    return value.substring(
      0,
      10
    );

  }


  // ====================================================
  // INITIALS
  // ====================================================

  getInitials(
    name?: string
  ): string {

    if (!name) {

      return 'L';

    }


    const words =
      name
        .trim()
        .split(/\s+/)
        .filter(Boolean);


    if (words.length === 1) {

      return words[0]
        .substring(0, 2)
        .toUpperCase();

    }


    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();

  }


  // ====================================================
  // GO BACK
  // ====================================================

  goBack(): void {

    this.router.navigate([
      '/labour'
    ]);

  }


  // ====================================================
  // DOWNLOAD EXCEL
  // ====================================================

  downloadExcel(): void {

    if (!this.labour) {

      alert(
        'Labour statement available nahi hai.'
      );

      return;

    }


    const companyInfo = [

      [
        'Shree Radha Construction'
      ],

      [
        '9111186281 | 7000091823'
      ],

      [
        'Purushattam Vihar Colony, Bhind Road, 474005'
      ],

      [],

      [
        'LABOUR STATEMENT'
      ],

      [],

      [
        'Labour Name',
        this.labour.name
      ],

      [
        'Labour Type',
        this.labour.labourType
      ],

      [
        'Mobile',
        this.labour.mobile || '-'
      ],

      [
        'Daily Rate',
        this.labour.dailyRate || 0
      ],

      [
        'Overtime Rate',
        this.labour.overtimeRate || 0
      ],

      [],

      [
        'SUMMARY'
      ],

      [
        'Total Work Days',
        this.totalWorkDays
      ],

      [
        'Present Days',
        this.presentDays
      ],

      [
        'Half Days',
        this.halfDays
      ],

      [
        'Overtime Hours',
        this.totalOvertimeHours
      ],

      [
        'Labour Work Amount',
        this.totalLabourAmount
      ],

      [
        'Overtime Amount',
        this.totalOvertimeAmount
      ],

      [
        'Gross Amount',
        this.grossAmount
      ],

      [
        'Total Paid',
        this.totalPaid
      ],

      [
        'Balance Remaining',
        this.remainingBalance
      ],

      [],

      [
        'ATTENDANCE HISTORY'
      ],

      [
        'Date',
        'Site',
        'Status',
        'Day',
        'Daily Rate',
        'Overtime Hours',
        'Overtime Amount',
        'Total Amount'
      ]

    ];


    for (
      const attendance
      of this.filteredAttendances
    ) {

      companyInfo.push([

        this.formatDate(
          attendance.attendanceDate
        ),

        this.getSiteName(
          attendance.site
        ),

        attendance.status,

        attendance.dayValue,

        this.getAttendanceAmount(
          attendance
        ),

        Number(
          attendance.overtimeHours || 0
        ),

        Number(
          attendance.overtimeAmount || 0
        ),

        this.getAttendanceTotal(
          attendance
        )

      ]);

    }


    companyInfo.push(
      [],
      [],
      ['PAYMENT HISTORY'],
      [
        'Date',
        'Site',
        'Payment Type',
        'Amount',
        'Payment Mode',
        'Reference',
        'Reason',
        'Notes'
      ]
    );


    for (
      const payment
      of this.filteredPayments
    ) {

      companyInfo.push([

        this.formatDate(
          payment.paymentDate
        ),

        this.getSiteName(
          payment.site
        ),

        payment.paymentType ||
        'Other',

        Number(
          payment.amount || 0
        ),

        payment.paymentMode,

        payment.referenceNumber ||
        '-',

        payment.reason ||
        '',

        payment.notes ||
        ''

      ]);

    }


    const worksheet =
      XLSX.utils.aoa_to_sheet(
        companyInfo
      );


    worksheet['!cols'] = [

      { wch: 24 },
      { wch: 28 },
      { wch: 18 },
      { wch: 12 },
      { wch: 16 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 }

    ];


    const workbook =
      XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Labour Statement'
    );


    const safeName =
      this.labour.name
        .replace(
          /[^a-zA-Z0-9-_]/g,
          '_'
        );


    XLSX.writeFile(
      workbook,
      `Labour_Statement_${safeName}.xlsx`
    );

  }


  // ====================================================
  // DOWNLOAD PDF
  // ====================================================

  downloadPDF(): void {

    if (!this.labour) {

      alert(
        'Labour statement available nahi hai.'
      );

      return;

    }


    const doc =
      new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });


    const pageWidth =
      doc.internal.pageSize.getWidth();


    // -----------------------------------------------
    // COMPANY HEADER
    // -----------------------------------------------

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(20);

    doc.text(
      'Shree Radha Construction',
      pageWidth / 2,
      18,
      {
        align: 'center'
      }
    );


    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.setFontSize(10);

    doc.text(
      '9111186281 | 7000091823',
      pageWidth / 2,
      25,
      {
        align: 'center'
      }
    );


    doc.text(
      'Purushattam Vihar Colony, Bhind Road, 474005',
      pageWidth / 2,
      31,
      {
        align: 'center'
      }
    );


    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(15);

    doc.text(
      'LABOUR STATEMENT',
      pageWidth / 2,
      43,
      {
        align: 'center'
      }
    );


    // -----------------------------------------------
    // LABOUR DETAILS
    // -----------------------------------------------

    autoTable(
      doc,
      {

        startY: 50,

        theme: 'grid',

        head: [
          [
            'Labour Name',
            'Type',
            'Mobile',
            'Daily Rate',
            'OT Rate'
          ]
        ],

        body: [

          [

            this.labour.name,

            this.labour.labourType,

            this.labour.mobile ||
            '-',

            `Rs. ${this.labour.dailyRate || 0}`,

            `Rs. ${this.labour.overtimeRate || 0}/hr`

          ]

        ],

        styles: {

          fontSize: 9,

          cellPadding: 3

        },

        headStyles: {

          fontStyle: 'bold'

        }

      }
    );


    // -----------------------------------------------
    // SUMMARY
    // -----------------------------------------------

    const summaryY =
      (doc as any).lastAutoTable.finalY + 8;


    doc.setFontSize(12);

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.text(
      'Work & Payment Summary',
      14,
      summaryY
    );


    autoTable(
      doc,
      {

        startY: summaryY + 4,

        theme: 'grid',

        head: [
          [
            'Total Work Days',
            'Present',
            'Half Day',
            'OT Hours',
            'Work Amount',
            'OT Amount',
            'Gross',
            'Paid',
            'Balance'
          ]
        ],

        body: [

          [

            this.totalWorkDays,

            this.presentDays,

            this.halfDays,

            this.totalOvertimeHours,

            `Rs. ${this.totalLabourAmount.toFixed(2)}`,

            `Rs. ${this.totalOvertimeAmount.toFixed(2)}`,

            `Rs. ${this.grossAmount.toFixed(2)}`,

            `Rs. ${this.totalPaid.toFixed(2)}`,

            `Rs. ${this.remainingBalance.toFixed(2)}`

          ]

        ],

        styles: {

          fontSize: 7,

          cellPadding: 3

        },

        headStyles: {

          fontStyle: 'bold'

        }

      }
    );


    // -----------------------------------------------
    // ATTENDANCE TABLE
    // -----------------------------------------------

    const attendanceY =
      (doc as any).lastAutoTable.finalY + 10;


    doc.setFontSize(12);

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.text(
      'Work / Attendance History',
      14,
      attendanceY
    );


    autoTable(
      doc,
      {

        startY: attendanceY + 4,

        theme: 'grid',

        head: [

          [

            'Date',

            'Site',

            'Status',

            'Day',

            'Work Amount',

            'OT Hrs',

            'OT Amount',

            'Total'

          ]

        ],

        body:

          this.filteredAttendances.map(
            attendance => [

              this.formatDate(
                attendance.attendanceDate
              ),

              this.getSiteName(
                attendance.site
              ),

              attendance.status,

              attendance.dayValue,

              `Rs. ${this.getAttendanceAmount(
                attendance
              ).toFixed(2)}`,

              Number(
                attendance.overtimeHours || 0
              ),

              `Rs. ${Number(
                attendance.overtimeAmount || 0
              ).toFixed(2)}`,

              `Rs. ${this.getAttendanceTotal(
                attendance
              ).toFixed(2)}`

            ]
          ),

        styles: {

          fontSize: 7,

          cellPadding: 2.5

        },

        headStyles: {

          fontStyle: 'bold'

        }

      }
    );


    // -----------------------------------------------
    // PAYMENT TABLE
    // -----------------------------------------------

    let paymentY =
      (doc as any).lastAutoTable.finalY + 10;


    // New page if required
    if (paymentY > 250) {

      doc.addPage();

      paymentY = 20;

    }


    doc.setFontSize(12);

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.text(
      'Payment / Advance History',
      14,
      paymentY
    );


    autoTable(
      doc,
      {

        startY: paymentY + 4,

        theme: 'grid',

        head: [

          [

            'Date',

            'Site',

            'Type',

            'Amount',

            'Mode',

            'Reference',

            'Reason / Notes'

          ]

        ],

        body:

          this.filteredPayments.map(
            payment => [

              this.formatDate(
                payment.paymentDate
              ),

              this.getSiteName(
                payment.site
              ),

              payment.paymentType ||
              'Other',

              `Rs. ${Number(
                payment.amount || 0
              ).toFixed(2)}`,

              payment.paymentMode,

              payment.referenceNumber ||
              '-',

              (

                payment.reason ||
                payment.notes ||
                '-'

              )

            ]
          ),

        styles: {

          fontSize: 7,

          cellPadding: 2.5

        },

        headStyles: {

          fontStyle: 'bold'

        }

      }
    );


    // -----------------------------------------------
    // FOOTER ON EVERY PAGE
    // -----------------------------------------------

    const pageCount =
      doc.getNumberOfPages();


    for (
      let page = 1;
      page <= pageCount;
      page++
    ) {

      doc.setPage(page);

      const pageHeight =
        doc.internal.pageSize.getHeight();


      doc.setFont(
        'helvetica',
        'normal'
      );

      doc.setFontSize(8);

      doc.text(
        `Shree Radha Construction | Page ${page} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 8,
        {
          align: 'center'
        }
      );

    }


    // -----------------------------------------------
    // SAVE
    // -----------------------------------------------

    const safeName =
      this.labour.name
        .replace(
          /[^a-zA-Z0-9-_]/g,
          '_'
        );


    doc.save(
      `Labour_Statement_${safeName}.pdf`
    );

  }


  // ====================================================
  // FORMAT DATE
  // ====================================================

  private formatDate(
    value: string
  ): string {

    if (!value) {

      return '-';

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }


    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }

}