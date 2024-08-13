// https://github.com/madblade/waves-gerstner

// attribute vec3 position;

// uniform mat4 projectionMatrix;
// uniform mat4 modelMatrix;
// uniform mat4 normalMatrix;
// uniform mat4 viewMatrix;
uniform mat4 textureMatrix;
uniform float time;
uniform sampler2D waveData;

varying vec4 worldPosition;
varying vec3 vvnormal;

const float pi = 3.1415926;
const int waveCount = 32;

#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>

float random(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 addWaveOffset(vec2 coord, float angle, float amplitude, float waveLength, float steepness, float speed) {
    vec2 d = vec2(cos(angle), sin(angle));
    float omega = 2.0 * pi / waveLength;
    float phase = omega * speed;
    float dotWpD = omega * dot(coord, d) + phase * time;

    float x = steepness / omega * d.x * cos(dotWpD);
    float y = amplitude * sin(dotWpD);
    float z = steepness / omega * d.y * cos(dotWpD);

    return vec3(x, y, z);
}

vec3 addWaveNormal(vec2 coord, float angle, float amplitude, float waveLength, float steepness, float speed) {
    vec2 d = vec2(cos(angle), sin(angle));
    float omega = 2.0 * pi / waveLength;
    float phase = omega * speed;
    float dotWpD = omega * dot(coord, d) + phase * time;

    float x = amplitude * omega * cos(dotWpD) * d.x;
    float y = amplitude * omega * cos(dotWpD) * d.y;
    float z = steepness * omega * sin(dotWpD);

    return vec3(x, y, z);
}

float lerp(float min, float max, float t) {
    return min + (max - min) * t;
}

void main() {
    worldPosition = modelMatrix * vec4(position, 1);
    vec2 coord = worldPosition.xz;
    vvnormal = vec3(0, 0, 1);

    float fWaveCount = float(waveCount);

    for(int i = 0; i < waveCount; i++) {
        float ang = random(vec2(i, 1.0)) * 2.0 * pi;
        float len = lerp(100.0, 150.0, random(vec2(i, 2.0)));
        float amp = lerp(20.0, 30.0, random(vec2(i, 3.0))) / fWaveCount;
        float ste = lerp(0.8, 1.0, random(vec2(i, 4.0))) / fWaveCount;
        float spe = lerp(20.0, 25.0, random(vec2(i, 5.0)));

        worldPosition += vec4(addWaveOffset(coord, ang, amp, len, ste, spe), 0.0);
        vvnormal -= addWaveNormal(coord, ang, amp, len, ste, spe);
    }
    // float dotWpD = dot(vWorldPos.xz, direction);
    // vWorldPos.x += steepness * direction.x * cos(dotWpD);
    // vWorldPos.y += sin(dotWpD);
    // vWorldPos.z += steepness * direction.y * cos(dotWpD);

    // vNormal.x = -cos(dotWpD) * direction.x;
    // vNormal.y = 1.0 - steepness * sin(dotWpD);
    // vNormal.z = -cos(dotWpD) * direction.y;

    // vNormal = normalize(vNormal);
    // vNormal = (normalMatrix * vec4(vNormal, 0.0)).xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;

    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
    #include <shadowmap_vertex>
}