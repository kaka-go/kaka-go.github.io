var posX, posY;
var curX, curY;
var vx, vy;
var isDown = false;

var ballImg = new Image();
ballImg.src = 'img/ball.png';
var moneyballImg = new Image();
moneyballImg.src = 'img/moneyball.png';
var backboardImg = new Image();
backboardImg.src = 'img/backboard.png';
var hoopImg = new Image();
hoopImg.src = 'img/hoop.png';
var netImg = new Image();
netImg.src = 'img/net.png';
var pillarImg = new Image();
pillarImg.src = 'img/pillar.png';
var bgImg = new Image();
bgImg.src = 'img/bg.jpg';

function drawParabola(ctx){
        ctx.fillStyle = '#00ee00';
        var v=vy;
        var step=2;
        for(var i=0; i<30; i+=step, v+=GRAVITY/60*step){
            ctx.beginPath();
            ctx.arc(posX+(i*vx/30), posY+(i*v/30), 5-i/30, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }
}

function showMouse(ctx){
        if(isDown){
            ctx.fillStyle = '#00ff00';
//            ctx.fillText(posX+','+posY+' -> '+curX+','+curY+' ('+vx+','+vy+')', curX, curY); 

            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.lineTo(curX, curY);
            ctx.closePath();
//            ctx.stroke();

            drawParabola(ctx);
        }

        ctx.fillStyle = '#11ff11';
        ctx.beginPath();
        var r = 26;
        if(isDown) ctx.arc(posX, posY, (r+2), 0, Math.PI*2, true); 
        else ctx.arc(curX, curY, (r+2), 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
        
        var img = ((ballNum+1)%BALLGAP==0) ? moneyballImg : ballImg; 

        if(isDown) ctx.drawImage(img, posX-r, posY-r, 2*r, 2*r);
        else ctx.drawImage(img, curX-r, curY-r, 2*r, 2*r);
}

function drawScene(ctx){
    ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(pillarImg, backboardX-120, backboardY, 180, 330);
    ctx.drawImage(backboardImg, backboardX-80, backboardY-75, 150, 150);
    ctx.drawImage(hoopImg, hoopX1-25, hoopY-30, 120, 110);

    for(var i=0; i<balls.length; i++){
        var deg = balls[i].GetRotation();
        var r = balls[i].GetShapeList().m_radius;
        var x = balls[i].GetCenterPosition().x;
        var y = balls[i].GetCenterPosition().y;

// draw shadow
        ctx.save();
        ctx.translate(x, GROUNDY-10);
        ctx.scale(1, 0.4);
        ctx.beginPath();
        ctx.arc(0,0,r,0,2*Math.PI, false);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill();
        ctx.restore();
    }

    for(var i=0; i<balls.length; i++){
        var deg = balls[i].GetRotation();
        var r = balls[i].GetShapeList().m_radius;
        var x = balls[i].GetCenterPosition().x;
        var y = balls[i].GetCenterPosition().y;
        var mb = balls[i].GetShapeList().GetUserData().moneyball;
        var img = mb ? moneyballImg : ballImg;

// draw ball image
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(deg);
        ctx.drawImage(img, -r, -r, 2*r, 2*r);
        ctx.restore();
    }

    ctx.drawImage(netImg, hoopX1-25, hoopY-30, 120, 110);  
}

function drawInfo(ctx){
    var infoY = canvasHeight - 20;
    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    ctx.fillRect(0,infoY-25,canvasWidth, 30);

    ctx.font = 'bold 25px arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText("Score: " + score, canvasWidth/3, infoY);
    ctx.fillStyle = '#ff8800';
    ctx.fillText("Score: " + score, canvasWidth/3, infoY);

    var timeLeft = ((GAMETIME-(currTime-startTime))/1000).toFixed(2);
    if(timeLeft < 0.04) timeLeft = (0.00).toFixed(2);

    if(timeLeft < 6){
        var fontSize = 25 + (timeLeft*10)%10; 
        ctx.font = 'bold ' + fontSize + 'px arial';
    }
    ctx.strokeText("Time: " + timeLeft, canvasWidth/3*2, infoY);
    ctx.fillText("Time: "+ timeLeft, canvasWidth/3*2, infoY);
    ctx.lineWidth = 1;
}

function drawGrid(context){
    for(var i = 0; i < canvasWidth; i += 20){
        context.strokeStyle = (i%100==0) ? '#eeee00' : '#eeeeff';
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvasHeight);
        context.stroke();
    }
    context.strokeStyle = '#eeee00';
    for(var j = 0; j < canvasHeight; j += 100){
        context.beginPath();
        context.moveTo(0, j);
        context.lineTo(canvasWidth, j);
        context.stroke();
    }
}

function drawWorld(world, context) {
    for (var j = world.m_jointList; j; j = j.m_next) {
    	drawJoint(j, context);
    }
    for (var b = world.m_bodyList; b; b = b.m_next) {
    	for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
    	    drawShape(s, context);
    	}
    }
}
 
function drawJoint(joint, context) {
    var b1 = joint.m_body1;
    var b2 = joint.m_body2;
    var x1 = b1.m_position;
    var x2 = b2.m_position;
    var p1 = joint.GetAnchor1();
    var p2 = joint.GetAnchor2();
    context.strokeStyle = '#00eeee';
    context.beginPath();
    switch (joint.m_type) {
    case b2Joint.e_distanceJoint:
	context.moveTo(p1.x, p1.y);
	context.lineTo(p2.x, p2.y);
	break;
 
    case b2Joint.e_pulleyJoint:
	// TODO
	break;
 
    default:
	if (b1 == world.m_groundBody) {
	    context.moveTo(p1.x, p1.y);
	    context.lineTo(x2.x, x2.y);
	}
	else if (b2 == world.m_groundBody) {
	    context.moveTo(p1.x, p1.y);
	    context.lineTo(x1.x, x1.y);
	}
	else {
	    context.moveTo(x1.x, x1.y);
	    context.lineTo(p1.x, p1.y);
	    context.lineTo(x2.x, x2.y);
	    context.lineTo(p2.x, p2.y);
	}
	break;
    }
    context.stroke();
}
 
function drawShape(shape, context) {
    context.strokeStyle = '#ffffff';
    if (shape.density == 1.0) {
	context.fillStyle = "red";
    } else {
	context.fillStyle = "black";
    }
    context.beginPath();
    switch (shape.m_type) {
    case b2Shape.e_circleShape:
	{
	    var circle = shape;
	    var pos = circle.m_position;
	    var r = circle.m_radius;
	    var segments = 16.0;
	    var theta = 0.0;
	    var dtheta = 2.0 * Math.PI / segments;
 
	    // draw circle
	    context.moveTo(pos.x + r, pos.y);
	    for (var i = 0; i < segments; i++) {
		var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
		var v = b2Math.AddVV(pos, d);
		context.lineTo(v.x, v.y);
		theta += dtheta;
	    }
	    context.lineTo(pos.x + r, pos.y);
 
	    // draw radius
	    context.moveTo(pos.x, pos.y);
	    var ax = circle.m_R.col1;
	    var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
	    context.lineTo(pos2.x, pos2.y);
	}
	break;
    case b2Shape.e_polyShape:
	{
	    var poly = shape;
	    var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
	    context.moveTo(tV.x, tV.y);
	    for (var i = 0; i < poly.m_vertexCount; i++) {
		var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
		context.lineTo(v.x, v.y);
	    }
	    context.lineTo(tV.x, tV.y);
	}
	break;
    }
    context.fill();
    context.stroke();
}

