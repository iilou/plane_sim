const canvas = document.querySelector('canvas');
var gl = canvas.getContext('webgl');


function tower(arr, l, w, h, x, y, z){
    var rect = [
        x+l/2, y+h/2, z+w/2,
        x+l/2, y+h/2, z-w/2,
        x+l/2, y-h/2, z-w/2,

        x+l/2, y+h/2, z+w/2,
        x+l/2, y-h/2, z-w/2,
        x+l/2, y-h/2, z+w/2,

        x-l/2, y+h/2, z+w/2,
        x-l/2, y+h/2, z-w/2,
        x-l/2, y-h/2, z-w/2,

        x-l/2, y+h/2, z+w/2,
        x-l/2, y-h/2, z-w/2,
        x-l/2, y-h/2, z+w/2,

        x+l/2, y+h/2, z+w/2,
        x+l/2, y-h/2, z+w/2,
        x-l/2, y-h/2, z+w/2,

        x+l/2, y+h/2, z+w/2,
        x-l/2, y+h/2, z+w/2,
        x-l/2, y-h/2, z+w/2,

        x+l/2, y+h/2, z-w/2,
        x+l/2, y-h/2, z-w/2,
        x-l/2, y-h/2, z-w/2,

        x+l/2, y+h/2, z-w/2,
        x-l/2, y+h/2, z-w/2,
        x-l/2, y-h/2, z-w/2,

        x+l/2, y+h/2, z+w/2,
        x+l/2, y+h/2, z-w/2,
        x-l/2, y+h/2, z-w/2,

        x+l/2, y+h/2, z+w/2,
        x-l/2, y+h/2, z-w/2,
        x-l/2, y+h/2, z+w/2,

        x+l/2, y-h/2, z+w/2,
        x+l/2, y-h/2, z-w/2,
        x-l/2, y-h/2, z-w/2,

        x+l/2, y-h/2, z+w/2,
        x-l/2, y-h/2, z-w/2,
        x-l/2, y-h/2, z+w/2,
    ]

    for(var i = 0; i < rect.length; i+=1){
        arr.push(rect[i]);
    }

    return arr;
}

function floor(arr, s, ds){
    for(var i = -s; i <= s; i+=ds){
        for(var j = -s; j <= s; j+=ds){
            arr.push(i, 0, j);
            arr.push(i+ds, 0, j);
            arr.push(i, 0, j+ds);
            arr.push(i+ds, 0, j+ds);
            arr.push(i, 0, j+ds);
            arr.push(i+ds, 0, j);
        }
    }
    return arr;
}

var vertexData = [];

vertexData = tower(vertexData, 100, 100, 1000, -110, 490, -1750);
vertexData = tower(vertexData, 100, 100, 1000, 110, 490, -1750);
vertexData = floor(vertexData, 10000, 40);

// const tower1 = tower(100, 100, 1000, -110, 490, -1750);
// const tower2 = tower(100, 100, 1000, 110, 490, -1750);
// const floor1 = floor(10000, 40);

// const vertexData = tower1.concat(tower2, floor1);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorData = [];
for(let face = 0; face < vertexData.length / 3; face++) {
    colorData.push(0.5, 0.5, 0.5, 1);
}

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);



const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

uniform mat4 matrix;

void main() {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));





const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);



document.querySelector('body').appendChild(document.createElement("div1"));
document.querySelector('div1').innerHTML = "";
document.querySelector('body').appendChild(document.createElement("div2"));
document.querySelector('div2').innerHTML = "";


const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
};

const zero = (v, lim) => {
    for(var i = 0; i < v.length; i++){
        if(Math.abs(v[i]) < lim){
            v[i] = 0;
        }
    }
    return v;
}   

const mag = (v) => {
    return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}

const sumVectors = (v1, v2) => {
    return [v1[0]+v2[0], v1[1]+v2[1], v1[2]+v2[2]];
}

const dot = (v1, v2) => {
    return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}

const cross = (v1, v2) => {
    return [v1[1]*v2[2] - v1[2]*v2[1],
            v1[2]*v2[0] - v1[0]*v2[2],
            v1[0]*v2[1] - v1[1]*v2[0]];
}

const normalize = (v) => {
    var m = mag(v);
    return [v[0]/m, v[1]/m, v[2]/m];
}

const productConstVector = (c, v) => {
    return [c*v[0], c*v[1], c*v[2]];
}

const rotateVector = (v, theta, axis) => {
    var x = v[0];
    var y = v[1];
    var z = v[2];
    var c = Math.cos(theta);
    var s = Math.sin(theta);

    var x1 = (c + (1-c)*axis[0]*axis[0])*x + ((1-c)*axis[0]*axis[1] - s*axis[2])*y + ((1-c)*axis[0]*axis[2] + s*axis[1])*z;
    var y1 = ((1-c)*axis[0]*axis[1] + s*axis[2])*x + (c + (1-c)*axis[1]*axis[1])*y + ((1-c)*axis[1]*axis[2] - s*axis[0])*z;
    var z1 = ((1-c)*axis[0]*axis[2] - s*axis[1])*x + ((1-c)*axis[1]*axis[2] + s*axis[0])*y + (c + (1-c)*axis[2]*axis[2])*z;

    return [x1, y1, z1];
};

const rotation3D = (v, theta_x, theta_y, theta_z) => {
    var x = v[0];
    var y = v[1];
    var z = v[2];

    var x1 = x*Math.cos(theta_y)*Math.cos(theta_z) + y*(Math.cos(theta_y)*Math.sin(theta_z)*Math.sin(theta_x) - Math.sin(theta_y)*Math.cos(theta_x)) + z*(Math.cos(theta_y)*Math.sin(theta_z)*Math.cos(theta_x) + Math.sin(theta_y)*Math.sin(theta_x));
    var y1 = x*Math.sin(theta_y)*Math.cos(theta_z) + y*(Math.sin(theta_y)*Math.sin(theta_z)*Math.sin(theta_x) + Math.cos(theta_y)*Math.cos(theta_x)) + z*(Math.sin(theta_y)*Math.sin(theta_z)*Math.cos(theta_x) - Math.cos(theta_y)*Math.sin(theta_x));
    var z1 = -x*Math.sin(theta_z) + y*Math.cos(theta_z)*Math.sin(theta_x) + z*Math.cos(theta_z)*Math.cos(theta_x);

    return [x1, y1, z1];
}

// const addRotation = (v, theta, axis) => {





var thrust = 0;
var weight = 1;
var drag = 0;

var velocity = [0,0,10];
var sumForce = [0,0,0];

var dive = 0;
var spin = 0;
var koel = 0;

var q = quat.create();

var angularVelocity = [0,0,0];
var angularAcceleration = [0,0,0];

var dir = [0,0,1];









const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, 
    75 * Math.PI/180, // vertical field-of-view (angle, radians)
    canvas.width/canvas.height, // aspect W/H
    1e-4, // near cull distance
    1e4 // far cull distance
);

const rotationMatrix = mat4.create();
const rotationBase = mat4.create();

const mvMatrix = mat4.create();
const mvpMatrix = mat4.create();
const finMatrix = mat4.create();

// mat4.translate(modelMatrix, modelMatrix, [-1.5, 0, -2]);

mat4.translate(viewMatrix, viewMatrix, [-3, 97, 1]);
mat4.invert(viewMatrix, viewMatrix);

const translate = (v) => {
    mat4.translate(modelMatrix, modelMatrix, v);
}

function animate() {
    requestAnimationFrame(animate);


    angularVelocity = sumVectors(angularVelocity, angularAcceleration);

    if(Math.abs(angularVelocity[1]) >= 0.04){
        angularVelocity[1] = 0.04 * Math.sign(angularVelocity[1]);
    }

    dive += angularVelocity[0];
    koel += angularVelocity[1];
    spin += angularVelocity[2];

    if(Math.abs(dive) > Math.PI/6){
        dive = Math.PI/6 * Math.sign(dive);
        angularVelocity[0] = 0;
    }

    if(Math.abs(koel) > 2*Math.PI){
        koel = koel - 2*Math.PI * Math.sign(koel);
    }
    if(Math.abs(spin) > Math.PI/4){
        spin = Math.PI/4 * Math.sign(spin);
        angularVelocity[2] = 0;
    }

    dir = [Math.cos(dive)*Math.sin(koel), Math.sin(dive), Math.cos(dive)*Math.cos(koel)];

    q = quat.fromEuler(q, dive*(180/Math.PI), -koel*(180/Math.PI), -spin*(180/Math.PI));
    mat4.fromQuat(rotationMatrix, q);
    // mat4.rotateZ(rotationMatrix, rotationBase, -spin);
    // mat4.rotateX(rotationMatrix, rotationMatrix, -dive);
    // mat4.rotateY(rotationMatrix, rotationMatrix, -koel);

    drag = 0.0005 * mag(velocity) * mag(velocity);

    sumForce = [0,0,0];
    sumForce = sumVectors(sumForce, productConstVector(thrust, dir)); // add forward backward forces
    sumForce = sumVectors(sumForce, productConstVector(-drag, dir)); // add drag force in direction
    sumForce = sumVectors(sumForce, productConstVector(-0.01 * Math.sin(dive) * dot(velocity, [dir[0], 0, dir[2]]), [dir[0], 0, dir[2]])); // add weight force
    sumForce = sumVectors(sumForce, productConstVector(-0.1 * Math.sin(spin) - 0.1, cross(cross(dir, velocity), dir))); // add sideways forces
    
    velocity = sumVectors(velocity, sumForce); // add acceleration to velocity

    translate(velocity);
    
    document.querySelector('div1').innerHTML = spin*180/Math.PI  + " " + velocity[2] + " " + thrust + " " + weight;
    document.querySelector('div2').innerHTML = "";

    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    mat4.multiply(mvpMatrix, rotationMatrix, mvMatrix);
    mat4.multiply(finMatrix, projectionMatrix, mvpMatrix);

    angularVelocity = productConstVector(0.95, angularVelocity);
    dive = 0.98 * dive;
    // koel = 0.99 * (koel);
    spin = 0.98 * (spin);//angular decay for simplification

    gl.uniformMatrix4fv(uniformLocations.matrix, false, finMatrix);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.clearColor(0.4, 0.4, 0.8, 1);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

document.addEventListener('keydown', (e) => {
    if(e.key == 'd'){
        thrust = Math.max(thrust + 0.001, 0.3);
    }
    if(e.key == 'q'){
        velocity = [0,0,1];
    }
    if(e.key == 's'){
        angularAcceleration[1] = 0.0019;
        angularAcceleration[2] = 0.0004;
    }
    if(e.key == 'f'){
        angularAcceleration[1] = -0.0019;
        angularAcceleration[2] = -0.0004;
    }
    if(e.key == ' '){
        angularAcceleration[0] = -0.0002;
    }
    if(e.key == 'Shift'){
        angularAcceleration[0] = 0.0002;
    }
});

document.addEventListener('keyup', (e) => {
    if(e.key == 'd'){
        thrust = 0.2;
    }
    if(e.key == 's'){
        angularAcceleration[1] = 0;
        angularAcceleration[2] = 0;
    }
    if(e.key == 'f'){
        angularAcceleration[1] = 0;
        angularAcceleration[2] = 0;
    }
    if(e.key == ' '){
        angularAcceleration[0] = 0;
    }
    if(e.key == 'Shift'){
        angularAcceleration[0] = 0;
    }
});


animate();