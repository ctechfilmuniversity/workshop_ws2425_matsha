---
layout: default
title: Code
nav_exclude: true
---


# Adding the Phong Material

* [Adding the Phong Material](#adding-the-phong-material)
    * [Setup](#setup)
    * [Diffuse Reflection](#diffuse-reflection)
    * [Specular Reflection](#specular-reflection)
    * [In Total](#in-total)

Code basis is a Three.js scene, in which the lighting and shading within `scene.js` with the 'MeshPhongMaterial' (meshes in the upper row) is re-created with a vertex and fragment shader (lower row).

## Setup

In this example, everything it setup (including the shading) but the material. I


We need to integrate the lights into the following function:

```glsl
float material(vec3 normal, vec3 lightDirection, vec3 viewDirection) {

    // Diffuse
    

    // Specular
    

    // Total
    return 1.;
}
```


## Diffuse Reflection

```glsl
float diffuseReflection(vec3 normal, vec3 lightDirection) {

    return max(0., dot(normal, lightDirection));
}

float material(vec3 normal, vec3 lightDirection, vec3 viewDirection) {

    // Diffuse
    float diffuse = diffuseReflection(normal, lightDirection);

    // Specular
    

    // Total
    return diffuse ;
}
```



## Specular Reflection

```glsl
float specularReflection(vec3 normal, vec3 lightDirection, vec3 viewDirection) {

    vec3 reflection = reflect(lightDirection, normal);
    float specular = max(0., dot(reflection, viewDirection));
    specular = pow(specular, uShininess);
    return specular;
}

float material(vec3 normal, vec3 lightDirection, vec3 viewDirection) {

    // Diffuse
    float diffuse = diffuseReflection(normal, lightDirection);

    // Specular
    float specular = specularReflection(normal, lightDirection, viewDirection);

    // Total
    return diffuse + specular;
}
```


## In Total

```glsl
//// Reflections
float diffuseReflection(vec3 normal, vec3 lightDirection) {

    return max(0., dot(normal, lightDirection));
}

float specularReflection(vec3 normal, vec3 lightDirection, vec3 viewDirection) {

    vec3 reflection = reflect(lightDirection, normal);
    float specular = max(0., dot(reflection, viewDirection));
    specular = pow(specular, uShininess);
    return specular;
}

float material(vec3 normal, vec3 lightDirection, vec3 viewDirection) {

    // Diffuse
    float diffuse = diffuseReflection(normal, lightDirection);

    // Specular
    float specular = specularReflection(normal, lightDirection, viewDirection);

    // Total
    return diffuse + specular;
}
```