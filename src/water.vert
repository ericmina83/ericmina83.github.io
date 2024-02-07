varying vec4 vPos;
varying vec4 pPos;

void main() {
    vPos = modelViewMatrix * vec4(position, 1);
    pPos = projectionMatrix * vPos;
    gl_Position = pPos;
}