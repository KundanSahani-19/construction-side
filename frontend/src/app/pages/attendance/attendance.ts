import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


// ======================================================
// SITE
// ======================================================

interface Site {
  _id?: string;
  siteName: string;
  location?: string;
}


// ======================================================
// COUPLE MEMBER
// ======================================================

interface CoupleMember {
  name: string;
  mobile?: string;
  dailyRate: number;
}


// ======================================================
// COUPLE
// ======================================================

interface Couple {
  _id?: string;
  coupleName: string;

  member1: CoupleMember;
  member2: CoupleMember;

  currentSite?: Site | string | null;

  paymentType:
    | 'Daily'
    | 'Monthly'
    | 'Piece Rate';

  status:
    | 'Active'
    | 'Inactive';

  joiningDate?: string;
  notes?: string;
}


// ======================================================
// ATTENDANCE MEMBER
// ======================================================

interface AttendanceMember {
  status:
    | 'Present'
    | 'Absent'
    | 'Half Day';

  amount: number;

  overtimeHours: number;

  overtimeAmount: number;

  notes: string;
}


// ======================================================
// COUPLE ATTENDANCE
// ======================================================

interface CoupleAttendance {
  _id?: string;

  couple: any;

  site: any;

  date: string;

  member1: AttendanceMember;

  member2: AttendanceMember;

  totalAmount: number;

  notes?: string;
}


// ======================================================
// LABOUR ADVANCE
// ======================================================

interface LabourAdvance {
  _id?: string;

  labour:
    | string
    | {
        _id?: string;
        name?: string;
      };

  amount: number;

  date: string;

  reason?: string;

  notes?: string;

  createdAt?: string;
}


// ======================================================
// LABOUR STATEMENT
// ======================================================

interface LabourStatementData {

  labourId: string;

  labourName: string;

  totalDays: number;

  totalEarned: number;

  totalOvertime: number;

  totalAdvance: number;

  totalPaid: number;

  balance: number;

  attendances: any[];

  advances: LabourAdvance[];
}


// ======================================================
// COMPONENT
// ======================================================

@Component({
  selector: 'app-attendance',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './attendance.html',

  styleUrl: './attendance.css'
})
export class AttendanceComponent
  implements OnInit {


// ======================================================
// API
// ======================================================

private coupleApi =
  'http://localhost:5001/api/couples';

private siteApi =
  'http://localhost:5001/api/sites';

private attendanceApi =
  'http://localhost:5001/api/couple-attendance';

private labourApi =
  'http://localhost:5001/api/labours';

private advanceApi =
  'http://localhost:5001/api/labour-advances';

private statementApi =
  'http://localhost:5001/api/labour-statements';


// ======================================================
// DATA
// ======================================================

couples: Couple[] = [];

sites: Site[] = [];

attendances: CoupleAttendance[] = [];

labours: any[] = [];

advances: LabourAdvance[] = [];


// ======================================================
// FORM
// ======================================================

selectedCoupleId = '';

selectedSiteId = '';

selectedDate = this.getToday();


// ======================================================
// MEMBER 1
// ======================================================

member1: AttendanceMember = {

  status: 'Absent',

  amount: 0,

  overtimeHours: 0,

  overtimeAmount: 0,

  notes: ''

};


// ======================================================
// MEMBER 2
// ======================================================

member2: AttendanceMember = {

  status: 'Absent',

  amount: 0,

  overtimeHours: 0,

  overtimeAmount: 0,

  notes: ''

};


// ======================================================
// NOTES
// ======================================================

notes = '';


// ======================================================
// STATES
// ======================================================

loading = false;

saving = false;

loadingLabours = false;

loadingStatement = false;

savingAdvance = false;


// ======================================================
// LABOUR SEARCH
// ======================================================

labourSearch = '';

selectedStatementLabour = '';

statementFromDate = '';

statementToDate = '';


// ======================================================
// ADVANCE FORM
// ======================================================

advanceAmount = 0;

advanceDate = this.getToday();

advanceReason = '';

advanceNotes = '';


// ======================================================
// CURRENT STATEMENT
// ======================================================

statement: LabourStatementData | null = null;


// ======================================================
// INIT
// ======================================================

ngOnInit(): void {

  this.loadCouples();

  this.loadSites();

  this.loadAttendances();

  this.loadLabours();

}


// ======================================================
// TODAY
// ======================================================

getToday(): string {

  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, '0');

  const day =
    String(
      today.getDate()
    ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


// ======================================================
// LOAD COUPLES
// ======================================================

loadCouples(): void {

  this.http.get<any>(
    this.coupleApi
  ).subscribe({

    next: (response) => {

      this.couples =
        Array.isArray(response?.data)
          ? response.data.filter(
              (couple: Couple) =>
                couple.status === 'Active'
            )
          : [];

    },

    error: (error) => {

      console.error(
        'Couples loading failed:',
        error
      );

      this.couples = [];

    }

  });

}


// ======================================================
// LOAD SITES
// ======================================================

loadSites(): void {

  this.http.get<any>(
    this.siteApi
  ).subscribe({

    next: (response) => {

      this.sites =
        Array.isArray(response?.data)
          ? response.data
          : [];

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


// ======================================================
// LOAD LABOURS
// ======================================================

loadLabours(): void {

  this.loadingLabours = true;

  this.http.get<any>(
    this.labourApi
  ).subscribe({

    next: (response) => {

      this.labours =
        Array.isArray(response?.data)
          ? response.data
          : [];

      this.loadingLabours = false;

    },

    error: (error) => {

      console.error(
        'Labours loading failed:',
        error
      );

      this.labours = [];

      this.loadingLabours = false;

    }

  });

}


// ======================================================
// LOAD ATTENDANCE
// ======================================================

loadAttendances(): void {

  this.loading = true;

  this.http.get<any>(
    this.attendanceApi
  ).subscribe({

    next: (response) => {

      this.attendances =
        Array.isArray(response?.data)
          ? response.data
          : [];

      this.loading = false;

    },

    error: (error) => {

      console.error(
        'Attendance loading failed:',
        error
      );

      this.attendances = [];

      this.loading = false;

    }

  });

}


// ======================================================
// SELECTED COUPLE
// ======================================================

getSelectedCouple():
  Couple | undefined {

  return this.couples.find(
    couple =>
      couple._id ===
      this.selectedCoupleId
  );

}


// ======================================================
// COUPLE CHANGE
// ======================================================

onCoupleChange(): void {

  const couple =
    this.getSelectedCouple();

  if (!couple) {

    this.member1.amount = 0;

    this.member2.amount = 0;

    this.member1.overtimeAmount = 0;

    this.member2.overtimeAmount = 0;

    return;

  }


  if (!this.selectedSiteId) {

    if (
      couple.currentSite &&
      typeof couple.currentSite === 'object'
    ) {

      this.selectedSiteId =
        couple.currentSite._id || '';

    }

    else if (
      typeof couple.currentSite === 'string'
    ) {

      this.selectedSiteId =
        couple.currentSite;

    }

  }


  this.calculateAmounts();

}


// ======================================================
// MEMBER STATUS CHANGE
// ======================================================

onMemberStatusChange(): void {

  this.calculateAmounts();

}


// ======================================================
// CALCULATE AMOUNTS
// ======================================================

calculateAmounts(): void {

  const couple =
    this.getSelectedCouple();

  if (!couple) {

    this.member1.amount = 0;

    this.member2.amount = 0;

    this.member1.overtimeAmount = 0;

    this.member2.overtimeAmount = 0;

    return;

  }


  const member1Rate =
    Number(
      couple.member1?.dailyRate || 0
    );

  const member2Rate =
    Number(
      couple.member2?.dailyRate || 0
    );


  // MEMBER 1

  if (
    this.member1.status === 'Present'
  ) {

    this.member1.amount =
      member1Rate;

  }

  else if (
    this.member1.status === 'Half Day'
  ) {

    this.member1.amount =
      member1Rate / 2;

  }

  else {

    this.member1.amount = 0;

  }


  // MEMBER 2

  if (
    this.member2.status === 'Present'
  ) {

    this.member2.amount =
      member2Rate;

  }

  else if (
    this.member2.status === 'Half Day'
  ) {

    this.member2.amount =
      member2Rate / 2;

  }

  else {

    this.member2.amount = 0;

  }


  // OVERTIME

  this.member1.overtimeAmount =
    this.calculateOvertime(
      this.member1.overtimeHours,
      member1Rate
    );


  this.member2.overtimeAmount =
    this.calculateOvertime(
      this.member2.overtimeHours,
      member2Rate
    );

}


// ======================================================
// OVERTIME
// ======================================================

calculateOvertime(
  hours: number,
  dailyRate: number
): number {

  const overtimeRate =
    Number(dailyRate || 0) / 8;

  return Math.round(
    Number(hours || 0) *
    overtimeRate
  );

}


// ======================================================
// TOTAL
// ======================================================

getTotalAmount(): number {

  return (

    Number(
      this.member1.amount || 0
    )

    +

    Number(
      this.member1.overtimeAmount || 0
    )

    +

    Number(
      this.member2.amount || 0
    )

    +

    Number(
      this.member2.overtimeAmount || 0
    )

  );

}


// ======================================================
// FORMAT MONEY
// ======================================================

formatMoney(
  amount: number
): string {

  return Number(
    amount || 0
  ).toLocaleString(
    'en-IN',
    {
      maximumFractionDigits: 2
    }
  );

}


// ======================================================
// SAVE ATTENDANCE
// ======================================================

saveAttendance(): void {

  if (!this.selectedCoupleId) {

    alert(
      'Pehle Couple / Jodi select karo.'
    );

    return;

  }


  if (!this.selectedSiteId) {

    alert(
      'Site select karo.'
    );

    return;

  }


  if (!this.selectedDate) {

    alert(
      'Date select karo.'
    );

    return;

  }


  this.calculateAmounts();

  this.saving = true;


  const data = {

    couple:
      this.selectedCoupleId,

    site:
      this.selectedSiteId,

    date:
      this.selectedDate,

    member1: {

      status:
        this.member1.status,

      amount:
        Number(
          this.member1.amount || 0
        ),

      overtimeHours:
        Number(
          this.member1.overtimeHours || 0
        ),

      overtimeAmount:
        Number(
          this.member1.overtimeAmount || 0
        ),

      notes:
        this.member1.notes || ''

    },

    member2: {

      status:
        this.member2.status,

      amount:
        Number(
          this.member2.amount || 0
        ),

      overtimeHours:
        Number(
          this.member2.overtimeHours || 0
        ),

      overtimeAmount:
        Number(
          this.member2.overtimeAmount || 0
        ),

      notes:
        this.member2.notes || ''

    },

    totalAmount:
      this.getTotalAmount(),

    notes:
      this.notes || ''

  };


  this.http.post<any>(
    this.attendanceApi,
    data
  ).subscribe({

    next: () => {

      alert(
        'Couple attendance saved successfully ✅'
      );

      this.resetForm();

      this.loadAttendances();

      this.saving = false;

    },

    error: (error) => {

      console.error(
        'Attendance save failed:',
        error
      );

      alert(
        error?.error?.message ||
        'Attendance save nahi hui ❌'
      );

      this.saving = false;

    }

  });

}


// ======================================================
// RESET
// ======================================================

resetForm(): void {

  this.selectedCoupleId = '';

  this.selectedSiteId = '';

  this.selectedDate =
    this.getToday();


  this.member1 = {

    status: 'Absent',

    amount: 0,

    overtimeHours: 0,

    overtimeAmount: 0,

    notes: ''

  };


  this.member2 = {

    status: 'Absent',

    amount: 0,

    overtimeHours: 0,

    overtimeAmount: 0,

    notes: ''

  };


  this.notes = '';

}


// ======================================================
// FILTER ATTENDANCE
// ======================================================

get filteredAttendances():
  CoupleAttendance[] {

  const search =
    this.labourSearch
      .trim()
      .toLowerCase();


  return this.attendances.filter(
    (attendance) => {

      const couple =
        attendance.couple;

      const member1 =
        couple?.member1?.name || '';

      const member2 =
        couple?.member2?.name || '';

      const coupleName =
        couple?.coupleName || '';

      const siteName =
        attendance.site?.siteName || '';


      const matchesSearch =

        !search ||

        member1
          .toLowerCase()
          .includes(search) ||

        member2
          .toLowerCase()
          .includes(search) ||

        coupleName
          .toLowerCase()
          .includes(search) ||

        siteName
          .toLowerCase()
          .includes(search);


      const attendanceDate =
        new Date(
          attendance.date
        );


      const fromOk =

        !this.statementFromDate ||

        attendanceDate >=
        new Date(
          `${this.statementFromDate}T00:00:00`
        );


      const toOk =

        !this.statementToDate ||

        attendanceDate <=
        new Date(
          `${this.statementToDate}T23:59:59`
        );


      return (
        matchesSearch &&
        fromOk &&
        toOk
      );

    }
  );

}


// ======================================================
// STATEMENT DAYS
// ======================================================

getStatementTotalDays(): number {

  return this.filteredAttendances
    .reduce(
      (total, attendance) => {

        const m1 =
          attendance.member1?.status ===
          'Present'

            ? 1

            : attendance.member1?.status ===
              'Half Day'

              ? 0.5

              : 0;


        const m2 =
          attendance.member2?.status ===
          'Present'

            ? 1

            : attendance.member2?.status ===
              'Half Day'

              ? 0.5

              : 0;


        return total + m1 + m2;

      },
      0
    );

}


// ======================================================
// STATEMENT OVERTIME
// ======================================================

getStatementOvertime(): number {

  return this.filteredAttendances
    .reduce(
      (total, attendance) => {

        return (

          total +

          Number(
            attendance.member1
              ?.overtimeAmount || 0
          )

          +

          Number(
            attendance.member2
              ?.overtimeAmount || 0
          )

        );

      },
      0
    );

}


// ======================================================
// STATEMENT EARNED
// ======================================================

getStatementEarned(): number {

  return this.filteredAttendances
    .reduce(
      (total, attendance) => {

        return (

          total +

          Number(
            attendance.totalAmount || 0
          )

        );

      },
      0
    );

}


// ======================================================
// LOAD LABOUR STATEMENT
// ======================================================

loadLabourStatement(
  labourId: string
): void {

  if (!labourId) {

    return;

  }


  this.selectedStatementLabour =
    labourId;

  this.loadingStatement = true;


  let url =
    `${this.statementApi}/${labourId}`;


  const params: string[] = [];


  if (this.statementFromDate) {

    params.push(
      `fromDate=${encodeURIComponent(
        this.statementFromDate
      )}`
    );

  }


  if (this.statementToDate) {

    params.push(
      `toDate=${encodeURIComponent(
        this.statementToDate
      )}`
    );

  }


  if (params.length) {

    url += `?${params.join('&')}`;

  }


  this.http.get<any>(
    url
  ).subscribe({

    next: (response) => {

      this.statement =
        response?.data || null;


      this.advances =
        Array.isArray(
          response?.data?.advances
        )
          ? response.data.advances
          : [];


      this.loadingStatement = false;

    },

    error: (error) => {

      console.error(
        'Labour statement loading failed:',
        error
      );

      this.statement = null;

      this.advances = [];

      this.loadingStatement = false;


      alert(
        error?.error?.message ||
        'Labour statement load nahi hua.'
      );

    }

  });

}


// ======================================================
// SEARCH LABOUR
// ======================================================

searchLabourStatement(): void {

  const search =
    this.labourSearch
      .trim()
      .toLowerCase();


  if (!search) {

    this.selectedStatementLabour =
      '';

    this.statement = null;

    return;

  }


  const labour =
    this.labours.find(
      (item: any) => {

        const name =
          String(
            item?.name || ''
          ).toLowerCase();

        const mobile =
          String(
            item?.mobile || ''
          ).toLowerCase();

        return (
          name.includes(search) ||
          mobile.includes(search)
        );

      }
    );


  if (!labour?._id) {

    this.selectedStatementLabour =
      '';

    this.statement = null;

    alert(
      'Labour nahi mila.'
    );

    return;

  }


  this.loadLabourStatement(
    labour._id
  );

}


// ======================================================
// ADVANCE AMOUNT
// ======================================================

getStatementAdvance(): number {

  if (this.statement) {

    return Number(
      this.statement.totalAdvance || 0
    );

  }


  return this.advances.reduce(
    (total, advance) => {

      return total +
        Number(
          advance.amount || 0
        );

    },
    0
  );

}


// ======================================================
// ADD ADVANCE
// ======================================================

addAdvance(): void {

  if (
    !this.selectedStatementLabour
  ) {

    alert(
      'Pehle labour select/search karo.'
    );

    return;

  }


  const amount =
    Number(
      this.advanceAmount || 0
    );


  if (amount <= 0) {

    alert(
      'Advance amount enter karo.'
    );

    return;

  }


  if (!this.advanceDate) {

    alert(
      'Advance date select karo.'
    );

    return;

  }


  this.savingAdvance = true;


  const data = {

    labour:
      this.selectedStatementLabour,

    amount,

    date:
      this.advanceDate,

    reason:
      this.advanceReason || '',

    notes:
      this.advanceNotes || ''

  };


  this.http.post<any>(
    this.advanceApi,
    data
  ).subscribe({

    next: (response) => {

      alert(
        response?.message ||
        'Advance added successfully ✅'
      );


      this.advanceAmount = 0;

      this.advanceDate =
        this.getToday();

      this.advanceReason = '';

      this.advanceNotes = '';


      this.savingAdvance = false;


      this.loadLabourStatement(
        this.selectedStatementLabour
      );

    },

    error: (error) => {

      console.error(
        'Advance save failed:',
        error
      );

      this.savingAdvance = false;


      alert(
        error?.error?.message ||
        'Advance save nahi hua ❌'
      );

    }

  });

}


// ======================================================
// DELETE ADVANCE
// ======================================================

deleteAdvance(
  id?: string
): void {

  if (!id) {

    return;

  }


  const confirmed =
    confirm(
      'Kya aap ye advance delete karna chahte ho?'
    );


  if (!confirmed) {

    return;

  }


  this.http.delete<any>(
    `${this.advanceApi}/${id}`
  ).subscribe({

    next: () => {

      alert(
        'Advance deleted successfully ✅'
      );


      if (
        this.selectedStatementLabour
      ) {

        this.loadLabourStatement(
          this.selectedStatementLabour
        );

      }

    },

    error: (error) => {

      console.error(
        'Advance delete failed:',
        error
      );

      alert(
        error?.error?.message ||
        'Advance delete nahi hua ❌'
      );

    }

  });

}


// ======================================================
// STATEMENT BALANCE
// ======================================================

getStatementBalance(): number {

  const earned =
    this.statement
      ? Number(
          this.statement.totalEarned || 0
        )
      : this.getStatementEarned();


  const advance =
    this.getStatementAdvance();


  const paid =
    this.statement
      ? Number(
          this.statement.totalPaid || 0
        )
      : 0;


  return Math.max(
    earned -
    advance -
    paid,
    0
  );

}


// ======================================================
// STATEMENT TOTAL
// ======================================================

getStatementTotal(): number {

  if (this.statement) {

    return Number(
      this.statement.totalEarned || 0
    );

  }


  return this.getStatementEarned();

}


// ======================================================
// CLEAR SEARCH
// ======================================================

clearStatementSearch(): void {

  this.labourSearch = '';

  this.statementFromDate = '';

  this.statementToDate = '';

  this.selectedStatementLabour = '';

  this.statement = null;

  this.advances = [];

}


// ======================================================
// COUPLE NAME
// ======================================================

getCoupleName(
  couple: any
): string {

  if (!couple) {

    return 'Unknown Couple';

  }


  if (
    typeof couple === 'string'
  ) {

    return couple;

  }


  return (

    couple.coupleName ||

    `${couple.member1?.name || ''} & ${
      couple.member2?.name || ''
    }`

  );

}


// ======================================================
// SITE NAME
// ======================================================

getSiteName(
  site: any
): string {

  if (!site) {

    return 'Unknown Site';

  }


  if (
    typeof site === 'string'
  ) {

    const found =
      this.sites.find(
        s =>
          s._id === site
      );


    return (
      found?.siteName ||
      site
    );

  }


  return (
    site.siteName ||
    'Unknown Site'
  );

}


// ======================================================
// DELETE ATTENDANCE
// ======================================================

deleteAttendance(
  id?: string
): void {

  if (!id) {

    return;

  }


  const confirmed =
    confirm(
      'Kya aap ye attendance delete karna chahte ho?'
    );


  if (!confirmed) {

    return;

  }


  this.http.delete<any>(
    `${this.attendanceApi}/${id}`
  ).subscribe({

    next: () => {

      alert(
        'Attendance deleted successfully ✅'
      );

      this.loadAttendances();

    },

    error: (error) => {

      console.error(
        'Delete attendance failed:',
        error
      );

      alert(
        error?.error?.message ||
        'Attendance delete nahi hui ❌'
      );

    }

  });

}


// ======================================================
// DOWNLOAD / PRINT STATEMENT
// ======================================================

downloadLabourStatement(): void {

  if (
    !this.selectedStatementLabour
  ) {

    this.searchLabourStatement();

    if (
      !this.selectedStatementLabour
    ) {

      return;

    }

  }


  if (
    !this.statement
  ) {

    alert(
      'Pehle labour statement load karo.'
    );

    return;

  }


  window.print();

}


// ======================================================
// GET SELECTED LABOUR NAME
// ======================================================

getSelectedLabourName(): string {

  if (
    this.statement?.labourName
  ) {

    return this.statement.labourName;

  }


  const labour =
    this.labours.find(
      (item: any) =>
        item?._id ===
        this.selectedStatementLabour
    );


  return (
    labour?.name ||
    'Unknown Labour'
  );

}


// ======================================================
// GET LABOUR RATE
// ======================================================

getSelectedLabourRate(): number {

  const labour =
    this.labours.find(
      (item: any) =>
        item?._id ===
        this.selectedStatementLabour
    );


  return Number(
    labour?.dailyRate || 0
  );

}


// ======================================================
// GET ADVANCE COUNT
// ======================================================

getAdvanceCount(): number {

  return this.advances.length;

}


// ======================================================
// GET PRESENT DAYS
// ======================================================

getPresentDays(): number {

  if (this.statement) {

    return Number(
      this.statement.totalDays || 0
    );

  }


  return this.getStatementTotalDays();

}


// ======================================================
// GET OVERTIME
// ======================================================

getTotalOvertime(): number {

  if (this.statement) {

    return Number(
      this.statement.totalOvertime || 0
    );

  }


  return this.getStatementOvertime();

}


// ======================================================
// GET TOTAL PAID
// ======================================================

getTotalPaid(): number {

  if (this.statement) {

    return Number(
      this.statement.totalPaid || 0
    );

  }


  return 0;

}


// ======================================================
// CONSTRUCTOR
// ======================================================

constructor(
  private http: HttpClient
) {}

}