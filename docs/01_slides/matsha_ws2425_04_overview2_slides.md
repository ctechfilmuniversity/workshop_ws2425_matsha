name: inverse
layout: true
class: center, middle, inverse
---

#### Prof. Dr. Lena Gieseke | l.gieseke@filmuniversitaet.de  
#### Film University Babelsberg KONRAD WOLF

# Materials and Shading Workshop

### Overview 2

<!--

Start server in /doc/


h or ?: Toggle the help window
j: Jump to next slide
k: Jump to previous slide
b: Toggle blackout mode
m: Toggle mirrored mode.
c: Create a clone presentation on a new window
p: Toggle PresenterMode
f: Toggle Fullscreen
t: Reset presentation timer
<number> + <Return>: Jump to slide <number>
-->

---
layout:false

## Workshop Topics

### Day 1

* Shading ✓
* Local Illumination ✓
* Re-cap Shader Programming Environment ✓
* Example: Implementation of a basic material 


---
## Phong Implementation

```glsl
//$max(0, L ∙ N)

float diffuseReflection(vec3 normal, vec3 light_direction_to_point) {

    return max(0., dot(normal, light_direction_to_point));
}
```
--

```glsl
//max(0, R ∙ V)^n

float specularReflection(vec3 normal, vec3 lightDirection, 
                                                vec3 viewDirection) {
    vec3 reflection = reflect(lightDirection, normal);
    float specular = max(0., dot(reflection, viewDirection));
    specular = pow(specular, shininess);
    return specular;
}
```


???

.task[TASK: Code through Phong solution code]

---
## Phong Implementation

Design decision or as user input: color of the highlight?

```glsl
const material = new THREE.MeshPhongMaterial();
material.shininess = 100
material.specular = new THREE.Color(0x1188ff)
```


---

## Workshop Topics

### Day 2

--
* BRDFs

--
* Material Properties

--
* (Non Photorealistic Rendering (NPR))

--
* *On a Side Note*: Implementation of NPR materials



???

.todo[TODO:Teaser Image]


<!----------------------------------------------------------------------------->
---
template:inverse

#### On a Side Note...
# Toon Shading

---
## Toon Shading

The Phong material is a good basis for a simple toon material.


---

## Toon Shading

.left-even[<img src="img/sphere_toon.png" alt="sphere_toon" style="width:100%;">]

???
* Show live version
* What properties do you see?
    * Flat shading
    * Step function for diffuse shading
    * Outline
    * Small light highlight
    * Outline around highlight 

--
.right-even[
* Flat, steps for diffuse shading
* Outline
* Flat, bright highlight
* Outline around highlight 
]

???

.task[TASK: Show: Flat, steps for diffuse shading]

* Go step by step, no follow along
* [sphere_toon_smooth_steps](../02_code/04_toon/toon_steps.md)



Many NPR shaders make use of the outline of an object.


* How do we detect the outline?

---
.header[Toon Shading]
## Outline

.center[<img src="img/outline_01.png" alt="outline_01" style="width:50%;">]

???
The outline of an object is detected by the angle between the normal of the surface point and the view vector.


---

## Toon Shading

.center[<img src="img/outline_02.png" alt="outline_02" style="width:50%;">]

???
The outline of an object is detected by the angle between the normal of the surface point and the view vector.


---

## Toon Shading

.center[<img src="img/outline_03.png" alt="outline_03" style="width:46%;">]

???
The outline of an object is detected by the angle between the normal of the surface point and the view vector.



---

## Toon Shading

.left-even[<img src="img/outline_03.png" alt="outline_03" style="width:100%;">]
.right-even[

<br />
\\({cos θ}\\) = **V** ∙ **N**
  
<br />
> The outline of an object is detected by the angle between the normal of the surface point and the view vector.
]

---

## Toon Shading

\\({cos θ}\\) = **V** ∙ **N**

```glsl
float cos_view_normal = max(0.0, dot(view_dir, normal));
```


???

Once again...

\\({cos θ}\\) = **A** ∙ **B**

.center[<img src="img/dot_product_values.gif" alt="dot_product_values" style="width:40%;">]

--

### Implementation

* Outline
* Flat, steps for diffuse shading
* Flat, bright highlight
* Outline around highlight 



???


* Go step by step, no following ?
* [sphere_toon_smooth_steps](../02_code/04_toon/toon_steps.md)


---
template:inverse


