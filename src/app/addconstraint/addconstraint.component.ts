import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Scenario } from '../entity/Scenario';
import { Interaction } from '../entity/Interaction';
import { ActivatedRoute } from '@angular/router';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpXsrfCookieExtractor } from '@angular/common/http/src/xsrf';

@Component({
  selector: 'app-addconstraint',
  templateUrl: './addconstraint.component.html',
  styleUrls: ['./addconstraint.component.css']
})
export class AddconstraintComponent implements OnInit {
  interactions : Array<Interaction>;
  fromInt : string;
  toInt : string;
  cons : string;
  canAdd : boolean;

  constructor(private service : ServiceService, private route: ActivatedRoute, private router : Router, private location : Location) { }

  ngOnInit() {
    this.interactions = new Array<Interaction>();
    this.getInteractions();
  }

  getInteractions() : void{
    let index = +this.route.snapshot.paramMap.get('index'); 
    this.service.getInteractions(index).subscribe(data =>{
      this.interactions = data;
    });
  }

  checkCons(){
    let index = +this.route.snapshot.paramMap.get('index'); 
    let fromInt : string = 'int' + this.fromInt.substring(0, this.fromInt.indexOf(','));
    let toInt : string = 'int' + this.toInt.substring(0, this.toInt.indexOf(','));
    this.service.canAddConstraint(index, fromInt,toInt,this.cons).subscribe(data => {
      this.canAdd = data;
      if(!this.canAdd){
        this.location.back();
        alert("circuit!");
      } 
      else{
        //3:20,0 StrictPre 21,0/4:
        let constraint : string = this.fromInt + ' ' + this.cons + ' ' + this.toInt;
        document.cookie = document.cookie + index + ':' + constraint + '/';
        console.log(document.cookie);
        //this.location.back();
        //this.router.navigate(['/home'], { skipLocationChange: true });
        this.router.navigate(['rightbar']);
      }
    });
  }

  goBack(){
    this.location.back();
  }
}
