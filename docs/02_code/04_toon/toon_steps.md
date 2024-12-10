---
layout: default
title: Simple Toon Shading
nav_exclude: true
---


# Basic Toon Shading

The following steps are based on the solution of [03_phong](../03_phong/phong_steps.md).

### Step Function For Diffuse Shading

First we compute the diffuse component as usual

```glsl
float diffuse = diffuseReflection(normal, lightDirection);
```

The computed diffuse value has a range of 0..1. We can multiply this with the number of shading levels we want to create and use the `floor` function to create the steps. Then we transform the value back to a range of 0..1.

We define for easy access the LEVELS and SCALING at the top of the file.
```glsl
const float LEVELS = 5.0;
const float SCALING = 1.0 / LEVELS;
```

```glsl
float toon = 0.;

// Transforming the diffuse part to being stepped
toon = floor(diffuse * LEVELS) * SCALING;
```

### The Outline

For creating an outline-like as black line, we can compute and check the the angle between the view direction and the surface normal in the same way we as for the diffuse value for the angle between light direction and the surface normal. 

We want to draw an outline if the view direction and the surface normal are somewhat perpendicular to each other, meaning where their dot product is around 0.

As the outline only depends on the view, we do not need to compute it for each light separately.

```glsl
// Black color if dot product is smaller than 0.2
// else keep the same colors
float edge = (dot(view_dir, normal) > 0.2) ? 1.0 : 0.0;
toon *= edge;
```

### Specular Highlight Dot

For this we clamp the specular reflection value

```glsl

// A Small Highlight
float mask = (spec > 0.9) ? 0.8 : 0.0;
toon += (spec * mask);
```

We can furthermore use the `spec` value to clamp an outline for the highlight if so desired

```glsl
// Outline for Highlight
    edge = (specular >  0.4 && specular < 0.6) ? 0.0 : 1.0; // simply black
    toon *= edge;
```

---

The End 👩🏼‍🎨