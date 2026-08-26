import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Site,
  SiteService
} from '../../services/site';

@Component({
  selector: 'app-sites',
  imports: [CommonModule, FormsModule],
  templateUrl: './sites.html',
  styleUrl: './sites.css'
})
export class Sites implements OnInit {

  sites: Site[] = [];

  showForm = false;

  newSite: Site = this.getEmptySite();

  constructor(
    private siteService: SiteService
  ) {}

  ngOnInit(): void {
    this.loadSites();
  }

  // ==========================================
  // EMPTY SITE FORM
  // ==========================================

  getEmptySite(): Site {

    return {
      siteName: '',
      clientName: '',
      clientMobile: '',
      location: '',
      workType: '',
      contractAmount: 0,
      startDate: '',
      expectedCompletionDate: '',
      receivedAmount: 0,
      status: 'Running',
      notes: ''
    };

  }

  // ==========================================
  // LOAD SITES
  // ==========================================

  loadSites(): void {

    this.siteService.getSites().subscribe({

      next: (response) => {

        this.sites = response.data || [];

      },

      error: (error) => {

        console.error(
          'Failed to load sites:',
          error
        );

      }

    });

  }

  // ==========================================
  // CREATE SITE
  // ==========================================

  createSite(): void {

    if (!this.newSite.siteName.trim()) {

      alert('Site name required.');

      return;

    }

    if (!this.newSite.clientName.trim()) {

      alert('Client name required.');

      return;

    }

    if (!this.newSite.location.trim()) {

      alert('Location required.');

      return;

    }

    this.siteService
      .createSite(this.newSite)
      .subscribe({

        next: () => {

          alert(
            'Site successfully added ✅'
          );

          // Form completely clear
          this.resetForm();

          // Form close
          this.showForm = false;

          // Fresh site list
          this.loadSites();

        },

        error: (error) => {

          console.error(
            'Site create error:',
            error
          );

          alert(
            error?.error?.message ||
            'Site create nahi hua ❌'
          );

        }

      });

  }

  // ==========================================
  // RESET SITE FORM
  // ==========================================

  resetForm(): void {

    this.newSite = this.getEmptySite();

  }

}