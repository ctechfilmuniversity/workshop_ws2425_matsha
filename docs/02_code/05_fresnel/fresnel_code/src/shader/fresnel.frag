precision mediump float;

uniform vec3 uColor;
uniform vec3 uAmbientLight;
uniform vec3 uDirectionalLightTop;
uniform vec3 uDirectionalLightRight;
uniform vec3 uDirectionalLightBottom;
uniform float uShininess;

varying vec3 vNormal;
varying vec3 vPosition;

// Reflections
float specularReflection(vec3 normal, vec3 lightDirection, vec3 viewDirection) {

    vec3 reflection = reflect(lightDirection, normal);
    float specular = max(0., dot(reflection, viewDirection));
    specular = pow(specular, uShininess);
    return specular;
}

float diffuseReflection(vec3 normal, vec3 lightDirection) {

    return max(0., dot(normal, lightDirection));
}


// A Quick & Dirty Version of Using
// the Fresnel factor for a colorful rim

const vec3 fresnelColor = vec3(0.5569, 0.0, 0.5882); // fresnel color
const float fresnelRimWidth = 2.1; // increase in reflectance at grazing angles
const float fresnelBaseReflectance = 1.6; // reflectance when light hits the surface perpendicularly
const float fresnelIntensity = .5; // color threshold multiplier


float fresnelFactor( float width, float base, vec3 normal, vec3 view) {

    // Blindly copying the formula
    // https://google.github.io/filament/Filament.html#materialsystem/specularbrdf/fresnel(specularf)
    return base + ( 1.0 - base ) * pow( 1.0 - dot(normal , view), width);
}

vec3 material(vec3 normal, vec3 lightDirection, vec3 viewDirection) {

    vec3 color = vec3(0.0);

    // Diffuse
    float diffuse = diffuseReflection(normal, lightDirection);
    vec3 diffuseColor = diffuse * uColor;

    // Fresnel color
    float fresnel = fresnelFactor(fresnelRimWidth, fresnelBaseReflectance, normal, viewDirection);
    vec3 fresnelColor = fresnelColor * fresnelIntensity;

    // Specular
    // float specular = specularReflection(normal, lightDirection, viewDirection);
    // vec3 specularColor = specular * vec3(1., 1., 0);

     vec3 finalColor = mix(diffuseColor, fresnelColor, fresnel);

    // Total
    return finalColor;
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
    // vec3 directionalLightBottom = normalize(vec3(-10, -20, -10));
    // shading +=  material(normal, directionalLightBottom, viewDirection) * uDirectionalLightBottom;

    return shading;
}



void main() {

    vec3 color = setLightingShading();

    gl_FragColor = vec4(color, 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}



