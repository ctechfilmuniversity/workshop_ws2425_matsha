
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Transform Normal
    vec4 normalModel = modelMatrix * vec4(normal, 0.);

    // Varying
    vNormal = normalModel.xyz;
    vPosition = modelPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}