
varying vec3 vWorldPosition;

void main()
{   
    // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = vec3(-worldPosition.z, worldPosition.y, -worldPosition.x);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}


