import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Scenario } from '../entity/Scenario';
import { Interaction } from '../entity/Interaction';
import { ActivatedRoute } from '@angular/router';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpXsrfCookieExtractor } from '@angular/common/http/src/xsrf';
import { CookieService } from 'ngx-cookie-service';
import { containerRefreshEnd } from '@angular/core/src/render3';

@Component({
  selector: 'app-addconstraint',
  templateUrl: './addconstraint.component.html',
  styleUrls: ['./addconstraint.component.css']
})
export class AddconstraintComponent implements OnInit {
  interval
  interactions : Array<Interaction>;
  fromInt : string;
  toInt : string;
  cons : string;
  canAdd : boolean;
  boundedFrom : string;
  boundedTo : string;
  addedClockName : string;
  addedTime : string;

  constructor(private service : ServiceService, private route: ActivatedRoute, private router : Router, private location : Location, private cookieService:CookieService) { }

  ngOnInit() {
    this.interactions = new Array<Interaction>();
    this.getInteractions();
  }

  getInteractions() : void{
    let index = +this.route.snapshot.paramMap.get('index'); 
    let projectPath = this.route.snapshot.paramMap.get('projectPath');
    this.service.getInteractions(index).subscribe(data =>{
      this.interactions = data;
      this.cons = 'StrictPre';
      this.fromInt = this.interactions[0].number + ',' + this.interactions[0].state;
      this.toInt = this.interactions[0].number + ',' + this.interactions[0].state;
      this.boundedFrom = '0';
      this.boundedTo = '0';
      let constraints : string[] = this.cookieService.get('constraints').split('/');
      for(let i = 0;i < constraints.length;i++){
        let index = constraints[i].substring(0,constraints[i].indexOf(':'));
					let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
					let tempCons : string = constraint[1];
          if(tempCons ==='Sup' || tempCons === 'Union' || tempCons === 'Inf'){
            let extra = constraint[3];
            $("#from").append('<option value="'+extra+'">' + extra + '</option>');
            $("#to").append('<option value="'+extra+'">' + extra + '</option>');
          }    
      }
    });
  }

  checkCons(){
    let index = +this.route.snapshot.paramMap.get('index'); 
    let projectPath = this.route.snapshot.paramMap.get('projectPath');
    if(!this.fromInt.includes(',')){
      if(this.cons === 'BoundedDiff'){
        if(isNaN(+this.boundedFrom) || isNaN(+this.boundedTo) || +this.boundedFrom >= +this.boundedTo){
          this.location.back();
          alert("Error Parameters");
        }
        else{
          let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt +' ' + this.boundedFrom + ',' + this.boundedTo + '';
          this.cookieService.set('newClockConstraints', this.cookieService.get('newClockConstraints') + index + ':'  + constraint + '/');
          this.router.navigate(['']).then(() => {
            window.location.reload();
          });
        }    
      }
      else if(this.cons === 'Union' || this.cons === 'Inf' || this.cons === 'Sup'){
        if(isNaN(this.addedClockName.length) || this.addedClockName.length === 0){
          this.location.back();
          alert("Error Parameters");
        }
        let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt + ' ' + this.addedClockName;
        this.cookieService.set('newClockConstraints', this.cookieService.get('newClockConstraints') + index + ':'  + constraint + '/');
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
      else if(this.cons === 'Delay'){
        if(isNaN(+this.addedTime)){
          this.location.back();
          alert("Error Parameters");
        }
        console.log(this.addedTime);
        let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt + ' ' + this.addedTime;
        this.cookieService.set('newClockConstraints', this.cookieService.get('newClockConstraints') + index + ':'  + constraint + '/');
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
      else{
        let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt;
        this.cookieService.set('newClockConstraints',this.cookieService.get('newClockConstraints') + index + ':'  + constraint + '/');
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }  
    }

    else if(!this.toInt.includes(',')){
      if(this.cons === 'BoundedDiff'){
        if(isNaN(+this.boundedFrom) || isNaN(+this.boundedTo) || +this.boundedFrom >= +this.boundedTo){
          this.location.back();
          alert("Error Parameters");
        }
        else{
          let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt +' ' + this.boundedFrom + ',' + this.boundedTo + '';
          this.cookieService.set('newClockConstraints', this.cookieService.get('newClockConstraints') + index + ':'  + constraint + '/');
          this.router.navigate(['']).then(() => {
            window.location.reload();
          });
        }    
      }
      else if(this.cons === 'Union' || this.cons === 'Inf' || this.cons === 'Sup'){
        if(isNaN(this.addedClockName.length) || this.addedClockName.length === 0){
          this.location.back();
          alert("Error Parameters");
        }
        let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt + ' ' + this.addedClockName;
        this.cookieService.set('newClockConstraints', this.cookieService.get('newClockConstraints') + index + ':'  + constraint + '/');
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
      else if(this.cons === 'Delay'){
        if(isNaN(+this.addedTime)){
          this.location.back();
          alert("Error Parameters");
        }
        console.log(this.addedTime);
        let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt + ' ' + this.addedTime;
        this.cookieService.set('newClockConstraints', this.cookieService.get('newClockConstraints') + index + ':'  + constraint + '/');
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
      else{
        let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt;
        this.cookieService.set('newClockConstraints',this.cookieService.get('newClockConstraints') + index + ':'  + constraint + '/');
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
    }

    else{
      if(this.cons === "StrictPre" || this.cons === 'nStrictPre'){
        this.service.canAddConstraint(index, this.fromInt,this.toInt,this.cons,null,null).subscribe(data => {
          this.canAdd = data;
          if(!this.canAdd){
            this.location.back();
            alert("circuit!");
          } 
          else{
            let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt;
            //3:20,0 StrictPre 21,0/4:5,0 BoundedDiff 6,1 [0,5]/
            //document.cookie = document.cookie + index + ':' + constraint + '/';
            //3:20,0 21,0/4:
            this.cookieService.set('constraints', this.cookieService.get('constraints') + index + ':'  + constraint + '/');
            console.log(this.cookieService.get('constraints'));
            this.router.navigate(['']).then(() => {
              window.location.reload();
            });
          }
        });
      }
  
      else if(this.cons === 'BoundedDiff'){
        if(isNaN(+this.boundedFrom) || isNaN(+this.boundedTo) || +this.boundedFrom >= +this.boundedTo){
          this.location.back();
          alert("Error Parameters");
        }
        else{
          this.service.canAddConstraint(index, this.fromInt,this.toInt,this.cons,this.boundedFrom,this.boundedTo).subscribe(data => {
            this.canAdd = data;
            if(!this.canAdd){
              this.location.back();
              alert("circuit!");
            } 
            else{
              let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt +' ' + this.boundedFrom + ',' + this.boundedTo + '';
              this.cookieService.set('constraints', this.cookieService.get('constraints') + index + ':'  + constraint + '/');
              this.router.navigate(['']).then(() => {
                window.location.reload();
              });
            }
          });
        }    
      }
      else if(this.cons === 'Union' || this.cons === 'Inf' || this.cons === 'Sup'){
        if(isNaN(this.addedClockName.length) || this.addedClockName.length === 0){
          this.location.back();
          alert("Error Parameters");
        }
        let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt + ' ' + this.addedClockName;
        this.cookieService.set('constraints', this.cookieService.get('constraints') + index + ':'  + constraint + '/');
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
      else if(this.cons === 'Delay'){
        if(isNaN(+this.addedTime)){
          this.location.back();
          alert("Error Parameters");
        }
        console.log(this.addedTime);
        let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt + ' ' + this.addedTime;
        this.cookieService.set('constraints', this.cookieService.get('constraints') + index + ':'  + constraint + '/');
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
  
      else{
        let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt;
        //document.cookie = document.cookie + index + ':' + constraint + '/';
        //console.log(document.cookie);
        this.cookieService.set('constraints', this.cookieService.get('constraints') + index + ':'  + constraint + '/');
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
    }
  }

  goBack(){
    this.location.back();
  }
}
