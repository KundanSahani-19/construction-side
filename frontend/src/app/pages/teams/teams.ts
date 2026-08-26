import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


// =========================
// SITE INTERFACE
// =========================

interface Site {
  _id?: string;
  siteName: string;
  location?: string;
}


// =========================
// COUPLE INTERFACE
// =========================

interface CoupleMember {

  name: string;

  mobile?: string;

  dailyRate: number;

}


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


// =========================
// COMPONENT
// =========================

@Component({

  selector: 'app-teams',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './teams.html',

  styleUrl: './teams.css'

})
export class Teams implements OnInit {


  // =========================
  // API
  // =========================

  private coupleApi =
    'http://localhost:5001/api/couples';

  private siteApi =
    'http://localhost:5001/api/sites';


  // =========================
  // DATA
  // =========================

  couples: Couple[] = [];

  sites: Site[] = [];


  // =========================
  // STATE
  // =========================

  showForm = false;

  loading = false;

  saving = false;


  // =========================
  // NEW COUPLE FORM
  // =========================

  newCouple: Couple = {

    coupleName: '',


    member1: {

      name: '',

      mobile: '',

      dailyRate: 0

    },


    member2: {

      name: '',

      mobile: '',

      dailyRate: 0

    },


    currentSite: '',


    paymentType: 'Daily',


    status: 'Active',


    joiningDate: '',


    notes: ''

  };


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private http: HttpClient
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.loadCouples();

    this.loadSites();

  }


  // =========================
  // LOAD COUPLES
  // =========================

  loadCouples(): void {

    this.loading = true;


    this.http.get<any>(
      this.coupleApi
    ).subscribe({

      next: (response) => {

        this.couples =
          Array.isArray(response?.data)
            ? response.data
            : [];


        this.loading = false;

      },


      error: (error) => {

        console.error(
          'Couple loading failed:',
          error
        );


        this.couples = [];


        this.loading = false;

      }

    });

  }


  // =========================
  // LOAD SITES
  // =========================

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
          'Site loading failed:',
          error
        );


        this.sites = [];

      }

    });

  }


  // =========================
  // CREATE COUPLE
  // =========================

  createCouple(): void {


    // Couple name

    if (
      !this.newCouple.coupleName.trim()
    ) {

      alert(
        'Couple / Jodi name required.'
      );

      return;

    }


    // Member 1 name

    if (
      !this.newCouple.member1.name.trim()
    ) {

      alert(
        'Member 1 ka naam required hai.'
      );

      return;

    }


    // Member 2 name

    if (
      !this.newCouple.member2.name.trim()
    ) {

      alert(
        'Member 2 ka naam required hai.'
      );

      return;

    }


    // Member 1 rate

    if (
      Number(
        this.newCouple.member1.dailyRate
      ) < 0
    ) {

      alert(
        'Member 1 ka rate valid hona chahiye.'
      );

      return;

    }


    // Member 2 rate

    if (
      Number(
        this.newCouple.member2.dailyRate
      ) < 0
    ) {

      alert(
        'Member 2 ka rate valid hona chahiye.'
      );

      return;

    }


    this.saving = true;


    // =========================
    // DATA TO BACKEND
    // =========================

    const data = {

      coupleName:
        this.newCouple.coupleName.trim(),


      member1: {

        name:
          this.newCouple.member1.name.trim(),

        mobile:
          this.newCouple.member1.mobile?.trim() || '',

        dailyRate:
          Number(
            this.newCouple.member1.dailyRate || 0
          )

      },


      member2: {

        name:
          this.newCouple.member2.name.trim(),

        mobile:
          this.newCouple.member2.mobile?.trim() || '',

        dailyRate:
          Number(
            this.newCouple.member2.dailyRate || 0
          )

      },


      currentSite:
        this.newCouple.currentSite || null,


      paymentType:
        this.newCouple.paymentType,


      status:
        this.newCouple.status,


      joiningDate:
        this.newCouple.joiningDate || undefined,


      notes:
        this.newCouple.notes?.trim() || ''

    };


    console.log(
      'Creating couple:',
      data
    );


    // =========================
    // POST
    // =========================

    this.http.post<any>(
      this.coupleApi,
      data
    ).subscribe({

      next: (response) => {

        console.log(
          'Couple created:',
          response
        );


        alert(
          'Couple / Jodi added successfully ✅'
        );


        this.showForm = false;


        this.resetForm();


        this.loadCouples();


        this.saving = false;

      },


      error: (error) => {

        console.error(
          'Couple add failed:',
          error
        );


        alert(
          error?.error?.message ||
          'Couple add nahi hua ❌'
        );


        this.saving = false;

      }

    });

  }


  // =========================
  // DELETE COUPLE
  // =========================

  deleteCouple(
    id?: string
  ): void {

    if (!id) {

      return;

    }


    const confirmed =
      confirm(
        'Kya aap is Couple / Jodi ko delete karna chahte ho?'
      );


    if (!confirmed) {

      return;

    }


    this.http.delete<any>(
      `${this.coupleApi}/${id}`
    ).subscribe({

      next: () => {

        alert(
          'Couple deleted successfully ✅'
        );


        this.loadCouples();

      },


      error: (error) => {

        console.error(
          'Couple delete failed:',
          error
        );


        alert(
          error?.error?.message ||
          'Couple delete nahi hua ❌'
        );

      }

    });

  }


  // =========================
  // RESET FORM
  // =========================

  resetForm(): void {

    this.newCouple = {

      coupleName: '',


      member1: {

        name: '',

        mobile: '',

        dailyRate: 0

      },


      member2: {

        name: '',

        mobile: '',

        dailyRate: 0

      },


      currentSite: '',


      paymentType: 'Daily',


      status: 'Active',


      joiningDate: '',


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
    site: Site | string | null | undefined
  ): string {


    if (!site) {

      return 'No Site';

    }


    // Site ID

    if (
      typeof site === 'string'
    ) {

      const found =
        this.sites.find(
          item =>
            item._id === site
        );


      return found?.siteName ||
        'No Site';

    }


    // Populated Site object

    return site.siteName ||
      'No Site';

  }


  // =========================
  // MEMBER COUNT
  // =========================

  getMemberCount(
    couple: Couple
  ): number {

    let count = 0;


    if (
      couple.member1?.name
    ) {

      count++;

    }


    if (
      couple.member2?.name
    ) {

      count++;

    }


    return count;

  }


  // =========================
  // COUPLE TOTAL RATE
  // =========================

  getCoupleTotalRate(
    couple: Couple
  ): number {

    const member1Rate =
      Number(
        couple.member1?.dailyRate || 0
      );


    const member2Rate =
      Number(
        couple.member2?.dailyRate || 0
      );


    return (
      member1Rate +
      member2Rate
    );

  }


  // =========================
  // NEW COUPLE TOTAL RATE
  // =========================

  getNewCoupleTotalRate(): number {

    const member1Rate =
      Number(
        this.newCouple.member1?.dailyRate || 0
      );


    const member2Rate =
      Number(
        this.newCouple.member2?.dailyRate || 0
      );


    return (
      member1Rate +
      member2Rate
    );

  }


  // =========================
  // ACTIVE COUPLES
  // =========================

  getActiveCouples(): number {

    return this.couples.filter(
      couple =>
        couple.status === 'Active'
    ).length;

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

}