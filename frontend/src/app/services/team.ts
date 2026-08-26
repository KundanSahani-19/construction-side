import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeamMember {
  labour:
    | string
    | {
        _id?: string;
        name?: string;
        labourType?: string;
      };

  role: string;

  isLeader: boolean;
}

export interface Team {
  _id?: string;

  teamName: string;

  teamType: string;

  /*
   * Create karte time site ID string hoti hai.
   * Backend se populate hone ke baad site object ho sakta hai.
   */
  site:
    | string
    | {
        _id?: string;
        siteName?: string;
        location?: string;
      };

  members: TeamMember[];

  status: 'Active' | 'Inactive';

  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private apiUrl = 'https://construction-side-api.onrender.com/api/teams';

  constructor(
    private http: HttpClient
  ) {}

  getTeams(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createTeam(team: Team): Observable<any> {
    return this.http.post(this.apiUrl, team);
  }

  updateTeam(
    id: string,
    team: Partial<Team>
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      team
    );
  }

  deleteTeam(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

}