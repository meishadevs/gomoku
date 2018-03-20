
let cavBg;
let cavChess;
let contextBg;
let contextChess;

//用于设置当前是否轮到白棋
let isWhite;

//用于设置当前局棋是否赢了
let isWin;

//白棋图片
let imageWhite;

//黑棋图片
let imageBlack;

//用于保存棋盘信息的二维数组
let chessData;

//0 表示没有棋子
const NO_CHESS = 0;

//1 表示黑棋
const BLACK_CHESS = 1;

//2 表示白棋
const WHITE_CHESS = 2;

//每一行上只能下15个棋子
//每一列上也只能下15个棋子
let NUM_CHESS = 15;

function startLoad() {

    //初始化游戏中的一些数据
    initData();

    //绘制棋盘
    drawRect();
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

    //创建数组，存储棋子的位置信息
    chessData = new Array(NUM_CHESS);

    //初始化二维数组
    for (let x = 0; x < NUM_CHESS; x++) {
        chessData[x] = new Array(NUM_CHESS);
        for (let y = 0; y < NUM_CHESS; y++) {
            chessData[x][y] = NO_CHESS;
        }
    }
}


//绘制棋盘
function drawRect() {

    cavBg = document.getElementById("cav-bg");
    cavChess = document.getElementById("cav-chess");
    contextBg = cavBg.getContext("2d");
    contextChess = cavChess.getContext("2d");

    //创建棋盘背景
    contextBg.fillStyle = '#FFA500';
    contextBg.fillRect(0, 0, 640, 640);

    //绘制构成棋盘的线段
    for (let i = 1; i <= NUM_CHESS; i++) {
        drawLine({x: 40 * i, y: 40}, {x: 40 * i, y: 600});
        drawLine({x: 40, y: 40 * i}, {x: 600, y: 40 * i});
    }
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
    let x = parseInt((event.clientX - 40 + 20) / 40);
    let y = parseInt((event.clientY - 75 + 20) / 40);

    //确保棋子的坐标在可以下棋的范围之内
    if (x >= NUM_CHESS || y >= NUM_CHESS || chessData[x][y] != 0) {
        return;
    }

    //如果当前用户下的是白棋
    if (isWhite) {

        //绘制白棋
        drawChess(WHITE_CHESS, x, y);

    //如果当前用户下的是黑棋
    } else {

        //绘制黑棋
        drawChess(BLACK_CHESS, x, y);
    }

    //每当下完一颗棋子后，改变下一颗棋子的颜色
    isWhite = !isWhite;
}


/**
 * 绘制旗子
 * @param chessType 棋子的类型
 * @param x 棋子的 x 坐标
 * @param y 棋子的 y 坐标
 */
function drawChess(chessType, x, y) {

    //如果赢了
    if (isWin) {
        alert("已经结束了，如果需要重新玩，请刷新");
        return;
    }

    //如果棋子的类型为白棋
    if (chessType == WHITE_CHESS) {

        //绘制白棋
        contextChess.drawImage(imageWhite, x * 40 + 40 - 20, y * 40 + 40 - 20);
        chessData[x][y] = WHITE_CHESS;

    //如果棋子的类型为黑棋
    } else {

        //绘制黑棋
        contextChess.drawImage(imageBlack, x * 40 + 40 - 20, y * 40 + 40 - 20);
        chessData[x][y] = BLACK_CHESS;
    }

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

    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;

    //从当前所下的棋子处往左判断
    for (let i = x; i >= 0; i--) {
        if (chessData[i][y] != chessType) {
            break;
        }
        count1++;
    }

    //从当前所下的棋子处往右判断
    for (let i = x + 1; i < 15; i++) {
        if (chessData[i][y] != chessType) {
            break;
        }
        count1++;
    }

    //从当前所下的棋子处往上判断
    for (let i = y; i >= 0; i--) {
        if (chessData[x][i] != chessType) {
            break;
        }
        count2++;
    }

    //从当前所下的棋子处往下判断
    for (let i = y + 1; i < 15; i++) {
        if (chessData[x][i] != chessType) {
            break;
        }
        count2++;
    }

    //从当前所下的棋子处往左上角判断
    for (let i = x, j = y; i >= 0 && j >= 0; i--, j--) {
        if (chessData[i][j] != chessType) {
            break;
        }
        count3++;
    }

    //从当前所下的棋子处往右下角判断
    for (let i = x + 1, j = y + 1; i < 15 && j < 15; i++, j++) {
        if (chessData[i][j] != chessType) {
            break;
        }
        count3++;
    }

    //从当前所下的棋子处往左下角判断
    for (let i = x, j = y; i >= 0 && j < 15; i--, j++) {
        if (chessData[i][j] != chessType) {
            break;
        }
        count4++;
    }

    //从当前所下的棋子处往右上角判断
    for (let i = x + 1, j = y - 1; i < 15 && j >= 0; i++, j--) {
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
    for (let i = 0; i < NUM_CHESS; i++) {
        for (let j = 0; j < NUM_CHESS; j++) {
            chessData[i][j] = 0;
        }

        isWhite = false;
        isWin = false;
        contextChess.clearRect(0, 0, cavChess.offsetWidth, cavChess.offsetHeight);
    }
}


/**
 * 悔棋
 */
function regretChess() {
}


/**
 * 撤销悔棋
 */
function cancelChess() {

}