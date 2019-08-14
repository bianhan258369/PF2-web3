import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Scenario } from '../entity/Scenario';
import { Interaction } from '../entity/Interaction';
import { ActivatedRoute } from '@angular/router';
import * as joint from 'node_modules/jointjs/dist/joint.js';


@Component({
  selector: 'app-clockdiagram-detail',
  templateUrl: './clockdiagram-detail.component.html',
  styleUrls: ['./clockdiagram-detail.component.css']
})
export class ClockdiagramDetailComponent implements OnInit {
  interval;
  scenarioDiagram : Array<Object>;
  paper : joint.dia.Paper;
  graph : joint.dia.Graph;
  colour : string;

  constructor(private service : ServiceService, private route: ActivatedRoute) {
   }

  ngOnInit() {
    this.scenarioDiagram = new Array<Object>();
    this.getScenarioDiagramByDomain();
    var that = this;
    that.interval = setInterval(function(){
      clearInterval(that.interval);
      that.initPaper();
      that.showDiagram();
    },300);

  }

  initPaper(){
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
  }

  getScenarioDiagramByDomain() : void{
    let indexAndDomainTextAndColour : string = this.route.snapshot.paramMap.get('indexAndDomainTextAndColour');
    let splitted = indexAndDomainTextAndColour.split(',');
    let index : number = +splitted[0];
    let domainText : string = splitted[1];
    this.colour = splitted[2];
    domainText = domainText.replace("&","%26");
    this.service.getScenarioDiagramByDomainText(index, domainText).subscribe(data=>{
      this.scenarioDiagram = data;
    });
  }

  showDiagram() : void{
    if(this.graph.getCells().length === 0){
      let interactions : Array<Interaction> = new Array<Interaction>();
      let scenarios : Array<Scenario> = new Array<Scenario>();
      for(let i = 0 ;i < this.scenarioDiagram.length;i++){
        if(this.scenarioDiagram[i].hasOwnProperty('number')){
          let interaction : Interaction = this.scenarioDiagram[i] as Interaction;
          interactions.push(interaction); 
        }
        else{
          let scenario : Scenario = this.scenarioDiagram[i] as Scenario;
          scenarios.push(scenario);
        }
      }
      if(interactions.length === 1){
        let interaction : Interaction = interactions[0];
        let ellipse = new joint.shapes.basic.Ellipse({
          position: {x: interaction.x1,y : interaction.y1},
          size: {width: interaction.x2,height: interaction.y2},
          attrs: { ellipse: { fill: this.colour }, text: { text: 'int' + interaction.number, fill: 'white' }},
        })
        ellipse.addTo(this.graph);
      }
      else{
        let ellipseGraphList = new Array<joint.shapes.basic.Ellipse>();
        for(let i = 0;i < interactions.length;i++){
          let ellipse = new joint.shapes.basic.Ellipse({
            position: {x: interactions[i].x1,y : interactions[i].y1},
            size: {width: interactions[i].x2,height: interactions[i].y2},
            attrs: { ellipse: { fill: this.colour }, text: { text: 'int' + interactions[i].number, fill: 'white' }},
          })
          ellipseGraphList[i] = ellipse;
        }
        for(let i = 0;i < scenarios.length;i++){
          let scenario : Scenario = scenarios[i];
          let interactionFrom : Interaction = scenario.from;
          let interactionTo : Interaction = scenario.to;
          let interactionFromIndex = -1;
          let interactionToIndex = -1;
          for(let j = 0;j < interactions.length;j++){
            let tempInteraction : Interaction = interactions[j];
            if(tempInteraction.number === interactionFrom.number && tempInteraction.state === interactionFrom.state) interactionFromIndex = j;
            if(tempInteraction.number === interactionTo.number && tempInteraction.state === interactionTo.state) interactionToIndex = j;
          }
  
          if(scenario.state === 4){
            let link = new joint.shapes.standard.Link();
            link.source(ellipseGraphList[interactionToIndex]);
            link.target(ellipseGraphList[interactionFromIndex]);
            
            this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
          }
          else if(scenario.state ===2){
            let link = new joint.dia.Link();
            link.source(ellipseGraphList[interactionFromIndex]);
            link.target(ellipseGraphList[interactionToIndex]);	
            this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
          }
          else{
            let link = new joint.shapes.standard.Link();
            link.source(ellipseGraphList[interactionFromIndex]);
            link.target(ellipseGraphList[interactionToIndex]);	
            this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);		
          }	
        }
      }
    }
  }
}
