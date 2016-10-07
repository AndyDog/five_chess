//得到canvas的id
var chess=document.getElementById('chess');
var context=chess.getContext("2d");

//定义线的颜色
context.strokeStyle="#999";

//为棋盘画背景
var bg=new Image();
bg.src="images/bg.png";
bg.onload=function(){
    context.drawImage(bg,0,0,450,450);
    //先画图在画线，线会显示在图片上
    drawchessBoard();
}
//为棋盘画线
var drawchessBoard=function(){
    for(var i=0;i<15;i++){
        context.moveTo(15 + i*30,15);
        context.lineTo(15 + i*30,435);
        context.stroke();
        context.moveTo(15,15 + i*30);
        context.lineTo(435,15 + i*30);
        context.stroke();
    }
}
//画棋子（圆）me代表黑棋或白棋
var oneStep=function(i,j,me){
    context.beginPath();
    //描绘圆形
    context.arc(15+i*30,15+j*30,12,0,2*Math.PI);
    context.closePath();
    //定义圆形渐变
    var gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,12,15+i*30+2,15+j*30-2,0);
    if(me){
        gradient.addColorStop(0,"#0a0a0a");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0,"#d1d1d1");
        gradient.addColorStop(1,"#f9f9f9");
    }
    context.fillStyle=gradient;
    context.fill();
}
var chessBoard=[];
//判断落子的位置
for(var i=0;i<15;i++){
    chessBoard[i]=[];
    for(var j=0;j<15;j++){
        chessBoard[i][j]=0;
    }
}
var wins=[];
//初始化赢法数组
for(var i=0; i<15;i++){
    wins[i]=[];
    for(var j=0;j<15;j++){
        wins[i][j]=[];
    }
}
var count=0;
//横线赢法
for(var i=0;i<15;i++){
    for(j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i][j+k][count]=true;
        }
        count++;
    }
}
//竖线赢法
for(var i=0;i<15;i++){
    for(j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[j+k][i][count]=true;
        }
        count++;
    }
}
//斜线赢法
for(var i=0;i<11;i++){
    for(j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count]=true;
        }
        count++;
    }
}
//反斜线赢法
for(var i=0;i<11;i++){
    for(j=14;j>3;j--){
        for(var k=0;k<5;k++){
            wins[i+k][j-k][count]=true;
        }
        count++;
    }
}
console.log(count);

var myWin=[];
var computerWin=[];
for(var i=0;i<count;i++){
    myWin[i]=0;
    computerWin[i]=0;
}
//用户先下棋
var me=true;
//棋子是否结束
var over=false;
//实现点击落子
chess.onclick=function(e){
    if(over){
        return;
    }
    if(!me){
        return;
    }
    var x= e.offsetX;
    var y= e.offsetY;
    var i=Math.floor(x/30);
    var j=Math.floor(y/30);
    //判断落子位置是否为空
    if(chessBoard[i][j]==0) {
        oneStep(i, j, me);
        chessBoard[i][j]=1;
        for(var k=0;k<count;k++){
            if(wins[i][j][k]){
                myWin[k]++;
                computerWin[k] = 6;
                if(myWin[k] == 5){
                    window.alert("恭喜你，你赢了！！！");
                    over=true;
                }
            }
        }
        if(!over){
            me=!me;
            computerAI();
        }
    }
}
//实现人机大战
var computerAI=function(){
    var max=0;
    var u=0;
    var v=0;
    var myScore=[];
    var computerScore=[];
    for(var i=0;i<15;i++){
        myScore[i]=[];
        computerScore[i]=[];
        for(var j=0;j<15;j++){
            myScore[i][j]=0;
            computerScore[i][j]=0;
        }
    }
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            if(chessBoard[i][j]==0){
                for(var k=0;k<count;k++){
                    if(wins[i][j][k]){
                        if(myWin[k] == 1){
                            myScore[i][j] += 200;
                        }else if(myWin[k] == 2){
                            myScore[i][j] += 400;
                        }else if(myWin[k] == 3){
                            myScore[i][j] += 2000;
                        }else if(myWin[k] == 4){
                            myScore[i][j] += 10000;
                        }
                        if(computerWin[k] == 1){
                            computerScore[i][j] += 220;
                        }else if(computerWin[k] == 2){
                            computerScore[i][j] += 420;
                        }else if(computerWin[k] == 3){
                            computerScore[i][j] += 2200;
                        }else if(computerWin[k] == 4){
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                if(myScore[i][j] > max){
                    max=myScore[i][j];
                    u=i;
                    v=j;
                }else if(myScore[i][j] == max){
                    if(computerScore[i][j]>computerScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
                if(computerScore[i][j] > max){
                    max=computerScore[i][j];
                    u=i;
                    v=j;
                }else if(computerScore[i][j] == max){
                    if(myScore[i][j]>myScore[u][v])
                    {
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }
    oneStep(u,v,false);
    chessBoard[u][v] = 2;
    for(var k=0;k<count;k++){
        if(wins[u][v][k]){
            computerWin[k]++;
            myWin[k]=6;
            if(computerWin[k] == 5){
                window.alert("计算机赢了！！！");
                over=true;
            }
        }
    }
    if(!over){
        me=!me;
    }
}
//音乐
function Play(){
    var audio=document.getElementById("music");
    if(audio.paused){
        audio.play();
    }
    else{
        audio.pause();
    }
}
//再来一局
function Again() {
    window.location.reload();
}
