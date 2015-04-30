var world;
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;

var balls = [];
var score = 0;
var ballNum = 0;
var BALLGAP = 5;

var startTime=0, currTime=0;
var GRAVITY = 500;
var GAMETIME = 15001;

var MINX = 300;
var MAXY = 390;
var GROUNDY = 430;

var debugWorld = false;
var debugGrid = false;


function createGround(world){
    var groundSd = new b2BoxDef();
    groundSd.extents.Set(1000,10);
    groundSd.restitution = 0.2;
    groundSd.userData = 'ground';
    var groundBd = new b2BodyDef();
    groundBd.AddShape(groundSd);
    groundBd.position.Set(0, GROUNDY);
    return world.CreateBody(groundBd);
}

function createBox(world, x, y, width, height, fixed, userData){
    if(typeof(fixed) == 'undefined') fixed = true;
    var boxSd = new b2BoxDef();
    if(!fixed) boxSd.density = 1.0;
    boxSd.userData = userData;
    boxSd.extents.Set(width, height);
    var boxBd = new b2BodyDef();
    boxBd.AddShape(boxSd);
    boxBd.position.Set(x,y);
    return world.CreateBody(boxBd);
}

function createCircle(world, x, y, r, fixed, vec, userData){
    if(typeof(fixed) == 'undefined') fixed = true;
    var circleSd = new b2CircleDef();
    if(!fixed) circleSd.density = 1.0;
    circleSd.userData = userData;
    circleSd.radius = r;
    circleSd.restitution = 0.7;
    circleSd.friction = 0.5;
    var circleBd = new b2BodyDef();
    circleBd.AddShape(circleSd);
    circleBd.position.Set(x, y);
    if(typeof(vec) != 'undefined') circleBd.linearVelocity = vec;
    return world.CreateBody(circleBd);
}

function createJoint(world, circleBody, x, y){
    var jointDef = new b2RevoluteJointDef();
    jointDef.anchorPoint.Set(x, y);
    jointDef.body1 = world.GetGroundBody();
    jointDef.body2 = circleBody;
    world.CreateJoint(jointDef);
}

function createJoint2(world, body1, body2){
    var jointDef = new b2RevoluteJointDef();
    jointDef.anchorPoint.Set(body1.GetOriginPosition().x, body1.GetOriginPosition().y);
    jointDef.body1 = body1;
    jointDef.body2 = body2;
    world.CreateJoint(jointDef);
}

var backboardX = 100;
var backboardY = 100;
var backboardW = 10;
var backboardH = 70;
var hoopX1 = 115;
var hoopX2 = 200;
var hoopY = 160;
var hoopR = 6;
function createBasket(world){
    createBox(world, backboardX, backboardY, backboardW, backboardH);
    createCircle(world, hoopX1, hoopY, hoopR);
    createCircle(world, hoopX2, hoopY, hoopR);

    var net1 = createCircle(world, hoopX1+10, hoopY+20, hoopR, false);
    var net2 = createCircle(world, hoopX2-10, hoopY+20, hoopR, false);
    createJoint(world, net1, hoopX1+5, hoopY+10);
    createJoint(world, net2, hoopX2-5, hoopY+10); 
    var net3 = createCircle(world, hoopX1+15, hoopY+30, 5, false);
    var net4 = createCircle(world, hoopX2-15, hoopY+30, 5, false);
    createJoint(world, net3, hoopX1+10, hoopY+20);
    createJoint(world, net4, hoopX2-10, hoopY+20);
    var net5 = createCircle(world, hoopX1+20, hoopY+40, 5, false);
    var net6 = createCircle(world, hoopX2-20, hoopY+40, 5, false);
    createJoint(world, net5, hoopX1+15, hoopY+30);
    createJoint(world, net6, hoopX2-15, hoopY+30);

    var net9 = createCircle(world, 135, 220, 5, false);
    var net10 = createCircle(world, 180, 220, 5, false);
    createJoint(world, net9, hoopX1+20, hoopY+50);
    createJoint(world, net10, hoopX2-20, hoopY+50);
}

function createWorld(){
    var worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-1000,-1000);
    worldAABB.maxVertex.Set(1000,1000);
    var g = new b2Vec2(0, GRAVITY);
    var doSleep = true;
    var world = new b2World(worldAABB, g, doSleep);
    createGround(world);
    createBox(world, 0, 0, 10, canvasHeight);
    createBox(world, canvasWidth, 0, 10, canvasHeight);

    createBasket(world);

    return world;
}

function checkScore(){
    for(var i=0; i<balls.length; i++){
        var r = balls[i].GetShapeList().m_radius;
        var x = balls[i].GetCenterPosition().x;
        var y = balls[i].GetCenterPosition().y;
        var vy = balls[i].GetLinearVelocity().y;
        if(!(balls[i].GetShapeList().GetUserData().goal) && 
           vy > 0 && hoopX1+r < x && hoopX2-r > x &&
           hoopY < y && hoopY+r/2 > y){
           balls[i].GetShapeList().GetUserData().goal = true; 
//           balls[i].Freeze();
           score += balls[i].GetShapeList().GetUserData().score;;
           playSound(goalSound);
        }
    }
}

function removeBalls(){
    for(var coll = world.m_contactList; coll != null; coll = coll.GetNext()){
        var ball = null;
        if(coll.GetShape1().GetUserData() == 'ground')
            ball = coll.GetShape2();
        if(coll.GetShape2().GetUserData() == 'ground')
            ball = coll.GetShape1();
        if(ball != null && ball.GetUserData() != null
                && !ball.GetUserData().hitGround){
            ball.GetUserData().hitGround = true;
            playSound(bounceSound);
        }
    }
    for(var i=0; i<balls.length; i++){
        var r = balls[i].GetShapeList().m_radius;
        var x = balls[i].GetCenterPosition().x;
        var y = balls[i].GetCenterPosition().y;
        var info = balls[i].GetShapeList().GetUserData();
        if(x<-r || x>canvasWidth+2*r || y > canvasHeight+2*r){
            info.hitGround = true;
        }
        if(info.hitGround){
            info.timeout --;
        }
        if(info.timeout < 0){
           world.DestroyBody(balls[i]);
           balls.splice(i,1);
        } 
    }
}

function step(cnt){

    checkScore();
    removeBalls();

    var stepping = false;
    var timeStep = 1.0/60;
    var iteration = 1;
    world.Step(timeStep, iteration);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawScene(ctx);
    if(debugWorld) drawWorld(world, ctx);
    if(debugGrid) drawGrid(ctx);

    showMouse(ctx);
    drawInfo(ctx);

    if(startTime!=0)
        currTime = Date.now();

    if(currTime - startTime <= GAMETIME || balls.length!=0)
        setTimeout("step(" + (cnt || 0) + ")", 10);
    else
        playSound(endSound);
}

function restart(){
    score = 0;
    ballNum = 0;
    if(currTime - startTime <= GAMETIME || balls.length!=0){
        currTime = 0;
        startTime = 0;
        for(var i=0; i<balls.length; ){
            world.DestroyBody(balls[i]);
            balls.splice(i,1);
        }
    }
    else{
        currTime = 0;
        startTime = 0;
        step();
    }
}

var ballInfo = function(mball){
    this.moneyball = false;
    if(typeof(mball) != 'undefined') this.moneyball = mball;

    this.score = 1;
    if(this.moneyball) this.score = 3;

    this.goal= false;
    this.hitGround = false;
    this.timeout = 100;
}

function handleKeyPress(evt){
    console.log(evt.keyCode);
    if(evt.keyCode == 49) debugWorld = !debugWorld;  // press '1'
    if(evt.keyCode == 50) debugGrid = !debugGrid;  // press '2'
    if(evt.keyCode == 82 || evt.keyCode == 114) restart();     // press 'r'
    if(evt.keyCode == 83 || evt.keyCode == 115) setMute();     // press 's'
}

Event.observe(window, 'load', function(){
    ctx = $('canvas').getContext('2d');
    var canvasElm = $('canvas');
    canvasWidth = parseInt(canvasElm.width);
    canvasHeight= parseInt(canvasElm.height);
    canvasTop = parseInt(canvasElm.style.top);
    canvasLeft = parseInt(canvasElm.style.left);

    world = createWorld();

    Event.observe('canvas', 'mousedown', function(e){
        if(startTime==0) startTime = Date.now();
        if(!isDown){
            posX = e.layerX;
            posY = e.layerY;
            if(posX < MINX) posX = MINX;
            if(posY > MAXY) posY = MAXY;
            vx = 0;
            vy = 0;
        }
        isDown = true;
    });
    Event.observe('canvas', 'mousemove', function(e){
        curX = e.layerX;
        curY = e.layerY;
        if(!isDown && curX < MINX) curX = MINX; 
        if(!isDown && curY > MAXY) curY = MAXY; 
        vx = (curX - posX) * 3;
        vy = (curY - posY) * 3;
    });
    Event.observe('canvas', 'mouseup', function(e){
        isDown = false;
        if(curX < MINX) curX = MINX;
        if(curY > MAXY) curY = MAXY;
    });
    Event.observe('canvas', 'click', function(e){
        if(currTime-startTime <= GAMETIME){
            ballNum ++;
            var mb = false;
            if(ballNum % BALLGAP == 0) mb = true;
            balls[balls.length] = createCircle(world, posX, posY, 
                Math.random()*2 + 26, false, 
                new b2Vec2(vx, vy), new ballInfo(mb)); 
        }
    });

    window.addEventListener('keypress',handleKeyPress,true);

    step();
});
