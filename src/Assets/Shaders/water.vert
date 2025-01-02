// https://github.com/madblade/waves-gerstner/blob/master/src/ocean.vertex.glsl
// https://github.com/mrdoob/three.js/blob/r156/examples/jsm/objects/Water.js

uniform mat4 textureMatrix;
uniform sampler2D waveData;
uniform float time;

varying vec4 worldPosition;
varying vec3 vvnormal;

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
vec3 addWaveOffset(vec2 coord, float angle, float amplitude, float waveLength, float steepness, float speed) {
    vec2 d = vec2(cos(angle), sin(angle));
    float omega = 2.0 * pi / waveLength;
    // float k = 2.0 * pi /waveLength;
    // float phase = 
    float phase = 2.0 * pi * speed;
    float dotWpD = omega * dot(coord, d) + phase * time;

    float x = steepness * d.x * cos(dotWpD);
    float y = amplitude * sin(dotWpD);
    float z = steepness * d.y * cos(dotWpD);

    return vec3(x, y, z);
}

// using partial derivative
// d coord.x
// d coord.y
vec3 addWaveNormal(vec2 coord, float angle, float amplitude, float waveLength, float steepness, float speed) {
    vec2 d = vec2(cos(angle), sin(angle));
    float omega = 2.0 * pi / waveLength;
    float phase = 2.0 * pi * speed;
    float dotWpD = omega * dot(coord, d) + phase * time;

    float x = amplitude * omega * cos(dotWpD) * d.x;
    float y = steepness * omega * sin(dotWpD);
    float z = amplitude * omega * cos(dotWpD) * d.y;

    return vec3(x, y, z);
}

float lerp(float min, float max, float t) {
    return min + (max - min) * t;
}

void main() {
    worldPosition = modelMatrix * vec4(position, 1.0);
    mirrorCoord = worldPosition.xyzw;
    mirrorCoord = textureMatrix * mirrorCoord;
    vec3 gp = worldPosition.xyz;
    vec3 gn = vec3(0, 0, 0);

    vec2 coord = worldPosition.xz;
    float fWaveCount = float(waveCount);

    for(int i = 0; i < waveCount; i++) {
        float ang = random(vec2(i, 1.0)) * 2.0 * pi;
        float len = lerp(15.0, 35.0, random(vec2(i, 2.0)));
        float amp = lerp(0.6, 3.0, random(vec2(i, 3.0))) / fWaveCount;
        float ste = lerp(0.8, 1.0, random(vec2(i, 4.0))) / fWaveCount;
        float spe = lerp(0.2, 1.0, random(vec2(i, 5.0)));

        gp += addWaveOffset(coord, ang, amp, len, ste, spe);
        gn += addWaveNormal(coord, ang, amp, len, ste, spe);
    }

    vvnormal = normalMatrix * gn;
    worldPosition = vec4(gp, 1.0);
    vec4 mvPosition = viewMatrix * worldPosition;
    gl_Position = projectionMatrix * mvPosition;

    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
    #include <shadowmap_vertex>
}
