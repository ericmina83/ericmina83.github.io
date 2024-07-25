precision highp float;

varying vec4 vViewPos;
varying vec4 vScreenPos;
varying vec3 vNormal;
uniform sampler2D tDepth;
// uniform sampler2D map;
uniform float cameraNear;
uniform float cameraFar;

// https://gist.github.com/greggman/41d93c00649cba78abdbfc1231c9158c
float perspectiveDepthToViewZ(const in float invClipZ, const in float near, const in float far) {
    return (near * far) / ((far - near) * invClipZ - far);
}

float readDepth(sampler2D depthSampler, vec2 coord) {
    float fragCoordZ = texture2D(depthSampler, coord).x;
    return perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
}

void main() {
    vec3 pos = vScreenPos.xyz;
    pos /= vScreenPos.w;
    vec2 uv = pos.xy * 0.5 + 0.5;

    // float depth = readDepth(tDepth, uv);

    // float ratio = 1.0 - ((vViewPos.z - depth) / 40.0);

    // vec4 color = texture2D(map, uv) * ratio;
    vec4 color = vec4(1, 1, 1, 1);

    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = 1.0;
    gl_FragColor = abs(vec4(vNormal, 1));
}