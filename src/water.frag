precision highp float;

varying vec4 vPos;
varying vec4 pPos;
uniform sampler2D tDepth;
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
    vec3 pos = pPos.xyz;
    pos /= pPos.w;
    vec2 uv = pos.xy * 0.5 + 0.5;

    float depth = readDepth(tDepth, uv);

    gl_FragColor.rgb = vec3(1.0 - ((vPos.z - depth) / 40.0));
    gl_FragColor.a = 1.0;
}