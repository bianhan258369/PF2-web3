import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload'
import { ServiceService} from '../service/service.service'
import { Phenomenon } from '../entity/Phenomenon';
import * as _ from 'lodash';
import * as joint from 'node_modules/jointjs/dist/joint.js';
import { Rect } from '../entity/Rect';
import { Line } from '../entity/Line';
import { Oval } from '../entity/Oval';
import { Diagram } from '../entity/Diagram';
import { Interaction } from '../entity/Interaction';
import { Scenario } from '../entity/Scenario';
import { RouterLink, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { stringify } from 'querystring';


@Component({
  selector: 'app-mainboard',
  templateUrl: './mainboard.component.html',
  styleUrls: ['./mainboard.component.css']
})
export class MainboardComponent implements OnInit {
	interval
	projectPath : string;
	step : number;
	currentDiagram : number;
	diagramCount : number;
	scDiagrams : Array<Diagram>;
	tDiagrams : Array<Diagram>;
	diagrams : Array<Diagram>;
	allPhenomena : Array<Phenomenon>;
	references : Array<Phenomenon>;
	rects : Array<Array<Rect>>;
	lines : Array<Array<Line>>;
	ovals : Array<Array<Oval>>;
	interactions : Array<Array<Interaction>>;
	scenarios : Array<Array<Scenario>>;
	phenomena : Array<Array<Phenomenon>>;
	graph : joint.dia.Graph;
	paper : joint.dia.Paper;
	colours : Array<string>;
	rectColourMap : Map<string, string>;//rectName,colour
    numberColourMap : Map<number, string>;//interactionNumber,colour
	constraints : Array<string>;
	domainClockSpecification : Array<string>;

  uploader:FileUploader = new FileUploader({
	url:"http://localhost:8090/client/upload",
	//url:"http://47.52.116.116:8090/client/upload",
    method:"POST",
	itemAlias:"uploadedFiles"
  });


  constructor(private service : ServiceService,private cookieService:CookieService, private route : ActivatedRoute, private router : Router) {
	  
   }

  ngOnInit() {
	if(this.cookieService.check('projectPath')){
		this.projectPath = this.cookieService.get('projectPath');
		this.colours = new Array<string>();
	this.domainClockSpecification = new Array<string>();
	this.rectColourMap = new Map<string, string>();
	this.numberColourMap = new Map<number, string>();
	this.rects = new Array<Array<Rect>>();
	this.lines = new Array<Array<Line>>();
	this.ovals = new Array<Array<Oval>>();
	this.scenarios = new Array<Array<Scenario>>();
	this.interactions = new Array<Array<Interaction>>();
	this.graph = new joint.dia.Graph();
	this.scDiagrams = new Array<Diagram>();
	this.tDiagrams = new Array<Diagram>();
	this.diagrams = new Array<Diagram>();
	this.phenomena = new Array<Array<Phenomenon>>();
	this.constraints = new Array<string>();  
	this.allPhenomena = new Array<Phenomenon>();
	this.references = new Array<Phenomenon>();
	//this.getConstraints();
	this.getAllPhenomena();
	this.getAllReferences();
	this.initColours();
	this.getDiagramCount();
	this.getOvalList();
	this.getLineList();
	this.getScenarioList();
	this.getInteractionList();
	this.getRectAndPhenomenonListAndInitDCS();
	this.getDiagramList();
	this.getAddedConstraints();
	var that = this;
	if(!this.cookieService.check('step')){
		this.cookieService.set('step','0');
	}
	if(this.cookieService.check('constraints')){
		console.log(this.cookieService.get('constraints'));
		this.cookieService.set('step','6');
	}
	this.step = +this.cookieService.get('step');
	if(this.step >= 1){
		document.getElementById("details1DIV").hidden = false;
	}
	if(this.step >= 2){
		document.getElementById("details2DIV").hidden = false;
	}
	if(this.step >= 3){
		document.getElementById("details3DIV").hidden = false;
	}
	if(this.step >= 5){
		document.getElementById("OtherConstraintDIV").hidden = false;
	}

	that.interval = setInterval(function(){
		clearInterval(that.interval);
		that.initPaper();
	},1500);
	}
  }

  selectedXMLFileOnChanged(event:any) {
    this.uploadXMLFile(event.target.files[0].webkitRelativePath.split('/')[0]);
  }

  uploadXMLFile(folderName: string){
	this.uploader.onBuildItemForm=function(fileItem,form){
		form.append('folderName',folderName);
	}
	for(let i = 0;i < this.uploader.queue.length;i++){
		this.uploader.queue[i].upload();
	} 
	var that = this;
	var int = setInterval(function(){
		var finish = true;
		for(let i = 0;i < that.uploader.queue.length;i++){
			if(that.uploader.queue[i].progress !== 100) finish = false;
		}
		if(finish){
			clearInterval(int);
			alert("upload success");
		}
	},500);
	
  }

	change_Menu(index){//index from 1 to diagramCount * 2
		this.graph.off('change:position');
		if(index <= this.diagramCount){
			this.showClockDiagram(index - 1);
		}
		else{
			this.showTimingDiagram(index - 1);
		} 
		this.currentDiagram = index - 1;
		var element:any = document.getElementById("details1");
		element.open = false;
		element = document.getElementById("details3");
		element.open = false;
		this.cookieService.set('menu',index.toString());
	}
	
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


	initColours() : void{
		this.colours = new Array<string>();
		this.colours[0] = '#EA0000';
		this.colours[1] = '#6F00D2';
		this.colours[2] = '#000093';
		this.colours[3] = '#4DFFFF';
		this.colours[4] = '#BBFFBB';
		this.colours[5] = '#F9F900';
		this.colours[6] = '#FF8F59';
		this.colours[7] = '#AD5A5A';
		this.colours[8] = '#B9B973';
		this.colours[9] = '#4D0000';
		this.colours[10] = '#006030';
		this.colours[11] = '#E6CAFF';
		this.colours[12] = '#7B7B7B';
		this.colours[13] = '#336666';
		this.colours[14] = '#FFB5B5';
	}

	showConstraintDialog() : void{
		let index : number = this.currentDiagram - this.diagramCount;
		if(index >= 0 && index < this.diagramCount){
			this.router.navigate(['/addConstraint',index, this.projectPath]);	
		}	
	}

	initPaper() : void{
		this.graph = new joint.dia.Graph();
		let d = $("#content1");
		let wid = d.width();
		let hei =d.height();
		this.paper = new joint.dia.Paper({
			el: $("#content1"),
			width:wid,
			height:hei,
			model: this.graph,
			gridSize: 10,
			drawGrid: true,
			background: {
					color: 'rgb(240,255,255)'
				}
		});
		var that = this;

		if(this.step < 2){
			this.paper.off('element:pointerdblclick');
		}
		if(this.step >= 2){
			this.paper.on('element:pointerdblclick', function(elementView) {//pointerdblclick : double click
				var currentElement = elementView.model;//currentElement:the element which you double click on
				let index : number = that.currentDiagram;
				let domainText : string = currentElement.attr().label.text;
				let colour : string = that.rectColourMap.get(domainText);
				let indexAndDomainTextAndColour : string = index + ',' + domainText + ',' + colour;
				that.router.navigate(['/detail',indexAndDomainTextAndColour,that.projectPath]);
			});
		}
		
		this.paper.on('blank:mousewheel', (event,x ,y ,delta) => {
			let scale = that.paper.scale();
			that.paper.scale(scale.sx + (delta * 0.01), scale.sy + (delta * 0.01));
		});

		let index = +this.cookieService.get('menu');
		this.currentDiagram = index - 1;
		if(index <= this.diagramCount){
			this.showClockDiagram(index - 1);
		}
		else{
			this.showTimingDiagram(index - 1);
		}
	}

	getDiagramCount() : void{
		this.service.getDiagramCount(this.projectPath).subscribe(data=>{
			this.diagramCount = data;
		});	
	  }

	  //rectState: 1 domain 2 machine
	getRectAndPhenomenonListAndInitDCS() : void{
		this.service.getDiagramCount(this.projectPath).subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getRects(this.projectPath,i).subscribe(data => {
					this.rects[i] = data;
					for(let j = 0;j < this.rects[i].length;j++){
						if(this.rects[i][j].state === 1){
							if(this.rectColourMap.get(this.rects[i][j].text) === undefined){
								let colour : string = this.colours.shift();
								this.rectColourMap.set(this.rects[i][j].text,colour);
								this.colours.push(colour);
							}
							this.domainClockSpecification[this.domainClockSpecification.length] = i + ',' + this.rects[i][j].text + ',' + this.rectColourMap.get(this.rects[i][j].text);
						}						
					}
					this.service.getPhenomenonList(this.projectPath,i).subscribe(phe => {
						console.log("init numberColourMap");
						this.phenomena[i] = phe;
						for(let j = 0;j < this.phenomena[i].length;j++){
							let tempPhenomenon : Phenomenon = this.phenomena[i][j];
							let from : Rect = tempPhenomenon.from;
							let to : Rect = tempPhenomenon.to;
							if(from.state === 1){
								this.numberColourMap.set(tempPhenomenon.biaohao, this.rectColourMap.get(from.text));
							}
							else if(to.state === 1){
								this.numberColourMap.set(tempPhenomenon.biaohao, this.rectColourMap.get(to.text));
							}
						}
					})
				});
			}
			// for(let i = 0;i < diagramCount;i++){
			// 	this.service.getPhenomenonList(i).subscribe(phe => {
			// 		console.log("init numberColourMap");
			// 		this.phenomena[i] = phe;
			// 		for(let j = 0;j < this.phenomena[i].length;j++){
			// 			let tempPhenomenon : Phenomenon = this.phenomena[i][j];
			// 			let from : Rect = tempPhenomenon.from;
			// 			let to : Rect = tempPhenomenon.to;
			// 			if(from.state === 0){
			// 				this.numberColourMap.set(tempPhenomenon.biaohao, this.rectColourMap.get(from.text));
			// 			}
			// 			else if(to.state === 0){
			// 				this.numberColourMap.set(tempPhenomenon.biaohao, this.rectColourMap.get(to.text));
			// 			}
			// 		}
			// 	})
			// }
		});	
	}

	getOvalList() : void{
		this.service.getDiagramCount(this.projectPath).subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getOvals(this.projectPath,i).subscribe(data => {
					this.ovals[i] = data;
				})
			}
		});	
	}

	getLineList() : void{
		this.service.getDiagramCount(this.projectPath).subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getLines(this.projectPath,i).subscribe(data => {
					this.lines[i] = data;
				})
			}
		});	
	}

	getScenarioList() : void{
		this.service.getDiagramCount(this.projectPath).subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getScenarios(this.projectPath,i).subscribe(data => {
					this.scenarios[i] = data;
				})
			}
		});	
	}

	getInteractionList() : void{
		this.service.getDiagramCount(this.projectPath).subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getInteractions(this.projectPath,i).subscribe(data => {
					this.interactions[i] = data;
				})
			}
		});	
	}

	getDiagramList() : void{
		this.service.getDiagrams(this.projectPath).subscribe(dia=>{
			this.diagrams = dia;
			this.service.getDiagramCount(this.projectPath).subscribe(diagramCount=>{
				for(let i = 0;i < diagramCount;i++){
					this.diagrams[i].title = 'SCD' + (i + 1);
					this.diagrams[i + diagramCount].title = 'TD' + (i + 1);
					this.service.getRects(this.projectPath,i).subscribe(data => {
						this.rects[i] = data;
						for(let j = 0;j < this.rects[i].length;j++){
							if(this.rects[i][j].state === 2){
								this.diagrams[i].machineName = this.rects[i][j].text;
								this.diagrams[i + diagramCount].machineName = this.rects[i][j].text;
							}
						}
					})
				}
			});	
		});	
	}

	getAllPhenomena() : void{
		this.service.getAllPhenomenonList(this.projectPath).subscribe(data => {
			this.allPhenomena = data;
		})
	}

	getAllReferences() : void{
		this.service.getAllReferenceList(this.projectPath).subscribe(data => {
			this.references = data;
		})
	}

	getAddedConstraints() : void{
		this.service.getAddedConstraints(this.projectPath).subscribe(data =>{
			if(this.cookieService.get("open") === "true"){
				let constraintsCookie = "";
				let newClockConstraintsCookie = "";
				let constraints = data["constraints"].split("/");
				for(let i = 0;i < constraints.length - 1;i++){
					let tempIndex = +constraints[i].substring(0, constraints[i].indexOf(':'));
					let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
					if(constraint[0].includes(',') && constraint[2].includes(',')){
						let from : string = 'int' + constraint[0].split(',')[0] + 'state' + constraint[0].split(',')[1];
						let cons : string = constraint[1];
						let to : string = 'int' + constraint[2].split(',')[0] + 'state' + constraint[2].split(',')[1];
						let extra = "";
						if(cons === 'Union' || cons === 'Sup' || cons === 'Inf' || cons === 'BoundedDiff') extra = constraint[3];
						constraintsCookie = constraintsCookie + constraints[i] + '/';
					}
					else{
						let from = constraint[0];
						let cons = constraint[1];
						let to = constraint[2];
						if(from.includes(',')) from = 'int' + constraint[0].split(',')[0] + 'state' + constraint[0].split(',')[1];
						if(to.includes(',')) to = 'int' + constraint[2].split(',')[0] + 'state' + constraint[2].split(',')[1];
						let extra = "";
						if(cons === 'Union' || cons === 'Sup' || cons === 'Inf' || cons === 'BoundedDiff') extra = constraint[3];
						newClockConstraintsCookie = newClockConstraintsCookie + constraints[i] + '/';
					}
				}
				console.log(constraintsCookie);
				console.log(newClockConstraintsCookie);
				this.cookieService.set('constraints',constraintsCookie);
				this.cookieService.set('newClockConstraints',newClockConstraintsCookie);
				this.cookieService.set('open','false');
			}
			this.service.getOWLConstrainList(this.projectPath).subscribe(data=>{
				this.constraints = data;
				if(this.constraints === null) this.constraints = new Array<string>();
				if(this.cookieService.get('constraints').length !== 0){
					//3:20,0 StrictPre 21,0/4:
					let constraints : string[] = this.cookieService.get('constraints').split('/');
					for(let i = 0;i < constraints.length - 1;i++){
						let index = constraints[i].substring(0,constraints[i].indexOf(':'));
						let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
						let from : string = 'int' + constraint[0].split(',')[0] + 'state' + constraint[0].split(',')[1];
						let cons : string = constraint[1];
						let to : string = 'int' + constraint[2].split(',')[0] + 'state' + constraint[2].split(',')[1];
						let extra : string = "";
						if(cons === 'BoundedDiff' || cons ==='Sup' || cons === 'Union' || cons === 'Inf') extra = constraint[3];
						this.constraints.push('TD' + (+index + 1) + ':' + from + ' ' + cons + ' ' + to + ' ' + extra);
					}
				}
				if(this.cookieService.get('newClockConstraints').length !== 0){
					let constraints : string[] = this.cookieService.get('newClockConstraints').split('/');
					for(let i = 0;i < constraints.length - 1;i++){
						let index = constraints[i].substring(0,constraints[i].indexOf(':'));
						let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
						let from : string = constraint[0].includes(',') ? 'int' + constraint[0].split(',')[0] + 'state' + constraint[0].split(',')[1] : constraint[0];
						let cons : string = constraint[1];
						let to : string = constraint[2].includes(',') ? 'int' + constraint[2].split(',')[0] + 'state' + constraint[2].split(',')[1] : constraint[2];
						let extra : string = "";
						if(cons === 'BoundedDiff' || cons ==='Sup' || cons === 'Union' || cons === 'Inf') extra = constraint[3];
						this.constraints.push('TD' + (+index + 1) + ':' + from + ' ' + cons + ' ' + to + ' ' + extra);
					}
				}	
			});	
		})
	}

	showClockDiagram(index : number) : void{
		this.graph.clear();
		var MachineElement = joint.dia.Element.define('examples.CustomTextElement', {
			attrs: {
				label: {
					textAnchor: 'middle', //文本居中
					textVerticalAnchor: 'middle',
				},
				r: {
					strokeWidth: 1, //宽度
					stroke: '#000000', //颜色
					fill: 'none' //填充色
				},
				r1: {
					strokeWidth: 1,
					stroke: '#000000',
					fill: 'none',
				},
				r2: {
					strokeWidth: 1,
					stroke: '#000000',
					fill: 'none',
				},
			}
		}, {
				markup: [{
					tagName: 'text',
					selector: 'label'
				}, {
					tagName: 'rect',
					selector: 'r'
				}, {
					tagName: 'rect',
					selector: 'r1'
				}, {
					tagName: 'rect',
					selector: 'r2'
				}]
			});

		var machineElement = new MachineElement();
		let rectGraphList = new Array<joint.shapes.basic.Rect>();
		let ovalGraphList = new Array<joint.shapes.basic.Ellipse>();
		for(let i = 0;i < this.rects[index].length;i++){
			let rect = new joint.shapes.standard.Rectangle({
				position: {x: this.rects[index][i].x1,y : this.rects[index][i].y1},
				size: {width: this.rects[index][i].x2+150,height: this.rects[index][i].y2},
				attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: this.rects[index][i].text, fill: '#000000' }}
			});
			rectGraphList[i] = rect;
			if(this.rects[index][i].state === 2){
				machineElement.attr(
					{
					label: {
						text: this.rects[index][i].text + '(' + this.rects[index][i].shortName + ')',
						x: this.rects[index][i].x1,
						y: this.rects[index][i].y1,
					},
					r: {
						ref: 'label',
						refX: -45, //坐标原点
						refY: 0,
						x: 0, //图形位置
						y: 0,
						refWidth: 40, //图形大小
						refHeight: '120%',
					},
					r1: {
						ref: 'r',
						refX: 20,
						refY: 0,
						x: 0,
						y: 0,
						refWidth:-20,
						refHeight:'100%'
					},
					r2: {
						ref: 'r',
						refX: 40,
						refY: 0,
						x: 0,
						y: 0,
						refWidth: -40,
						refHeight: '100%',
					},
					root: {
						title: 'machine:' + this.rects[index][i].text,
					}
				});
			}
		}
		for(let i = 0;i < this.ovals[index].length;i++){
			let oval = new joint.shapes.standard.Ellipse({
				position: {x: this.ovals[index][i].x1,y : this.ovals[index][i].y1},
				size: {width: this.ovals[index][i].x2+150,height: this.ovals[index][i].y2},
				attrs: { body: { fill: 'none',strokeWidth:1,strokeDasharray : '10,5' }, label: { text: this.ovals[index][i].text, fill: '#000000' }}
			});
			ovalGraphList[i] = oval;
		}
		for(let i = 0;i < this.lines[index].length;i++){
			let line = this.lines[index][i];
			if(line.state === 0){
				let rectTo : Rect = line.to as Rect;
				let rectToIndex = -1;
				for(let j = 0;j < this.rects[index].length;j++){
					let tempRect : Rect = this.rects[index][j];
					if(tempRect.text === rectTo.text) rectToIndex = j;
				}
				let link = new joint.shapes.standard.Link({
					source: { id: machineElement.id },
					target: { id: rectGraphList[rectToIndex].id },
					});
					link.appendLabel({
						attrs: {
							text: {
								text: line.name,
							},
							body: {
								stroke: 'transparent',
								fill: 'transparent'
							}
						}
					});
					link.attr({
						line: {
							strokeWidth: 1,
							targetMarker:{
								'fill': 'none',
								'stroke': 'none',
							}
						},
						
					});
				this.graph.addCells([rectGraphList[rectToIndex], machineElement,link]);
			}
			else if(line.state === 1){
				let oval : Oval = line.from as Oval;
				let rect : Rect = line.to as Rect;
				let rectIndex = -1;
				let ovalIndex = -1;
				for(let j = 0;j < this.rects[index].length;j++){
					let tempRect : Rect = this.rects[index][j];
					if(tempRect.text === rect.text) rectIndex = j;
				}
				for(let j = 0;j < this.ovals[index].length;j++){
					let tempOval : Oval = this.ovals[index][j];
					if(tempOval.text === oval.text) ovalIndex = j;
				}
				let link = new joint.shapes.standard.Link({
					source: { id: rectGraphList[rectIndex].id },
					target: { id: ovalGraphList[ovalIndex].id },
					});
					link.appendLabel({
						attrs: {
							text: {
								text: line.name,
							},
							body: {
								stroke: 'transparent',
								fill: 'transparent'
							}
						}
					});
					link.attr({
						line: {
							strokeWidth: 1,
							targetMarker:{
								'fill': 'none',
								'stroke': 'none',
							},
							strokeDasharray: '8,4',
						},
						
					});
				this.graph.addCells([rectGraphList[rectIndex],ovalGraphList[ovalIndex],link]);
			}
			else{
				let oval : Oval = line.from as Oval;
				let rect : Rect = line.to as Rect;
				let rectIndex = -1;
				let ovalIndex = -1;
				for(let j = 0;j < this.rects[index].length;j++){
					let tempRect : Rect = this.rects[index][j];
					if(tempRect.text === rect.text) rectIndex = j;
				}
				for(let j = 0;j < this.ovals[index].length;j++){
					let tempOval : Oval = this.ovals[index][j];
					if(tempOval.text === oval.text) ovalIndex = j;
				}
				let link = new joint.shapes.standard.Link({
					source: { id: ovalGraphList[ovalIndex].id },
					target: { id: rectGraphList[rectIndex].id },
					attrs:{
						line:{
							strokeDasharray: '5 5'
						}
					}
					});
					link.appendLabel({
						attrs: {
							text: {
								text: line.name,
							},
							body: {
								stroke: 'transparent',
								fill: 'transparent'
							}
						}
					});
					link.attr({
						line: {
							strokeWidth: 1,
							targetMarker:{
								'fill': 'black',
								'stroke': 'black',
							},
							strokeDasharray: '8,4',
						},
						
					});
				this.graph.addCells([rectGraphList[rectIndex],ovalGraphList[ovalIndex],link]);
			}
		}
	}

	//index from diagramCount to 2 * diagramCount - 1
	showTimingDiagram(index : number) : void{		
		this.graph.clear();
		let tempIndex : number = index - this.diagramCount;
		let ellipseGraphList = new Array<joint.shapes.basic.Ellipse>();
		let textList = new Array<joint.shapes.standard.Rectangle>();
		for(let i = 0;i < this.rects[tempIndex].length;i++){
			let tempRect : Rect = this.rects[tempIndex][i];
			if(tempRect.state === 1){
				let text = new joint.shapes.standard.TextBlock({
					position:{x:0,y:i * 25 - 25},
					size:{width:40, height:20},
					attrs:{body:{stroke : 'transparent', fill : 'transparent'}, label:{text: tempRect.shortName + ":"}}
				})
				let tag = new joint.shapes.basic.Rect({
					position:{x:40,y:i * 25 - 25},
					size:{width:40, height:20},
					attrs:{rect : {fill: this.rectColourMap.get(tempRect.text)}}
				});
				this.graph.addCell(text);
				this.graph.addCell(tag);
			}
		}
		for(let i = 0;i < this.interactions[tempIndex].length;i++){
			let text = new joint.shapes.standard.Rectangle();
			let ellipse = null;
			if(this.interactions[tempIndex][i].state === 1){
				ellipse = new joint.shapes.basic.Ellipse({
					position: {x: this.interactions[tempIndex][i].x1,y : this.interactions[tempIndex][i].y1},
					size: {width: this.interactions[tempIndex][i].x2,height: this.interactions[tempIndex][i].y2},
					attrs: { ellipse: {strokeWidth:1,strokeDasharray : '10,5', fill: this.numberColourMap.get(this.interactions[tempIndex][i].number) }, text: { text: 'int' + this.interactions[tempIndex][i].number, fill: 'white' },root:{id:'int' + this.interactions[tempIndex][i].state.toString() + this.interactions[tempIndex][i].number.toString()}},
				})
			}
			else{
				ellipse = new joint.shapes.basic.Ellipse({
					position: {x: this.interactions[tempIndex][i].x1,y : this.interactions[tempIndex][i].y1},
					size: {width: this.interactions[tempIndex][i].x2,height: this.interactions[tempIndex][i].y2},
					attrs: { ellipse: {strokeWidth:1, fill: this.numberColourMap.get(this.interactions[tempIndex][i].number) }, text: { text: 'int' + this.interactions[tempIndex][i].number, fill: 'white' },root:{id:'int' + this.interactions[tempIndex][i].state.toString() + this.interactions[tempIndex][i].number.toString()}},
				})
			}
			for(let j = 0;j < this.phenomena[tempIndex].length;j++){
				if(this.phenomena[tempIndex][j].biaohao === this.interactions[tempIndex][i].number){
					text.attr({
						body: {
							ref: 'label',
							refX: -5,
							refY: 0,
							x: 0,
							y: 0,
							refWidth: 10,
							refHeight: '120%',
							fill: 'none',
							stroke:'none',
							strokeWidth: 1,
						},
						label: {
							text: this.phenomena[tempIndex][j].name,
							fontSize: 15,
							textAnchor: 'middle',
							textVerticalAnchor: 'middle',
						},
						root: {
							id:this.interactions[tempIndex][i].state.toString() + this.interactions[tempIndex][i].number.toString(),
						}
					});
					text.position(this.interactions[tempIndex][i].x1 + 80, this.interactions[tempIndex][i].y1 - 15);
					text.addTo(this.graph);
					break;
				}
			};
			ellipseGraphList[i] = ellipse;
			textList[i] = text;
		}
		for(let i = 0;i < this.scenarios[tempIndex].length;i++){
			let scenario : Scenario = this.scenarios[tempIndex][i];
			let interactionFrom : Interaction = scenario.from;
			let interactionTo : Interaction = scenario.to;
			let interactionFromIndex = -1;
			let interactionToIndex = -1;
			for(let j = 0;j < this.interactions[tempIndex].length;j++){
				let tempInteraction : Interaction = this.interactions[tempIndex][j];
				if(tempInteraction.number === interactionFrom.number && tempInteraction.state === interactionFrom.state) interactionFromIndex = j;
				if(tempInteraction.number === interactionTo.number && tempInteraction.state === interactionTo.state) interactionToIndex = j;
			}

			if(scenario.state === 4){
				let link = new joint.shapes.standard.Link();
				link.source(ellipseGraphList[interactionToIndex]);
				link.target(ellipseGraphList[interactionFromIndex]);
				link.attr({
					line: {
						strokeWidth: 1,
						targetMarker:{
							'fill': 'black',
							'stroke': 'black',
						}
					},
					
				});
				this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
			}
			else if(scenario.state ===2){
				let link = new joint.shapes.standard.Link();
				link.source(ellipseGraphList[interactionFromIndex]);
				link.target(ellipseGraphList[interactionToIndex]);	
				link.attr({
					line: {
						strokeWidth: 1,
						targetMarker:{
							'fill': 'none',
							'stroke': 'none',
						}
					},
					
				});
				this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
			}
			else{
				let link = new joint.shapes.standard.Link();
				link.source(ellipseGraphList[interactionFromIndex]);
				link.target(ellipseGraphList[interactionToIndex]);	
				link.attr({
					line: {
						strokeWidth: 1,
						targetMarker:{
							'fill': 'black',
							'stroke': 'black',
						}
					},
					
				});
				this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);		
			}	
		}

		var that = this;
		this.graph.on('change:position', function(elementView, position) {
			if(elementView.attributes.type === 'basic.Ellipse'){
				var id = elementView.attributes.attrs.root.id.substring(3);
				for(let n = 0;n < that.graph.getCells().length;n++){
					if(that.graph.getCells()[n].attributes.type === 'standard.Rectangle' && that.graph.getCells()[n].attributes.attrs.root.id === id){
						that.graph.getCells()[n].set("position",{x: position.x + 80,y: position.y - 15});
					}
				}
			}
		});

		let constraints : string[] = this.cookieService.get('constraints').split('/');
		console.log(this.cookieService.get('constraints'));
		if(constraints.length !== 0){
			for(let i = 0;i < constraints.length - 1;i++){
				let index2 : number = +constraints[i].substring(0, constraints[i].indexOf(':'));
				if(index2 === tempIndex){
					let interactionFromIndex = -1;
					let interactionToIndex = -1;
					let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
					let cons : string = constraint[1];
					let fromNum : number = +constraint[0].substring(0,constraint[0].indexOf(','));
					let toNum : number = +constraint[2].substring(0,constraint[2].indexOf(','));
					let fromState : number = +constraint[0].substring(1 + constraint[0].indexOf(','));
					let toState : number = +constraint[2].substring(1 + constraint[2].indexOf(','));
					for(let j = 0;j < this.interactions[tempIndex].length;j++){
						let tempInteraction : Interaction = this.interactions[tempIndex][j];
						if(tempInteraction.number === fromNum && tempInteraction.state === fromState) interactionFromIndex = j;
						if(tempInteraction.number === toNum && tempInteraction.state === toState) interactionToIndex = j;
					}
					if(cons === 'StrictPre'){
						let link = new joint.shapes.standard.Link();
						link.source(ellipseGraphList[interactionFromIndex]);
						link.target(ellipseGraphList[interactionToIndex]);	
						link.attr({
							line: {
								strokeWidth: 1,
								targetMarker:{
									'fill': 'black',
									'stroke': 'black',
								}
							},	
						});
						this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
					}
					else if(cons === 'Coincidence'){
						let link = new joint.shapes.standard.Link();
						link.source(ellipseGraphList[interactionFromIndex]);
						link.target(ellipseGraphList[interactionToIndex]);	
						link.attr({
							line: {
								strokeWidth: 1,
								sourceMarker:{
									'fill': 'none',
									'stroke': 'none',
								},
								targetMarker:{
									'fill': 'none',
									'stroke': 'none',
								}
							},	
						});
						this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
					}
					else if(cons === 'BoundedDiff'){
						let fromto = constraint[3];
						let link = new joint.shapes.standard.Link();
						link.source(ellipseGraphList[interactionFromIndex]);
						link.target(ellipseGraphList[interactionToIndex]);
						link.appendLabel({
							attrs: {
								text: {
									text: "Bounded[" + fromto + "]",
								},
								body: {
									stroke: 'transparent',
									fill: 'transparent'
								}
							}
						});
						this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
					}
					else if(cons === 'Union' || cons === 'Inf' || cons === 'Sup'){
						let name = constraint[3];
						let link = new joint.shapes.standard.Link();
						link.source(ellipseGraphList[interactionFromIndex]);
						link.target(ellipseGraphList[interactionToIndex]);
						link.appendLabel({
							attrs: {
								text: {
									text: cons +"[" + name + "]",
								},
								body: {
									stroke: 'transparent',
									fill: 'transparent'
								}
							}
						});
						link.attr({
							line: {
								strokeWidth: 1,
								sourceMarker:{
									'fill': 'none',
									'stroke': 'none',
								},
								targetMarker:{
									'fill': 'none',
									'stroke': 'none',
								}
							},	
						});
						this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
					}
					else{
						let link = new joint.shapes.standard.Link();
						link.source(ellipseGraphList[interactionFromIndex]);
						link.target(ellipseGraphList[interactionToIndex]);
						link.appendLabel({
							attrs: {
								text: {
									text: cons,
								},
								body: {
									stroke: 'transparent',
									fill: 'transparent'
								}
							}
						});
						this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
					}		
				}
			}
		}
		//3:20,0 StrictPre 21,0/4:
	}

	// getConstraints() : void{
	// 	this.service.getOWLConstrainList(this.projectPath).subscribe(data=>{
	// 		this.constraints = data;
	// 		if(this.constraints === null) this.constraints = new Array<string>();
	// 		if(this.cookieService.get('constraints').length !== 0){
	// 			//3:20,0 StrictPre 21,0/4:
	// 			let constraints : string[] = this.cookieService.get('constraints').split('/');
	// 			for(let i = 0;i < constraints.length - 1;i++){
	// 				let index = constraints[i].substring(0,constraints[i].indexOf(':'));
	// 				let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
	// 				let from : string = 'int' + constraint[0].split(',')[0] + 'state' + constraint[0].split(',')[1];
	// 				let cons : string = constraint[1];
	// 				let to : string = 'int' + constraint[2].split(',')[0] + 'state' + constraint[2].split(',')[1];
	// 				let extra : string = "";
	// 				if(cons === 'BoundedDiff' || cons ==='Sup' || cons === 'Union' || cons === 'Inf') extra = constraint[3];
	// 				this.constraints.push('TD' + (+index + 1) + ':' + from + ' ' + cons + ' ' + to + ' ' + extra);
	// 			}
	// 		}
	// 		if(this.cookieService.get('newClockConstraints').length !== 0){
	// 			let constraints : string[] = this.cookieService.get('newClockConstraints').split('/');
	// 			for(let i = 0;i < constraints.length - 1;i++){
	// 				let index = constraints[i].substring(0,constraints[i].indexOf(':'));
	// 				let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
	// 				let from : string = constraint[0].includes(',') ? 'int' + constraint[0].split(',')[0] + 'state' + constraint[0].split(',')[1] : constraint[0];
	// 				let cons : string = constraint[1];
	// 				let to : string = constraint[2].includes(',') ? 'int' + constraint[2].split(',')[0] + 'state' + constraint[2].split(',')[1] : constraint[2];
	// 				let extra : string = "";
	// 				if(cons === 'BoundedDiff' || cons ==='Sup' || cons === 'Union' || cons === 'Inf') extra = constraint[3];
	// 				this.constraints.push('TD' + (+index + 1) + ':' + from + ' ' + cons + ' ' + to + ' ' + extra);
	// 			}
	// 		}	
	// 	});	
	//   }

	  deleteConstraint(index : number) : void{
		let constraintCookie : string = "";
		let newClockConstraintsCookie : string = "";
		let parent = document.getElementById('OtherConstraint');
		let child = document.getElementById('consAndBut' + index);
		let selectedCons = document.getElementById('cons' + index).innerText;
		let constraints : string[] = this.cookieService.get('constraints').split('/');
		for(let i = 0;i < constraints.length - 1;i++){
			let tempIndex = +constraints[i].substring(0, constraints[i].indexOf(':'));
			let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
			if(constraint[0].includes(',') && constraint[2].includes(',')){
				let from : string = 'int' + constraint[0].split(',')[0] + 'state' + constraint[0].split(',')[1];
				let cons : string = constraint[1];
				let to : string = 'int' + constraint[2].split(',')[0] + 'state' + constraint[2].split(',')[1];
				let extra = "";
				if(cons === 'Union' || cons === 'Sup' || cons === 'Inf' || cons === 'BoundedDiff') extra = constraint[3];
				if(('TD' + (tempIndex + 1) + ':' + from + ' ' + cons + ' ' + to + ' ' + extra) === selectedCons){
					parent.removeChild(child);
				}
				else{
					constraintCookie = constraintCookie + constraints[i] + '/';
				}
			}
			else{
				let from = constraint[0];
				let cons = constraint[1];
				let to = constraint[2];
				if(from.includes(',')) from = 'int' + constraint[0].split(',')[0] + 'state' + constraint[0].split(',')[1];
				if(to.includes(',')) to = 'int' + constraint[2].split(',')[0] + 'state' + constraint[2].split(',')[1];
				let extra = "";
				if(cons === 'Union' || cons === 'Sup' || cons === 'Inf' || cons === 'BoundedDiff') extra = constraint[3];
				if(('TD' + (tempIndex + 1) + ':' + from + ' ' + cons + ' ' + to + ' ' + extra) === selectedCons){
					parent.removeChild(child);
				}
				else{
					newClockConstraintsCookie = newClockConstraintsCookie + newClockConstraintsCookie[i] + '/';
				}
			}
		}
		for(let i = 0;i < this.constraints.length;i++){
			if(this.constraints[i] === selectedCons){
				this.constraints.splice(i, 1);
				break;
			}
		}
		this.cookieService.set('constraints',constraintCookie);
		this.cookieService.set('newClockConstraints',newClockConstraintsCookie);
		this.saveConstraintsTxt();
		location.reload(true);
	}

	showZ3Panel(){
		document.getElementById('z3check').style.display = 'block';
	}

	getZ3Result(){
		document.getElementById('z3check').style.display = 'none';
		var timeout = +$("#timeout").val();
		var b = +$("#bound").val();
		var p = $("#hasPeriod").is(":checked");
		var pb = +$("#period").val();
		var dl = $("#hasDeadlock").is(":checked");
		this.service.z3Check(this.projectPath, timeout, b, pb, dl, p).subscribe(data => {
			var result = data["result"];
			//document.getElementById("z3Result").innerHTML = "result:"+result;
			alert("z3 result:"+result);
		});
	}

	goBack(){
		document.getElementById('z3check').style.display = 'none';
	}

	next(){
		if(!this.cookieService.check('step')){
			this.cookieService.set('step','0');
		} 
		else if(+this.cookieService.get('step') > 8){
			return;
		}
		else{
			let step : number = +this.cookieService.get('step');
			this.cookieService.set('step',(step + 1).toString());
			if(step === 0){
				document.getElementById("details1DIV").hidden = false;
			}
			if(step === 1){
				document.getElementById("details2DIV").hidden = false;
				var that = this;
				this.paper.on('element:pointerdblclick', function(elementView) {//pointerdblclick : double click
					var currentElement = elementView.model;//currentElement:the element which you double click on
					let index : number = that.currentDiagram;
					let domainText : string = currentElement.attr().label.text;
					let colour : string = that.rectColourMap.get(domainText);
					let indexAndDomainTextAndColour : string = index + ',' + domainText + ',' + colour;
					console.log(indexAndDomainTextAndColour);
					that.router.navigate(['/detail',indexAndDomainTextAndColour, that.projectPath]);
				});
			}
			if(step === 2){
				document.getElementById("details3DIV").hidden = false;
			}
			if(step === 3){
				document.getElementById("OtherConstraintDIV").hidden = false;
			}
			if(step === 4){
				this.ruleBasedCheck();
			}
		}
		this.step = +this.cookieService.get('step');
	}

	previous(){
		if(!this.cookieService.check('step')){
			return;
		} 
		else if(+this.cookieService.get('step') < 1){
			return;
		}
		else{
			let step : number = +this.cookieService.get('step');
			this.cookieService.set('step',(step -1).toString());
			if(step === 1){
				document.getElementById("details1DIV").hidden = true;
			}
			if(step === 2){
				document.getElementById("details2DIV").hidden = true;
				this.paper.off('element:pointerdblclick');
			}
			if(step === 3){
				document.getElementById("details3DIV").hidden = true;
			}
			if(step === 4){
				document.getElementById("OtherConstraintDIV").hidden = true;
			}
		}
		this.step = +this.cookieService.get('step');
	}

	nextMainStep(){
		location.href="http://re4cps.org/MainPage/workflow?from=timingrequirementmodelandverification";
	}

	saveConstraintsTxt() : void{
		var str = '';
		var addedConstraints = '';
		var ints = new Array<number>();
		console.log(this.constraints);
		// var newClockConstraints = this.cookieService.get('newClockConstraints').split('/');
		// for(let i = 0;i < newClockConstraints.length - 1;i++){
		// 	var tempStr = newClockConstraints[i].substr(newClockConstraints[i].indexOf(':')+1).split(' ');
		// 	console.log(tempStr);
		// 	var from = tempStr[0];
		// 	var to = tempStr[2];
		// 	if(!from.includes(',') && !str.includes(from)) str = str + from + '/';
		// 	if(!to.includes(',') && !str.includes(to)) str = str + to + '/';
		// }
		for(let i = 0;i < this.constraints.length;i++){
			console.log(this.constraints);
			var tempStr = this.constraints[i].substr(this.constraints[i].indexOf(':')+1).split(' ');
			var from = tempStr[0];
			var to = tempStr[2];
			if((!from.includes('int') || !from.includes('state')) && !str.includes(from)) str = str + from + '/';
			if(from.includes('.') && !str.includes(from)) str = str + from + '/';
			if((!to.includes('int') || !to.includes('state')) && !str.includes(to)) str = str + to + '/';
			if(to.includes('.') && !str.includes(to)) str = str + to + '/';
		}
		for(let i = 0;i < this.diagramCount;i++){
			for(let j = 0;j < this.interactions[i].length;j++){
				if(ints.indexOf(this.interactions[i][j].number) === -1) ints.push(this.interactions[i][j].number);
			}
		}
		for(let i = 0;i < ints.length;i++){
			if(i!==ints.length - 1) str = str + 'int' + ints[i] + '/';
			else str = str + 'int' + ints[i] + ';/';
		} 
		str = str + '/';
		for(let i = 0;i < this.diagramCount;i++){
			for(let j = 0;j < this.scenarios[i].length;j++){
				if(this.scenarios[i][j].state !==2 && this.scenarios[i][j].state !== 4){
					str = str + 'int' + this.scenarios[i][j].from.number + ' StrictPre ' + 'int' + this.scenarios[i][j].to.number + ';/';
				}
				else if(this.scenarios[i][j].state ===2){
					//str = str + 'int' + this.scenarios[i][j].from.number + ' Coincidence ' + 'int' +  this.scenarios[i][j].to.number + ';,';
				}
				else {
					str = str + 'int' + this.scenarios[i][j].to.number + ' StrictPre ' + 'int' + this.scenarios[i][j].from.number + ';/';
				}
			}
		}
		for(let i = 0;i < this.constraints.length;i++){
			str = str + this.constraints[i] + ';/';
			addedConstraints = addedConstraints + this.constraints[i] + '//';
		}
		// for(let i = 0;i < newClockConstraints.length - 1;i++){
		// 	str = str + newClockConstraints[i] + ';/';
		// 	addedConstraints = addedConstraints + newClockConstraints[i] + '//';
		// }
		console.log(str);
		this.service.exportConstraints(this.projectPath,str,addedConstraints);
		alert('success');
	}

	downloadConstraints(){
		window.open('http://localhost:8090/client/downloadMyCCSLFile?path=' + this.projectPath);
		//window.open('http://47.52.116.116:8090/client/downloadMyCCSLFile');
	}
	

	downloadTool(){
		window.open('http://localhost:8090/client/downloadMyCCSLTool');
		//window.open('http://47.52.116.116:8090/client/downloadMyCCSLTool');
	}
	

	showDomainClockSpecification(str : string){
		var element1 : any = document.getElementById("details1");
		var element2 : any = document.getElementById("details2");
		var element3 : any = document.getElementById("details3");
		element1.open = false;
		element2.open = false;
		element3.open = false;
		this.router.navigate(['/detail',str,this.projectPath]);
	}

	details1Click(){
		var element1 : any = document.getElementById("details2");
		var element2 : any = document.getElementById("details3");
		element1.open = false;
		element2.open = false;
	}

	details2Click(){
		var element1 : any = document.getElementById("details1");
		var element2 : any = document.getElementById("details3");
		element1.open = false;
		element2.open = false;
	}

	details3Click(){
		var element1 : any = document.getElementById("details1");
		var element2 : any = document.getElementById("details2");
		element1.open = false;
		element2.open = false;
	}

	ruleBasedCheck(){
		this.service.ruleBasedCheck(this.projectPath).subscribe(data => {
			if(data["circle"] === '') return;
			let circle = data["circle"];
			let circles : Array<string> = circle.split(';');
			var tip = "TD";
			tip = tip + (+circles[circles.length - 1] + 1) + ' ';
			if(circles.length === 2){
				tip = tip + circles[0];
				this.previous();
				alert(tip);
			}
			if(circles.length > 2){
				for(let i = 0;i < circles.length - 1;i++ ){
					tip = tip + 'int' + circles[i].split(',')[1] + ',state:' + circles[i].split(',')[0] + '-->';
				}
				tip = tip + 'int' + circles[0].split(',')[1] + ',state:' + circles[0].split(',')[0];
				tip = tip + ' is a circle';
				this.previous();
				alert(tip);
			}	
		});
	}

	openProject(){
		this.router.navigate(['/loadproject']);
	}
}
