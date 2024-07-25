// https://github.com/madblade/waves-gerstner

attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 normalMatrix;
uniform mat4 viewMatrix;
uniform sampler2D waveData;
uniform float time;

varying vec4 vWorldPos;
varying vec4 vViewPos;
varying vec4 vScreenPos;
varying vec3 vNormal;

const float pi = 3.1415926;
const int waveCount = 16;

float random(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 addWaveOffset(vec2 coord, float angle, float amplitude, float waveLength, float steepness, float speed) {
    vec2 d = vec2(cos(angle), sin(angle));
    float omega = 2.0 * pi / waveLength;
    float phase = 2.0 * pi * speed;
    float dotWpD = omega * dot(coord, d) + phase * time;

    float x = steepness / omega * d.x * cos(dotWpD);
    float y = amplitude * sin(dotWpD);
    float z = steepness / omega * d.y * cos(dotWpD);

    return vec3(x, y, z);
}

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
    vWorldPos = modelMatrix * vec4(position, 1);
    vec2 coord = vWorldPos.xz;
    vNormal = vec3(0, 1, 0);

    float fWaveCount = float(waveCount);

    for(int i = 0; i < waveCount; i++) {
        float ang = random(vec2(i, 1.0)) * 2.0 * pi;
        float len = lerp(5.0, 10.0, random(vec2(i, 2.0)));
        float amp = lerp(0.6, 3.0, random(vec2(i, 3.0))) / fWaveCount;
        float ste = lerp(0.8, 1.0, random(vec2(i, 4.0))) / fWaveCount;
        float spe = lerp(0.2, 1.0, random(vec2(i, 5.0)));

        vWorldPos += vec4(addWaveOffset(coord, ang, amp, len, ste, spe), 0.0);
        vNormal -= addWaveNormal(coord, ang, amp, len, ste, spe);
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

    vViewPos = viewMatrix * vWorldPos;
    vScreenPos = projectionMatrix * vViewPos;
    gl_Position = vScreenPos;
}