// https://github.com/madblade/waves-gerstner/blob/master/src/ocean.vertex.glsl
// https://github.com/mrdoob/three.js/blob/r156/examples/jsm/objects/Water.js

uniform mat4 textureMatrix;
uniform float time;

varying vec4 worldPosition;
varying vec4 mirrorCoord;
varying vec4 vScreenPos;
varying vec4 vViewPos;

varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBionormal;

#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>

const float pi = 3.1415926;

float random(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

// rotate point a with circle path around the original point
vec3 getWaveOffset(vec2 coord, float angle, float steepness, float waveLength) {
    float omega = 2.0 * pi / waveLength;
    float c = sqrt(9.8 / omega);
    vec2 d = vec2(cos(angle), sin(angle));
    float amp = steepness / omega;
    float theta = omega * (dot(coord, d) - c * time);

    float x = amp * d.x * cos(theta);
    float y = amp * sin(theta);
    float z = amp * d.y * cos(theta);

    return vec3(x, y, z);
}

vec3 addWaveTangent(vec2 coord, float angle, float steepness, float waveLength) {
    float omega = 2.0 * pi / waveLength;
    float c = sqrt(9.8 / omega);
    vec2 d = vec2(cos(angle), sin(angle));
    float theta = omega * (dot(coord, d) - c * time);

    float x = -d.x * d.x * steepness * sin(theta);
    float y = d.x * steepness * cos(theta);
    float z = -d.x * d.y * steepness * sin(theta);
    return vec3(x, y, z);
}

vec3 addWaveBionormal(vec2 coord, float angle, float steepness, float waveLength) {
    float omega = 2.0 * pi / waveLength;
    float c = sqrt(9.8 / omega);
    vec2 d = vec2(cos(angle), sin(angle));
    float theta = omega * (dot(coord, d) - c * time);

    float x = -d.y * d.x * steepness * sin(theta);
    float y = d.y * steepness * cos(theta);
    float z = -d.y * d.y * steepness * sin(theta);
    return vec3(x, y, z);
}

float lerp(float min, float max, float t) {
    return min + (max - min) * t;
}

void main() {
    worldPosition = modelMatrix * vec4(position, 1.0);

    vec3 gp = worldPosition.xyz;

    vec2 coord = worldPosition.xz;
    vec3 tangent = vec3(1.0, 0.0, 0.0);
    vec3 bionormal = vec3(0.0, 0.0, 1.0);

    for(int i = 0; i < waveCount; i++) {
        vec3 wave = waveParameters[i];
        float ang = wave.x;
        float ste = wave.y;
        float len = wave.z;

        gp += getWaveOffset(coord, ang, ste, len);
        tangent += addWaveTangent(coord, ang, ste, len);
        bionormal += addWaveBionormal(coord, ang, ste, len);
    }

    vNormal = normalize(cross(bionormal, tangent));
    vTangent = normalize(tangent);
    vBionormal = normalize(bionormal);

    worldPosition = vec4(gp, 1.0);
    mirrorCoord = worldPosition.xyzw;
    mirrorCoord.y = 0.0;
    mirrorCoord = textureMatrix * mirrorCoord;
    vViewPos = viewMatrix * worldPosition;
    vScreenPos = projectionMatrix * vViewPos;
    gl_Position = vScreenPos;

    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
    #include <shadowmap_vertex>
}
