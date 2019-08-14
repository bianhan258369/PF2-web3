 import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { timeout } from 'q';
import { Phenomenon } from '../entity/Phenomenon';

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
  	constructor(private service : ServiceService) { }

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
}
