// https://github.com/madblade/waves-gerstner/blob/master/src/ocean.vertex.glsl
// https://github.com/mrdoob/three.js/blob/r156/examples/jsm/objects/Water.js

uniform mat4 textureMatrix;
uniform float time;

uniform vec3 wave1;
uniform vec3 wave2;
uniform vec3 wave3;

varying vec4 worldPosition;
varying vec4 mirrorCoord;

#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>

const float pi = 3.1415926;
const int waveCount = 16;

float random(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

// rotate point a with circle path around the original point
vec3 getWaveOffset(vec2 coord, float angle, float amplitude, float waveLength) {
    vec2 d = vec2(cos(angle), sin(angle));
    float omega = 2.0 * pi / waveLength;
    float amp = amplitude / omega;
    float c = sqrt(9.8 / omega);
    float dotWpD = omega * dot(coord, d) + c * time;

    float x = amp * d.x * cos(dotWpD);
    float y = amp * sin(dotWpD);
    float z = amp * d.y * cos(dotWpD);

    return vec3(x, y, z);
}

// using partial derivative
// d coord.x
// d coord.y
// vec3 addWaveNormal(vec2 coord, float angle, float amplitude, float waveLength, float steepness, float speed) {
//     vec2 d = vec2(cos(angle), sin(angle));
//     float omega = 2.0 * pi / waveLength;
//     float phase = 2.0 * pi * speed;
//     float dotWpD = omega * dot(coord, d) + phase * time;

//     float x = amplitude * omega * cos(dotWpD) * d.x;
//     float y = steepness * omega * sin(dotWpD);
//     float z = amplitude * omega * cos(dotWpD) * d.y;

//     return vec3(x, y, z);
// }

float lerp(float min, float max, float t) {
    return min + (max - min) * t;
}

void main() {
    worldPosition = modelMatrix * vec4(position, 1.0);
    mirrorCoord = worldPosition.xyzw;
    mirrorCoord = textureMatrix * mirrorCoord;

    vec3 gp = worldPosition.xyz;

    vec2 coord = worldPosition.xz;

    // for(int i = 0; i < waveCount; i++) {
    //     float ang = random(vec2(i, 1.0)) * 2.0 * pi;
    //     float len = lerp(0.5, 2.0, random(vec2(i, 2.0)));
    //     float amp = lerp(0.6, 1.0, random(vec2(i, 3.0)));

    //     gp += getWaveOffset(coord, ang, amp, len);
    //     // gn += addWaveNormal(coord, ang, amp, len, ste, spe);
    // }

    gp += getWaveOffset(coord, wave1.x, wave1.y, wave1.z);
    gp += getWaveOffset(coord, wave2.x, wave2.y, wave2.z);
    gp += getWaveOffset(coord, wave3.x, wave3.y, wave3.z);

    worldPosition = vec4(gp, 1.0);
    vec4 mvPosition = viewMatrix * worldPosition;
    gl_Position = projectionMatrix * mvPosition;

    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
    #include <shadowmap_vertex>
}
