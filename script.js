let mode = 0; //モード管理用　0：タイトル画面　1：ゲーム画面　２：リザルト画面
let resultText=""; //ゲームの結果　MissかClear
let ctx2d;
let t = 0; //時間の管理用
let initialPfnw = performance.now();//ロード時の起動時間をセット
let myPos={x:0,y:0};
const WIDTH = 960, HEIGHT = 540;// キャンバスのサイズを指定
const START_POS_X=50,START_POS_Y=HEIGHT/2;
const CHARACTER_SIZE=30, WALL_WIDTH=30;
const WALL=[ //eventは0なら何もない　1はミス　2はクリア
    {x:0,y:0,w:WIDTH,h:WALL_WIDTH,col:"rgba(100,100,100,1)"},
    {x:0,y:0,w:WALL_WIDTH,h:HEIGHT,col:"rgba(100,100,100,1)"},
    {x:WIDTH-WALL_WIDTH,y:0,w:WALL_WIDTH,h:HEIGHT,col:"rgba(100,100,100,1)"},
    {x:0,y:HEIGHT-WALL_WIDTH,w:WIDTH,h:WALL_WIDTH,col:"rgba(100,100,100,1)"}
];


window.addEventListener('load', init); //ロード完了後にinitが実行されるように、ロードイベントを登録
window.addEventListener('DOMContentLoaded', function(){ ///キー入力イベントを登録
    window.addEventListener("keydown", function(e){
        if (e.key=="ArrowUp" || e.key=="ArrowDown" || e.key=="ArrowLeft" || e.key=="ArrowRight"){ //方向キー
            e.preventDefault();//スクロールを防ぐ
            if(mode==1){ //ゲーム画面なら
                moveCharacter(e.key);
            } 
        }
        if(e.key==" "){
            if(mode==0){ //タイトル画面なら
                startGame();
            } else if(mode==2){//リザルト画面なら
                mode=0;
            }
        }
    });
});

function drawTitle(){
    ctx2d.fillStyle="rgba(255,255,255,1)";
    ctx2d.font="32px sans-serif";
    ctx2d.fillText("SQUARE",(WIDTH-ctx2d.measureText("SQUARE").width)/2,HEIGHT/2);
    ctx2d.font="16px sans-serif";
    ctx2d.fillText("Press space key",(WIDTH-ctx2d.measureText("Press space key").width)/2,HEIGHT/2+50);
}

function drawResult(){
    ctx2d.fillStyle="rgba(255,255,255,1)";
    ctx2d.font="32px sans-serif";
    ctx2d.fillText(resultText,(WIDTH-ctx2d.measureText(resultText).width)/2,HEIGHT/2);
    ctx2d.font="16px sans-serif";
    ctx2d.fillText("Press space key",(WIDTH-ctx2d.measureText("Press space key").width)/2,HEIGHT/2+50);
}

function startGame(){ //ゲームスタートの処理
    myPos.x=START_POS_X;
    myPos.y=START_POS_Y;
    mode=1;
}

function triggerEvent(event){
    if(event==0){//ミス
        mode=2;
        resultText="Miss";
    } else if(event==1){//クリア
        mode=2;
        resultText="Clear!";
    }
}

function checkColisionObj(obj){
    for(let i = 0;i < obj.length;i++){
        if(myPos.x < obj[i].x+obj[i].w && myPos.x + CHARACTER_SIZE > obj[i].x){
            if(myPos.y < obj[i].y+obj[i].h && myPos.y + CHARACTER_SIZE > obj[i].y){
                triggerEvent(obj[i].event);
            }
        }
    }    
}

function checkColisionWall(direction,MOVE_SPEED){//当たり判定
    var offsetX=0,offsetY=0;
    if(direction=="ArrowUp") offsetY-=MOVE_SPEED;
    if(direction=="ArrowDown") offsetY+=MOVE_SPEED;
    if(direction=="ArrowLeft") offsetX-=MOVE_SPEED;
    if(direction=="ArrowRight") offsetX+=MOVE_SPEED;
    for(let i = 0;i < WALL.length;i++){
        if(myPos.x+offsetX < WALL[i].x+WALL[i].w && myPos.x+offsetX + CHARACTER_SIZE > WALL[i].x){
            if(myPos.y+offsetY < WALL[i].y+WALL[i].h && myPos.y+offsetY + CHARACTER_SIZE > WALL[i].y){
                return 1;
            }
        }
    }
    return 0;
}
function moveCharacter(direction){ //移動の処理
    const MOVE_SPEED=10;
    if(checkColisionWall(direction,MOVE_SPEED)) return 0;
    if(direction == "ArrowUp"){
        myPos.y-=MOVE_SPEED;
    } else if(direction == "ArrowDown"){
        myPos.y+=MOVE_SPEED;
    } else if(direction == "ArrowLeft"){
        myPos.x-=MOVE_SPEED;
    } else if(direction == "ArrowRight"){
        myPos.x+=MOVE_SPEED;
    }
}
function drawCharacter(myPos){
    ctx2d.fillStyle="rgba(200,0,0,1)";
    ctx2d.fillRect(myPos.x,myPos.y,CHARACTER_SIZE,CHARACTER_SIZE);
}
function drawObj(obj){
    for(let i = 0;i < obj.length;i++){
        ctx2d.fillStyle=obj[i].col;
        ctx2d.fillRect(obj[i].x,obj[i].y,obj[i].w,obj[i].h);
    }
}
function drawWall(){
    for(let i = 0;i < WALL.length;i++){
        ctx2d.fillStyle=WALL[i].col;
        ctx2d.fillRect(WALL[i].x,WALL[i].y,WALL[i].w,WALL[i].h);
    }
}

function init() {
    //ロード処理
    ctx2d=document.getElementById("myCanvas").getContext("2d"); //ctx2dをセット
    tick(); //ループ処理を呼び出し
}

function tick() { //ループ処理
    let obj=[ //eventは0ミス　1はクリア
        {x:100,y:50,w:10,h:10,col:"rgba(255,0,0,1)",event:0},
        {x:50,y:100,w:10,h:10,col:"rgba(255,0,0,1)",event:0},
        {x:200,y:200,w:10,h:10,col:"rgba(150,255,150,1)",event:1}
    ];

    t=performance.now()-initialPfnw;    //ゲーム開始からの経過時間をセット
    ctx2d.clearRect(0,0,WIDTH,HEIGHT);  //2次元のリセット処理
    ctx2d.fillStyle="rgba(30,30,0,1)";
    ctx2d.fillRect(0,0,WIDTH,HEIGHT);   //背景を描画

    if(mode==0){
        drawTitle();        //タイトル画面の描画
    } else if(mode==1){
        drawWall();         //壁の描画処理
        drawObj(obj);       //敵の描画処理
        drawCharacter(myPos);//キャラクターの描画処理
        checkColisionObj(obj);    //衝突チェック
    } else if(mode==2){//リザルト画面
        drawResult();
    }

    requestAnimationFrame(tick);//再帰する　このタイミングで描画が行われる
}
