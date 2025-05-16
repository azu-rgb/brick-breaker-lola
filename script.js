$(document).ready(function () {
    var x;
    var y;
    var dx = 2;
    var dy = 4;
    var WIDTH;
    var HEIGHT;
    var r = 15;
    var ctx;
    var paddlex;
    var paddleh;
    var paddlew;
    var intervalId;
    var rightDown = false;
    var leftDown = false;
    var bricks;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING = 30;
    var rowcolors = "#FF0000";
    var rowcolors2 = "#FFEA00";
    var paddlecolor = "#000000";
    var ballcolor = "#000000";
    var start = false; // Game doesn't start until paddle is moved
    var sekunde = 0;
    var minuteI = 0;
    var sekundeI = 0;
    var izpisTimer = "00:00";
    var tocke = 0;
    var gamePaused = false; // New variable to track the game state

    var catImg = new Image();
    catImg.src = "https://i.postimg.cc/vHm7BXLD/fd552e00-4426-453b-8ccc-b90e73b28d97.webp"; // replace with your cat image path

    var hamsterImg = new Image();
    hamsterImg.src = "https://i.postimg.cc/BvBh5QhM/c0270f4f-54ba-4249-ae55-d1e09865f900.webp"; // replace with your hamster image path

    var startMessage = "Move the paddle to start the game";

    var backgroundImg = new Image();
    backgroundImg.src = "background.jpg";

    function init() {
        ctx = $("#canvas")[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        init_paddle();
        initbricks();
        $("#tocke").html(tocke);
        intervalId = setInterval(draw, 10);
        setInterval(updateTimer, 1000);
    }

    function updateTimer() {
    if (start && !gamePaused) {
        sekunde++;
        sekundeI = (sekunde % 60 > 9) ? sekunde % 60 : "0" + sekunde % 60;
        minuteI = (Math.floor(sekunde / 60) > 9) ? Math.floor(sekunde / 60) : "0" + Math.floor(sekunde / 60);
        izpisTimer = minuteI + ":" + sekundeI;
        $("#cas").html(izpisTimer);
    }
}


    function init_paddle() {
        paddlex = WIDTH / 2 - 37.5;
        paddleh = 10;
        paddlew = 150;
        x = paddlex + paddlew / 2; // Center the cat horizontally on the paddle
        y = HEIGHT - paddleh - r * 10 / 2;
    }


    function initbricks() { 
        NROWS = 4; 
        NCOLS = 12; 
        BRICKWIDTH = Math.floor((WIDTH - (NCOLS - 1) * PADDING) / NCOLS);  // Account for padding between bricks
        BRICKHEIGHT = 70; // Height of the brick
        bricks = new Array(NROWS); 
    
        for (var i = 0; i < NROWS; i++) { 
            bricks[i] = new Array(NCOLS); 
            for (var j = 0; j < NCOLS; j++) { 
                bricks[i][j] = 1; // 1 means the brick is present 
            } 
        }
    }

    function drawBricks() {
    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (bricks[i][j] == 1) {
                var brickX = j * (BRICKWIDTH + PADDING);
                var brickY = i * (BRICKHEIGHT + PADDING);
                ctx.drawImage(hamsterImg, brickX, brickY, BRICKWIDTH, BRICKHEIGHT);
            }
        }
    }
}



    function ballBrickCollision() {
        for (var i = 0; i < NROWS; i++) {
            for (var j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 1) {
                    var brickX = j * (BRICKWIDTH + PADDING);
                    var brickY = i * (BRICKHEIGHT + PADDING);
                    if (x + r > brickX && x - r < brickX + BRICKWIDTH && y + r > brickY && y - r < brickY + BRICKHEIGHT+20) {
                        bricks[i][j] = 0; // Remove the brick
                        dy = -dy;
                        tocke++;
                        $("#tocke").html(tocke);
                    }
                }
            }
        }
    }

    

    function draw() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        // Draw background with opacity
    ctx.globalAlpha = 0.5; // Set the opacity to 50%
    ctx.drawImage(backgroundImg, 0, 0, WIDTH, HEIGHT); // Draw the background image
    ctx.globalAlpha = 1; // Reset opacity to 100% for other drawing


        if (!start) {
            ctx.font = "20px SpeakDays";  // Set font size and type
            ctx.fillStyle = "black";  // Set text color
            ctx.textAlign = "center"; // Center the text horizontally
            ctx.textBaseline = "middle"; // Center the text vertically
            ctx.fillText(startMessage, WIDTH / 2, HEIGHT / 2+100); // Draw the text on the canvas
        }
        
        // Cat image dimensions
        var catWidth = r * 10;
        var catHeight = r * 10;

    
        // Draw the cat image instead of the ball
        ctx.drawImage(catImg, x - catWidth / 2, y - catHeight / 2, catWidth, catHeight);


    
        // Draw the paddle
        ctx.fillStyle = paddlecolor;
        ctx.fillRect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
        
        drawBricks();
    
        // Ball-wall collision checks (left and right walls)
        if (x + dx > WIDTH - catWidth / 2 || x + dx < catWidth / 2) {
            dx = -dx;
        }
        if (y + dy < catHeight / 2) {
            dy = -dy;
        }
    
        // Ball-paddle collision detection
        // Only check for collision when the cat is falling down (dy > 0)
        let catBottom = y + dy + catHeight / 2 -17;
        let paddleTop = HEIGHT - paddleh;

        if (
        dy > 0 &&
        catBottom >= paddleTop &&
        y - catHeight / 2 < HEIGHT && // make sure the cat is not way below the canvas
        x + catWidth / 2 > paddlex &&
        x - catWidth / 2 < paddlex + paddlew
        ) {
        dy = -dy;
        dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
        }
    
        // If the cat falls below the paddle (game over)
        if (y + dy + catHeight / 2 -15 > HEIGHT) {
            clearInterval(intervalId);
            start = false;
        }
    
        // Move the cat only if the game has started
        if (start) {
            x += dx;
            y += dy;
        }
    
        // Paddle movement (only starts game when paddle is moved)
        if (rightDown && paddlex < WIDTH - paddlew) {
            paddlex += 5;
            if (!start) start = true; // Start the game when the paddle is moved
        } else if (leftDown && paddlex > 0) {
            paddlex -= 5;
            if (!start) start = true; // Start the game when the paddle is moved
        }
    
        // Check brick collisions
        ballBrickCollision();
    }

    // Toggle the pause/play button text and game state
    $("#pause-play-button").click(function () {
        if (gamePaused) {
            gamePaused = false;
            $("#pause-play-button").text("Pause");
            intervalId = setInterval(draw, 10); // Restart the game loop
        } else {
            gamePaused = true;
            $("#pause-play-button").text("Play");
            clearInterval(intervalId); // Stop the game loop
        }

    });

    $("#restart").click(function () {
        clearInterval(intervalId); // Stop current game loop
        sekunde = 0;
        izpisTimer = "00:00";
        $("#cas").html(izpisTimer);
        tocke = 0;
        $("#tocke").html(tocke);

        // Reset positions and speeds
        paddlex = WIDTH / 2 - 37.5;
        x = paddlex + paddlew / 2; // Start the cat on top of the paddle
        y = HEIGHT - paddleh - r * 10 / 2; // Just above the paddle
        dx = 2;
        dy = 4;
        

        // Re-initialize bricks and game state
        initbricks();

        // Restart game loop
        intervalId = setInterval(draw, 10);
        start = false; // Set start to false so game doesn't automatically start
        gamePaused = false;
        $("#pause-play-button").text("Pause");
    });

    function onKeyDown(evt) {
        if (evt.keyCode == 39) rightDown = true;
        else if (evt.keyCode == 37) leftDown = true;
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 39) rightDown = false;
        else if (evt.keyCode == 37) leftDown = false;
    }

    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);
    init();
});
