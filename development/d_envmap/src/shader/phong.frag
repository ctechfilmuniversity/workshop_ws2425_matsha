precision mediump float;

uniform vec3 uColor;
uniform vec3 uAmbientLight;
uniform vec3 uDirectionalLightTop;
uniform vec3 uDirectionalLightRight;
uniform vec3 uDirectionalLightBottom;
uniform float uShininess;

varying vec3 vNormal;
varying vec3 vPosition;

//// Reflections
float specularReflection(vec3 normal, vec3 lightDirection, vec3 viewDirection) {

    vec3 reflection = reflect(lightDirection, normal);
    float specular = max(0., dot(reflection, viewDirection));
    specular = pow(specular, uShininess);
    return specular;
}

float diffuseReflection(vec3 normal, vec3 lightDirection) {

    return max(0., dot(normal, lightDirection));
}

float material(vec3 normal, vec3 lightDirection, vec3 viewDirection) {

    // Diffuse
    float diffuse = diffuseReflection(normal, lightDirection);

    // Specular
    float specular = specularReflection(normal, lightDirection, viewDirection);

    // Total
    return diffuse + specular;
}

// Shading the scene
vec3 setLightingShading() {

    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    // Shading
    vec3 shading  = vec3(0.);
    
    //// Replicating the scene setup
    // Ambient Light
    shading += uAmbientLight;

    // Directional Light Top
    vec3 directionalLightTop = normalize(vec3(0, 20, 0));
    shading +=  material(normal, directionalLightTop, viewDirection) * uDirectionalLightTop;

    // Directional Light Right
    vec3 directionalLightRight = normalize(vec3(10, 20, 10));
    shading +=  material(normal, directionalLightRight, viewDirection) * uDirectionalLightRight;

    // Directional Light Bottom
    vec3 directionalLightBottom = normalize(vec3(-10, -20, -10));
    shading +=  material(normal, directionalLightBottom, viewDirection) * uDirectionalLightBottom;

    return shading;
}


// Version with Arrays
// vec3 setLightingShading() {

//     vec3 normal = normalize(vNormal);
//     vec3 viewDirection = normalize(vPosition - cameraPosition);

//     // Shading
//     vec3 shading  = vec3(0.);
    
//     //// Replicating the scene setup
//     // Ambient Light
//     shading += uAmbientLight;

//     // Directional lights
//     vec3 lightsDirections[3] = vec3[3](vec3(0, 20, 0), vec3(10, 20, 10), vec3(-10, -20, -10));
//     vec3 lightsIntensities[3] = vec3[3](uDirectionalLightTop, uDirectionalLightRight, uDirectionalLightBottom);

//     for (int i = 0; i < 3; i++)
//     {
//         shading +=  material(normal, normalize(lightsDirections[i]), viewDirection) * lightsIntensities[i];
//     }

//     return shading;
// }



void main() {

    vec3 color = uColor;
    color *= setLightingShading();

    gl_FragColor = vec4(color, 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}



