
let canvas;
let context;

//用于设置当前是否轮到白棋
let isWhite;

//用于设置该局棋盘是否赢了
let isWin;

//白棋图片
let imageWhite;

//黑棋图片
let imageBlack;

//用于保存棋盘信息的二维数组
let chessData;

//0 表示没有棋子
const NO_CHESS = 0;

//1 表示白棋
const WHITE_CHESS = 1;

//2 表示黑棋
const BLACK_CHESS = 2;

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

    //这个为棋盘的二维数组用来保存棋盘信息，初始化0为没有走过的，1为白棋走的，2为黑棋走的
    chessData = new Array(15);

    //初始化二维数组
    for (let x = 0; x < 15; x++) {
        chessData[x] = new Array(15);
        for (let y = 0; y < 15; y++) {
            chessData[x][y] = NO_CHESS;
        }
    }
}


//绘制棋盘
function drawRect() {

    //创建棋盘背景
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.fillStyle = '#FFA500';
    context.fillRect(0, 0, 1024, 768);

    //游戏标题
    context.fillStyle = '#00f';
    context.font = '40px Arial';
    context.strokeText('JavaScript版五子棋', 330, 50);

    //再来一局按钮
    context.strokeRect(790, 140, 120, 30);
    context.fillStyle = '#00f';
    context.font = '25px Arial';
    context.strokeText('再来一局', 800, 163);

    //悔棋按钮
    context.strokeRect(790, 180, 120, 30);
    context.fillStyle = '#00f';
    context.font = '25px Arial';
    context.strokeText('悔棋', 820, 203);

    //撤销悔棋按钮
    context.strokeRect(790, 220, 120, 30);
    context.fillStyle = '#00f';
    context.font = '25px Arial';
    context.strokeText('撤销悔棋', 800, 243);

    //绘制构成棋盘的线段
    for (let i = 1; i < 16; i++) {
        drawLine({x: 40 * i + 140, y: 80}, {x: 40 * i + 140, y: 640});
        drawLine({x: 180, y: 40 * i + 40}, {x: 740, y: 40 * i + 40});
    }
}


/**
 * 绘制线段
 * @param pointStart 线段的起始点坐标
 * @param pointEnd 线段的终止点坐标
 */
function drawLine(pointStart, pointEnd) {
    context.beginPath();
    context.moveTo(pointStart.x, pointStart.y);
    context.lineTo(pointEnd.x, pointEnd.y);
    context.closePath();
    context.stroke();
}


//鼠标点击时发生
function play(e) {

    //将鼠标点击的坐标转换成棋盘中的坐标
    //180表示棋盘中第一条线段的起始点与浏览器最左端的距离为180
    //80表示棋盘中第一条线段的起始点与浏览器最顶端的距离为80
    let x = parseInt((e.clientX - 180 + 20) / 40);
    let y = parseInt((e.clientY - 80 + 20) / 40);

    //确保棋子的坐标在可以下棋的范围之内
    if (x < NUM_CHESS && y < NUM_CHESS) {

        //判断该位置是否有棋子
        if (chessData[x][y] != 0) {
            console.log('你不能在这个位置下棋');
            return;
        }
    } else {
        console.log('你不能在这个位置下棋');
        return;
    }

    //如果当前用户下的是白棋
    if (isWhite) {

        //标记下一步下的是黑棋
        isWhite = false;

        //绘制白棋
        drawChess(WHITE_CHESS, x, y);

    //如果当前用户下的是黑棋
    } else {

        //标记下一步下的是白棋
        isWhite = true;

        //绘制黑棋
        drawChess(BLACK_CHESS, x, y);
    }
}


/**
 * 绘制旗子
 * @param chessType 棋子的类型，1为白棋，2为黑棋
 * @param x 棋子的 x 坐标
 * @param y 棋子的 y 坐标
 */
function drawChess(chessType, x, y) {

    //如果赢了
    if (isWin) {
        alert("已经结束了，如果需要重新玩，请刷新");
        return;
    }

    if (x >= 0 && x < 15 && y >= 0 && y < 15) {

        //如果棋子的类型为白棋
        if (chessType == WHITE_CHESS) {

            //绘制白棋
            context.drawImage(imageWhite, x * 40 + 180 - 20, y * 40 + 80 - 20);
            chessData[x][y] = WHITE_CHESS;

        //如果棋子的类型为黑棋
        } else {

            //绘制黑棋
            context.drawImage(imageBlack, x * 40 + 180 - 20, y * 40 + 80 - 20);
            chessData[x][y] = BLACK_CHESS;
        }

        judge(x, y, chessType);
    }
}


//判断输赢
function judge(x, y, chessType) {

    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;

    //从右往左判断
    for (let i = x; i >= 0; i--) {
        if (chessData[i][y] != chessType) {
            break;
        }
        count1++;
    }

    //从最左往右判断
    for (let i = x + 1; i < 15; i++) {
        if (chessData[i][y] != chessType) {
            break;
        }
        count1++;
    }

    //上下判断
    for (let i = y; i >= 0; i--) {
        if (chessData[x][i] != chessType) {
            break;
        }
        count2++;
    }

    for (let i = y + 1; i < 15; i++) {
        if (chessData[x][i] != chessType) {
            break;
        }
        count2++;
    }

    //左上右下判断
    for (let i = x, j = y; i >= 0 && j >= 0; i--, j--) {
        if (chessData[i][j] != chessType) {
            break;
        }
        count3++;
    }

    for (let i = x + 1, j = y + 1; i < 15 && j < 15; i++, j++) {
        if (chessData[i][j] != chessType) {
            break;
        }
        count3++;
    }

    //右上左下判断
    for (let i = x, j = y; i >= 0 && j < 15; i--, j++) {
        if (chessData[i][j] != chessType) {
            break;
        }
        count4++;
    }
    for (let i = x + 1, j = y - 1; i < 15 && j >= 0; i++, j--) {
        if (chessData[i][j] != chessType) {
            break;
        }
        count4++;
    }

    if (count1 >= 5 || count2 >= 5 || count3 >= 5 || count4 >= 5) {

        if (chessType == 1) {
            alert("白棋赢了");
        }
        else {
            alert("黑棋赢了");
        }

        //设置该局棋盘已经赢了，不可以再走了
        isWin = true;
    }
}