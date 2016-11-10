/***********************************************
 *                                             *
 * Created by Syukron Zahri                    *
 * Copyright (c) Syukron Zahri @ 2016          *
 * Copy is permitted without any modifications *
 *                                             *
 ***********************************************/

(function($){
    var self;
    var canvas;
    var context;
    
    var canvasCenterPoint;
    var toothCoordinate = {};
    var toothSize;
    var toothSizeFactor = 0.4;
    
    var toothConditions;
    
    /*----------------------------------*/
    /*------- Internal functions -------*/
    /*----------------------------------*/
    
    /* Init Tooth Condition */
    function initToothConditions()
    {
        var t = {};
        
        /* populate tooth with indices */
        for (var i = 1; i <= 8; i++) {
            t['t1' + i] = []; 
            t['t2' + i] = []; 
            t['t4' + i] = []; 
            t['t3' + i] = [];
        }
        for (var i = 1; i <= 5; i++) {
            t['t5' + i] = []; 
            t['t6' + i] = []; 
            t['t8' + i] = []; 
            t['t7' + i] = [];
        }        
        return t;
    };
    
    /* Create trapezoid shape */
    function drawSideTrapezoid(origX, origY, size, direction, strokeStyle, fillStyle)
    {
        var fill;

        var templateDraw = [
            {x: origX + (2 * size / 5), y: origY - (2 * size / 5)},
            {x: origX + size, y: origY - size},
            {x: origX - size, y: origY - size},
            {x: origX - (2 * size / 5), y: origY - (2 * size / 5)}
        ];
        
        var coordinate = templateDraw;
        var degree;
        
        switch (direction) {
            case 'up':
                degree = 0;
                break;
            case 'right':
                degree = 90;
                break;
            case 'down':
                degree = 180;
                break;
            case 'left':
                degree = 270;
                break;
            default:
                degree = 0;
                break;
        }
        
        coordinate = rotateObject(templateDraw, {x: origX, y: origY}, degree);
        
        context.lineWidth = 1;
        context.beginPath();
        context.strokeStyle = strokeStyle;
        context.moveTo(coordinate[0].x, coordinate[0].y);
        context.lineTo(coordinate[1].x, coordinate[1].y);
        context.lineTo(coordinate[2].x, coordinate[2].y);
        context.lineTo(coordinate[3].x, coordinate[3].y);
        context.lineTo(coordinate[0].x, coordinate[0].y);
        context.closePath();
        context.stroke();
        if (fillStyle != false) {
            context.fillStyle = fillStyle;
            context.fill();
        }
    }
    
    /* Rotate object in a set of coordinates */
    function rotateObject(coordinates, origin, degree)
    {
        var xNew, yNew;
        var newCoordinates = [];
        
        for (idx in coordinates) {
            xNew = ((Math.cos(degree / 180 * Math.PI) * (coordinates[idx].x - origin.x)) - (Math.sin(degree / 180 * Math.PI) * (coordinates[idx].y - origin.y))) + origin.x;
            yNew = ((Math.sin(degree / 180 * Math.PI) * (coordinates[idx].x - origin.x)) - (Math.cos(degree / 180 * Math.PI) * (coordinates[idx].y - origin.y))) + origin.y;
            
            newCoordinates.push({x: xNew, y: yNew});
        }
        
        return newCoordinates;
    }
    
    /* Mirror object in a set of coordinates */
    function mirrorObject(coordinates, line, degree)
    {
        var xNew, yNew;
        var newCoordinates = [];
        
        return newCoordinates;
    }
    
    /* Create shade pattern for filling a shape */
    function getShadePattern(color, direction)
    {
        var patternCanvas = document.createElement('canvas'); // create a temporary canvas
        var patternContext = patternCanvas.getContext('2d');
        
        patternCanvas.width = patternCanvas.height = 4;
        patternContext.strokeStyle = color;
        patternContext.lineWidth = 1;
        patternContext.beginPath();
        patternContext.moveTo(0, 0);
        if (direction == 0) {
            patternContext.lineTo(4, 4);
        } else {
            patternContext.lineTo(4, -4);
        }
        patternContext.closePath();
        patternContext.stroke();
        return patternContext.createPattern(patternCanvas, 'repeat');
    }

    /* Draw a tooth in a specific coordinate, line color & size */
    function drawTooth(origX, origY, size, strokeStyle)
    {
        drawSideTrapezoid(origX, origY, size, 'up', strokeStyle, false);
        drawSideTrapezoid(origX, origY, size, 'right', strokeStyle, false);
        drawSideTrapezoid(origX, origY, size, 'down', strokeStyle, false);
        drawSideTrapezoid(origX, origY, size, 'left', strokeStyle, false);
    }
    
    /* Clear canvas */
    function clearCanvas()
    {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
    
    /* Draw background */
    function drawTeeth()
    {
        var xStart = canvas.width * 0.05;
        var xEnd = canvas.width * 0.95;
        var yStart = canvas.height * 0.05;
        var yEnd = canvas.height * 0.95;
                
        var teethNumber = 16;
        
        toothSize = (xEnd - xStart) / (teethNumber + 1);
        var rowSize = (yEnd - yStart) / 5;
        
        for (var i = 1; i <= 8; i++) {
            toothCoordinate['t1' + i] = {x: xStart + (toothSize * (9 - i)), y: yStart + (rowSize * 1)}; // top left
            toothCoordinate['t2' + i] = {x: xStart + (toothSize * (i + 8)), y: yStart + (rowSize * 1)}; // top right
            toothCoordinate['t4' + i] = {x: xStart + (toothSize * (9 - i)), y: yStart + (rowSize * 4)}; // bottom left
            toothCoordinate['t3' + i] = {x: xStart + (toothSize * (i + 8)), y: yStart + (rowSize * 4)}; // bottom right
        }
        for (var i = 1; i <= 5; i++) {
            toothCoordinate['t5' + i] = {x: xStart + (toothSize * (9 - i)), y: yStart + (rowSize * 2)}; // top left
            toothCoordinate['t6' + i] = {x: xStart + (toothSize * (i + 8)), y: yStart + (rowSize * 2)}; // top right
            toothCoordinate['t8' + i] = {x: xStart + (toothSize * (9 - i)), y: yStart + (rowSize * 3)}; // bottom left
            toothCoordinate['t7' + i] = {x: xStart + (toothSize * (i + 8)), y: yStart + (rowSize * 3)}; // bottom right
        }
                    
        context.strokeStyle = "#000";
        context.lineWidth = 1;
        
        var fontSize = Math.ceil(canvas.width * 0.025);
        var toothID;
        
        for (key in toothCoordinate) {
            drawTooth(toothCoordinate[key].x, toothCoordinate[key].y, toothSize * toothSizeFactor, context);
            context.font = fontSize + "px Arial";
            toothID = key.substring(1, 3);
            context.fillText(toothID, toothCoordinate[key].x - (fontSize / 2), toothCoordinate[key].y - fontSize, fontSize);
        }
    }
    
    /* Redraw Background */
    function redrawBackground()
    {
        var canvasWidth = parseInt($(self).css('width').replace(/px/i, ''));
        $(canvas).attr('width', canvasWidth);
        $(canvas).attr('height', canvasWidth / 2);
        canvasCenterPoint = {x: canvas.width / 2, y: canvas.height / 2};
        drawTeeth();
        $(self).attr('height', canvasWidth / 2);
    }

    /* Get nearest tooth ID */
    function getNearestTooth(xIn, yIn)
    {
        var smallestX = canvas.width / 2, smallestY = canvas.width / 2; // init smallest x & y distance by a large number
        var xDiff, yDiff; //variables to hold distance between mouse coordinate and toothCoordinate
        var isSmallestX, isSmallestY;
        var returnTooth;
        
        for (key in toothCoordinate) {
            isSmallestX = false;
            isSmallestY = false;
            
            xDiff = Math.abs(toothCoordinate[key].x - xIn);
            yDiff = Math.abs(toothCoordinate[key].y - yIn);
            
            if (xDiff <= smallestX) {
                isSmallestX = true;
                smallestX = xDiff;
            }
            if (yDiff <= smallestY) {
                isSmallestY = true;
                smallestY = yDiff;
            }
            
            if (isSmallestX && isSmallestY) {
                returnTooth = key;
            }
        }
        
        if ((Math.abs(toothCoordinate[returnTooth].x - xIn) <= (toothSize * toothSizeFactor)) && (Math.abs(toothCoordinate[returnTooth].y - yIn) <= (toothSize * toothSizeFactor)))
            return returnTooth;
        else
            return false;
    }
    
    /* Set Tooth Conditions */
    function setToothConditions(options)
    {
        toothConditions = $.extend(toothConditions, options);
        draw();
    }
    
    /* Get Tooth Conditions */
    function getToothConditions()
    {
        return toothConditions;
    }
    
    /* Get Each Tooth Description */
    function getToothDescriptions(options)
    {
        var description = {};
        if (typeof options === 'object') {
            for (key in options) {
                if (toothConditions[key] !== undefined) {
                    var desc = [];
                    for (index in toothConditions[key]) {
                        switch (toothConditions[key][index]) {
                            case 'karies_oklusal':
                                desc.push('Karies Oklusal');
                                break;
                            case 'karies_distal':
                                desc.push('Karies Distal');
                                break;
                            case 'karies_mesial':
                                desc.push('Karies Mesial');
                                break;
                            case 'karies_bukal':
                                desc.push('Karies Bukal');
                                break;
                            case 'karies_servikal':
                                desc.push('Karies Servikal');
                                break;
                            case 'karies_sekunder':
                                desc.push('Karies Sekunder');
                                break;
                            case 'karies_lingual':
                                desc.push('Karies Lingual');
                                break;
                            case 'karies_palatal':
                                desc.push('Karies Palatal');
                                break;
                            case 'migrasi_bukal':
                                desc.push('Migrasi Bukal');
                                break;
                            case 'migrasi_palatal':
                                desc.push('Migrasi Palatal');
                                break;
                            case 'migrasi_mesial':
                                desc.push('Migrasi Mesial');
                                break;
                            case 'migrasi_distal':
                                desc.push('Migrasi Distal');
                                break;
                            case 'gigi_goyang_1':
                                desc.push('Gigi Goyang 1&deg;');
                                break;
                            case 'gigi_goyang_2':
                                desc.push('Gigi Goyang 2&deg;');
                                break;
                            case 'gigi_goyang_3':
                                desc.push('Gigi Goyang 3&deg;');
                                break;
                            case 'gigi_goyang_4':
                                desc.push('Gigi Goyang 4&deg;');
                                break;
                            case 'rot_cw':
                                desc.push('Rotasi (Kanan)');
                                break;
                            case 'rot_ccw':
                                desc.push('Rotasi (Kiri)');
                                break;
                            case 'sisa_akar':
                                desc.push('Sisa Akar');
                                break;
                            case 'impaksi':
                                desc.push('Impaksi');
                                break;
                            case 'edentulous_ridge':
                                desc.push('Edentulous Ridge');
                                break;
                            case 'gigi_tiruan_sebagian':
                                desc.push('Gigi Tiruan Sebagian');
                                break;
                            case 'gigi_tiruan_cekat':
                                desc.push('Gigi Tiruan Cekat');
                                break;
                            case 'crowded':
                                desc.push('Crowded');
                                break;
                            case 'diasterna':
                                desc.push('Diasterna');
                                break;
                            case 'gangren_pulpa':
                                desc.push('Gangren / Pulpa');
                                break;
                            case 'tumpatan':
                                desc.push('Tumpatan / Crown / Inlay / Onlay');
                                break;
                            case 'persistensi':
                                desc.push('Persistensi');
                                break;
                        }
                    }
                    description[options] = desc.join(', ');
                }
            }
        } else if (typeof options === 'undefined') {
            for (key in toothConditions) {
                var desc = [];
                for (index in toothConditions[key]) {
                    switch (toothConditions[key][index]) {
                        case 'karies_oklusal':
                            desc.push('Karies Oklusal');
                            break;
                        case 'karies_distal':
                            desc.push('Karies Distal');
                            break;
                        case 'karies_mesial':
                            desc.push('Karies Mesial');
                            break;
                        case 'karies_bukal':
                            desc.push('Karies Bukal');
                            break;
                        case 'karies_servikal':
                            desc.push('Karies Servikal');
                            break;
                        case 'karies_sekunder':
                            desc.push('Karies Sekunder');
                            break;
                        case 'karies_palatal':
                            desc.push('Karies Palatal');
                            break;
                        case 'karies_lingual':
                            desc.push('Karies Lingual');
                            break;
                        case 'migrasi_bukal':
                            desc.push('Migrasi Bukal');
                            break;
                        case 'migrasi_palatal':
                            desc.push('Migrasi Palatal');
                            break;
                        case 'migrasi_mesial':
                            desc.push('Migrasi Mesial');
                            break;
                        case 'migrasi_distal':
                            desc.push('Migrasi Distal');
                            break;
                        case 'gigi_goyang_1':
                            desc.push('Gigi Goyang 1&deg;');
                            break;
                        case 'gigi_goyang_2':
                            desc.push('Gigi Goyang 2&deg;');
                            break;
                        case 'gigi_goyang_3':
                            desc.push('Gigi Goyang 3&deg;');
                            break;
                        case 'gigi_goyang_4':
                            desc.push('Gigi Goyang 4&deg;');
                            break;
                        case 'rot_cw':
                            desc.push('Rotasi (Kanan)');
                            break;
                        case 'rot_ccw':
                            desc.push('Rotasi (Kiri)');
                            break;
                        case 'sisa_akar':
                            desc.push('Sisa Akar');
                            break;
                        case 'impaksi':
                            desc.push('Impaksi');
                            break;
                        case 'edentulous_ridge':
                            desc.push('Edentulous Ridge');
                            break;
                        case 'gigi_tiruan_sebagian':
                            desc.push('Gigi Tiruan Sebagian');
                            break;
                        case 'gigi_tiruan_cekat':
                            desc.push('Gigi Tiruan Cekat');
                            break;
                        case 'crowded':
                            desc.push('Crowded');
                            break;
                        case 'diasterna':
                            desc.push('Diasterna');
                            break;
                        case 'gangren_pulpa':
                            desc.push('Gangren / Pulpa');
                            break;
                        case 'tumpatan':
                            desc.push('Tumpatan / Crown / Inlay / Onlay');
                            break;
                        case 'persistensi':
                            desc.push('Persistensi');
                            break;
                    }
                }
                description[key] = desc.join(', ');
            }
        }
        return description;
    }
    
    /* Draw All Tooth Conditions */
    function drawToothConditions()
    {
        for (key in toothConditions) {
            var coordinate = toothCoordinate[key];
            
            for (cond in toothConditions[key]) {
                var quadran = key.substr(1, 1);
                
                switch (toothConditions[key][cond]) {
                    case 'mig_u':
                        drawMigrasi(coordinate.x, coordinate.y, toothSize / 2, 'up', "green");
                        break;
                    case 'mig_d':
                        drawMigrasi(coordinate.x, coordinate.y, toothSize / 2, 'down', "green");
                        break;
                    case 'mig_r':
                        drawMigrasi(coordinate.x, coordinate.y, toothSize / 2, 'right', "green");
                        break;
                    case 'mig_l':
                        drawMigrasi(coordinate.x, coordinate.y, toothSize / 2, 'left', "green");
                        break;
                    case 'rot_cw':
                        drawRotasi(coordinate.x, coordinate.y, toothSize * toothSizeFactor, 'cw', "blue");
                        break;
                    case 'rot_ccw':
                        drawRotasi(coordinate.x, coordinate.y, toothSize * toothSizeFactor, 'ccw', "blue");
                        break;
                    case 'sisa_akar':
                        drawSisaAkar(coordinate.x, coordinate.y, toothSize, "magenta")
                        break;
                    case 'impaksi':
                        drawImpaksi(coordinate.x, coordinate.y, toothSize / 2, "orange");
                        break;
                    case 'edentulous_ridge':
                        drawEdentulousRidge(coordinate.x, coordinate.y, toothSize, "red");
                        break;
                    case 'karies_oklusal':
                        drawKariesOklusal(coordinate.x, coordinate.y, toothSize, "black");
                        break;
                    case 'karies_distal':
                        drawKariesDistal(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "black");
                        break;
                    case 'karies_mesial':
                        drawKariesMesial(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "black");
                        break;
                    case 'karies_bukal':
                        drawKariesBukal(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "black");
                        break;
                    case 'karies_palatal':
                        drawKariesPalatal(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "black");
                        break;
                    case 'karies_lingual':
                        drawKariesLingual(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "black");
                        break;
                    case 'karies_servikal':
                        drawKariesServikal(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "orange");
                        break;
                    case 'migrasi_bukal':
                        drawMigrasiBukal(coordinate.x, coordinate.y, toothSize * toothSizeFactor, quadran, "black");
                        break;
                    case 'migrasi_palatal':
                        drawMigrasiPalatal(coordinate.x, coordinate.y, toothSize * toothSizeFactor, quadran, "black");
                        break;
                    case 'migrasi_mesial':
                        drawMigrasiMesial(coordinate.x, coordinate.y, toothSize * toothSizeFactor, quadran, "black");
                        break;
                    case 'migrasi_distal':
                        drawMigrasiDistal(coordinate.x, coordinate.y, toothSize * toothSizeFactor, quadran, "black");
                        break;
                    case 'crowded':
                        drawCrowded(coordinate.x, coordinate.y, toothSize * toothSizeFactor, "black");
                        break;
                    case 'diasterna':
                        drawDiasterna(coordinate.x, coordinate.y, toothSize * toothSizeFactor, "black");
                        break;
                    case 'gangren_pulpa':
                        drawGangrenPulpa(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "#CC3300");
                        break;
                    case 'karies_sekunder':
                        drawKariesSekunder(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "#660000");
                        break;
                    case 'tumpatan':
                        drawTumpatan(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "#339933");
                        break;
                    case 'persistensi':
                        drawPersistensi(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "#3333CC");
                        break;
                    case 'gigi_goyang_1':
                        drawGigiGoyang(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "#990099", "1");
                        break;
                    case 'gigi_goyang_2':
                        drawGigiGoyang(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "#990099", "2");
                        break;
                    case 'gigi_goyang_3':
                        drawGigiGoyang(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "#990099", "3");
                        break;
                    case 'gigi_goyang_4':
                        drawGigiGoyang(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "#990099", "4");
                        break;
                    case 'gigi_tiruan_sebagian':
                        drawGigiTiruanSebagian(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "#999900");
                        break;
                    case 'gigi_tiruan_cekat':
                        drawGigiTiruanCekat(coordinate.x, coordinate.y, toothSize * 0.85, quadran, "#999900");
                        break;
                    default:
                        break;
                }
            }
        }
    }
    
    /* Set whether the canvas is responsive to resize event */
    function setResponsive(state)
    {
        if (state === true) {
            $(canvas).css('width', '100%');
            $(window).resize(function(){
                canvasCenterPoint = {x: canvas.width / 2, y: canvas.height / 2};
                draw();
            });
        } else {
            $(canvas).css('width', $(self).css('width'));
            draw();
        }
    }
    
    /* Draw Canvas */
    function draw()
    {
        clearCanvas();
        redrawBackground();
        drawToothConditions();
    }

    
    /*-- Functions that draw specific tooth condition --*/
    
    /* Draw sisa akar */
    function drawSisaAkar(origX, origY, size, strokeStyle)
    {
        size = size * toothSizeFactor * 2;
        
        var templateDraw = [
            {x: origX - (size / 4) - (size / 10), y: origY - (size / 3)},
            {x: origX - (size / 10), y: origY + (size / 3)},
            {x: origX + (size / 4) - (size / 10), y: origY - (size / 3)},
            {x: origX + (size * 0.6) - (size / 10), y: origY - (size / 3)},
        ];
        
        var coordinate = templateDraw;
        
        context.lineWidth = 4;
        context.beginPath();
        context.strokeStyle = strokeStyle;
        context.moveTo(coordinate[0].x, coordinate[0].y);
        context.lineTo(coordinate[1].x, coordinate[1].y);
        context.lineTo(coordinate[2].x, coordinate[2].y);
        context.lineTo(coordinate[3].x, coordinate[3].y);
        context.stroke();
    }
    
    /* Draw Edentulous Ridge */
    function drawEdentulousRidge(origX, origY, size, strokeStyle)
    {
        size = size * toothSizeFactor * 2;
        
        var templateDraw = [
            {x: origX - (size / 2), y: origY - (size / 2)},
            {x: origX + (size / 2), y: origY + (size / 2)},
            {x: origX + (size / 2), y: origY - (size / 2)},
            {x: origX - (size / 2), y: origY + (size / 2)},
        ];
        
        var coordinate = templateDraw;
        
        context.lineWidth = 4;
        context.beginPath();
        context.strokeStyle = strokeStyle;
        context.moveTo(coordinate[0].x, coordinate[0].y);
        context.lineTo(coordinate[1].x, coordinate[1].y);
        context.stroke();
        context.moveTo(coordinate[2].x, coordinate[2].y);
        context.lineTo(coordinate[3].x, coordinate[3].y);
        context.stroke();
    }

    /* Draw Migrasi */
    function drawMigrasi(origX, origY, size, direction, strokeStyle)
    {
        var templateDraw = [
            {x: origX - (size / 3), y: origY - (size * 2 / 3)},
            {x: origX, y: origY - size},
            {x: origX + (size / 3), y: origY - (size * 2 / 3)},
            {x: origX, y: origY},
        ];
        
        var coordinate = templateDraw;
        var degree;
        
        switch (direction) {
            case 'up':
                degree = 0;
                break;
            case 'right':
                degree = 90;
                break;
            case 'down':
                degree = 180;
                break;
            case 'left':
                degree = 270;
                break;
            default:
                degree = 0;
                break;
        }
        
        coordinate = rotateObject(templateDraw, {x: origX, y: origY}, degree);
        
        //drawingObject.width = drawingObject.height = 16;
        context.lineWidth = 3;
        context.beginPath();
        context.strokeStyle = strokeStyle;
        context.moveTo(coordinate[0].x, coordinate[0].y);
        context.lineTo(coordinate[1].x, coordinate[1].y);
        context.lineTo(coordinate[2].x, coordinate[2].y);
        context.stroke();
        context.moveTo(coordinate[1].x, coordinate[1].y);
        context.lineTo(coordinate[3].x, coordinate[3].y);
        context.stroke();
    }

    /* Draw Impaksi */
    function drawImpaksi(origX, origY, size, strokeStyle)
    {
        size = size * toothSizeFactor * 2.5;
        
        context.lineWidth = 4;
        context.beginPath();
        context.strokeStyle = strokeStyle;
        context.arc(origX, origY, size, 0, 2 * Math.PI, false);
        context.stroke();
    }

    /* Draw Rotasi */
    function drawRotasi(origX, origY, size, direction, strokeStyle)
    {
        size = size * toothSizeFactor * 2;
        var templateDraw;
        
        if (direction == 'cw') {
            templateDraw = [
                {x: origX + size - (size / 3), y: origY - (size / 3)},
                {x: origX + size, y: origY},
                {x: origX + size + (size / 3), y: origY - (size / 3)},
            ];
        } else if (direction == 'ccw') {
            templateDraw = [
                {x: origX - size - (size / 3), y: origY - (size / 3)},
                {x: origX - size, y: origY},
                {x: origX - size + (size / 3), y: origY - (size / 3)},
            ];        
        }
        
        context.lineWidth = 3;
        context.strokeStyle = strokeStyle;

        context.beginPath();
        context.arc(origX, origY, size, Math.PI, 2 * Math.PI, false);
        context.stroke();

        context.beginPath();
        context.moveTo(templateDraw[0].x, templateDraw[0].y);
        context.lineTo(templateDraw[1].x, templateDraw[1].y);
        context.lineTo(templateDraw[2].x, templateDraw[2].y);
        context.stroke();
    }

    /* Draw Karies Oklusal */
    function drawKariesOklusal(origX, origY, size, strokeStyle)
    {
        size = size * toothSizeFactor * 0.4;
        
        context.lineWidth = 4;
        context.beginPath();
        context.strokeStyle = strokeStyle;
        context.arc(origX, origY, size, 0, 2 * Math.PI, false);
        context.fillStyle = 'black';
        context.fill();
        context.stroke();
    }

    /* Draw Karies Servikal */
    function drawKariesServikal(origX, origY, size, quadran, strokeStyle)
    {
        size = Math.ceil(size * toothSizeFactor);
        context.font = "bold " + size + "px Arial";
        
        context.fillStyle = strokeStyle;
        context.fillText("C", origX - (size / 3), origY + (size / 3), size);
        
    }

    /* Draw Karies Distal */
    function drawKariesDistal(origX, origY, size, quadran, strokeStyle)
    {
        var fillStyle;
        if (quadran == '1' || quadran == '5' || quadran == '4' || quadran == '8') {
            fillStyle = getShadePattern('#7402F7', 0);
            drawSideTrapezoid(origX, origY, toothSize * toothSizeFactor, 'left', '#7402F7', fillStyle);
        } else {
            fillStyle = getShadePattern('#7402F7', 0);
            drawSideTrapezoid(origX, origY, toothSize * toothSizeFactor, 'right', '#7402F7', fillStyle);
        }
    }

    /* Draw Karies Mesial */
    function drawKariesMesial(origX, origY, size, quadran, strokeStyle)
    {
        var fillStyle;
        if (quadran == '1' || quadran == '5' || quadran == '4' || quadran == '8') {
            fillStyle = getShadePattern('#F72AA1', 0);
            drawSideTrapezoid(origX, origY, toothSize * toothSizeFactor, 'right', '#F72AA1', fillStyle);
        } else {
            fillStyle = getShadePattern('#F72AA1', 0);
            drawSideTrapezoid(origX, origY, toothSize * toothSizeFactor, 'left', '#F72AA1', fillStyle);
        }
    }

    /* Draw Karies Bukal */
    function drawKariesBukal(origX, origY, size, quadran, strokeStyle)
    {
        var fillStyle;
        if (quadran == '1' || quadran == '2' || quadran == '5' || quadran == '6') {
            fillStyle = getShadePattern('#F70202', 0);
            drawSideTrapezoid(origX, origY, toothSize * toothSizeFactor, 'down', '#F70202', fillStyle);
        } else {
            fillStyle = getShadePattern('#F70202', 0);
            drawSideTrapezoid(origX, origY, toothSize * toothSizeFactor, 'up', '#F70202', fillStyle);
        }
    }

    /* Draw Karies Lingual */
    function drawKariesLingual(origX, origY, size, quadran, strokeStyle)
    {
        var fillStyle;
        if (quadran == '3' || quadran == '4' || quadran == '7' || quadran == '8') {
            fillStyle = getShadePattern('#B102F7', 0);
            drawSideTrapezoid(origX, origY, toothSize * toothSizeFactor, 'down', '#B102F7', fillStyle);
        } else {
            fillStyle = getShadePattern('#B102F7', 0);
            drawSideTrapezoid(origX, origY, toothSize * toothSizeFactor, 'up', '#B102F7', fillStyle);
        }
    }

    /* Draw Karies Palatal */
    function drawKariesPalatal(origX, origY, size, quadran, strokeStyle)
    {
        var fillStyle;
        if (quadran == '1' || quadran == '2' || quadran == '5' || quadran == '6') {
            fillStyle = getShadePattern('#00AA16', 0);
            drawSideTrapezoid(origX, origY, toothSize * toothSizeFactor, 'up', '#00AA16', fillStyle);
        }
    }

    /* Draw Migrasi Bukal */
    function drawMigrasiBukal(origX, origY, size, quadran, strokeStyle)
    {
        if (quadran == '1' || quadran == '2' || quadran == '5' || quadran == '6') {
            drawMigrasi(origX, origY, size, 'down', strokeStyle);
        } else {
            drawMigrasi(origX, origY, size, 'up', strokeStyle);
        }
    }

    /* Draw Migrasi Palatal */
    function drawMigrasiPalatal(origX, origY, size, quadran, strokeStyle)
    {
        if (quadran == '1' || quadran == '2' || quadran == '5' || quadran == '6') {
            drawMigrasi(origX, origY, size, 'up', '#229E00');
        } else {
            drawMigrasi(origX, origY, size, 'down', '#229E00');
        }
    }

    /* Draw Migrasi Mesial */
    function drawMigrasiMesial(origX, origY, size, quadran, strokeStyle)
    {
        if (quadran == '1' || quadran == '4' || quadran == '5' || quadran == '8') {
            drawMigrasi(origX, origY, size, 'right', '#DD0404');
        } else {
            drawMigrasi(origX, origY, size, 'left', '#DD0404');
        }
    }

    /* Draw Migrasi Distal */
    function drawMigrasiDistal(origX, origY, size, quadran, strokeStyle)
    {
        if (quadran == '1' || quadran == '4' || quadran == '5' || quadran == '8') {
            drawMigrasi(origX, origY, size, 'left', '#A200AA');
        } else {
            drawMigrasi(origX, origY, size, 'right', '#A200AA');
        }
    }
    
    /* Draw Crowded */
    function drawCrowded(origX, origY, size, strokeStyle)
    {
        var templateDraw = [
            {x: origX - (size / 3), y: origY - (size / 3) - (size / 8)},
            {x: origX, y: origY - (size / 8)},
            {x: origX + (size / 3), y: origY - (size / 3) - (size / 8)},
            {x: origX, y: origY - size},
        ];
        
        var coordinate = templateDraw;
        
        coordinate1 = rotateObject(templateDraw, {x: origX, y: origY}, 90);
        coordinate2 = rotateObject(templateDraw, {x: origX, y: origY}, 270);
        
        context.lineWidth = 3;
        context.beginPath();
        context.strokeStyle = strokeStyle;
        context.moveTo(coordinate1[0].x, coordinate1[0].y);
        context.lineTo(coordinate1[1].x, coordinate1[1].y);
        context.lineTo(coordinate1[2].x, coordinate1[2].y);
        context.stroke();
        context.moveTo(coordinate1[1].x, coordinate1[1].y);
        context.lineTo(coordinate1[3].x, coordinate1[3].y);
        context.stroke();
        
        context.moveTo(coordinate2[0].x, coordinate2[0].y);
        context.lineTo(coordinate2[1].x, coordinate2[1].y);
        context.lineTo(coordinate2[2].x, coordinate2[2].y);
        context.stroke();
        context.moveTo(coordinate2[1].x, coordinate2[1].y);
        context.lineTo(coordinate2[3].x, coordinate2[3].y);
        context.stroke();
    }

    /* Draw Diasterna */
    function drawDiasterna(origX, origY, size, strokeStyle)
    {
        
        var templateDraw = [
            {x: origX - (size / 3), y: origY - (size * 2 / 3)},
            {x: origX, y: origY - size},
            {x: origX + (size / 3), y: origY - (size * 2 / 3)},
            {x: origX, y: origY},
        ];
        
        var templateDraw = [
            {x: origX - (size / 3), y: origY - (size * 2 / 3)},
            {x: origX, y: origY - size},
            {x: origX + (size / 3), y: origY - (size * 2 / 3)},
            {x: origX, y: origY  - (size / 8)},
        ];
        
        var coordinate = templateDraw;
        
        coordinate1 = rotateObject(templateDraw, {x: origX, y: origY}, 90);
        coordinate2 = rotateObject(templateDraw, {x: origX, y: origY}, 270);
        
        context.lineWidth = 3;
        context.beginPath();
        context.strokeStyle = strokeStyle;
        context.moveTo(coordinate1[0].x, coordinate1[0].y);
        context.lineTo(coordinate1[1].x, coordinate1[1].y);
        context.lineTo(coordinate1[2].x, coordinate1[2].y);
        context.stroke();
        context.moveTo(coordinate1[1].x, coordinate1[1].y);
        context.lineTo(coordinate1[3].x, coordinate1[3].y);
        context.stroke();
        
        context.moveTo(coordinate2[0].x, coordinate2[0].y);
        context.lineTo(coordinate2[1].x, coordinate2[1].y);
        context.lineTo(coordinate2[2].x, coordinate2[2].y);
        context.stroke();
        context.moveTo(coordinate2[1].x, coordinate2[1].y);
        context.lineTo(coordinate2[3].x, coordinate2[3].y);
        context.stroke();
    }

    /* Draw Gangren Pulpa */
    function drawGangrenPulpa(origX, origY, size, quadran, strokeStyle)
    {
        size = Math.ceil(size * toothSizeFactor);
        context.font = "bold " + size + "px Arial";
        context.fillStyle = strokeStyle;
        context.fillText("GP", origX - (size / 2), origY + (size / 3), size);    
    }

    /* Draw Karies Sekunder */
    function drawKariesSekunder(origX, origY, size, quadran, strokeStyle)
    {
        size = Math.ceil(size * toothSizeFactor);
        context.font = "bold " + size + "px Arial";
        context.fillStyle = strokeStyle;
        context.fillText("S", origX - (size / 3), origY + (size / 3));
    }

    /* Draw Tumpatan */
    function drawTumpatan(origX, origY, size, quadran, strokeStyle)
    {
        size = Math.ceil(size * toothSizeFactor);
        context.font = "bold " + size + "px Arial";
        context.fillStyle = strokeStyle;
        context.fillText("T", origX - (size / 3), origY + (size / 3));
    }
    
    /* Draw Persistensi */
    function drawPersistensi(origX, origY, size, quadran, strokeStyle)
    {
        size = Math.ceil(size * toothSizeFactor);
        context.font = "bold " + size + "px Arial";
        context.fillStyle = strokeStyle;
        context.fillText("P", origX - (size / 3), origY + (size / 3));
    }

    /* Draw Gigi Goyang */
    function drawGigiGoyang(origX, origY, size, quadran, strokeStyle, degree)
    {
        size = Math.ceil(size * toothSizeFactor);
        context.font = "bold " + size + "px Arial";
        context.fillStyle = strokeStyle;
        context.fillText("\u00b0" + degree, origX - (size / 2), origY + (size / 3));
    }

    /* Draw Gigi Tiruan Sebagian */
    function drawGigiTiruanSebagian(origX, origY, size, quadran, strokeStyle)
    {
        size = Math.ceil(size * toothSizeFactor);
        context.font = "bold " + size + "px Arial";
        context.fillStyle = strokeStyle;
        context.fillText("GTS", origX - size, origY + (size / 3));
    }

    /* Draw Gigi Tiruan Cekat */
    function drawGigiTiruanCekat(origX, origY, size, quadran, strokeStyle)
    {
        size = Math.ceil(size * toothSizeFactor);
        context.font = "bold " + size + "px Arial";
        context.fillStyle = strokeStyle;
        context.fillText("GTC", origX - size, origY + (size / 3));
    }

    /*-- End of functions that draw specific tooth condition --*/
        
    /*-----------------------------------------*/
    /*------- End of Internal functions -------*/
    /*-----------------------------------------*/
    
    /* Public method */
    var methods = {
        init: function(options){
            canvas = self.appendChild(document.createElement('canvas'));
            context = canvas.getContext('2d');
            
            $(canvas).css('width', $(self).css('width'));
            
            if (typeof options === 'undefined') {
                toothConditions = initToothConditions();
            } else {
                toothConditions = $.extend(initToothConditions(), options.toothConditions);
            }
            
            if (options.responsive === true) {
                setResponsive(true);
            } else {
                setResponsive(false);
            }
                        
        },
        drawTeeth: function(){
            return drawTeeth();
        },
        clearCanvas: function(){
            return clearCanvas();
        },
        drawToothConditions: function(){
            return drawToothConditions();
        },
        getToothConditions: function(){
            return getToothConditions();
        },
        setToothConditions: function(options){
            return setToothConditions(options);
        },
        getToothDescriptions: function(options){
            return getToothDescriptions(options);
        },
        setResponsive: function(state){
            return setResponsive(state);
        },
        getNearestTooth: function(x, y){
            return getNearestTooth(x, y);
        }
    };
    
    $.fn.szToothCanvas = function(params){
        self = this.get(0);
        
        if (methods[params]) {
            return methods[params].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof params === 'object' || typeof params === 'undefined') {
            methods.init.apply(this, arguments);
        }else {
            $.error('Method ' +  params + ' does not exist on jQuery.szToothCanvas');
        }
        
        draw();
        return this;
    }
})(jQuery);
