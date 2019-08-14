import { Component, OnInit, SystemJsNgModuleLoaderConfig } from '@angular/core';
// import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as backbone from 'backbone';
// const joint = require('../../../../node_modules/jointjs/dist/joint.js');
import * as joint from 'node_modules/jointjs/dist/joint.js';
import { ServiceService } from '../service/service.service';
import { Rect } from '../entity/Rect';
import { Line } from '../entity/Line';
import { Oval } from '../entity/Oval';
import { Tab } from '../entity/Tab';
import { Diagram } from '../entity/Diagram';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Interaction } from '../entity/Interaction';
import { Scenario } from '../entity/Scenario';
import { Phenomenon } from '../entity/Phenomenon';
import { strictEqual } from 'assert';
import { stringify } from '@angular/core/src/render3/util';
import { Kobiton } from 'protractor/built/driverProviders';
import { type } from 'os';
import { RouterLink, Router } from '@angular/router';
declare var $:JQueryStatic;

@Component({
  selector: 'app-drawingboard',
  templateUrl: './drawingboard.component.html',
  styleUrls: ['./drawingboard.component.css']
})
export class DrawingboardComponent implements OnInit {
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
	graphs : Array<joint.dia.Graph>;
	papers : Array<joint.dia.Paper>;
	colours : Array<string>;
	rectColourMap : Map<string, string>;//rectName,colour
	numberColourMap : Map<number, string>;//interactionNumber,colour

	constructor(private service:ServiceService, private router : Router) {
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
		this.graphs = new Array<joint.dia.Graph>();
		this.papers = new Array<joint.dia.Paper>();
		this.scDiagrams = new Array<Diagram>();
		this.tDiagrams = new Array<Diagram>();
		this.diagrams = new Array<Diagram>();
		this.phenomena = new Array<Array<Phenomenon>>();
		this.initColours();
		this.getDiagramCount();
		this.getRectList();
		this.getOvalList();
		this.getLineList();
		this.getScenarioList();
		this.getInteractionList();
		this.getPhenomenonList();
		this.getDiagramList();
		
		var that = this;
		that.interval = setInterval(function(){
			clearInterval(that.interval);
			that.initPapers();
		},300);
		
	}

	GetObj(objName){
		if(document.getElementById){
		return eval('document.getElementById("' + objName + '")');
		}
	}

	change_Menu(index){//index from 1 to diagramCount * 2
		for(var i=1;i<=this.diagramCount * 2;i++){
		if(this.GetObj("content"+i)&&this.GetObj("lm"+i)){
			this.GetObj("content"+i).style.display = 'none';
		}
	}
		if(this.GetObj("content"+index)&&this.GetObj("lm"+index)){
			this.GetObj("content"+index).style.display = 'block';
			if(index <= this.diagramCount)this.showClockDiagrams(index - 1);
			else this.showTimingDiagrams(index - 1);
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
			}
		});		
	}
	
	getDiagramCount() : void{
		this.service.getDiagramCount().subscribe(data=>{
			this.diagramCount = data;
		});	
	  }

	getRectList() : void{
		this.service.getDiagramCount().subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getRects(i).subscribe(data => {
					this.rects[i] = data;
					for(let j = 0;j < this.rects[i].length;j++){
						if(this.rects[i][j].state === 0){
							this.rectColourMap.set(this.rects[i][j].text,this.colours[0]);
							this.colours.shift();
						}						
					}
				});
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
					
					this.graphs[index].addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
				}
				else if(scenario.state ===2){
					let link = new joint.dia.Link();
					link.source(ellipseGraphList[interactionFromIndex]);
					link.target(ellipseGraphList[interactionToIndex]);	
					this.graphs[index].addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
				}
				else{
					let link = new joint.shapes.standard.Link();
					link.source(ellipseGraphList[interactionFromIndex]);
					link.target(ellipseGraphList[interactionToIndex]);	
					this.graphs[index].addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);		
				}	
			}
		}
	}		
}