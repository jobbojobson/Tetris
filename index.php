<!DOCTYPE html>
<html>
    <head>
        <?php
            function isMobile() {
                return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
            }
            $vers = "?v=20200401";
        ?>
        <title>Tetris</title>
        <link rel="stylesheet" type="text/css" href="css/styles.css">
    </head>
    <body>
        <div class="pnlHidden">
            <img id="imgTetI" src="img/tetI.png<?php echo $vers ?>">
            <img id="imgTetJ" src="img/tetJ.png<?php echo $vers ?>">
            <img id="imgTetL" src="img/tetL.png<?php echo $vers ?>">
            <img id="imgTetS" src="img/tetS.png<?php echo $vers ?>">
            <img id="imgTetT" src="img/tetT.png<?php echo $vers ?>">
            <img id="imgTetZ" src="img/tetZ.png<?php echo $vers ?>">
            <img id="imgTetO" src="img/tetO.png<?php echo $vers ?>">
        </div>
        <div class="pnlHidden">
            <audio id="audioRotateLeft">
                <source src="sound/rotateLeft.mp3<?php echo $vers ?>" type="audio/mpeg">
            </audio>
            <audio id="audioRotateRight">
                <source src="sound/rotateRight.mp3<?php echo $vers ?>" type="audio/mpeg">
            </audio>
            <audio id="audioLanding">
                <source src="sound/landing.mp3<?php echo $vers ?>" type="audio/mpeg">
            </audio>
        </div>
        <a href="about.html" style="font-size:0.8em;">About...</a>
        <div id="pnlGame" class="page-container">
            <?php
            if(isMobile()){
            ?>
            <div class="page-item divs control-panel">
                <div class="control-row">
                    <div class="control-button">
                        <div id="btnLeft" class="button-layer"></div>
                        <object class="control-icon" type="image/svg+xml" data="img/chevron-left.svg"><</object>
                    </div>
                    <div class="control-button">
                        <div id="btnRight" class="button-layer"></div>
                        <object class="control-icon" type="image/svg+xml" data="img/chevron-right.svg"><</object>
                    </div>
                </div>
                <div class="control-row">
                    <div class="control-button">
                        <div id="btnDown" class="button-layer"></div>
                        <object class="control-icon" type="image/svg+xml" data="img/chevron-down.svg">V</object>
                    </div>
                </div>
            </div>
            <?php
            }
            ?>
            <div class="page-item">
                <canvas id="gameCanvas"/>
            </div>
            <?php
            if(isMobile()){
            ?>
            <div class="page-item divs control-panel">
                <div class="control-row">
                    <div class="control-button hang-right">
                        <div id="btnRotateRight" class="button-layer"></div>
                        <object class="control-icon" type="image/svg+xml" data="img/rotate-right.svg">></object>
                    </div>
                </div>
                <div class="control-row">
                    <div class="control-button hang-left">
                        <div id="btnRotateLeft" class="button-layer"></div>
                        <object class="control-icon" type="image/svg+xml" data="img/rotate-left.svg"><</object>
                    </div>
                </div>
            </div>
            <?php
            }
            ?>
        </div>
        <script type="module" src="js/tetris.js<?php echo $vers ?>"></script>
    </body>
</html>
