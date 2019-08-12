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
declare var $:JQueryStatic;

@Component({
  selector: 'app-drawingboard',
  templateUrl: './drawingboard.component.html',
  styleUrls: ['./drawingboard.component.css']
})
export class DrawingboardComponent implements OnInit {
	diagramCount : number;
	rects : Array<Array<Rect>>;
	lines : Array<Array<Line>>;
	ovals : Array<Array<Oval>>;
	graph : joint.dia.Graph;
	num = 3;
	GetObj(objName){
		if(document.getElementById){
		return eval('document.getElementById("' + objName + '")');
		}
	}
	change_Menu(index){
		for(var i=1;i<=this.num;i++){
		if(this.GetObj("content"+i)&&this.GetObj("lm"+i)){
			this.GetObj("content"+i).style.display = 'none';
		}
	}
		if(this.GetObj("content"+index)&&this.GetObj("lm"+index)){
			this.GetObj("content"+index).style.display = 'block';
		}
	}
	constructor(private service:ServiceService) {
	}

	ngOnInit() {
		this.getDiagramCount();
		this.getRectList();
		this.rects = new Array<Array<Rect>>();
		this.lines = new Array<Array<Line>>();
		this.ovals = new Array<Array<Oval>>();
		var d = $("#content1")
		var wid = $("#content1").width();
		var hei = $("#content1").height();
		this.graph = new joint.dia.Graph;

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
	
	
	getDiagramCount() : any{
		this.service.getDiagramCount().subscribe(data=>{
			this.diagramCount = data;
		});	
	  }

	getRectList() : void{
		this.service.getDiagramCount().subscribe(diagramCount=>{
			for(let i = 0;i < diagramCount;i++){
				this.service.getRects(i).subscribe(data => {
					console.log(data);
					this.rects[i] = data;
				})
			}
		});	
	}

	showRects(index : number) : void{
		for(let i = 0;i < this.rects[index].length;i++){
			let rect = new joint.shapes.basic.Rect({
				position: {x: this.rects[index][i].x1,y : this.rects[index][i].y1},
				size: {width: this.rects[index][i].x2,height: this.rects[index][i].y2},
				attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' }}
			});
			this.graph.addCell(rect);
		}
	}
}