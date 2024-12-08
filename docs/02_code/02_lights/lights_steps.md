---
layout: default
title: Code
nav_exclude: true
---


# Adding Lights in the Fragment Shader

* [Adding Lights in the Fragment Shader](#adding-lights-in-the-fragment-shader)
    * [Setup](#setup)
    * [Ambient Light](#ambient-light)
    * [Directional Lights](#directional-lights)
        * [Directional Light Top](#directional-light-top)
        * [Directional Light Top](#directional-light-top-1)
        * [Directional Light Top](#directional-light-top-2)
    * [In Total](#in-total)

Code basis is a Three.js scene, in which the lighting and shading within `scene.js` with the 'MeshPhongMaterial' (meshes in the upper row) is re-created with a vertex and fragment shader (lower row).

## Setup

In this example, everything it setup (including the shading) but the lights. In the fragment shader we need to implement four lights to match the base scene. The lights' color and intensity (as one color) are coming in as uniforms, the lights' directions must be hard-coded in the fragment shader.

* Ambient Light
    * Color and intensity: `uniform vec3 uAmbientLight;`
* Directional Light Top
    * Color and intensity: `uniform vec3 uDirectionalLightTop;`
    * Direction: `vec3(0, 20, 0)`
* Directional Light Right
    * Color and intensity: `uniform vec3 uDirectionalLightRight;`
    * Direction: `vec3(10, 20, 10)`
* Directional Light Bottom
    * Color and intensity: `uniform vec3 uDirectionalLightBottom;`
    * Direction: `vec3(-10, -20, -10)`


We need to integrate the lights into the following function:

```glsl
// Shading the scene
vec3 setLightingShading() {

    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    // Shading
    vec3 shading  = vec3(0.);
    
    //// Replicating the scene setup
    // Ambient Light


    // Directional Light Top


    // Directional Light Right


    // Directional Light Bottom


    return shading;
}
```


## Ambient Light

Add the Ambient Light to the scene.

```glsl
    // Ambient Light
    shading += uAmbientLight;
```

**Careful**: In the base scene the default value for the ambient light is black, meaning zero. To see the ambient light working, change it's color in the UI.

## Directional Lights

Add all three Directional Lights to the scene. You can use the `material(vec3 normal, vec3 lightDirection, vec3 viewDirection)` to get the reflectance.


### Directional Light Top

```glsl
    // Directional Light Top
    vec3 directionalLightTop = normalize(vec3(0, 20, 0));
    shading +=  material(normal, directionalLightTop, viewDirection) * uDirectionalLightTop;
```

### Directional Light Top

```glsl
    // Directional Light Right
    vec3 directionalLightRight = normalize(vec3(10, 20, 10));
    shading +=  material(normal, directionalLightRight, viewDirection) * uDirectionalLightRight;
```

### Directional Light Top

```glsl
    // Directional Light Bottom
    vec3 directionalLightBottom = normalize(vec3(-10, -20, -10));
    shading +=  material(normal, directionalLightBottom, viewDirection) * uDirectionalLightBottom;
```


## In Total

All in all the `setLightingShading` function should look as follows:

```glsl
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
```

Of course, you could also use an array for directions and colors:

```glsl
// Shading the scene
vec3 setLightingShading() {

    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    // Shading
    vec3 shading  = vec3(0.);
    
    //// Replicating the scene setup
    // Ambient Light
    shading += uAmbientLight;

    // Directional lights
    vec3 lightsDirections[3] = vec3[3](vec3(0, 20, 0), vec3(10, 20, 10), vec3(-10, -20, -10));
    vec3 lightsIntensities[3] = vec3[3](uDirectionalLightTop, uDirectionalLightRight, uDirectionalLightBottom);

    for (int i = 0; i < 3; i++)
    {
        shading +=  material(normal, normalize(lightsDirections[i]), viewDirection) * lightsIntensities[i];
    }

    return shading;
}
```

Alternatively, you could send an object that contains all three lights as uniform from the scene and iterate over that.
