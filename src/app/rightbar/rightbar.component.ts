 import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { timeout } from 'q';
import { Phenomenon } from '../entity/Phenomenon';
import { ActivatedRoute } from '@angular/router';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-rightbar',
  templateUrl: './rightbar.component.html',
  styleUrls: ['./rightbar.component.css']
})
export class RightbarComponent implements OnInit {	
	phenomena : Array<Phenomenon>;
	references : Array<Phenomenon>;
	open1 = false;
	setOpen1():void{
		this.open1 = !this.open1;
	}
	open2 = false;
	setOpen2():void{
		this.open2 = !this.open2;
	}
	open3 = false;
	setOpen3():void{
		this.open3 = !this.open3;
	}
	open4 = false;
	setOpen4():void{
		this.open4 = !this.open4;
	}
	open5 = false;
	setOpen5():void{
		this.open5 = !this.open5;
	}

	constraints : Array<string>;
  	constructor(private service : ServiceService, private route : ActivatedRoute, private router : Router) { }

  	ngOnInit() {
		this.constraints = new Array<string>();  
		this.phenomena = new Array<Phenomenon>();
		this.references = new Array<Phenomenon>();
		this.getConstraints();
		this.getAllPhenomena();
		this.getAllReferences();
  }

  	getConstraints() : void{
		this.service.getOWLConstrainList().subscribe(data=>{
			this.constraints = data;
			if(document.cookie.length !== 0){
				//3:20,0 StrictPre 21,0/4:
				let constraints : string[] = document.cookie.split('/');
				for(let i = 0;i < constraints.length - 1;i++){
					let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
					let from : string = 'int' + constraint[0].substring(0,constraint[0].indexOf(','));
					let cons : string = constraint[1];
					let to : string = 'int' + constraint[2].substring(0,constraint[2].indexOf(','));
					this.constraints.push(from + ' ' + cons + ' ' + to);
				}
			}	
			//this.router.navigate(['']);
		});	
	  }
	  
	getAllPhenomena() : void{
		this.service.getAllPhenomenonList().subscribe(data => {
			this.phenomena = data;
		})
	}

	getAllReferences() : void{
		this.service.getAllReferenceList().subscribe(data => {
			this.references = data;
		})
	}
	deleteConstraint(index : number) : void{
		let newCookie : string = "";
		let parent = document.getElementById('OtherConstraint');
		let child = document.getElementById('consAndBut' + index);
		let selectedCons = document.getElementById('cons' + index).innerText;
		let constraints : string[] = document.cookie.split('/');
		for(let i = 0;i < constraints.length - 1;i++){
			let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
			let from : string = 'int' + constraint[0].substring(0,constraint[0].indexOf(','));
			let cons : string = constraint[1];
			let to : string = 'int' + constraint[2].substring(0,constraint[2].indexOf(','));
			console.log(from + ' ' + cons + ' ' + to);
			if((from + ' ' + cons + ' ' + to) === selectedCons){
				parent.removeChild(child);
			}
			else{
				newCookie = newCookie + constraints[i] + '/';
			}
		}
		console.log(newCookie);
		document.cookie = newCookie;
		location.reload(true);
	}
}
