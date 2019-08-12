import { Component, OnInit } from '@angular/core';
// import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as backbone from 'backbone';
// const joint = require('../../../../node_modules/jointjs/dist/joint.js');
import * as joint from 'node_modules/jointjs/dist/joint.js';
import { ServiceService } from '../service/service.service';
import { Rect } from '../class/Rect';
import { Line } from '../class/Line';
import { Oval } from '../class/Oval';
import { Tab } from '../class/Tab';
declare var $:JQueryStatic;

@Component({
  selector: 'app-drawingboard',
  templateUrl: './drawingboard.component.html',
  styleUrls: ['./drawingboard.component.css']
})
export class DrawingboardComponent implements OnInit {
	diagramCount : number;
	tabs : Array<Tab>;
	rects : Array<Array<Rect>>;
	lines : Array<Array<Line>>;
	ovals : Array<Array<Oval>>;
	graphs : Array<joint.dia.Graph>;
	papers : Array<joint.dia.Paper>;
	GetObj(objName){
		if(document.getElementById){
		return eval('document.getElementById("' + objName + '")');
		}
	}
	change_Menu(index){
		for(var i=1;i<=this.diagramCount;i++){
		if(this.GetObj("content"+i)&&this.GetObj("lm"+i)){
			this.GetObj("content"+i).style.display = 'none';
		}
	}
		if(this.GetObj("content"+index)&&this.GetObj("lm"+index)){
			this.showGraph(index - 1);
			this.GetObj("content"+index).style.display = 'block';
		}
	}
	constructor(private service:ServiceService) {
	}

	initPapers() : void{
		this.service.getDiagramCount().subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.graphs[i] = new joint.dia.Graph;
				let d = $("#content" + (i + 1));
				let wid = d.width();
				let hei =d.height();
				console.log(wid);
				console.log(hei);
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
			}
		});		
	}

	ngOnInit() {
		this.getDiagramCount();
		this.tabs = new Array<Tab>();
		this.rects = new Array<Array<Rect>>();
		this.lines = new Array<Array<Line>>();
		this.ovals = new Array<Array<Oval>>();
		this.graphs = new Array<joint.dia.Graph>();
		this.papers = new Array<joint.dia.Paper>();
		this.getRectList();
		this.getLineList();
		this.initPapers();
		/*
		var d = $("#content1");
		var wid = $("#content1").width();
		var hei = $("#content1").height();
		*/

		/*
		let paper = new joint.dia.Paper({
		el: $("#content1"),
		// width: 1396,
		// height: 809,
		width:wid,
		height:hei,
		model: this.graph,
		gridSize: 10,
		// color: 'rgba(0, 255, 0, 0.3)',
		drawGrid: true,
		background: {
                color: 'rgb(240,255,255)'
            }
		});
		*/

		/*
		let rect = new joint.shapes.basic.Rect({
		position: { x: 100, y: 30 },
		size: { width: 100, height: 30 },
		attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } }
		});

		let rect2 = rect.clone() as joint.shapes.basic.Rect;
		rect2.translate(300);

		var link = new joint.dia.Link({
		source: { id: rect.id },
		target: { id: rect2.id }
		});
		*/
		//graph.addCells([rect, rect2,link]);
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

	/*
	initTabs(){
		this.service.getDiagramCount().subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.tabs[i].index = i;
				this.tabs[i].id = "lm" + i;
				this.tabs[i].name = "SCD" + i;
			}
		});	
	}
	*/

	showGraph(index : number) : void{
		this.graphs[index].clear();
		let rectGraphList = new Array<joint.shapes.basic.Rect>();
		for(let i = 0;i < this.rects[index].length;i++){
			let rect = new joint.shapes.basic.Rect({
				position: {x: this.rects[index][i].x1,y : this.rects[index][i].y1},
				size: {width: this.rects[index][i].x2,height: this.rects[index][i].y2},
				attrs: { rect: { fill: 'blue' }, text: { text: this.rects[index][i].text, fill: 'white' }}
			});
			rectGraphList[i] = rect;
		}
		for(let i = 0;i < this.lines[index].length;i++){
			let line = this.lines[index][i];
			if(line.from.shape === 0 && line.to.shape === 0){
				let rect1 : Rect = line.from as Rect;
				let rect2 : Rect = line.to as Rect;
				let rect1Index = -1;
				let rect2Index = -1;
				for(let j = 0;j < this.rects[index].length;j++){
					let tempRect : Rect = this.rects[index][j];
					if(tempRect.text === rect1.text) rect1Index = j;
					if(tempRect.text === rect2.text) rect2Index = j;
				}
				let link = new joint.dia.Link({
					source: { id: rectGraphList[rect1Index].id },
					target: { id: rectGraphList[rect2Index].id }
					});
				this.graphs[index].addCells([rectGraphList[rect1Index], rectGraphList[rect2Index],link]);
			}
		}
	}
		
}