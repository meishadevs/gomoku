
var cavBg;
var cavChess;
var contextBg;
var contextChess;

//用于设置当前是否轮到白棋
var isWhite;

//用于设置当前局棋是否赢了
var isWin;

//白棋图片
var imageWhite;

//黑棋图片
var imageBlack;

//用于保存棋盘信息的二维数组
var chessData;

//记录每一步棋子的信息
var actions;

//记录悔了几步棋
var backActionNum;

//0 表示没有棋子
const NO_CHESS = 0;

//1 表示黑棋
const BLACK_CHESS = 1;

//2 表示白棋
const WHITE_CHESS = 2;

//每一行上只能下15个棋子
//每一列上也只能下15个棋子
var NUM_CHESS = 15;

//棋子图片的宽度
var IMAGE_WIDTH = 36;

//棋子图片的高度
var IMAGE_HEIGHT = 36;

function startLoad() {

    //初始化游戏中的一些数据
    initData();

    //绘制棋盘
    drawRect();

    //添加事件监听
    addEventListener();
}


//初始化游戏中的一些数据
function initData() {

    isWhite = false;
    isWin = false;

    //白棋图片
    imageWhite = new Image();
    imageWhite.src = "./images/white.png";

    //黑棋图片
    imageBlack = new Image();
    imageBlack.src = "./images/black.png";

    //创建数组，记录每一步棋子的信息
    actions = [];

    //初始化时没有悔棋
    backActionNum = 0;

    //创建数组，存储棋子的位置信息
    chessData = new Array(NUM_CHESS);

    //初始化二维数组
    for (var x = 0; x < NUM_CHESS; x++) {
        chessData[x] = new Array(NUM_CHESS);
        for (var y = 0; y < NUM_CHESS; y++) {
            chessData[x][y] = NO_CHESS;
        }
    }
}


//绘制棋盘
function drawRect() {

    cavBg = document.getElementById("cavBg");
    cavChess = document.getElementById("cavChess");
    contextBg = cavBg.getContext("2d");
    contextChess = cavChess.getContext("2d");

    //创建棋盘背景
    contextBg.fillStyle = '#FFA500';
    contextBg.fillRect(0, 0, 640, 640);

    //绘制构成棋盘的线段
    for (var i = 1; i <= NUM_CHESS; i++) {
        drawLine({x: 40 * i, y: 40}, {x: 40 * i, y: 600});
        drawLine({x: 40, y: 40 * i}, {x: 600, y: 40 * i});
    }
}


//添加事件监听
function addEventListener() {
    var btnRestart = document.getElementById('restart');
    var backBtn = document.getElementById('backBtn');
    var revokeBackBtn = document.getElementById('revokeBackBtn');

    cavChess.addEventListener('mousedown', play);
    btnRestart.addEventListener('click', restart);
    backBtn.addEventListener('click', back);
    revokeBackBtn.addEventListener('click', revokeBack);
}


/**
 * 绘制线段
 * @param pointStart 线段的起始点坐标
 * @param pointEnd 线段的终止点坐标
 */
function drawLine(pointStart, pointEnd) {
    contextBg.beginPath();
    contextBg.moveTo(pointStart.x, pointStart.y);
    contextBg.lineTo(pointEnd.x, pointEnd.y);
    contextBg.closePath();
    contextBg.stroke();
}


/**
 * 鼠标点击时触发
 * @param event 触发的鼠标点击事件
 */
function play(event) {

    //将鼠标点击的坐标转换成棋盘中的坐标
    //40表示棋盘中第一条线段的起始点与浏览器最左端的距离为40
    //75表示棋盘中第一条线段的起始点与浏览器最顶端的距离为75
    var x = parseInt((event.clientX - 40 + 20) / 40);
    var y = parseInt((event.clientY - 75 + 20) / 40);

    //确保棋子的坐标在可以下棋的范围之内
    if (x >= NUM_CHESS || y >= NUM_CHESS || chessData[x][y] != NO_CHESS) {
        return;
    }

    //如果在落子之前产生了悔棋操作
    if(backActionNum > 0) {

        //清除数组中悔掉的棋子的记录
        actions.splice(actions.length - backActionNum, backActionNum);
        backActionNum = 0;
    }

    //如果当前用户下的是白棋
    if (isWhite) {

        //绘制白棋
        drawChess(WHITE_CHESS, x, y, false);

    //如果当前用户下的是黑棋
    } else {

        //绘制黑棋
        drawChess(BLACK_CHESS, x, y, false);
    }
}


/**
 * 绘制旗子
 * @param chessType 棋子的类型
 * @param x 棋子的 x 坐标
 * @param y 棋子的 y 坐标
 * @param isBack 标记当前是否处于悔棋状态
 */
function drawChess(chessType, x, y, isBack) {

    //如果赢了
    if (isWin) {
        alert("已经结束了，如果需要重新玩，请刷新");
        return;
    }

    //如果棋子的类型为白棋
    if (chessType == WHITE_CHESS) {

        //绘制白棋
        contextChess.drawImage(imageWhite, x * 40 + 40 - 20, y * 40 + 40 - 20, IMAGE_WIDTH, IMAGE_HEIGHT);
        chessData[x][y] = WHITE_CHESS;

    //如果棋子的类型为黑棋
    } else {

        //绘制黑棋
        contextChess.drawImage(imageBlack, x * 40 + 40 - 20, y * 40 + 40 - 20, IMAGE_WIDTH, IMAGE_HEIGHT);
        chessData[x][y] = BLACK_CHESS;
    }

    //如果当前不处于悔棋状态
    if (!isBack) {

        //将每一步棋子的信息存储到actions数组中
        actions.push({x: x, y: y, chessType: chessType});
    }

    //每当下完一颗棋子后，改变下一颗棋子的颜色
    isWhite = !isWhite;

    //判断输赢
    judge(x, y, chessType);
}


/**
 * 判断输赢
 * @param x 棋子的 x 坐标
 * @param y 棋子的 y 坐标
 * @param chessType 棋子的类型
 */
function judge(x, y, chessType) {

    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;

    //从当前所下的棋子处往左判断
    for (var i = x; i >= 0; i--) {
        if (chessData[i][y] != chessType) {
            break;
        }
        count1++;
    }

    //从当前所下的棋子处往右判断
    for (var i = x + 1; i < 15; i++) {
        if (chessData[i][y] != chessType) {
            break;
        }
        count1++;
    }

    //从当前所下的棋子处往上判断
    for (var i = y; i >= 0; i--) {
        if (chessData[x][i] != chessType) {
            break;
        }
        count2++;
    }

    //从当前所下的棋子处往下判断
    for (var i = y + 1; i < 15; i++) {
        if (chessData[x][i] != chessType) {
            break;
        }
        count2++;
    }

    //从当前所下的棋子处往左上角判断
    for (var i = x, j = y; i >= 0 && j >= 0; i--, j--) {
        if (chessData[i][j] != chessType) {
            break;
        }
        count3++;
    }

    //从当前所下的棋子处往右下角判断
    for (var i = x + 1, j = y + 1; i < 15 && j < 15; i++, j++) {
        if (chessData[i][j] != chessType) {
            break;
        }
        count3++;
    }

    //从当前所下的棋子处往左下角判断
    for (var i = x, j = y; i >= 0 && j < 15; i--, j++) {
        if (chessData[i][j] != chessType) {
            break;
        }
        count4++;
    }

    //从当前所下的棋子处往右上角判断
    for (var i = x + 1, j = y - 1; i < 15 && j >= 0; i++, j--) {
        if (chessData[i][j] != chessType) {
            break;
        }
        count4++;
    }

    if (count1 >= 5 || count2 >= 5 || count3 >= 5 || count4 >= 5) {

        if (chessType == WHITE_CHESS) {
            alert("白棋赢了");
        }
        else {
            alert("黑棋赢了");
        }

        //设置该局棋盘已经赢了，不可以再走了
        isWin = true;
    }
}


/**
 * 重新开始
 */
function restart() {
    for (var i = 0; i < NUM_CHESS; i++) {
        for (var j = 0; j < NUM_CHESS; j++) {
            chessData[i][j] = 0;
        }

        isWhite = false;
        isWin = false;
        actions = [];
        backActionNum = 0;
        contextChess.clearRect(0, 0, cavChess.offsetWidth, cavChess.offsetHeight);
    }
}


/**
 * 悔棋
 */
function back() {

    var backAction = null;

    //当棋盘上有棋子才能悔棋
    //或者游戏还没赢的时候才能悔棋
    if (actions.length <= 0 || isWin) {
        return;
    }

    //悔棋步数加1
    backActionNum++;

    //如果悔棋步数超过了棋盘上下的棋子数，不能悔棋
    if (backActionNum > actions.length) {
        backActionNum--;
        return;
    }

    //如果只悔一步棋
    if (backActionNum == 1) {

        backAction = actions.slice(-backActionNum);

    //悔多步棋
    } else {
        backAction = actions.slice(-backActionNum, -backActionNum + 1);
    }

    var x = backAction[0].x;
    var y = backAction[0].y;
    var color = backAction[0].chessType;

    chessData[x][y] = 0;
    isWhite = color == WHITE_CHESS ? true : false;
    contextChess.clearRect(x * 40 + 40 - 20, y * 40 + 40 - 20, IMAGE_WIDTH, IMAGE_HEIGHT);
}


/**
 * 撤销悔棋
 */
function revokeBack() {

    var backAction = null;

    //如果悔棋步数小于1或者有一方赢了，就不往下执行
    if (backActionNum < 1 || isWin) {
        return;
    }

    //如果只悔一步棋
    if (backActionNum == 1) {
        backAction = actions.slice(-backActionNum);

        //悔多步棋
    } else {
        backAction = actions.slice(-backActionNum, -backActionNum + 1);
    }

    //悔棋步数减1
    backActionNum--;

    var x = backAction[0].x;
    var y = backAction[0].y;
    var color = backAction[0].chessType;
    drawChess(color, x, y, true);
}