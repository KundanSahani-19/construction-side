import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  Labour,
  LabourMember,
  LabourService
} from '../../services/labour';

import {
  Site,
  SiteService
} from '../../services/site';

@Component({
  selector: 'app-labour',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './labour.html',
  styleUrl: './labour.css'
})
export class LabourComponent implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  labours: Labour[] = [];

  sites: Site[] = [];

  filteredLabours: Labour[] = [];

  // =====================================================
  // FORM
  // =====================================================

  showForm = false;

  isEditing = false;

  editingId = '';

  newLabour: Labour = this.getEmptyLabour();

  // =====================================================
  // LOADING / MESSAGES
  // =====================================================

  loading = false;

  errorMessage = '';

  successMessage = '';

  // =====================================================
  // FILTERS
  // =====================================================

  searchText = '';

  selectedSite = '';

  selectedLabourType = '';

  selectedStatus = '';

  selectedPaymentType = '';

  // =====================================================
  // SUMMARY
  // =====================================================

  get totalLabours(): number {
    return this.labours.length;
  }

  get activeLabours(): number {
    return this.labours.filter(
      labour => labour.status === 'Active'
    ).length;
  }

  get inactiveLabours(): number {
    return this.labours.filter(
      labour => labour.status === 'Inactive'
    ).length;
  }

  get totalDailyRate(): number {
    return this.labours.reduce(
      (total, labour) =>
        total + Number(labour.dailyRate || 0),
      0
    );
  }

  get filteredCount(): number {
    return this.filteredLabours.length;
  }

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private labourService: LabourService,
    private siteService: SiteService,
    private router: Router
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadLabours();

    this.loadSites();

  }

  // =====================================================
  // EMPTY LABOUR
  // =====================================================

  getEmptyLabour(): Labour {

    return {

      name: '',

      mobile: '',

      labourType: 'Mistri',

      memberCount: 1,

      members: [],

      dailyRate: 0,

      overtimeRate: 0,

      paymentType: 'Daily',

      currentSite: '',

      status: 'Active',

      joiningDate: '',

      notes: ''

    };

  }

  // =====================================================
  // LOAD LABOURS
  // =====================================================

  loadLabours(): void {

    this.loading = true;

    this.errorMessage = '';

    this.labourService
      .getLabours()
      .subscribe({

        next: (response) => {

          this.labours =
            response?.data || [];

          this.applyFilters();

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Labour loading failed:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Labour load nahi hua.';

          this.labours = [];

          this.filteredLabours = [];

          this.loading = false;

        }

      });

  }

  // =====================================================
  // LOAD SITES
  // =====================================================

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
            'Site loading failed:',
            error
          );

        }

      });

  }

  // =====================================================
  // FILTER
  // =====================================================

  applyFilters(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();

    this.filteredLabours =
      this.labours.filter(
        labour => {

          // -------------------------------
          // SEARCH
          // -------------------------------

          const matchesSearch =
            !search ||

            labour.name
              ?.toLowerCase()
              .includes(search) ||

            labour.mobile
              ?.toLowerCase()
              .includes(search) ||

            labour.labourType
              ?.toLowerCase()
              .includes(search) ||

            labour.paymentType
              ?.toLowerCase()
              .includes(search) ||

            this.getSiteName(
              labour.currentSite
            )
              .toLowerCase()
              .includes(search);

          // -------------------------------
          // SITE
          // -------------------------------

          const labourSiteId =
            this.getSiteId(
              labour.currentSite
            );

          const matchesSite =
            !this.selectedSite ||
            labourSiteId ===
              this.selectedSite;

          // -------------------------------
          // LABOUR TYPE
          // -------------------------------

          const matchesType =
            !this.selectedLabourType ||
            labour.labourType ===
              this.selectedLabourType;

          // -------------------------------
          // STATUS
          // -------------------------------

          const matchesStatus =
            !this.selectedStatus ||
            labour.status ===
              this.selectedStatus;

          // -------------------------------
          // PAYMENT TYPE
          // -------------------------------

          const matchesPayment =
            !this.selectedPaymentType ||
            labour.paymentType ===
              this.selectedPaymentType;

          return (
            matchesSearch &&
            matchesSite &&
            matchesType &&
            matchesStatus &&
            matchesPayment
          );

        }
      );

  }

  // =====================================================
  // GET SITE ID
  // =====================================================

  getSiteId(
    currentSite?:
      string |
      Labour['currentSite']
  ): string {

    if (!currentSite) {

      return '';

    }

    if (
      typeof currentSite === 'object' &&
      currentSite !== null
    ) {

      return currentSite._id || '';

    }

    return currentSite;

  }

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  clearFilters(): void {

    this.searchText = '';

    this.selectedSite = '';

    this.selectedLabourType = '';

    this.selectedStatus = '';

    this.selectedPaymentType = '';

    this.applyFilters();

  }

  // =====================================================
  // LABOUR TYPE CHANGE
  // =====================================================

  onLabourTypeChange(): void {

    if (
      this.newLabour.labourType ===
      'Couple / Jodi'
    ) {

      this.newLabour.memberCount = 2;

      if (
        !this.newLabour.members ||
        this.newLabour.members.length !== 2
      ) {

        this.newLabour.members = [

          {

            name: '',

            mobile: '',

            role: 'Mistri'

          },

          {

            name: '',

            mobile: '',

            role: 'Helper'

          }

        ];

      }

    } else {

      this.newLabour.memberCount = 1;

      this.newLabour.members = [];

    }

  }

  // =====================================================
  // CREATE / UPDATE LABOUR
  // =====================================================

  createLabour(): void {

    this.errorMessage = '';

    this.successMessage = '';

    // -------------------------------
    // NAME VALIDATION
    // -------------------------------

    if (
      !this.newLabour.name.trim()
    ) {

      alert(
        'Labour name required.'
      );

      return;

    }

    // -------------------------------
    // TYPE VALIDATION
    // -------------------------------

    if (
      !this.newLabour.labourType
    ) {

      alert(
        'Labour type select karo.'
      );

      return;

    }

    // -------------------------------
    // COUPLE VALIDATION
    // -------------------------------

    if (
      this.newLabour.labourType ===
      'Couple / Jodi'
    ) {

      const members =
        this.newLabour.members || [];

      if (
        members.length !== 2 ||
        members.some(
          member =>
            !member.name.trim()
        )
      ) {

        alert(
          'Couple / Jodi ke dono members ka naam required hai.'
        );

        return;

      }

      this.newLabour.memberCount = 2;

    } else {

      this.newLabour.memberCount = 1;

      this.newLabour.members = [];

    }

    // -------------------------------
    // NUMBER NORMALIZATION
    // -------------------------------

    this.newLabour.dailyRate =
      Number(
        this.newLabour.dailyRate || 0
      );

    this.newLabour.overtimeRate =
      Number(
        this.newLabour.overtimeRate || 0
      );

    // -------------------------------
    // LOADING
    // -------------------------------

    this.loading = true;

    const request$ =
      this.isEditing &&
      this.editingId

        ? this.labourService.updateLabour(
            this.editingId,
            this.newLabour
          )

        : this.labourService.createLabour(
            this.newLabour
          );

    // -------------------------------
    // REQUEST
    // -------------------------------

    request$.subscribe({

      next: (response) => {

        alert(

          response?.message ||

          (
            this.isEditing

              ? 'Labour updated successfully ✅'

              : 'Labour added successfully ✅'

          )

        );

        this.resetForm();

        this.showForm = false;

        this.loading = false;

        this.loadLabours();

      },

      error: (error) => {

        console.error(
          'Labour save error:',
          error
        );

        this.loading = false;

        alert(

          error?.error?.message ||

          'Labour save nahi hua ❌'

        );

      }

    });

  }

  // =====================================================
  // EDIT LABOUR
  // =====================================================

  editLabour(
    labour: Labour
  ): void {

    this.isEditing = true;

    this.editingId =
      labour._id || '';

    this.newLabour = {

      ...labour,

      currentSite:

        typeof labour.currentSite ===
          'object' &&

        labour.currentSite

          ? labour.currentSite._id

          : labour.currentSite || '',

      members:

        labour.members

          ? labour.members.map(
              member => ({
                ...member
              })
            )

          : []

    };

    this.showForm = true;

    if (
      this.newLabour.labourType ===
      'Couple / Jodi'
    ) {

      this.onLabourTypeChange();

    }

    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

  }

  // =====================================================
  // DELETE LABOUR
  // =====================================================

  deleteLabour(
    id?: string
  ): void {

    if (!id) {

      return;

    }

    const confirmDelete =
      confirm(
        'Kya aap is labour ko delete karna chahte ho?'
      );

    if (!confirmDelete) {

      return;

    }

    this.loading = true;

    this.labourService
      .deleteLabour(id)
      .subscribe({

        next: () => {

          alert(
            'Labour deleted successfully ✅'
          );

          this.loading = false;

          this.loadLabours();

        },

        error: (error) => {

          console.error(
            'Delete labour error:',
            error
          );

          this.loading = false;

          alert(

            error?.error?.message ||

            'Delete nahi hua ❌'

          );

        }

      });

  }

  // =====================================================
  // RESET FORM
  // =====================================================

  resetForm(): void {

    this.newLabour =
      this.getEmptyLabour();

    this.isEditing = false;

    this.editingId = '';

    this.errorMessage = '';

    this.successMessage = '';

  }

  // =====================================================
  // CLOSE FORM
  // =====================================================

  closeForm(): void {

    this.resetForm();

    this.showForm = false;

  }

  // =====================================================
  // GET SITE NAME
  // =====================================================

  getSiteName(
    currentSite?:
      string |
      Labour['currentSite']
  ): string {

    if (!currentSite) {

      return 'No Site';

    }

    // Backend populated object

    if (
      typeof currentSite ===
        'object' &&

      currentSite !== null
    ) {

      return (
        currentSite.siteName ||
        'No Site'
      );

    }

    // Site ID

    const site =
      this.sites.find(
        item =>
          item._id ===
          currentSite
      );

    return (
      site?.siteName ||
      'No Site'
    );

  }

  // =====================================================
  // MEMBER NAMES
  // =====================================================

  getMemberNames(
    labour: Labour
  ): string {

    if (

      labour.labourType !==
        'Couple / Jodi' ||

      !labour.members?.length

    ) {

      return (
        labour.memberCount === 1

          ? '1'

          : String(
              labour.memberCount || 1
            )
      );

    }

    return labour.members

      .map(
        member =>
          member.name
      )

      .filter(Boolean)

      .join(' + ');

  }

  // =====================================================
  // OPEN LABOUR STATEMENT
  // =====================================================

  openLabourStatement(
    labourId?: string
  ): void {

    if (!labourId) {

      alert(
        'Labour ID nahi mila.'
      );

      return;

    }

    this.router.navigate([

      '/labour-statement',

      labourId

    ]);

  }

  // =====================================================
  // ADD COUPLE MEMBER
  // =====================================================

  addMember(): void {

    if (
      this.newLabour.labourType !==
      'Couple / Jodi'
    ) {

      return;

    }

    if (
      (this.newLabour.members || [])
        .length >= 2
    ) {

      return;

    }

    this.newLabour.members = [

      ...(
        this.newLabour.members ||
        []
      ),

      {

        name: '',

        mobile: '',

        role: 'Helper'

      }

    ];

    this.newLabour.memberCount = 2;

  }

  // =====================================================
  // REMOVE MEMBER
  // =====================================================

  removeMember(
    index: number
  ): void {

    if (
      this.newLabour.labourType !==
      'Couple / Jodi'
    ) {

      return;

    }

    const members = [

      ...(
        this.newLabour.members ||
        []
      )

    ];

    if (
      members.length <= 2
    ) {

      return;

    }

    members.splice(
      index,
      1
    );

    this.newLabour.members =
      members;

  }

}