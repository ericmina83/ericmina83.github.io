#version 300 es

// Input vertex attributes
in vec3 a_position;
in vec3 a_normal;

// Uniforms for transformation matrices
uniform mat4 u_modelViewProjectionMatrix;
uniform mat3 u_normalMatrix;

// Varying to pass the normal to the fragment shader
out vec3 v_normal;

void main() {
    // Transform the position
    gl_Position = u_modelViewProjectionMatrix * vec4(a_position, 1.0f);

    // Transform the normal and pass it to the fragment shader
    v_normal = normalize(u_normalMatrix * a_normal);
}