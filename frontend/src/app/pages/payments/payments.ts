import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Payment,
  PaymentService
} from '../../services/payment';

import {
  Site,
  SiteService
} from '../../services/site';


@Component({
  selector: 'app-payments',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments implements OnInit {

  // =========================
  // DATA
  // =========================

  payments: Payment[] = [];

  sites: Site[] = [];


  // =========================
  // FORM
  // =========================

  showForm = false;

  loading = false;

  saving = false;


  // =========================
  // NEW PAYMENT
  // =========================

  newPayment: Payment = {

    labour: null,

    site: '',

    amount: 0,

    paymentDate: '',

    paymentType: 'Advance',

    reason: '',

    paymentMode: 'Bank Transfer',

    referenceNumber: '',

    notes: ''

  };


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private paymentService: PaymentService,
    private siteService: SiteService
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.loadPayments();

    this.loadSites();

  }


  // =========================
  // LOAD PAYMENTS
  // =========================

  loadPayments(): void {

    this.loading = true;

    this.paymentService
      .getPayments()
      .subscribe({

        next: (response: any) => {

          this.payments =
            Array.isArray(response?.data)
              ? response.data
              : [];

          this.loading = false;

        },

        error: (error: any) => {

          console.error(
            'Payment loading failed:',
            error
          );

          this.payments = [];

          this.loading = false;

        }

      });

  }


  // =========================
  // LOAD SITES
  // =========================

  loadSites(): void {

    this.siteService
      .getSites()
      .subscribe({

        next: (response: any) => {

          this.sites =
            Array.isArray(response?.data)
              ? response.data
              : [];

        },

        error: (error: any) => {

          console.error(
            'Site loading failed:',
            error
          );

          this.sites = [];

        }

      });

  }


  // =========================
  // CREATE PAYMENT
  // =========================

  createPayment(): void {

    // Site validation

    if (!this.newPayment.site) {

      alert(
        'Please select a construction site.'
      );

      return;

    }


    // Amount validation

    const amount =
      Number(
        this.newPayment.amount || 0
      );


    if (amount <= 0) {

      alert(
        'Please enter a valid payment amount.'
      );

      return;

    }


    // Date validation

    if (!this.newPayment.paymentDate) {

      alert(
        'Please select payment date.'
      );

      return;

    }


    this.saving = true;


    // Backend ke according clean data

    const paymentData: Payment = {

      labour:
        this.newPayment.labour || null,

      site:
        this.newPayment.site,

      amount:
        amount,

      paymentDate:
        this.newPayment.paymentDate,

      paymentType:
        this.newPayment.paymentType || 'Advance',

      reason:
        this.newPayment.reason || '',

      paymentMode:
        this.newPayment.paymentMode || 'Cash',

      referenceNumber:
        this.newPayment.referenceNumber || '',

      notes:
        this.newPayment.notes || ''

    };


    this.paymentService
      .createPayment(paymentData)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Payment created:',
            response
          );


          alert(
            'Payment added successfully ✅'
          );


          // Form close

          this.showForm = false;


          // Form reset

          this.resetForm();


          // Fresh payment list

          this.loadPayments();


          this.saving = false;

        },


        error: (error: any) => {

          console.error(
            'Payment add failed:',
            error
          );


          alert(
            error?.error?.message ||
            'Payment add nahi hua ❌'
          );


          this.saving = false;

        }

      });

  }


  // =========================
  // RESET FORM
  // =========================

  resetForm(): void {

    this.newPayment = {

      labour: null,

      site: '',

      amount: 0,

      paymentDate: '',

      paymentType: 'Advance',

      reason: '',

      paymentMode: 'Bank Transfer',

      referenceNumber: '',

      notes: ''

    };

  }


  // =========================
  // CANCEL FORM
  // =========================

  cancelForm(): void {

    this.showForm = false;

    this.resetForm();

  }


  // =========================
  // GET SITE NAME
  // =========================

  getSiteName(
    site: any
  ): string {

    if (!site) {

      return 'Unknown Site';

    }


    // Backend populated object

    if (
      typeof site === 'object' &&
      site.siteName
    ) {

      return site.siteName;

    }


    // Site ID

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


  // =========================
  // FORMAT PAYMENT TYPE
  // =========================

  getPaymentType(
    payment: Payment
  ): string {

    return (
      payment.paymentType ||
      'Advance'
    );

  }


  // =========================
  // TOTAL PAYMENTS
  // =========================

  getTotalPayments(): number {

    return this.payments.reduce(
      (total, payment) => {

        return total +
          Number(
            payment.amount || 0
          );

      },
      0
    );

  }


  // =========================
  // FORMAT MONEY
  // =========================

  formatMoney(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'en-IN'
    ).format(
      Number(amount || 0)
    );

  }


  // =========================
  // DELETE PAYMENT
  // =========================

  deletePayment(
    paymentId?: string
  ): void {

    if (!paymentId) {

      return;

    }


    const confirmed =
      confirm(
        'Kya aap is payment ko delete karna chahte ho?'
      );


    if (!confirmed) {

      return;

    }


    this.paymentService
      .deletePayment(paymentId)
      .subscribe({

        next: () => {

          alert(
            'Payment deleted successfully ✅'
          );


          // Site received amount backend
          // automatically recalculate karega

          this.loadPayments();

        },


        error: (error: any) => {

          console.error(
            'Payment delete failed:',
            error
          );


          alert(
            error?.error?.message ||
            'Payment delete nahi hua ❌'
          );

        }

      });

  }

}