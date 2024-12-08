name: inverse
layout: true
class: center, middle, inverse
---

#### Prof. Dr. Lena Gieseke | l.gieseke@filmuniversitaet.de  
#### Film University Babelsberg KONRAD WOLF

# Materials and Shading Workshop

### 01 - Overview

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
layout: false

## The Workshop

Materials & Shading is a complex topic, enough for a term...

---
## Materials & Shading

.left-even[
* Intro Materials and Shading
* Shading vs. Shader
* Local Illumination
* BRDFs
* Advanced Material Properties
* Physically-based Shading
]  

.right-even[
* Rendering
* Global Illumination
* Material Interfaces
* Real-time Implementations
* NPR Materials
* ...
]


???

Why am I saying this? To give a better overview of the topic field and if there is interest we can always do additional days and / projects.

---

## Workshop Topics

### Day 1

--

* Shading

--

* Re-cap Shader Programming Environment

--
* Local Illumination

--
* Example: Implementation of a basic material


???
* TODO: Teaser image


---

## Workshop Topics

### Day 2

--
* Material Properties

--
* Global Illumination

--
* Non Photorealistic Rendering (NPR)

--
* Example: Implementation of NPR materials



---

## Workshop Topics

### Day 3

--
* Example: Implementation of a complex material



---

## Learning Objectives

--
* Understand what shading is

--
* Grasp core theoretical concepts of shading and lighting

--
* Understand material properties

--
* Be able to implement basic materials within Three.js

--
* Be able to go from there to explore advanced and creative material options


---

## Let's Start

--

.center[<img src="img/sphere_all.png" alt="sphere_all" style="width:42%;"> <img src="img/sphere_toon.png" alt="sphere_toon" style="width:42%;">]

--

Looks simple enough, right? 😎

???

* The goal is to re-implement the material available in Three.js
* And with that I want to demonstrate that commonly used concepts aren't that complicated

