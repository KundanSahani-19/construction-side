import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


// ======================================================
// TYPES
// ======================================================

interface MeasurementSite {
  _id: string;
  siteName: string;
  location?: string;
}

interface Measurement {
  _id?: string;

  site:
    | string
    | MeasurementSite;

  workType:
    | 'Plaster'
    | 'Brick Work'
    | 'Concrete'
    | 'Flooring'
    | 'Painting'
    | 'Tiles'
    | 'Shuttering'
    | 'Excavation'
    | 'Other';

  length: number;
  width: number;
  height: number;

  unit:
    | 'sq.ft'
    | 'sq.m'
    | 'cu.ft'
    | 'cu.m'
    | 'running.ft'
    | 'piece';

  quantity: number;

  rate: number;

  totalAmount: number;

  measurementDate: string;

  photoUrl?: string;

  aiAnalysis?: string;

  notes?: string;

  status?:
    | 'Pending'
    | 'Calculated'
    | 'Completed';

  createdAt?: string;

  updatedAt?: string;
}

interface MeasurementResponse {
  success: boolean;
  message?: string;
  count?: number;
  data: Measurement[];
}


// ======================================================
// COMPONENT
// ======================================================

@Component({
  selector: 'app-measurements',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],

  templateUrl: './measurements.html',

  styleUrls: ['./measurements.css']
})
export class Measurements implements OnInit {

  // ======================================================
  // API
  // ======================================================

  private apiUrl =
    'http://localhost:5001/api/measurements';


  // ======================================================
  // MEASUREMENTS
  // ======================================================

  measurements: Measurement[] = [];

  filteredMeasurements: Measurement[] = [];


  // ======================================================
  // SITES
  // ======================================================

  sites: MeasurementSite[] = [];


  // ======================================================
  // LOADING
  // ======================================================

  loading = false;

  saving = false;

  deleting = false;


  // ======================================================
  // MESSAGES
  // ======================================================

  errorMessage = '';

  successMessage = '';


  // ======================================================
  // FORM
  // ======================================================

  showForm = false;

  editingId: string | null = null;


  form: any = {

    site: '',

    workType: 'Plaster',

    length: 0,

    width: 0,

    height: 0,

    unit: 'sq.ft',

    quantity: 0,

    rate: 0,

    totalAmount: 0,

    measurementDate: '',

    photoUrl: '',

    aiAnalysis: '',

    notes: '',

    status: 'Calculated'

  };


  // ======================================================
  // EXISTING HTML VARIABLE NAMES
  // ======================================================

  filterFromDate = '';

  filterToDate = '';

  sortBy = 'measurementDate';


  // ======================================================
  // OTHER FILTERS
  // ======================================================

  searchText = '';

  selectedSite = '';

  selectedWorkType = '';

  selectedStatus = '';

  selectedUnit = '';


  // ======================================================
  // DETAILS
  // ======================================================

  showDetails = false;

  selectedMeasurement: Measurement | null = null;

  // ======================================================
  // HTML COMPATIBILITY / UI STATE
  // ======================================================

  loadingMeasurements = false;

  selectedPhotoName = '';

  // Smart Photo Measurement
  smartPhotoName = '';
  smartPhotoUrl = '';
  referenceLength = 0;
  referenceWidth = 0;
  smartUnit = 'sq.ft';
  smartRate = 0;
  smartQuantity = 0;
  smartAmount = 0;
  smartNotes = '';

  get newMeasurement(): any {
    return this.form;
  }

  set newMeasurement(value: any) {
    this.form = value;
  }

  get isEditing(): boolean {
    return !!this.editingId;
  }

  get totalWorkValue(): number {
    return this.totalAmount;
  }

  get filterSite(): string {
    return this.selectedSite;
  }

  set filterSite(value: string) {
    this.selectedSite = value || '';
  }

  get filterWorkType(): string {
    return this.selectedWorkType;
  }

  set filterWorkType(value: string) {
    this.selectedWorkType = value || '';
  }

  get filterStatus(): string {
    return this.selectedStatus;
  }

  set filterStatus(value: string) {
    this.selectedStatus = value || '';
  }

  get filterUnit(): string {
    return this.selectedUnit;
  }

  set filterUnit(value: string) {
    this.selectedUnit = value || '';
  }


  // ======================================================
  // WORK TYPES
  // ======================================================

  workTypes = [

    'Plaster',

    'Brick Work',

    'Concrete',

    'Flooring',

    'Painting',

    'Tiles',

    'Shuttering',

    'Excavation',

    'Other'

  ];


  // ======================================================
  // UNITS
  // ======================================================

  units = [

    'sq.ft',

    'sq.m',

    'cu.ft',

    'cu.m',

    'running.ft',

    'piece'

  ];


  // ======================================================
  // STATISTICS
  // ======================================================

  totalMeasurements = 0;

  totalQuantity = 0;

  totalAmount = 0;

  pendingCount = 0;

  calculatedCount = 0;

  completedCount = 0;


  // ======================================================
  // SMART PHOTO MEASUREMENT
  // ======================================================

  onSmartPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please image file select karein.';
      return;
    }

    this.smartPhotoName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.smartPhotoUrl = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  }

  calculateSmartMeasurement(): void {
    const length = Number(this.referenceLength) || 0;
    const width = Number(this.referenceWidth) || 0;
    const rate = Number(this.smartRate) || 0;

    this.smartQuantity = this.round(length * width);
    this.smartAmount = this.round(this.smartQuantity * rate);
  }

  useSmartMeasurement(): void {
    if (!this.referenceLength || !this.referenceWidth) {
      this.errorMessage = 'Reference length aur width enter karein.';
      return;
    }

    this.form.length = Number(this.referenceLength) || 0;
    this.form.width = Number(this.referenceWidth) || 0;
    this.form.unit = this.smartUnit;
    this.form.rate = Number(this.smartRate) || 0;
    this.form.notes = this.smartNotes || '';

    if (this.smartPhotoUrl) {
      this.form.photoUrl = this.smartPhotoUrl;
      this.selectedPhotoName = this.smartPhotoName;
    }

    this.calculateQuantity();
    this.showForm = true;
    this.clearMessages();
  }

  resetSmartPhoto(): void {
    this.smartPhotoName = '';
    this.smartPhotoUrl = '';
    this.referenceLength = 0;
    this.referenceWidth = 0;
    this.smartUnit = 'sq.ft';
    this.smartRate = 0;
    this.smartQuantity = 0;
    this.smartAmount = 0;
    this.smartNotes = '';
  }

  // ======================================================
  // DOWNLOAD / REPORT
  // ======================================================

  downloadMeasurementsExcel(): void {
    this.exportCSV();
  }

  downloadMeasurementsPDF(): void {
    if (this.filteredMeasurements.length === 0) {
      this.errorMessage = 'PDF ke liye koi data nahi hai.';
      return;
    }

    const rows = this.filteredMeasurements.map(m => `
      <tr>
        <td>${this.formatDate(m.measurementDate)}</td>
        <td>${this.escapeHtml(this.getSiteName(m))}</td>
        <td>${this.escapeHtml(m.workType)}</td>
        <td>${m.length} × ${m.width}${m.unit === 'cu.ft' || m.unit === 'cu.m' ? ` × ${m.height}` : ''}</td>
        <td>${this.formatQuantity(m.quantity)} ${this.escapeHtml(m.unit)}</td>
        <td>₹${this.formatMoney(m.rate)}</td>
        <td>₹${this.formatMoney(m.totalAmount)}</td>
        <td>${this.escapeHtml(m.status || 'Calculated')}</td>
      </tr>`).join('');

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      this.errorMessage = 'Popup blocked hai. Browser me popup allow karein.';
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
      <head>
        <title>Construction Measurements</title>
        <style>
          @page{
            size:A4 landscape;
            margin:10mm;
          }

          *{
            box-sizing:border-box;
          }

          html,
          body{
            margin:0;
            padding:0;
            background:#ffffff;
            color:#111827;
          }

          body{
            font-family:Arial,Helvetica,sans-serif;
          }

          .report{
            width:100%;
            margin:0 auto;
            padding:0 8px 16px;
          }

          .company-header{
            width:100%;
            min-height:145px;
            border:1px solid #b7b7b7;
            background:#ffffff;
            text-align:center;
            padding:12px 15px;
            margin:0 auto 18px;
          }

          .company-name{
            margin:0;
            color:#c00000;
            font-size:30px;
            line-height:1.15;
            font-weight:800;
            text-align:center;
          }

          .company-address{
            margin:8px 0 0;
            color:#111111;
            font-size:17px;
            line-height:1.35;
            text-align:center;
          }

          .company-phone{
            margin:0;
            color:#111111;
            font-size:17px;
            line-height:1.35;
            text-align:center;
          }

          .report-title{
            margin:0 0 4px;
            color:#111827;
            font-size:20px;
            font-weight:700;
            text-align:center;
          }

          .report-subtitle{
            margin:0;
            color:#6b7280;
            font-size:12px;
            text-align:center;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:18px;
          }

          th,
          td{
            border:1px solid #d1d5db;
            padding:8px;
            font-size:12px;
            text-align:left;
            vertical-align:middle;
          }

          th{
            background:#f3f4f6;
            color:#111827;
            font-weight:700;
          }

          .total{
            margin-top:18px;
            padding:10px;
            border:1px solid #d1d5db;
            background:#f8fafc;
            color:#111827;
            font-weight:700;
            text-align:center;
          }

          @media print{
            .report{
              padding:0;
            }

            table{
              page-break-inside:auto;
            }

            tr{
              page-break-inside:avoid;
              page-break-after:auto;
            }

            .company-header{
              page-break-inside:avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="report">

          <div class="company-header">

            <h1 class="company-name">
              Shree Radha Construction
            </h1>

            <p class="company-address">
              Purushattam Vihar Colony, Bhind Road, Gwalior
            </p>

            <p class="company-phone">
              PHONE (9111186281, 7000091823)
            </p>

          </div>

          <h2 class="report-title">
            Construction Measurement Report
          </h2>

          <p class="report-subtitle">
            Measurement, Quantity &amp; Work Value Details
          </p>

          <table>
            <thead><tr><th>Date</th><th>Site</th><th>Work</th><th>Measurement</th><th>Quantity</th><th>Rate</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>

          <div class="total">
            Total Records: ${this.filteredMeasurements.length}
            | Total Quantity: ${this.formatQuantity(this.totalQuantity)}
            | Total Work Value: ₹${this.formatMoney(this.totalAmount)}
          </div>

        </div>
      </body>
      </html>`);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  }

  private escapeHtml(value: string): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ======================================================
  // PAGINATION
  // ======================================================

  currentPage = 1;

  pageSize = 10;


  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(
    private http: HttpClient
  ) {}


  // ======================================================
  // INIT
  // ======================================================

  ngOnInit(): void {

    this.setTodayDate();

    this.loadMeasurements();

  }


  // ======================================================
  // TODAY
  // ======================================================

  setTodayDate(): void {

    const today =
      new Date();

    this.form.measurementDate =
      today.toISOString()
        .split('T')[0];

  }


  // ======================================================
  // LOAD MEASUREMENTS
  // ======================================================

  loadMeasurements(): void {

    this.loading = true;
    this.loadingMeasurements = true;

    this.errorMessage = '';

    this.http
      .get<MeasurementResponse>(
        this.apiUrl
      )
      .subscribe({

        next: (response: MeasurementResponse) => {

          console.log(
            'MEASUREMENT GET RESPONSE:',
            response
          );

          if (
            response &&
            response.success &&
            Array.isArray(response.data)
          ) {

            this.measurements =
              response.data;

          } else {

            this.measurements = [];

          }


          console.log(
            'MEASUREMENTS LOADED:',
            this.measurements
          );


          this.filteredMeasurements =
            [...this.measurements];


          this.extractSites();

          this.applyFilters();

          this.loading = false;
          this.loadingMeasurements = false;

        },

        error: (error: any) => {

          console.error(
            'MEASUREMENT LOAD ERROR:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Measurements load nahi ho paayi.';

          this.loading = false;
          this.loadingMeasurements = false;

        }

      });

  }


  // ======================================================
  // REFRESH
  // ======================================================

  refresh(): void {

    this.loadMeasurements();

  }

  // HTML uses this name
  refreshMeasurements(): void {
    this.loadMeasurements();
  }


  // ======================================================
  // EXTRACT SITES
  // ======================================================

  extractSites(): void {

    const siteMap =
      new Map<string, MeasurementSite>();


    for (
      const measurement
      of this.measurements
    ) {

      if (
        measurement.site &&
        typeof measurement.site !== 'string'
      ) {

        siteMap.set(
          measurement.site._id,
          measurement.site
        );

      }

    }


    this.sites =
      Array.from(
        siteMap.values()
      );

  }


  // ======================================================
  // NEW MEASUREMENT
  // ======================================================

  OpenNewMeasurement(): void {

    this.editingId = null;

    this.resetForm();

    this.showForm = true;

    this.clearMessages();

  }


  // ======================================================
  // OPEN FORM
  // ======================================================

  openAddForm(): void {

    this.OpenNewMeasurement();

  }


  // ======================================================
  // CLOSE FORM
  // ======================================================

  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

  }


  // ======================================================
  // RESET FORM
  // ======================================================

  resetForm(): void {

    this.form = {

      site:
        '',

      workType:
        'Plaster',

      length:
        0,

      width:
        0,

      height:
        0,

      unit:
        'sq.ft',

      quantity:
        0,

      rate:
        0,

      totalAmount:
        0,

      measurementDate:
        this.getTodayDate(),

      photoUrl:
        '',

      aiAnalysis:
        '',

      notes:
        '',

      status:
        'Calculated'

    };

  }


  // ======================================================
  // GET TODAY
  // ======================================================

  getTodayDate(): string {

    const today =
      new Date();

    return today
      .toISOString()
      .split('T')[0];

  }


  // ======================================================
  // CALCULATE
  // ======================================================

  calculateQuantity(): void {

    const length =
      Number(
        this.form.length
      ) || 0;

    const width =
      Number(
        this.form.width
      ) || 0;

    const height =
      Number(
        this.form.height
      ) || 0;

    const rate =
      Number(
        this.form.rate
      ) || 0;


    let quantity = 0;


    if (
      this.form.unit === 'cu.ft' ||
      this.form.unit === 'cu.m'
    ) {

      quantity =
        length *
        width *
        height;

    }

    else if (
      this.form.unit === 'running.ft' ||
      this.form.unit === 'piece'
    ) {

      quantity =
        length;

    }

    else {

      quantity =
        length *
        width;

    }


    this.form.quantity =
      this.round(quantity);


    this.form.totalAmount =
      this.round(
        quantity *
        rate
      );

  }


  // ======================================================
  // CALCULATE MEASUREMENT
  // HTML compatibility for the existing template
  // ======================================================

  calculateMeasurement(): void {

    this.calculateQuantity();

  }


  // ======================================================
  // DIMENSION CHANGE
  // ======================================================

  onDimensionChange(): void {

    this.calculateQuantity();

  }


  // ======================================================
  // RATE CHANGE
  // ======================================================

  onRateChange(): void {

    this.calculateQuantity();

  }


  // ======================================================
  // UNIT CHANGE
  // ======================================================

  onUnitChange(): void {

    this.calculateQuantity();

  }


  // ======================================================
  // ROUND
  // ======================================================

  round(
    value: number
  ): number {

    return Math.round(
      value * 100
    ) / 100;

  }


  // ======================================================
  // SAVE
  // ======================================================

  // HTML uses createMeasurement()
  createMeasurement(): void {
    this.saveMeasurement();
  }

  saveMeasurement(): void {

    this.clearMessages();


    if (!this.form.site) {

      this.errorMessage =
        'Please site select karein.';

      return;

    }


    if (!this.form.workType) {

      this.errorMessage =
        'Please work type select karein.';

      return;

    }


    this.calculateQuantity();


    const payload = {

      site:
        this.form.site,

      workType:
        this.form.workType,

      length:
        Number(
          this.form.length
        ) || 0,

      width:
        Number(
          this.form.width
        ) || 0,

      height:
        Number(
          this.form.height
        ) || 0,

      unit:
        this.form.unit,

      rate:
        Number(
          this.form.rate
        ) || 0,

      measurementDate:
        this.form.measurementDate,

      photoUrl:
        this.form.photoUrl || '',

      aiAnalysis:
        this.form.aiAnalysis || '',

      notes:
        this.form.notes || '',

      status:
        this.form.status ||
        'Calculated'

    };


    this.saving = true;


    // ==================================================
    // UPDATE
    // ==================================================

    if (this.editingId) {

      this.http
        .put<MeasurementResponse>(
          `${this.apiUrl}/${this.editingId}`,
          payload
        )
        .subscribe({

          next: (response: MeasurementResponse) => {

            console.log(
              'MEASUREMENT UPDATED:',
              response
            );

            this.successMessage =
              'Measurement updated successfully.';

            this.saving = false;

            this.showForm = false;

            this.editingId = null;

            this.loadMeasurements();

          },

          error: (error: any) => {

            console.error(
              'UPDATE ERROR:',
              error
            );

            this.errorMessage =
              error?.error?.message ||
              'Measurement update nahi ho paayi.';

            this.saving = false;

          }

        });

      return;

    }


    // ==================================================
    // CREATE
    // ==================================================

    this.http
      .post<MeasurementResponse>(
        this.apiUrl,
        payload
      )
      .subscribe({

        next: (response: MeasurementResponse) => {

          console.log(
            'MEASUREMENT CREATED:',
            response
          );

          this.successMessage =
            'Measurement saved successfully.';

          this.saving = false;

          this.showForm = false;


          /*
           * IMPORTANT:
           *
           * Save ke baad directly browser
           * array me depend nahi karenge.
           *
           * MongoDB se fresh GET karenge.
           *
           * Isse browser refresh ke baad bhi
           * history correctly dikhegi.
           */

          this.loadMeasurements();

        },

        error: (error: any) => {

          console.error(
            'CREATE ERROR:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Measurement save nahi ho paayi.';

          this.saving = false;

        }

      });

  }


  // ======================================================
  // EDIT
  // ======================================================

  editMeasurement(
    measurement: Measurement
  ): void {

    if (!measurement._id) {

      return;

    }


    this.editingId =
      measurement._id;


    const siteId =
      this.getSiteId(
        measurement
      );


    this.form = {

      site:
        siteId,

      workType:
        measurement.workType,

      length:
        measurement.length || 0,

      width:
        measurement.width || 0,

      height:
        measurement.height || 0,

      unit:
        measurement.unit,

      quantity:
        measurement.quantity || 0,

      rate:
        measurement.rate || 0,

      totalAmount:
        measurement.totalAmount || 0,

      measurementDate:
        this.formatInputDate(
          measurement.measurementDate
        ),

      photoUrl:
        measurement.photoUrl || '',

      aiAnalysis:
        measurement.aiAnalysis || '',

      notes:
        measurement.notes || '',

      status:
        measurement.status ||
        'Calculated'

    };


    this.showForm = true;

    this.calculateQuantity();

  }


  // ======================================================
  // VIEW
  // ======================================================

  viewMeasurement(
    measurement: Measurement
  ): void {

    this.selectedMeasurement =
      measurement;

    this.showDetails = true;

  }


  // ======================================================
  // CLOSE DETAILS
  // ======================================================

  closeDetails(): void {

    this.showDetails = false;

    this.selectedMeasurement =
      null;

  }


  // ======================================================
  // DELETE
  // ======================================================

  deleteMeasurement(
    measurement: Measurement | string | undefined
  ): void {

    const measurementId =
      typeof measurement === 'string'
        ? measurement
        : measurement?._id;

    if (!measurementId) {

      return;

    }


    const confirmDelete =
      window.confirm(
        'Kya aap is measurement ko delete karna chahte hain?'
      );


    if (!confirmDelete) {

      return;

    }


    this.deleting = true;


    this.http
      .delete(
        `${this.apiUrl}/${measurementId}`
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Measurement deleted successfully.';

          this.deleting = false;

          this.loadMeasurements();

        },

        error: (error: any) => {

          console.error(
            'DELETE ERROR:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Measurement delete nahi ho paayi.';

          this.deleting = false;

        }

      });

  }


  // ======================================================
  // FILTER
  // ======================================================

  applyFilters(): void {

    let result =
      [...this.measurements];


    // ----------------------------------------------
    // SEARCH
    // ----------------------------------------------

    const search =
      (
        this.searchText ||
        ''
      )
        .trim()
        .toLowerCase();


    if (search) {

      result =
        result.filter(
          measurement => {

            const siteName =
              this.getSiteName(
                measurement
              )
                .toLowerCase();


            const workType =
              (
                measurement.workType ||
                ''
              )
                .toLowerCase();


            const notes =
              (
                measurement.notes ||
                ''
              )
                .toLowerCase();


            return (
              siteName.includes(search) ||
              workType.includes(search) ||
              notes.includes(search)
            );

          }
        );

    }


    // ----------------------------------------------
    // SITE
    // ----------------------------------------------

    if (this.selectedSite) {

      result =
        result.filter(
          measurement =>
            this.getSiteId(
              measurement
            ) ===
            this.selectedSite
        );

    }


    // ----------------------------------------------
    // WORK TYPE
    // ----------------------------------------------

    if (this.selectedWorkType) {

      result =
        result.filter(
          measurement =>
            measurement.workType ===
            this.selectedWorkType
        );

    }


    // ----------------------------------------------
    // STATUS
    // ----------------------------------------------

    if (this.selectedStatus) {

      result =
        result.filter(
          measurement =>
            measurement.status ===
            this.selectedStatus
        );

    }


    // ----------------------------------------------
    // UNIT
    // ----------------------------------------------

    if (this.selectedUnit) {

      result =
        result.filter(
          measurement =>
            measurement.unit ===
            this.selectedUnit
        );

    }


    // ----------------------------------------------
    // FROM DATE
    // ----------------------------------------------

    if (this.filterFromDate) {

      const from =
        new Date(
          this.filterFromDate
        );

      from.setHours(
        0,
        0,
        0,
        0
      );


      result =
        result.filter(
          measurement =>
            new Date(
              measurement.measurementDate
            ) >= from
        );

    }


    // ----------------------------------------------
    // TO DATE
    // ----------------------------------------------

    if (this.filterToDate) {

      const to =
        new Date(
          this.filterToDate
        );

      to.setHours(
        23,
        59,
        59,
        999
      );


      result =
        result.filter(
          measurement =>
            new Date(
              measurement.measurementDate
            ) <= to
        );

    }


    // ----------------------------------------------
    // SORT
    // ----------------------------------------------

    result.sort(
      (
        a,
        b
      ) =>
        this.compareSort(
          a,
          b
        )
    );


    this.filteredMeasurements =
      result;


    this.calculateStatistics();


    this.currentPage = 1;

  }


  // ======================================================
  // SORT
  // ======================================================

  compareSort(
    a: Measurement,
    b: Measurement
  ): number {

    switch (
      this.sortBy
    ) {

      case 'workType':

        return (
          a.workType || ''
        )
          .localeCompare(
            b.workType || ''
          );


      case 'quantity':

        return (
          Number(
            b.quantity
          ) -
          Number(
            a.quantity
          )
        );


      case 'rate':

        return (
          Number(
            b.rate
          ) -
          Number(
            a.rate
          )
        );


      case 'totalAmount':

        return (
          Number(
            b.totalAmount
          ) -
          Number(
            a.totalAmount
          )
        );


      case 'createdAt':

        return (
          new Date(
            b.createdAt || 0
          ).getTime()
          -
          new Date(
            a.createdAt || 0
          ).getTime()
        );


      default:

        return (
          new Date(
            b.measurementDate
          ).getTime()
          -
          new Date(
            a.measurementDate
          ).getTime()
        );

    }

  }


  // ======================================================
  // CLEAR FILTERS
  // ======================================================

  clearFilters(): void {

    this.searchText = '';

    this.selectedSite = '';

    this.selectedWorkType = '';

    this.selectedStatus = '';

    this.selectedUnit = '';

    this.filterFromDate = '';

    this.filterToDate = '';

    this.sortBy =
      'measurementDate';


    this.applyFilters();

  }


  // ======================================================
  // STATISTICS
  // ======================================================

  calculateStatistics(): void {

    this.totalMeasurements =
      this.filteredMeasurements.length;


    this.totalQuantity =
      this.filteredMeasurements
        .reduce(
          (
            total,
            measurement
          ) =>
            total +
            (
              Number(
                measurement.quantity
              ) || 0
            ),
          0
        );


    this.totalAmount =
      this.filteredMeasurements
        .reduce(
          (
            total,
            measurement
          ) =>
            total +
            (
              Number(
                measurement.totalAmount
              ) || 0
            ),
          0
        );


    this.pendingCount =
      this.filteredMeasurements
        .filter(
          measurement =>
            measurement.status ===
            'Pending'
        )
        .length;


    this.calculatedCount =
      this.filteredMeasurements
        .filter(
          measurement =>
            measurement.status ===
            'Calculated'
        )
        .length;


    this.completedCount =
      this.filteredMeasurements
        .filter(
          measurement =>
            measurement.status ===
            'Completed'
        )
        .length;

  }


  // ======================================================
  // SITE NAME
  // ======================================================

  getSiteName(
    value:
      | Measurement
      | string
      | MeasurementSite
      | null
      | undefined
  ): string {

    if (!value) {

      return '-';

    }


    let siteValue:
      | string
      | MeasurementSite
      | null
      | undefined;


    if (
      typeof value === 'object' &&
      'site' in value
    ) {

      siteValue = value.site;

    } else {

      siteValue = value;

    }


    if (!siteValue) {

      return '-';

    }


    if (typeof siteValue === 'string') {

      const site =
        this.sites.find(
          item =>
            item._id === siteValue
        );


      return (
        site?.siteName ||
        '-'
      );

    }


    return (
      siteValue.siteName ||
      '-'
    );

  }


  // ======================================================
  // SITE LOCATION
  // ======================================================

  getSiteLocation(
    value:
      | Measurement
      | string
      | MeasurementSite
      | null
      | undefined
  ): string {

    if (!value) {

      return '-';

    }


    let siteValue:
      | string
      | MeasurementSite
      | null
      | undefined;


    if (
      typeof value === 'object' &&
      'site' in value
    ) {

      siteValue = value.site;

    } else {

      siteValue = value;

    }


    if (!siteValue) {

      return '-';

    }


    if (typeof siteValue === 'string') {

      const site =
        this.sites.find(
          item =>
            item._id === siteValue
        );


      return (
        site?.location ||
        '-'
      );

    }


    return (
      siteValue.location ||
      '-'
    );

  }


  // ======================================================
  // SITE ID
  // ======================================================

  getSiteId(
    measurement: Measurement
  ): string {

    if (!measurement.site) {

      return '';

    }


    if (
      typeof measurement.site ===
      'string'
    ) {

      return measurement.site;

    }


    return measurement.site._id;

  }


  // ======================================================
  // DATE FORMAT
  // ======================================================

  formatDate(
    date: string
  ): string {

    if (!date) {

      return '-';

    }


    const d =
      new Date(date);


    if (
      Number.isNaN(
        d.getTime()
      )
    ) {

      return '-';

    }


    return d.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  // ======================================================
  // INPUT DATE
  // ======================================================

  formatInputDate(
    date: string
  ): string {

    if (!date) {

      return this.getTodayDate();

    }


    const d =
      new Date(date);


    if (
      Number.isNaN(
        d.getTime()
      )
    ) {

      return this.getTodayDate();

    }


    const year =
      d.getFullYear();


    const month =
      String(
        d.getMonth() + 1
      )
        .padStart(
          2,
          '0'
        );


    const day =
      String(
        d.getDate()
      )
        .padStart(
          2,
          '0'
        );


    return `${year}-${month}-${day}`;

  }


  // ======================================================
  // TEMPLATE FORMATTERS
  // ======================================================

  formatQuantity(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2
    }).format(Number(value) || 0);
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value) || 0);
  }

  hasPhoto(measurement: Measurement): boolean {
    return !!measurement.photoUrl;
  }


  // ======================================================
  // CURRENCY
  // ======================================================

  formatCurrency(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
      }
    )
      .format(
        Number(amount) || 0
      );

  }


  // ======================================================
  // STATUS CLASS
  // ======================================================

  getStatusClass(
    status?: string
  ): string {

    if (
      status ===
      'Completed'
    ) {

      return 'completed';

    }


    if (
      status ===
      'Calculated'
    ) {

      return 'calculated';

    }


    if (
      status ===
      'Pending'
    ) {

      return 'pending';

    }


    return '';

  }


  // ======================================================
  // PHOTO SELECT
  // ======================================================

  onPhotoSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }


    const file =
      input.files[0];


    if (
      !file.type.startsWith(
        'image/'
      )
    ) {

      this.errorMessage =
        'Please image file select karein.';

      return;

    }


    const reader =
      new FileReader();


    reader.onload =
      () => {

        this.form.photoUrl =
          String(
            reader.result || ''
          );

      };


    reader.readAsDataURL(
      file
    );

  }


  // ======================================================
  // REMOVE PHOTO
  // ======================================================

  removePhoto(): void {

    this.form.photoUrl = '';

  }


  // ======================================================
  // AI ANALYSIS
  // ======================================================

  analyzePhoto(): void {

    if (!this.form.photoUrl) {

      this.errorMessage =
        'Pehle photo select karein.';

      return;

    }


    this.form.aiAnalysis =
      'Photo uploaded successfully.';

  }


  // ======================================================
  // PAGINATION
  // ======================================================

  get totalPages(): number {

    return Math.max(
      1,
      Math.ceil(
        this.filteredMeasurements.length /
        this.pageSize
      )
    );

  }


  get paginatedMeasurements():
    Measurement[] {

    const start =
      (
        this.currentPage -
        1
      ) *
      this.pageSize;


    return this.filteredMeasurements
      .slice(
        start,
        start +
        this.pageSize
      );

  }


  // ======================================================
  // NEXT PAGE
  // ======================================================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

    }

  }


  // ======================================================
  // PREVIOUS PAGE
  // ======================================================

  previousPage(): void {

    if (
      this.currentPage >
      1
    ) {

      this.currentPage--;

    }

  }


  // ======================================================
  // GO PAGE
  // ======================================================

  goToPage(
    page: number
  ): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {

      this.currentPage =
        page;

    }

  }


  // ======================================================
  // PAGE NUMBERS
  // ======================================================

  get pageNumbers(): number[] {

    return Array.from(
      {
        length:
          this.totalPages
      },
      (
        _,
        index
      ) =>
        index + 1
    );

  }


  // ======================================================
  // CSV EXPORT
  // ======================================================

  exportCSV(): void {

    if (
      this.filteredMeasurements.length === 0
    ) {

      this.errorMessage =
        'Export ke liye koi data nahi hai.';

      return;

    }


    const headers = [

      'Date',
      'Site',
      'Work Type',
      'Length',
      'Width',
      'Height',
      'Unit',
      'Quantity',
      'Rate',
      'Total Amount',
      'Status',
      'Notes'

    ];


    const rows =
      this.filteredMeasurements
        .map(
          measurement => [

            this.formatDate(
              measurement.measurementDate
            ),

            this.getSiteName(
              measurement
            ),

            measurement.workType,

            measurement.length,

            measurement.width,

            measurement.height,

            measurement.unit,

            measurement.quantity,

            measurement.rate,

            measurement.totalAmount,

            measurement.status || '',

            measurement.notes || ''

          ]
        );


    const csv =
      [
        headers,
        ...rows
      ]
        .map(
          row =>
            row
              .map(
                value =>
                  `"${String(
                    value ?? ''
                  ).replace(
                    /"/g,
                    '""'
                  )}"`
              )
              .join(',')
        )
        .join('\n');


    const blob =
      new Blob(
        [csv],
        {
          type:
            'text/csv;charset=utf-8;'
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        'a'
      );


    link.href =
      url;


    link.download =
      `measurements-${this.getTodayDate()}.csv`;


    link.click();


    URL.revokeObjectURL(
      url
    );

  }


  // ======================================================
  // PRINT
  // ======================================================

  printMeasurements(): void {

    window.print();

  }


  // ======================================================
  // CLEAR MESSAGES
  // ======================================================

  clearMessages(): void {

    this.errorMessage = '';

    this.successMessage = '';

  }


  // ======================================================
  // TRACK BY
  // ======================================================

  trackByMeasurementId(
    index: number,
    measurement: Measurement
  ): string {

    return (
      measurement._id ||
      String(index)
    );

  }

}