import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Scenario } from '../entity/Scenario';
import { Interaction } from '../entity/Interaction';
import { ActivatedRoute } from '@angular/router';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpXsrfCookieExtractor } from '@angular/common/http/src/xsrf';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(private service : ServiceService, private route: ActivatedRoute, private router : Router, private location : Location, private cookieService:CookieService) { }

  ngOnInit() {
    this.interactions = new Array<Interaction>();
    this.getInteractions();
  }

  getInteractions() : void{
    let index = +this.route.snapshot.paramMap.get('index'); 
    let projectPath = this.route.snapshot.paramMap.get('projectPath');
    this.service.getInteractions(projectPath,index).subscribe(data =>{
      this.interactions = data;
      this.cons = 'StrictPre';
      this.fromInt = this.interactions[0].number + ',' + this.interactions[0].state;
      this.toInt = this.interactions[0].number + ',' + this.interactions[0].state;
      this.boundedFrom = '0';
      this.boundedTo = '0';
    });
  }

  checkCons(){
    let index = +this.route.snapshot.paramMap.get('index'); 
    let projectPath = this.route.snapshot.paramMap.get('projectPath');
    //let fromInt : string = 'int' + this.fromInt.substring(0, this.fromInt.indexOf(','));
    //let toInt : string = 'int' + this.toInt.substring(0, this.toInt.indexOf(','));

    console.log(this.fromInt);
    console.log(this.toInt);
    if(this.cons === "StrictPre" || this.cons === 'nStrictPre'){
      this.service.canAddConstraint(projectPath,index, this.fromInt,this.toInt,this.cons,null,null).subscribe(data => {
        this.canAdd = data;
        if(!this.canAdd){
          this.location.back();
          alert("circuit!");
        } 
        else{
          let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt;
          //3:20,0 StrictPre 21,0/4:
          //document.cookie = document.cookie + index + ':' + constraint + '/';
          //3:20,0 21,0/4:
          this.cookieService.set('constraints', this.cookieService.get('constraints') + index + ':'  + constraint + '/');
          console.log(document.cookie);
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
        this.service.canAddConstraint(projectPath,index, this.fromInt,this.toInt,this.cons,this.boundedFrom,this.boundedTo).subscribe(data => {
          this.canAdd = data;
          if(!this.canAdd){
            this.location.back();
            alert("circuit!");
          } 
          else{
            let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt;

            this.cookieService.set('constraints', this.cookieService.get('constraints') + index + ':'  + constraint + '/');
            this.router.navigate(['']).then(() => {
              window.location.reload();
            });
          }
        });
      }    
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

  goBack(){
    this.location.back();
  }
}
