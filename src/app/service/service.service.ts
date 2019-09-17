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
  private serviceUrl = 'http://localhost:8090/client';
  //private serviceUrl = 'http://47.52.116.116:8090/client';
  private stepEmit = new Subject<any>();
  private mainStepEmit = new Subject<any>();
  stepEmmited$ = this.stepEmit.asObservable();
  mainStepEmmited$ = this.mainStepEmit.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  getDiagramCount(path : string) : Observable<number>{
    return this.httpClient.get<number>(this.serviceUrl + '/getDiagramCount?path=' + path);
  }

  getRects(path : string,index : number) : Observable<Rect[]>{
    return this.httpClient.get<Rect[]>(this.serviceUrl + '/getRectList?index=' + index + '&path=' + path);
  }

  getLines(path : string,index : number) : Observable<Line[]>{
    return this.httpClient.get<Line[]>(this.serviceUrl + '/getLineList?index=' + index + '&path=' + path);
  }

  getOvals(path : string,index : number) : Observable<Oval[]>{
    return this.httpClient.get<Oval[]>(this.serviceUrl + '/getOvalList?index=' + index + '&path=' + path);
  }

  getPhenomenonList(path : string,index : number) : Observable<Phenomenon[]>{
    return this.httpClient.get<Phenomenon[]>(this.serviceUrl + '/getPhenomenonList?index=' + index + '&path=' + path);
  }

  getScenarios(path : string,index : number) : Observable<Scenario[]>{
    return this.httpClient.get<Scenario[]>(this.serviceUrl + '/getScenarioList?index=' + index + '&path=' + path);
  }

  getInteractions(path : string,index : number) : Observable<Interaction[]>{
    return this.httpClient.get<Interaction[]>(this.serviceUrl + '/getInteractionList?index=' + index + '&path=' + path);
  }

  getDiagrams(path : string) : Observable<Diagram[]>{
    return this.httpClient.get<Diagram[]>(this.serviceUrl + '/getDiagramList?path=' + path);
  }

  getOWLConstrainList(path : string) : Observable<string[]>{
    return this.httpClient.get<string[]>(this.serviceUrl + '/getOWLConstraintList?path=' + path);
  }

  getAllPhenomenonList(path : string) : Observable<Phenomenon[]>{
    return this.httpClient.get<Phenomenon[]>(this.serviceUrl + '/getAllPhenomenonList?path=' + path);
  }

  getAllReferenceList(path : string) : Observable<Phenomenon[]>{
    return this.httpClient.get<Phenomenon[]>(this.serviceUrl + '/getAllReferenceList?path=' + path);
  }

  getScenarioDiagramByDomainText(path : string,index : number, domainText : string) : Observable<Interaction[] | Scenario[]>{
    return this.httpClient.get<Interaction[] | Scenario[]>(this.serviceUrl + '/getScenarioDiagramByDomain?index=' + index + '&domainText=' + domainText + '&path=' + path);
  }

  canAddConstraint(path : string,index : number, from : string, to : string, cons : string, boundedFrom : string, boundedTo : string) : Observable<boolean>{
    if(cons === 'StrictPre' || cons === 'nStrictPre'){
      return this.httpClient.get<boolean>(
        this.serviceUrl + '/canAddConstraint?index=' + index + '&from=' + from + '&to=' + to + '&cons=' + cons + '&path=' + path
        );
    }
    else if(cons === 'BoundedDiff'){
      return this.httpClient.get<boolean>(
        this.serviceUrl + '/canAddConstraint?index=' + index + '&from=' + from + '&to=' + to + '&cons=' + cons + '&boundedFrom=' + boundedFrom + '&boundedTo=' + boundedTo + '&path=' + path
        );
    }
  }

  exportConstraints(path : string,constraints : string, addedConstraints : string){
    return this.httpClient.get(this.serviceUrl+'/saveConstraintsTxtAndXMLAndMyCCSL?constraints=' + constraints + '&addedConstraints=' + addedConstraints + '&path=' + path).subscribe(response => {
      console.log(response);
    });
  }

  ruleBasedCheck(path : string){
    return this.httpClient.get(this.serviceUrl+'/ruleBasedCheck?path=' + path);
  }

  getAddedConstraints(path : string){
    return this.httpClient.get(this.serviceUrl+'/loadConstraintsXML?path=' + path);
  }

  z3Check(path : string, timeout : number, b : number, pb : number, dl : boolean, p : boolean){
    return this.httpClient.get(this.serviceUrl+'/z3Check?path=' + path + '&timeout=' + timeout +'&b=' + b + '&pb=' + pb + '&dl=' + dl + '&p=' + p);
  }

  getRootAddress(){
    return this.httpClient.get(this.serviceUrl+'/getRootAddress');
  }

  getBranchList(){
    return this.httpClient.get(this.serviceUrl+'/showBranchList');
  }

  getFolderList(branch : string){
    return this.httpClient.get(this.serviceUrl+'/showFolderList?branch=' + branch);
  }

  getVersionList(branch : string, folderName : string){
    return this.httpClient.get(this.serviceUrl+'/showVersionList?branch=' + branch + '&folderName=' + folderName);
  }

  gitChange(branch : string){
    return this.httpClient.get(this.serviceUrl+'/gitChange?branch=' + branch);
  }

  gitRollBack(branch : string, folderName : string, version : string){
    return this.httpClient.get(this.serviceUrl+'/gitRollBack?branch=' + branch + '&folderName=' + folderName + '&version=' + version);
  }
  
}