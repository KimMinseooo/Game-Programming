window.addEventListener("load",drawScreen,false);
window.addEventListener("keydown",onkeydown,true);

var GAME_STATE_READY = 0; // 준비
var GAME_STATE_GAME = 1;  // 게임 중
var GAME_STATE_OVER = 2;  // 게임 오버
var GAME_STATE_HELP = 3; // 게임 설명 
// 게임 상태값을 저장하는 변수
var GameState = GAME_STATE_READY; // 초깃값은 준비 상태

//죽었을때 소리
var audio = new Audio();
audio.src="diesound.mp3";

//배경음악
var BGM =new Audio();
BGM.src ="bgm1.mp3";
BGM.loop=true;

//점수 
var score=0;
var bestScore=0;

var intervalID;
//배경화면
var imgBackground = new Image();
imgBackground.src = "background.png";
imgBackground.addEventListener("load", drawScreen, false);
//플레이어
var imgPlayer = new Image();
imgPlayer.src = "player.png";
imgPlayer.addEventListener("load", drawScreen, false);
//장애물 똥 
var arrayddong =new Array();
//장애물 이미지 
var ddong = new Image();
ddong.src = "ddong.png";
//플레이어 초기 위치
var intPlayerX= 350;
var intPlayerY= 550;
//시간
var intTime =0;
function drawScreen()
{
  var theCanvas = document.getElementById("GameCanvas");
  var Context  = theCanvas.getContext("2d");

  Context.fillStyle = "#000000";
  Context.fillRect(0, 0, 800, 600);  
  
  // 배경 화면 그리기
  Context.drawImage(imgBackground, 0, 0);
  
  // 플레이어 그리기
  Context.drawImage(imgPlayer, intPlayerX, intPlayerY); 
  
  Context.fillStyle    = "#ffffff"; 
  Context.font     = '30px 바탕'; //font를 30px 바탕으로 변경
  Context.textBaseline = "top";
  
  // 게임 준비 중
  if( GameState == GAME_STATE_READY )
  {
    Context.fillText( "똥피하기 게임", 210, 80  );
    Context.fillText("게임설명:Hit the Spacebar",150,200);
    Context.fillText("게임시작:Hit the Enter",150,300);
  }
  //게임 설명화면
  else if(GameState ==GAME_STATE_HELP)
  {
    Context.font ='30px Arial Black';  //Arial --> Arial Black 폰트 변경
    Context.fillText("< 게임설명 >",280,80);
    Context.fillText("하늘에서 똥이 내려오는것으로부터",150,120);
    Context.fillText("플레이어를 지켜주세요!!",150,160);
    Context.fillText("피한 갯수만큼 점수가 카운트되니 ",150,200);
    Context.fillText("참고해서 기록을 세워보시길 바랍니다.",150,240);
    Context.fillText("5초마다 똥의 갯수가 5개씩 증가!!",150,280);
    Context.fillStyle ="#000000";   // 조작키설명은 잘 보이게 글자색을 하얀색에서 검은색으로 변경
    Context.fillText("<조작키>   왼쪽이동:<- 오른쪽이동:-> ",150,400);
    Context.fillText("다시 메뉴로 가기 :Hit the Backspace",150,450);
    
  }
  // 게임 중
  else if( GameState == GAME_STATE_GAME )
  {
    // 똥을 그려준다
    for( var i = 0; i < arrayddong.length; i++ )
    {
      Context.drawImage(ddong, arrayddong[i].x, arrayddong[i].y);  
    }
    Context.font = '20px Arial'; 
    Context.fillText( "Time : " + intTime / 1000, 20, 5  ); 
    Context.fillText( "똥 개수 : " + arrayddong.length , 660, 5  ); 
    Context.fillText( "점수 : "+score,660,25);
    Context.fillText( "최고점수 : "+bestScore,660,45);
  }
  // 게임 오버
  else if( GameState == GAME_STATE_OVER )
  {
    // 똥을 그려준다
    for( var i = 0; i < arrayddong.length; i++ )
    {
      Context.drawImage(ddong, arrayddong[i].x, arrayddong[i].y);  
    }

    Context.font = '20px Arial'; 
    Context.fillText( "Time : " + intTime / 1000, 20, 5  ); 
    Context.fillText( "똥 개수 : " + arrayddong.length , 660, 5  ); 
    Context.fillText( "점수 : "+score,660,25);
    Context.fillText( "최고점수 : "+bestScore,660,45);

    Context.fillStyle ="#000000";
    Context.font ='30px HY견고딕';  //font를 30px HY견고딕으로 변경
    Context.fillText( "이게 최선입니까?", 200, 180  );   
    Context.fillText("메뉴로 가기:Hit the Enter",200,230);
  }
  
  
} 


function onkeydown(e) 
{
  // 게임 준비 중
  if( GameState == GAME_STATE_READY )
  {
    // 게임을 시작합니다
    if( e.keyCode == 13 ) //Enter
    {
      // 엔터를 입력하면 게임시작
      onGameStart();
    }
    if(e.keyCode == 32)  //Spacebar
    {
      onGameHelp();
    }
  }
  else if(GameState == GAME_STATE_HELP)
  {
    if( e.keyCode == 8)//BackSpace
    {
      onReady();
    }
  }
  // 게임 중
  else if( GameState == GAME_STATE_GAME )
  {
    // 기존의 플레이어 이동 처리 코드  (좌 ,우 키만 필요)
    switch( e.keyCode )
    {
      case 37: // LEFT
        intPlayerX-=7;
        if( intPlayerX < -20 )
        {
          intPlayerX = -20;
        }
      break;
      case 39: // RIGHT
        intPlayerX+=7;
        if( intPlayerX > 760 )
        {
          intPlayerX = 760;
        }     
      break;
     
    };
  }
  // 게임 오버
  else if( GameState == GAME_STATE_OVER )
  {
    // 게임 준비 상태로 변경
    if( e.keyCode == 13 )
    {
      // 엔터를 입력하면 준비 상태로
      onReady();
    }
  }
  
  // 화면 갱신
  drawScreen();
}

function RandomNextInt ( max ) {
    return 1 + Math.floor( Math.random() * max );
  }
  
  function onGameStart() 
  {
    // 게임 시작
    GameState = GAME_STATE_GAME;
    BGM.play();  //게임 시작시 배경음악 실행
    intervalID = setInterval( InGameUpdate, 60 );
    
    // 똥 위치 추가하기    ( 화면 위에서 랜덤으로 추가하게끔 설정)
    for( var i = 0; i < 30; i++)
    {
        var intX = RandomNextInt(800);
        var intY = RandomNextInt(300);    
      
      arrayddong.push( {x: intX, y: -intY,} );
    }
    
  }

  function onGameOver() 
{
  // 게임 오버
  GameState = GAME_STATE_OVER;
  clearInterval( intervalID );
  BGM.pause();  //게임 오버시 배경음악 중지 
  if(score>bestScore){
  bestScore=score;
  }
  
}

function onGameHelp(){
  GameState =GAME_STATE_HELP;
}
function onReady() 
{
  // 게임 준비
  GameState = GAME_STATE_READY;
  //배경음악 초기화
  BGM.currentTime =0;
  // 타이머 초기화
  intTime = 0;
  score =0;
  // 플레이어 위치 초기화
  intPlayerX = 350;
  intPlayerY = 550; 
  
  // 똥 리스트 초기화
  while(arrayddong.length != 0)
  {
    arrayddong.pop();
  }
}
  function InGameUpdate () 
{
  // 시간 체크
  intTime += 100;
  if( intTime % 5000  == 0 )
  {
    //5초마다 장애물 5개씩 증가 
    for( var i = 0; i < 5; i++)
    {
        var  intX = RandomNextInt(800);
        var  intY = RandomNextInt(300);  
      arrayddong.push( {x: intX, y: -intY} );
    }
  } 
//   총알 이동 처리 
  Moveddong();
}
function Moveddong() 
{
  // 총알 이동 처리
  for( var i = 0; i < arrayddong.length; i++ )
  {
    //위에서 아래로만 이동하게끔 설정
    arrayddong[i].y += 10;
    // 충돌 시 게임 오버 및 충돌 효과음
    if( IsCollisionWithPlayer( arrayddong[i].x, arrayddong[i].y ))
    {
      audio.play();
      onGameOver();
    }
    if( arrayddong[i].x <0 || arrayddong[i].x > 800
      || arrayddong[i].y > 600 )
    {
     
          arrayddong[i].x = RandomNextInt(800);
          arrayddong[i].y = RandomNextInt(10)+10;
          score++;
    }
  }
  // 화면 갱신
  drawScreen();
}
//충돌함수
function IsCollisionWithPlayer( x, y )
{
  if( intPlayerX + 45 >  x + 5  && 
    intPlayerX + 15  < x + 25 && 
    intPlayerY + 15  < y + 25  && 
    intPlayerY + 45  > y + 5 )
  {
    return true;
  }
    
  return false;
}
