import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Labour,
  LabourService
} from '../../services/labour';

import {
  Site,
  SiteService
} from '../../services/site';

import {
  LabourTransfer,
  LabourTransferService
} from '../../services/labour-transfer';

@Component({
  selector: 'app-transfers',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './transfers.html',
  styleUrl: './transfers.css'
})
export class Transfers implements OnInit {

  labours: Labour[] = [];

  sites: Site[] = [];

  transfers: any[] = [];

  selectedLabour = '';

  fromSite = '';

  toSite = '';

  transferDate = this.getToday();

  reason = '';

  notes = '';

  loading = false;

  saving = false;

  constructor(
    private labourService: LabourService,
    private siteService: SiteService,
    private transferService: LabourTransferService
  ) {}

  ngOnInit(): void {

    this.loadLabours();

    this.loadSites();

    this.loadTransfers();

  }

  // ==========================================
  // TODAY
  // ==========================================

  getToday(): string {

    const date = new Date();

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

  // ==========================================
  // LOAD LABOURS
  // ==========================================

  loadLabours(): void {

    this.labourService
      .getLabours()
      .subscribe({

        next: (response: any) => {

          this.labours =
            response?.data || [];

        },

        error: (error: any) => {

          console.error(
            'Labour loading failed:',
            error
          );

        }

      });

  }

  // ==========================================
  // LOAD SITES
  // ==========================================

  loadSites(): void {

    this.siteService
      .getSites()
      .subscribe({

        next: (response: any) => {

          this.sites =
            response?.data || [];

        },

        error: (error: any) => {

          console.error(
            'Site loading failed:',
            error
          );

        }

      });

  }

  // ==========================================
  // LOAD TRANSFERS
  // ==========================================

  loadTransfers(): void {

    this.loading = true;

    this.transferService
      .getTransfers()
      .subscribe({

        next: (response: any) => {

          this.transfers =
            response?.data || [];

          this.loading = false;

        },

        error: (error: any) => {

          console.error(
            'Transfer loading failed:',
            error
          );

          this.transfers = [];

          this.loading = false;

        }

      });

  }

  // ==========================================
  // LABOUR CHANGE
  // ==========================================

  onLabourChange(): void {

    const labour =
      this.labours.find(
        item =>
          item._id === this.selectedLabour
      );

    if (!labour) {

      this.fromSite = '';

      return;

    }

    const currentSite =
      labour.currentSite;

    if (
      currentSite &&
      typeof currentSite === 'object'
    ) {

      this.fromSite =
        currentSite._id || '';

    } else {

      this.fromSite =
        currentSite || '';

    }

  }

  // ==========================================
  // GET SITE NAME
  // ==========================================

  getSiteName(
    siteId?: string
  ): string {

    if (!siteId) {
      return '';
    }

    const site =
      this.sites.find(
        item =>
          item._id === siteId
      );

    return site?.siteName || 'Unknown Site';

  }

  // ==========================================
  // GET LABOUR NAME
  // ==========================================

  getLabourName(
    labourId?: string
  ): string {

    if (!labourId) {
      return 'Unknown Labour';
    }

    const labour =
      this.labours.find(
        item =>
          item._id === labourId
      );

    return labour?.name || 'Unknown Labour';

  }

  // ==========================================
  // CREATE TRANSFER
  // ==========================================

  createTransfer(): void {

    if (!this.selectedLabour) {

      alert(
        'Labour select karo.'
      );

      return;

    }

    if (!this.fromSite) {

      alert(
        'Current site nahi mili.'
      );

      return;

    }

    if (!this.toSite) {

      alert(
        'New site select karo.'
      );

      return;

    }

    if (
      this.fromSite === this.toSite
    ) {

      alert(
        'Same site par transfer nahi kar sakte.'
      );

      return;

    }

    if (!this.transferDate) {

      alert(
        'Transfer date select karo.'
      );

      return;

    }

    this.saving = true;

    const data: LabourTransfer = {

      labour:
        this.selectedLabour,

      fromSite:
        this.fromSite,

      toSite:
        this.toSite,

      transferDate:
        this.transferDate,

      reason:
        this.reason.trim(),

      notes:
        this.notes.trim()

    };

    this.transferService
      .createTransfer(data)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Transfer response:',
            response
          );

          alert(
            'Labour transferred successfully ✅'
          );

          this.resetForm();

          this.loadLabours();

          this.loadTransfers();

          this.saving = false;

        },

        error: (error: any) => {

          console.error(
            'Transfer error:',
            error
          );

          alert(
            error?.error?.message ||
            'Labour transfer nahi hua ❌'
          );

          this.saving = false;

        }

      });

  }

  // ==========================================
  // RESET
  // ==========================================

  resetForm(): void {

    this.selectedLabour = '';

    this.fromSite = '';

    this.toSite = '';

    this.transferDate =
      this.getToday();

    this.reason = '';

    this.notes = '';

  }

}