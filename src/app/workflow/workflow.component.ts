import { Component, OnInit } from '@angular/core';
import * as joint from 'node_modules/jointjs/dist/joint.js';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {

  paper : joint.dia.Paper;
  graph : joint.dia.Graph;
  lastURL : string;
  mainStep : number;

  constructor(private service : ServiceService) {
    service.stepEmmited$.subscribe(mainStep => {
		  this.mainStep = mainStep;
	  });
   }

  ngOnInit() {
    console.log(document.referrer);
    this.initPaper();
  }

  initPaper() : void{
		this.graph = new joint.dia.Graph();
		let d = $("#content");
		let wid = d.width();
    let hei =d.height();
		this.paper = new joint.dia.Paper({
			el: $("#content"),
			width:wid,
			height:hei,
			model: this.graph,
			gridSize: 10,
			drawGrid: true,
			background: {
					color: 'rgb(240,255,255)'
				}
    });
    let ellipse = new joint.shapes.standard.Ellipse({
      position: {x: 625, y: 25},
			size: {width: 50,height: 50},
			attrs: { body: { fill: 'none',strokeWidth:1 }, label: { text: 'Start', fill: '#000000' }}
    });
    let polygon = new joint.shapes.standard.Polygon({
      position: {x: 600,y : 125},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1,refPoints: '0,10 10,0 20,10 10,20' }}
    });
    let rect1 = new joint.shapes.standard.Rectangle({
      position: {x: 400,y : 250},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Text Description', fill: '#000000' }}
    });
    let rect2 = new joint.shapes.standard.Rectangle({
      position: {x: 800,y : 250},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Diagram Description', fill: '#000000' }}
    });
    let rect3 = new joint.shapes.standard.Rectangle({
      position: {x: 700,y : 375},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Progression', fill: '#000000' }}
    });
    let rect4 = new joint.shapes.standard.Rectangle({
      position: {x: 900,y : 375},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Projection', fill: '#000000' }}
    });
    let rect5 = new joint.shapes.standard.Rectangle({
      position: {x: 900,y : 500},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Clock Check', fill: '#000000' }}
    });
    let link1 = new joint.shapes.standard.Link({
      source: { id: ellipse.id },
      target: { id: polygon.id },
      });
      link1.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link2 = new joint.shapes.standard.Link({
        source: { id: polygon.id },
        target: { id: rect1.id },
        });
      link2.attr({
        line: {
          strokeWidth: 1,
        }
      });
      let link3 = new joint.shapes.standard.Link({
        source: { id: polygon.id },
        target: { id: rect2.id },
        });
      link2.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link4 = new joint.shapes.standard.Link({
        source: { id: rect2.id },
        target: { id: rect3.id },
        });
      link3.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link5 = new joint.shapes.standard.Link({
        source: { id: rect2.id },
        target: { id: rect4.id },
        });
      link4.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link6 = new joint.shapes.standard.Link({
        source: { id: rect4.id },
        target: { id: rect5.id },
        });
      link5.attr({
        line: {
          strokeWidth: 1,
        },
      });
    ellipse.addTo(this.graph);
    polygon.addTo(this.graph);
    rect1.addTo(this.graph);
    rect2.addTo(this.graph);
    rect3.addTo(this.graph);
    rect4.addTo(this.graph);
    rect5.addTo(this.graph);
    link1.addTo(this.graph);
    link2.addTo(this.graph);
    link3.addTo(this.graph);
    link4.addTo(this.graph);
    link5.addTo(this.graph);
    link6.addTo(this.graph);
		var that = this;
		this.paper.on('blank:mousewheel', (event,x ,y ,delta) => {
			let scale = that.paper.scale();
			that.paper.scale(scale.sx + (delta * 0.01), scale.sy + (delta * 0.01));
		});
  }
  
  nextMainStep(){
    if(isNaN(this.mainStep)){
			this.service.mainStepChange(1);
		} 
		else{
			this.service.mainStepChange(this.mainStep + 1);
		}
  }

}
