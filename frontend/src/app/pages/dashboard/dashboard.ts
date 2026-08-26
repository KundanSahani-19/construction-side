import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Site,
  SiteService
} from '../../services/site';

import {
  Labour,
  LabourService
} from '../../services/labour';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  sites: Site[] = [];

  labours: Labour[] = [];

  // =====================================================
  // SITE STATISTICS
  // =====================================================

  activeSites = 0;

  totalSites = 0;

  // =====================================================
  // LABOUR STATISTICS
  // =====================================================

  activeLabour = 0;

  inactiveLabour = 0;

  totalLabourRecords = 0;

  totalLabourMembers = 0;

  // =====================================================
  // MONEY
  // =====================================================

  totalReceived = 0;

  paymentPending = 0;

  totalContractValue = 0;

  // =====================================================
  // LOADING
  // =====================================================

  loadingSites = true;

  loadingLabour = true;

  refreshing = false;

  // =====================================================
  // ERRORS
  // =====================================================

  sitesError = '';

  labourError = '';

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private siteService: SiteService,
    private labourService: LabourService
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.loadDashboard();
  }

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  loadDashboard(): void {
    this.loadSites();
    this.loadLabour();
  }

  // =====================================================
  // REFRESH
  // =====================================================

  refreshDashboard(): void {

    this.refreshing = true;

    this.loadSites();
    this.loadLabour();

    setTimeout(() => {
      this.refreshing = false;
    }, 700);
  }

  // =====================================================
  // LOAD SITES
  // =====================================================

  loadSites(): void {

    this.loadingSites = true;

    this.sitesError = '';

    this.siteService.getSites().subscribe({

      next: (response: any) => {

        this.sites = Array.isArray(response?.data)
          ? response.data
          : [];

        this.calculateSiteData();

        this.loadingSites = false;

      },

      error: (error: any) => {

        console.error(
          'Dashboard sites loading failed:',
          error
        );

        this.sites = [];

        this.calculateSiteData();

        this.sitesError =
          error?.error?.message ||
          'Sites data load nahi ho paaya.';

        this.loadingSites = false;

      }

    });

  }

  // =====================================================
  // LOAD LABOUR
  // =====================================================

  loadLabour(): void {

    this.loadingLabour = true;

    this.labourError = '';

    this.labourService.getLabours().subscribe({

      next: (response: any) => {

        this.labours = Array.isArray(response?.data)
          ? response.data
          : [];

        this.calculateLabourData();

        this.loadingLabour = false;

      },

      error: (error: any) => {

        console.error(
          'Dashboard labour loading failed:',
          error
        );

        this.labours = [];

        this.calculateLabourData();

        this.labourError =
          error?.error?.message ||
          'Labour data load nahi ho paaya.';

        this.loadingLabour = false;

      }

    });

  }

  // =====================================================
  // SITE CALCULATIONS
  // =====================================================

  calculateSiteData(): void {

    this.totalSites = this.sites.length;

    this.activeSites =
      this.sites.filter(
        site => site.status === 'Running'
      ).length;

    this.totalReceived =
      this.sites.reduce(
        (total, site) => {

          return total +
            Number(
              site.receivedAmount || 0
            );

        },
        0
      );

    this.totalContractValue =
      this.sites.reduce(
        (total, site) => {

          return total +
            Number(
              site.contractAmount || 0
            );

        },
        0
      );

    this.paymentPending =
      this.sites.reduce(
        (total, site) => {

          if (
            site.pendingAmount !== undefined &&
            site.pendingAmount !== null
          ) {

            return total +
              Number(
                site.pendingAmount || 0
              );

          }

          const contractAmount =
            Number(
              site.contractAmount || 0
            );

          const receivedAmount =
            Number(
              site.receivedAmount || 0
            );

          return total +
            Math.max(
              contractAmount -
              receivedAmount,
              0
            );

        },
        0
      );

  }

  // =====================================================
  // LABOUR CALCULATIONS
  // =====================================================

  calculateLabourData(): void {

    this.totalLabourRecords =
      this.labours.length;

    this.activeLabour =
      this.labours
        .filter(
          labour =>
            labour.status === 'Active'
        )
        .reduce(
          (total, labour) => {

            return total +
              Number(
                labour.memberCount || 1
              );

          },
          0
        );

    this.inactiveLabour =
      this.labours
        .filter(
          labour =>
            labour.status === 'Inactive'
        )
        .reduce(
          (total, labour) => {

            return total +
              Number(
                labour.memberCount || 1
              );

          },
          0
        );

    this.totalLabourMembers =
      this.labours.reduce(
        (total, labour) => {

          return total +
            Number(
              labour.memberCount || 1
            );

        },
        0
      );

  }

  // =====================================================
  // MONEY FORMAT
  // =====================================================

  formatMoney(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'en-IN'
    ).format(
      Number(amount || 0)
    );

  }

  // =====================================================
  // ACTIVE SITES
  // =====================================================

  getActiveSites(): Site[] {

    return this.sites
      .filter(
        site =>
          site.status === 'Running'
      )
      .slice(0, 5);

  }

  // =====================================================
  // SITE VALUE
  // =====================================================

  getSiteValue(
    site: Site
  ): number {

    return Number(
      site.contractAmount || 0
    );

  }

  // =====================================================
  // SITE LABOUR COUNT
  // =====================================================

  getSiteLabourCount(
    siteId?: string
  ): number {

    if (!siteId) {
      return 0;
    }

    return this.labours
      .filter(
        labour => {

          if (!labour.currentSite) {
            return false;
          }

          if (
            typeof labour.currentSite === 'string'
          ) {

            return (
              labour.currentSite === siteId
            );

          }

          return (
            labour.currentSite._id === siteId
          );

        }
      )
      .reduce(
        (total, labour) => {

          return total +
            Number(
              labour.memberCount || 1
            );

        },
        0
      );

  }

  // =====================================================
  // SITE LOCATION
  // =====================================================

  getSiteLocation(
    site: Site
  ): string {

    return (
      site.location ||
      'Location not added'
    );

  }

  // =====================================================
  // LABOUR PERCENTAGE
  // =====================================================

  getActiveLabourPercentage(): number {

    if (
      this.totalLabourMembers === 0
    ) {
      return 0;
    }

    return Math.round(
      (
        this.activeLabour /
        this.totalLabourMembers
      ) * 100
    );

  }

}