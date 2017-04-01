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
   console.log("check success;opath: "+opath+" xpath:"+xpath);
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
  var pointA=0;   //user point
  var pointAI=0;  //AI point
  var positions=[];   //store the exact location to draw patterns

  var leftPosition=[];

  var canvas = document.getElementById("canvas");
  canvas.width=canvasWidth;
  canvas.height=canvasHeigh;
  var ctx = canvas.getContext("2d");
  
  console.log("canvas offset top:"+canvas.offsetTop+" offsetLeft:"+canvas.offsetLeft);
  
  canvasIniial(ctx,canvasWidth,canvasHeigh);
  var offsetTop=canvas.offsetTop;
  var offsetLeft=canvas.offsetLeft;

  for(var i=0;i<9;i++){  //push each block location
    positions.push({
      topX:i%3*(canvasWidth/3)+offsetLeft,
      topY:Math.floor(i/3)*(canvasHeigh/3)+offsetTop,
      middleY:Math.floor(i/3)*(canvasHeigh/3)+canvasHeigh/6,  //when draw pattern no need to add offset
      middleX:i%3*(canvasWidth/3)+canvasWidth/6,
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
      drawPiece(ctx,leftPosition[getRandomInt(0,leftPosition.length)]);
  });

  $("#choose-buttonO").on("click",function(){
    buttonDraw=document.getElementById("choose-buttonO").value;
   console.log(buttonDraw);
   if(turnFlag===0)  
    drawPiece(ctx,leftPosition[getRandomInt(0,leftPosition.length)]);
  });
  

  $("#canvas").on("click",function(event){
    var AIScore=[];
    
    var mouseX=event.pageX;
    var mouseY=event.pageY;
    var location=-1;
    console.log("mouseX: "+mouseX+" mouseY:"+mouseY);
    if(mouseX>0 & mouseY>0) {
      for(var loc=0;loc<positions.length;loc++){
        if(mouseX>positions[loc].topX & mouseX<positions[loc].topX+canvasWidth/3 & 
        mouseY>positions[loc].topY & mouseY<positions[loc].topY+canvasHeigh/3)
          location=positions[loc].locations;  //get location of clicked point
      }
    } 
    
    if(xpath.indexOf(location)==-1 & opath.indexOf(location)==-1){  //if location not filled yet, then draw the pattern
      drawPiece(ctx,location);
      
      console.log("X DRAWED, O TURN");
      if(checkResult()){
        if(opath.length===0) drawPiece(ctx,leftPosition[getRandomInt(0,leftPosition.length)]);
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
        drawPiece(ctx,leftPosition[AIScore.indexOf(max)]);
        checkResult();
        }
      }
    }//if clicked location not filled yet
  });
  
  $( "#canvas" ).on( "mousemove", function( event ) {
    $( "#log" ).text( "pageX: " + event.pageX + ", pageY: " + event.pageY );
  });
  
  function canvasIniial(context,canvasWidth,canvasHeigh){
    context.clearRect(0, 0, canvasWidth, canvasHeigh);
    
    xpath=[];    //X put
    opath=[];    //O put
    turnFlag=getRandomInt(0,2);   //1: Player1 turn; 0: AI turn
    leftPosition=[0,1,2,3,4,5,6,7,8];
    
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
    
    console.log("buttonDraw after init:"+buttonDraw);
    
    if(buttonDraw!==undefined & turnFlag===0)
      drawPiece(ctx,4);
      
    $( "#pointA" ).text(pointA);
    $( "#pointAI" ).text(pointAI);
  }

  function drawPiece(context,loc){
    var x=0;
    var y=0;
    var location=loc;

    x=positions[loc].middleX-20;
    y=positions[loc].middleY+20;
    
    console.log('Draw location:'+x+';'+y);
    
    context.font="50px Arial";
    console.log("location"+location);
    
    leftPosition.splice(leftPosition.indexOf(location),1); //remove exist postion from left Position
   
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
  
  function checkResult(){
    var succStatus=checkSuccess(xpath,opath);
    var returnFlag=1;
   console.log("checkresult flag:"+turnFlag+" succStatus:"+succStatus+" leftPos"+leftPosition+" returnflag:"+returnFlag);
    
   if(leftPosition.length===0) {
      $( "#result" ).text("Its a Draw");
      canvasIniial(ctx,canvasWidth,canvasHeigh);
      returnFlag=0;
    }
     if(succStatus==-10) {
      $( "#result" ).text("You Win");
    pointA++;
      canvasIniial(ctx,canvasWidth,canvasHeigh);
      returnFlag=0;
    }
     if(succStatus==10) {
      $( "#result" ).text("AI Win");
      pointAI++;
      canvasIniial(ctx,canvasWidth,canvasHeigh);
      returnFlag=0;
    }
    if(turnFlag==1) {console.log("Player1 turn");$( "#result" ).text("Player1 turn"); }
     if(turnFlag===0) {console.log("AI turn");$( "#result" ).text("AI turn");}
    console.log("checkresult flag:"+turnFlag+" succStatus:"+succStatus+" leftPos"+leftPosition+" returnflag:"+returnFlag);
    return returnFlag;
  }
  
});
