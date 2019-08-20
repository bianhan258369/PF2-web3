import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload'
import { ServiceService} from '../service/service.service'
import { Phenomenon } from '../entity/Phenomenon';
import * as _ from 'lodash';
import * as joint from 'node_modules/jointjs/dist/joint.js';
import { Rect } from '../entity/Rect';
import { Line } from '../entity/Line';
import { Oval } from '../entity/Oval';
import { Tab } from '../entity/Tab';
import { Diagram } from '../entity/Diagram';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Interaction } from '../entity/Interaction';
import { Scenario } from '../entity/Scenario';
import { strictEqual } from 'assert';
import { stringify } from '@angular/core/src/render3/util';
import { Kobiton } from 'protractor/built/driverProviders';
import { type } from 'os';
import { RouterLink, Router } from '@angular/router';


@Component({
  selector: 'app-mainboard',
  templateUrl: './mainboard.component.html',
  styleUrls: ['./mainboard.component.css']
})
export class MainboardComponent implements OnInit {
  interval
	diagramCount : number;
	scDiagrams : Array<Diagram>;
	tDiagrams : Array<Diagram>;
	diagrams : Array<Diagram>;
	rects : Array<Array<Rect>>;
	lines : Array<Array<Line>>;
	ovals : Array<Array<Oval>>;
	interactions : Array<Array<Interaction>>;
	scenarios : Array<Array<Scenario>>;
	phenomena : Array<Array<Phenomenon>>;
	graph : joint.dia.Graph;
	graphs : Array<joint.dia.Graph>;
	paper : joint.dia.Paper;
	papers : Array<joint.dia.Paper>;
	colours : Array<string>;
	rectColourMap : Map<string, string>;//rectName,colour
  numberColourMap : Map<number, string>;//interactionNumber,colour
  uploader:FileUploader = new FileUploader({
    url:"http://localhost:8080/client/upload",
    method:"POST",
    itemAlias:"uploadedFiles"
  });


  constructor(private service:ServiceService, private router : Router) { }

  ngOnInit() {
    this.colours = new Array<string>();
		this.rectColourMap = new Map<string, string>();
		this.numberColourMap = new Map<number, string>();
		this.rects = new Array<Array<Rect>>();
		this.lines = new Array<Array<Line>>();
		this.ovals = new Array<Array<Oval>>();
		this.scenarios = new Array<Array<Scenario>>();
		this.interactions = new Array<Array<Interaction>>();
		this.graphs = new Array<joint.dia.Graph>();
		this.graph = new joint.dia.Graph();
		this.papers = new Array<joint.dia.Paper>();
		this.scDiagrams = new Array<Diagram>();
		this.tDiagrams = new Array<Diagram>();
		this.diagrams = new Array<Diagram>();
		this.phenomena = new Array<Array<Phenomenon>>();
		this.initColours();
		this.getDiagramCount();
		this.getOvalList();
		this.getLineList();
		this.getScenarioList();
		this.getInteractionList();
		this.getRectAndPhenomenonList();
		this.getDiagramList();
		var that = this;
		that.interval = setInterval(function(){
			clearInterval(that.interval);
			that.initPapers();
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

  GetObj(objName){
		if(document.getElementById){
		return eval('document.getElementById("' + objName + '")');
		}
	}

	/*
	change_Menu(index){//index from 1 to diagramCount * 2
		for(var i=1;i<=this.diagramCount * 2;i++){
		if(this.GetObj("content"+i)&&this.GetObj("lm"+i)){
			this.GetObj("content"+i).style.display = 'none';
		}
	}
		if(this.GetObj("content"+index)&&this.GetObj("lm"+index)){
			this.GetObj("content"+index).style.display = 'block';
			if(index <= this.diagramCount)this.showClockDiagrams(index - 1);
			else{
				this.showTimingDiagrams(index - 1);
			} 
		}
	}
	*/
	

	
	change_Menu(index){//index from 1 to diagramCount * 2
		if(index <= this.diagramCount)this.showClockDiagrams(index - 1);
		else{
			this.showTimingDiagram(index - 1);
		} 
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
		for(let i = 0;i < this.graphs.length;i++){
			if(this.GetObj("content"+(i + 1)).style.display === 'block'){
				let index : number = i - this.diagramCount;
				this.router.navigate(['/addConstraint',index]);	
			}
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
	}

	initPapers() : void{
		this.service.getDiagramCount().subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount * 2;i++){
				this.graphs[i] = new joint.dia.Graph();
				let d = $("#content" + (i + 1));
				let wid = d.width();
				let hei =d.height();
				this.papers[i] = new joint.dia.Paper({
					el: $("#content" +  (i + 1)),
					width:wid,
					height:hei,
					model: this.graphs[i],
					gridSize: 10,
					drawGrid: true,
					background: {
							color: 'rgb(240,255,255)'
						}
				});
				var that = this;
				this.papers[i].on('element:pointerdblclick', function(elementView) {//pointerdblclick : double click
					var currentElement = elementView.model;//currentElement:the element which you double click on
					let index : number = i;
					let domainText : string = currentElement.attr().label.text;
					let colour : string = that.rectColourMap.get(domainText);
					let indexAndDomainTextAndColour : string = index + ',' + domainText + ',' + colour;
					that.router.navigate(['/detail',indexAndDomainTextAndColour]);
				});
				this.papers[i].on('blank:mousewheel', (event,x ,y ,delta) => {
					let scale = that.papers[i].scale();
					console.log(scale);
					that.papers[i].scale(scale.sx + (delta * 0.01), scale.sy + (delta * 0.01));
				});
			}
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
								this.rectColourMap.set(this.rects[i][j].text,this.colours[0]);
								this.colours.push(this.colours.shift());
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

	/*
	getPhenomenonList() : void{
		this.service.getDiagramCount().subscribe(diagramCount=>{
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
	*/

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

	//index from 0 to diagramCount - 1
	showClockDiagrams(index : number) : void{
		if(this.graphs[index].getCells().length === 0){
			let rectGraphList = new Array<joint.shapes.basic.Rect>();
			let ovalGraphList = new Array<joint.shapes.basic.Ellipse>();
			for(let i = 0;i < this.rects[index].length;i++){
				let rect = new joint.shapes.standard.Rectangle({
					position: {x: this.rects[index][i].x1,y : this.rects[index][i].y1},
					size: {width: this.rects[index][i].x2+150,height: this.rects[index][i].y2},
					attrs: { body: { fill: 'blue' }, label: { text: this.rects[index][i].text, fill: 'white' }}
				});
				rectGraphList[i] = rect;
			}
			for(let i = 0;i < this.ovals[index].length;i++){
				let oval = new joint.shapes.standard.Ellipse({
					position: {x: this.ovals[index][i].x1,y : this.ovals[index][i].y1},
					size: {width: this.ovals[index][i].x2+150,height: this.ovals[index][i].y2},
					attrs: { body: { fill: 'blue' }, label: { text: this.ovals[index][i].text, fill: 'white' }}
				});
				ovalGraphList[i] = oval;
			}
			for(let i = 0;i < this.lines[index].length;i++){
				let line = this.lines[index][i];
				if(line.state === 0){
					let rectFrom : Rect = line.from as Rect;
					let rectTo : Rect = line.to as Rect;
					let rectFromIndex = -1;
					let rectToIndex = -1;
					for(let j = 0;j < this.rects[index].length;j++){
						let tempRect : Rect = this.rects[index][j];
						if(tempRect.text === rectFrom.text) rectFromIndex = j;
						if(tempRect.text === rectTo.text) rectToIndex = j;
					}
					let link = new joint.shapes.standard.Link({
						source: { id: rectGraphList[rectFromIndex].id },
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
					this.graphs[index].addCells([rectGraphList[rectFromIndex], rectGraphList[rectToIndex],link]);
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
					let link = new joint.dia.Link({
						source: { id: rectGraphList[rectIndex].id },
						target: { id: ovalGraphList[ovalIndex].id },
						attrs:{
							".connection":{
								'stroke-width': '2',
								'stroke-dasharray':'5 5'
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
					this.graphs[index].addCells([rectGraphList[rectIndex],ovalGraphList[ovalIndex],link]);
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
					this.graphs[index].addCells([rectGraphList[rectIndex],ovalGraphList[ovalIndex],link]);
				}
			}
		}
		
	}

	//index from diagramCount to 2 * diagramCount - 1
	showTimingDiagrams(index : number) : void{		
		if(this.graphs[index].getCells().length === 0){
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
					this.graphs[index].addCell(text);
					this.graphs[index].addCell(tag);
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
					this.graphs[index].addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
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
					this.graphs[index].addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
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
					this.graphs[index].addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);		
				}	
			}
			let constraints : string[] = document.cookie.split('/');
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
						this.graphs[index].addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
					}
				}
			}
			//3:20,0 StrictPre 21,0/4:
		}
	}

	showClockDiagram(index : number) : void{
		this.graph.clear();
		let rectGraphList = new Array<joint.shapes.basic.Rect>();
		let ovalGraphList = new Array<joint.shapes.basic.Ellipse>();
		for(let i = 0;i < this.rects[index].length;i++){
			let rect = new joint.shapes.standard.Rectangle({
				position: {x: this.rects[index][i].x1,y : this.rects[index][i].y1},
				size: {width: this.rects[index][i].x2+150,height: this.rects[index][i].y2},
				attrs: { body: { fill: 'blue' }, label: { text: this.rects[index][i].text, fill: 'white' }}
			});
			rectGraphList[i] = rect;
		}
		for(let i = 0;i < this.ovals[index].length;i++){
			let oval = new joint.shapes.standard.Ellipse({
				position: {x: this.ovals[index][i].x1,y : this.ovals[index][i].y1},
				size: {width: this.ovals[index][i].x2+150,height: this.ovals[index][i].y2},
				attrs: { body: { fill: 'blue' }, label: { text: this.ovals[index][i].text, fill: 'white' }}
			});
			ovalGraphList[i] = oval;
		}
		for(let i = 0;i < this.lines[index].length;i++){
			let line = this.lines[index][i];
			if(line.state === 0){
				let rectFrom : Rect = line.from as Rect;
				let rectTo : Rect = line.to as Rect;
				let rectFromIndex = -1;
				let rectToIndex = -1;
				for(let j = 0;j < this.rects[index].length;j++){
					let tempRect : Rect = this.rects[index][j];
					if(tempRect.text === rectFrom.text) rectFromIndex = j;
					if(tempRect.text === rectTo.text) rectToIndex = j;
				}
				let link = new joint.shapes.standard.Link({
					source: { id: rectGraphList[rectFromIndex].id },
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
				this.graph.addCells([rectGraphList[rectFromIndex], rectGraphList[rectToIndex],link]);
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
				let link = new joint.dia.Link({
					source: { id: rectGraphList[rectIndex].id },
					target: { id: ovalGraphList[ovalIndex].id },
					attrs:{
						".connection":{
							'stroke-width': '2',
							'stroke-dasharray':'5 5'
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
		let constraints : string[] = document.cookie.split('/');
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
		//3:20,0 StrictPre 21,0/4:
	}

}
