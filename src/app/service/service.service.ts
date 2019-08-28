import { Injectable, ErrorHandler } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { Phenomenon } from '../entity/Phenomenon';
import { Rect } from '../entity/Rect';
import { Line } from '../entity/Line';
import { Oval } from '../entity/Oval';
import { Diagram } from '../entity/Diagram';
import { Scenario } from '../entity/Scenario';
import { Interaction } from '../entity/Interaction';

const httpOptions = {
  headers: new HttpHeaders({'content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class ServiceService {
  private serviceUrl = 'http://localhost:8080/client';
  private stepEmit = new Subject<any>();
  private mainStepEmit = new Subject<any>();
  stepEmmited$ = this.stepEmit.asObservable();
  mainStepEmmited$ = this.mainStepEmit.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  getDiagramCount() : Observable<number>{
    return this.httpClient.get<number>(this.serviceUrl + '/getDiagramCount');
  }

  getRects(index : number) : Observable<Rect[]>{
    return this.httpClient.get<Rect[]>(this.serviceUrl + '/getRectList?index=' + index);
  }

  getLines(index : number) : Observable<Line[]>{
    return this.httpClient.get<Line[]>(this.serviceUrl + '/getLineList?index=' + index);
  }

  getOvals(index : number) : Observable<Oval[]>{
    return this.httpClient.get<Oval[]>(this.serviceUrl + '/getOvalList?index=' + index);
  }

  getPhenomenonList(index : number) : Observable<Phenomenon[]>{
    return this.httpClient.get<Phenomenon[]>(this.serviceUrl + '/getPhenomenonList?index=' + index);
  }

  getScenarios(index : number) : Observable<Scenario[]>{
    return this.httpClient.get<Scenario[]>(this.serviceUrl + '/getScenarioList?index=' + index);
  }

  getInteractions(index : number) : Observable<Interaction[]>{
    return this.httpClient.get<Interaction[]>(this.serviceUrl + '/getInteractionList?index=' + index);
  }

  getDiagrams() : Observable<Diagram[]>{
    return this.httpClient.get<Diagram[]>(this.serviceUrl + '/getDiagramList');
  }

  getOWLConstrainList() : Observable<string[]>{
    return this.httpClient.get<string[]>(this.serviceUrl + '/getOWLConstraintList');
  }

  getAllPhenomenonList() : Observable<Phenomenon[]>{
    return this.httpClient.get<Phenomenon[]>(this.serviceUrl + '/getAllPhenomenonList');
  }

  getAllReferenceList() : Observable<Phenomenon[]>{
    return this.httpClient.get<Phenomenon[]>(this.serviceUrl + '/getAllReferenceList');
  }

  getScenarioDiagramByDomainText(index : number, domainText : string) : Observable<Interaction[] | Scenario[]>{
    return this.httpClient.get<Interaction[] | Scenario[]>(this.serviceUrl + '/getScenarioDiagramByDomain?index=' + index + '&domainText=' + domainText);
  }

  canAddConstraint(index : number, from : string, to : string, cons : string, boundedFrom : string, boundedTo : string) : Observable<boolean>{
    if(cons === 'StrictPre' || cons === 'nStrictPre'){
      return this.httpClient.get<boolean>(
        this.serviceUrl + '/canAddConstraint?index=' + index + '&from=' + from + '&to=' + to + '&cons=' + cons
        );
    }
    else if(cons === 'BoundedDiff'){
      return this.httpClient.get<boolean>(
        this.serviceUrl + '/canAddConstraint?index=' + index + '&from=' + from + '&to=' + to + '&cons=' + cons + '&boundedFrom=' + boundedFrom + '&boundedTo=' + boundedTo
        );
    }
  }

  exportConstraints(constraints : string){
    return this.httpClient.get(this.serviceUrl+'/saveConstraintsTxt?constraints=' + constraints).subscribe(response => {
      console.log(response);
    });
  }
}