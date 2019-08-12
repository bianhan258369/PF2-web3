import { Injectable, ErrorHandler } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { Phenomenon } from '../class/Phenomenon';
import { Rect } from '../class/Rect';
import { Line } from '../class/Line';
import { Oval } from '../class/Oval';

const httpOptions = {
  headers: new HttpHeaders({'content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class ServiceService {
  private serviceUrl = 'http://localhost:8080/client';

  constructor(private httpClient: HttpClient) {
  }

  getPhenomenonList() : Observable<Phenomenon[]>{
    return this.httpClient.get<Phenomenon[]>(this.serviceUrl + '/getPhenomenonList');
  }

  getDiagramCount() : Observable<number>{
    return this.httpClient.get<number>(this.serviceUrl + '/getDiagramCount');
  }

  getCount() : Promise<any>{
    return this.httpClient.get(this.serviceUrl + '/getDiagramCount').toPromise().catch(this.handleError());
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


private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    return of(result as T);
  };
}
}
