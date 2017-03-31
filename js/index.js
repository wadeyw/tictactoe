var success=[[0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2] ];  //winner mode
  

function checkSuccess(xpath,opath){
  var succ=0;
  for(var i=0;i<success.length;i++){   //loop to check if any path have pattern match success pattern
    for(var j=0;j<success[i].length;j++){
      if(xpath.indexOf(success[i][j])==-1) {  //X win if any success pattern can match
        succ=1;       
      }
    }
    if(succ!=1) {console.log("X WIN"); return -10;}
    for(var k=0;k<success[i].length;k++){
      if(opath.indexOf(success[i][k])==-1) succ=2;
    }
    if(succ!=2) {console.log("O WIN");  return 10;}
  }
  return 0;
}


function minimax(leftMove,opath,xpath,turn){
  var score=[];
  
 console.log("leftmoves: "+leftMove+"; Turn: "+turn);
 console.log("opath: "+opath+ ";xpath: "+xpath);
  
  var point=checkSuccess(xpath,opath);
  if(point!==0) return point;    //if any side win , return point for that move directly
  if(leftMove.length===0) return 0; //even
  
  if(turn=="min"){  // is my turn(opath), the next step let player get less point,
    for(var i=0;i<leftMove.length;i++){
      //var xleftMoves=leftMove.filter(function(value){return value !=leftMove[i];});
      var xleftMoves=leftMove.slice();
      xleftMoves.splice(xleftMoves.indexOf(leftMove[i]),1);
      
      var xxpath=xpath.slice();
      xxpath.push(leftMove[i]);
      score.push(minimax(xleftMoves,opath,xxpath,'max'));
      if(score[score.length-1]==-10) return -10;
    }
    return score.sort(function(a,b){return a-b;})[0];//score.min;
  }
  else{   //is player turn, the next step I need to get max point
    for(var j=0;j<leftMove.length;j++){
      var oleftMoves=leftMove.slice();
      oleftMoves.splice(oleftMoves.indexOf(leftMove[j]),1);
      var oopath=opath.slice();
       oopath.push(leftMove[j]);
      score.push(minimax(oleftMoves,oopath,xpath,'min'));
      if(score[score.length-1]==10) return 10;
    }
    return score.sort(function(a,b){return b-a;})[0];  //score.max;
  }
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
  
//minimax algorithm http://neverstopbuilding.com/minimax
$(document).ready(function(){
 
  var xpath=[];    //X put
  var opath=[];    //O put
  var turnFlag=1;   //1: ppl turn; 0: AI turn
  var buttonDraw;  //after choose  X/O, draw the particular pattern
  var canvasWidth=250;
  var canvasHeigh=250;
  
  var positions=[];   //store the exact location to draw patterns
  

  
  var leftPosition=[0,1,2,3,4,5,6,7,8];

  var canvas = document.getElementById("canvas");
  canvas.width=canvasWidth;
  canvas.height=canvasHeigh;
  var ctx = canvas.getContext("2d");
  
  console.log("canvas offset top:"+canvas.offsetTop+" offsetLeft:"+canvas.offsetLeft);
  //console.log("checksuccess opath:"+checkSuccess(success,[3,5,7],[1,3,6]));
  //console.log("checksuccess opath:"+checkSuccess(success,[3,5,7],[2,2,3]));
  canvasIniial(ctx,canvasWidth,canvasHeigh);
  var offsetTop=canvas.offsetTop;
var offsetLeft=canvas.offsetLeft;

    for(var i=0;i<9;i++){  //push each block location
    positions.push({
      topX:i%3*(canvasWidth/3)+offsetLeft,
      topY:Math.floor(i/3)*(canvasHeigh/3)+offsetTop,
      middleY:Math.floor(i/3)*(canvasHeigh/3)+offsetTop+canvasHeigh/6,
      middleX:i%3*(canvasWidth/3)+offsetLeft+canvasWidth/6,
      locations:i
    });
  }  

  positions.forEach(function(val){
  console.log("positions: "+val.locations+"; middleX: "+val.middleX+" middleY:"+val.middleY+"; topX:"+val.topX+" topY:"+val.topY );
});

  $("#choose-buttonX").on("click",function(){
    buttonDraw=document.getElementById("choose-buttonX").value;
   console.log(buttonDraw);
   if(turnFlag===0)  
    drawPiece(ctx,0,0,leftPosition[getRandomInt(0,leftPosition.length)]);
  });

  $("#choose-buttonO").on("click",function(){
    buttonDraw=document.getElementById("choose-buttonO").value;
   console.log(buttonDraw);
   if(turnFlag===0)  
    drawPiece(ctx,0,0,leftPosition[getRandomInt(0,leftPosition.length)]);
  });
  

  $("#canvas").on("click",function(event){
    var AIScore=[];
    
    drawPiece(ctx,event.pageX,event.pageY,0);
    console.log("X DRAWED, O TURN");
    if(opath.length===0) drawPiece(ctx,0,0,leftPosition[getRandomInt(0,leftPosition.length)]);
    else {
      for(var i=0;i<leftPosition.length;i++)
      {  //loop for each left position to calcualte score of each step
        console.log("leftPosition:"+leftPosition+" opath:"+opath+" xpath:"+xpath);
        var leftPos=leftPosition.slice();
        var oopath=opath.slice();
        oopath.push(leftPosition[i]);
        leftPos.splice(leftPos.indexOf(leftPosition[i]),1);    
        AIScore.push(minimax(leftPos,oopath,xpath,"min"));
        //if(AIScore[AIScore.length-1]==10) break;
      }
    console.log("AIScore:"+AIScore);
    var max = AIScore.reduce(function(a, b) {   //get max score 
        return Math.max(a, b);
    });
    
    console.log("best score pos:"+leftPosition[AIScore.indexOf(max)]);
    drawPiece(ctx,0,0,leftPosition[AIScore.indexOf(max)]);

    }
  });
  
  $( "#canvas" ).on( "mousemove", function( event ) {
    $( "#log" ).text( "pageX: " + event.pageX + ", pageY: " + event.pageY );
  });
  
function canvasIniial(context,canvasWidth,canvasHeigh){
  context.clearRect(0, 0, canvasWidth, canvasHeigh);

  
  xpath=[];    //X put
  opath=[];    //O put
  turnFlag=getRandomInt(0,2);   //1: Player1 turn; 0: AI turn
  
  console.log("Turn Flag:"+turnFlag);
  
  //draw the line
  context.moveTo(8,canvasHeigh/3);
  context.lineTo(canvasWidth-8,canvasHeigh/3);
  //context.stroke();

  context.moveTo(8,canvasHeigh/3*2);
  context.lineTo(canvasWidth-8,canvasHeigh/3*2);
  //context.stroke();

  context.moveTo(canvasWidth/3,8);
  context.lineTo(canvasWidth/3,canvasHeigh-8);
  //context.stroke();

  context.moveTo(canvasWidth/3*2,8);
  context.lineTo(canvasWidth/3*2,canvasHeigh-8);
  context.stroke();

}
  

  
  
function drawPiece(context, mouseX,mouseY,loc){
  var x=0;
  var y=0;
  var location=0;
  console.log("mouseX: "+mouseX+" mouseY:"+mouseY);
  
  if(mouseX>0 & mouseY>0) {
    for(var i=0;i<positions.length;i++){
      if(mouseX>positions[i].topX & mouseX<positions[i].topX+canvasWidth/3 & 
      mouseY>positions[i].topY & mouseY<positions[i].topY+canvasHeigh/3){
        location=positions[i].locations;
        x=positions[i].middleX-20;
        y=positions[i].middleY-30;
      }
    }
  } else {  //For AI move
    location=loc;
    x=positions[loc].middleX-20;
    y=positions[loc].middleY-30;
  }
  
  console.log(x+';'+y);
  
  leftPosition.splice(leftPosition.indexOf(location),1); //remove exist postion from left Position
  
  context.font="50px Arial";
  console.log("location"+location);
  if(xpath.indexOf(location)==-1 & opath.indexOf(location)==-1) {
    if(turnFlag==1) {   //change the turn to draw X or O
      context.strokeText(buttonDraw,x,y);
      turnFlag=0;
      xpath.push(location);
    }
    else if(turnFlag===0){
      if(buttonDraw=='X')
        context.strokeText("O",x,y);
      else
        context.strokeText("X",x,y);
      turnFlag=1;
      opath.push(location);
    }
  }
  
  console.log("check success;opath: "+opath+" xpath:"+xpath);
  var succStatus=checkSuccess(xpath,opath);

  showResult(leftPosition,succStatus);
  //if(succStatus==10 || succStatus==2 || (xpath.length+opath.length>=9)) canvasIniial(ctx,canvasWidth,canvasHeigh);
}
  
  function showResult(lefts,succstatus){
  if(lefts.length===0) $( "#result" ).text("Its a Draw");
  else if(succstatus==-10) $( "#result" ).text("X Win");
  else if(succstatus==10) $( "#result" ).text("O Win");
  else if(turnFlag==1) $( "#result" ).text("Player1 turn");
  else if(turnFlag===0) $( "#result" ).text("AI turn");
}
});
