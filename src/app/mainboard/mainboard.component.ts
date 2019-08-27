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
	//graphs : Array<joint.dia.Graph>;
	paper : joint.dia.Paper;
	//papers : Array<joint.dia.Paper>;
	colours : Array<string>;
	rectColourMap : Map<string, string>;//rectName,colour
    numberColourMap : Map<number, string>;//interactionNumber,colour
    constraints : Array<string>;

  uploader:FileUploader = new FileUploader({
    url:"http://localhost:8080/client/upload",
    method:"POST",
	itemAlias:"uploadedFiles"
  });


  constructor(private service : ServiceService,private cookieService:CookieService, private route : ActivatedRoute, private router : Router) {
	  
   }

  ngOnInit() {
	this.colours = new Array<string>();
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
	this.getConstraints();
	this.getAllPhenomena();
	this.getAllReferences();
	this.initColours();
	this.getDiagramCount();
	this.getOvalList();
	this.getLineList();
	this.getScenarioList();
	this.getInteractionList();
	this.getRectAndPhenomenonList();
	this.getDiagramList();
	var that = this;
	if(!this.cookieService.check('step')){
		this.cookieService.set('step','1');
	}
	this.step = +this.cookieService.get('step');
	that.interval = setInterval(function(){
		clearInterval(that.interval);
		that.initPaper();
	},1500);
  }

  selectedXMLFileOnChanged(event:any) {
    this.uploadXMLFile();
  }

  uploadXMLFile(){
    this.uploader.queue[0].onSuccess = function (response, status, headers) {
      if (status == 200) {
        
      } else {
        alert('Failure');
      }
    };
    for(let i = 0;i < this.uploader.queue.length;i++) this.uploader.queue[i].upload();
    var that = this;
    setTimeout(function(){
      location.reload(true);
	},1000);
  }

  selectedOWLFileOnChanged(event:any) {
    this.uploadXMLFile();
  }

  uploadOWLFile(){
    this.uploader.queue[0].onSuccess = function (response, status, headers) {
      if (status == 200) {
        
      } else {
        alert('Failure');
      }
    };
    for(let i = 0;i < this.uploader.queue.length;i++) this.uploader.queue[i].upload();
    var that = this;
    setTimeout(function(){
      location.reload(true);
	},1000);
  }

	change_Menu(index){//index from 1 to diagramCount * 2
		if(index <= this.diagramCount)this.showClockDiagram(index - 1);
		else{
			this.showTimingDiagram(index - 1);
		} 
		this.currentDiagram = index - 1;
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
			this.router.navigate(['/addConstraint',index]);	
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
		this.paper.on('element:pointerdblclick', function(elementView) {//pointerdblclick : double click
			var currentElement = elementView.model;//currentElement:the element which you double click on
			let index : number = that.currentDiagram;
			let domainText : string = currentElement.attr().label.text;
			let colour : string = that.rectColourMap.get(domainText);
			let indexAndDomainTextAndColour : string = index + ',' + domainText + ',' + colour;
			that.router.navigate(['/detail',indexAndDomainTextAndColour]);
		});
		this.paper.on('blank:mousewheel', (event,x ,y ,delta) => {
			let scale = that.paper.scale();
			that.paper.scale(scale.sx + (delta * 0.01), scale.sy + (delta * 0.01));
		});
	}

	getDiagramCount() : void{
		this.service.getDiagramCount().subscribe(data=>{
			this.diagramCount = data;
		});	
	  }

	getRectAndPhenomenonList() : void{
		this.service.getDiagramCount().subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getRects(i).subscribe(data => {
					this.rects[i] = data;
					for(let j = 0;j < this.rects[i].length;j++){
						if(this.rects[i][j].state === 0){
							if(this.rectColourMap.get(this.rects[i][j].text) === undefined){
								let colour : string = this.colours.shift();
								//console.log(colour);
								this.rectColourMap.set(this.rects[i][j].text,colour);
								this.colours.push(colour);
							}	
						}						
					}
				});
			}
			for(let i = 0;i < diagramCount;i++){
				this.service.getPhenomenonList(i).subscribe(data => {
					this.phenomena[i] = data;
					for(let j = 0;j < this.phenomena[i].length;j++){
						let tempPhenomenon : Phenomenon = this.phenomena[i][j];
						let from : Rect = tempPhenomenon.from;
						let to : Rect = tempPhenomenon.to;
						if(from.state === 0){
							this.numberColourMap.set(tempPhenomenon.biaohao, this.rectColourMap.get(from.text));
						}
						else if(to.state === 0){
							this.numberColourMap.set(tempPhenomenon.biaohao, this.rectColourMap.get(to.text));
						}
					}
				})
			}
		});	
	}

	getOvalList() : void{
		this.service.getDiagramCount().subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getOvals(i).subscribe(data => {
					this.ovals[i] = data;
				})
			}
		});	
	}

	getLineList() : void{
		this.service.getDiagramCount().subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getLines(i).subscribe(data => {
					this.lines[i] = data;
				})
			}
		});	
	}

	getScenarioList() : void{
		this.service.getDiagramCount().subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getScenarios(i).subscribe(data => {
					this.scenarios[i] = data;
				})
			}
		});	
	}

	getInteractionList() : void{
		this.service.getDiagramCount().subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getInteractions(i).subscribe(data => {
					this.interactions[i] = data;
				})
			}
		});	
	}

	getDiagramList() : void{
		this.service.getDiagrams().subscribe(dia=>{
			this.diagrams = dia;
			this.service.getDiagramCount().subscribe(diagramCount=>{
				for(let i = 0;i < diagramCount;i++){
					this.diagrams[i].title = 'SCD' + (i + 1);
					this.diagrams[i + diagramCount].title = 'TD' + (i + 1);
					this.service.getRects(i).subscribe(data => {
						this.rects[i] = data;
						for(let j = 0;j < this.rects[i].length;j++){
							if(this.rects[i][j].state === 0){
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
		this.service.getAllPhenomenonList().subscribe(data => {
			this.allPhenomena = data;
		})
	}

	getAllReferences() : void{
		this.service.getAllReferenceList().subscribe(data => {
			this.references = data;
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
				attrs: { body: { fill: 'none',strokeWidth:1 }, label: { text: this.ovals[index][i].text, fill: '#000000' }}
			});
			ovalGraphList[i] = oval;
		}
		for(let i = 0;i < this.lines[index].length;i++){
			let line = this.lines[index][i];
			if(line.state === 0){
				//let rectFrom : Rect = line.from as Rect;
				let rectTo : Rect = line.to as Rect;
				//let rectFromIndex = -1;
				let rectToIndex = -1;
				for(let j = 0;j < this.rects[index].length;j++){
					let tempRect : Rect = this.rects[index][j];
					//if(tempRect.text === rectFrom.text) rectFromIndex = j;
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
		for(let i = 0;i < this.rects[tempIndex].length;i++){
			let tempRect : Rect = this.rects[tempIndex][i];
			if(tempRect.state === 0){
				let text = new joint.shapes.standard.TextBlock({
					position:{x:0,y:i * 25 - 25},
					size:{width:40, height:20},
					attrs:{body:{stroke : 'transparent', fill : 'transparent'}, label:{text: tempRect.shortName + ":"}}
				})
				//text.attr('label/text', tempRect.shortName);
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
			let ellipse = new joint.shapes.basic.Ellipse({
				position: {x: this.interactions[tempIndex][i].x1,y : this.interactions[tempIndex][i].y1},
				size: {width: this.interactions[tempIndex][i].x2,height: this.interactions[tempIndex][i].y2},
				attrs: { ellipse: { fill: this.numberColourMap.get(this.interactions[tempIndex][i].number) }, text: { text: 'int' + this.interactions[tempIndex][i].number, fill: 'white' }},
			})
			ellipseGraphList[i] = ellipse;
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
		let constraints : string[] = this.cookieService.get('constraints').split('/');
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

	getConstraints() : void{
		this.service.getOWLConstrainList().subscribe(data=>{
			this.constraints = data;
			if(this.cookieService.get('constraints').length !== 0){
				//3:20,0 StrictPre 21,0/4:
				let constraints : string[] = this.cookieService.get('constraints').split('/');
				for(let i = 0;i < constraints.length - 1;i++){
					let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
					let from : string = 'int' + constraint[0].substring(0,constraint[0].indexOf(','));
					let cons : string = constraint[1];
					let to : string = 'int' + constraint[2].substring(0,constraint[2].indexOf(','));
					this.constraints.push(from + ' ' + cons + ' ' + to);
				}
			}	
		});	
	  }

	  deleteConstraint(index : number) : void{
		let newCookie : string = "";
		let parent = document.getElementById('OtherConstraint');
		let child = document.getElementById('consAndBut' + index);
		let selectedCons = document.getElementById('cons' + index).innerText;
		let constraints : string[] = this.cookieService.get('constraints').split('/');
		for(let i = 0;i < constraints.length - 1;i++){
			let constraint : string[] = (constraints[i].substring(1 + constraints[i].indexOf(':'))).split(' ');
			let from : string = 'int' + constraint[0].substring(0,constraint[0].indexOf(','));
			let cons : string = constraint[1];
			let to : string = 'int' + constraint[2].substring(0,constraint[2].indexOf(','));
			//console.log(from + ' ' + cons + ' ' + to);
			if((from + ' ' + cons + ' ' + to) === selectedCons){
				parent.removeChild(child);
			}
			else{
				newCookie = newCookie + constraints[i] + '/';
			}
		}
		//console.log(newCookie);
		//document.cookie = newCookie;
		this.cookieService.set('constraints',newCookie);
		location.reload(true);
	}

	next(){
		if(!this.cookieService.check('step')){
			this.cookieService.set('step','1');
		} 
		else if(+this.cookieService.get('step') > 3){
			return;
		}
		else{
			let step : number = +this.cookieService.get('step');
			this.cookieService.set('step',(step + 1).toString());
		}
		this.step = +this.cookieService.get('step');
	}

	previous(){
		if(!this.cookieService.check('step')){
			return;
		} 
		else if(+this.cookieService.get('step') < 2){
			return;
		}
		else{
			let step : number = +this.cookieService.get('step');
			this.cookieService.set('step',(step + -1).toString());
		}
		this.step = +this.cookieService.get('step');
	}

	nextMainStep(){
		this.cookieService.set('mainStep','ClockCheckFinished');
		location.href="http://localhost:4200/workflow?from=clockcheck";
	}

	saveConstraintsTxt() : void{
		var str = '';
		var ints = new Array<number>();
		for(let i = 0;i < this.diagramCount;i++){
			for(let j = 0;j < this.interactions[i].length;j++){
				if(ints.indexOf(this.interactions[i][j].number) === -1) ints.push(this.interactions[i][j].number);
			}
		}
		for(let i = 0;i < ints.length;i++){
			if(i!==ints.length - 1) str = str + 'int' + ints[i] + ',';
			else str = str + 'int' + ints[i] + ';,';
		} 
		str = str + ',';
		for(let i = 0;i < this.diagramCount;i++){
			for(let j = 0;j < this.scenarios[i].length;j++){
				if(this.scenarios[i][j].state !==2 && this.scenarios[i][j].state !== 4){
					str = str + 'int' + this.scenarios[i][j].from.number + ' StrcitPre ' + 'int' + this.scenarios[i][j].to.number + ';,';
				}
				else if(this.scenarios[i][j].state ===2){
					str = str + 'int' + this.scenarios[i][j].from.number + ' Coincidence ' + this.scenarios[i][j].to.number + ';,';
				}
				else {
					str = str + 'int' + this.scenarios[i][j].to.number + ' StrcitPre ' + 'int' + this.scenarios[i][j].from.number + ';,';
				}
			}
		}
		for(let i = 0;i < this.constraints.length;i++){
			str = str + this.constraints[i] + ';,';
		}
		this.service.exportConstraints(str);
		alert('success');
	}

	downloadConstraints(){
		this.service.downloadConstraints();
	}
}
