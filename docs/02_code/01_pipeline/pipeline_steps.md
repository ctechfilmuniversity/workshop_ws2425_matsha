---
layout: default
title: Code
nav_exclude: true
---


# A Basic Shader Pipeline with three.js

Tutorial is based on Brunos excellent tutorial three.js journey, specifically on [Lesson - Shader](https://threejs-journey.com/lessons/shaders).

I recommend to install the Visual Studio Code extension [Shader languages support for VS Code](https://marketplace.visualstudio.com/items?itemName=slevesque.shader) for syntax highlighting.

* [A Basic Shader Pipeline with three.js](#a-basic-shader-pipeline-with-threejs)
    * [Raw Shader Material](#raw-shader-material)
    * [Add Inline Shader Code](#add-inline-shader-code)
        * [`precision mediump float;`](#precision-mediump-float)
    * [Separate Shader Files](#separate-shader-files)
        * [Environment For Shader Files](#environment-for-shader-files)
        * [scene.js](#scenejs)
    * [Adjustments To The Vertices](#adjustments-to-the-vertices)
    * [Uniform](#uniform)
        * [Hint](#hint)
    * [Attribute](#attribute)
    * [Varying](#varying)
    * [ShaderMaterial](#shadermaterial)
    * [References](#references)


## Raw Shader Material

In 'scene.js' replace the current material 'MeshBasicMaterial', with a ['RawShaderMaterial'](https://threejs.org/docs/index.html#api/en/materials/RawShaderMaterial), which allows for loading a vertex and a fragment shader. L.

```
const material = new THREE.RawShaderMaterial({
    vertexShader:``,
    fragmentShader:``,
    side: THREE.DoubleSide
});
```

* Backticks allow for multiline code.
* After this step the scene doesn't run - we fix that in the next step.
* Later we replace the ['RawShaderMaterial'](https://threejs.org/docs/index.html#api/en/materials/RawShaderMaterial) with the [ShaderMaterial](https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial), but for clarity sake with start with the 'RawShaderMaterial'.

## Add Inline Shader Code

There are two options to insert glsl-shader code: inline and as a separate file. The following demonstrates the inline approach with inserting the glsl code when defining the material.

Expand the RawShaderMaterial instantiation as shown below.


```
const material = new THREE.RawShaderMaterial({
    vertexShader:`
        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;

        attribute vec3 position;

        void main()
        {
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader:`
        precision mediump float;

        void main()
        {
            gl_FragColor = vec4(1., 0., 1., 1.);
        }
    `,
    side: THREE.DoubleSide
});
```

* Now, you scene should run again.

### `precision mediump float;`

This instruction lets us decide how precise can a float be. Possible values are
, `highp`, `mediump`, and `lowp`.

`highp` can have performance hit and might not even work on some devices. `lowp` can create bugs by the lack of precision. We ordinarily use `mediump`. We also could have set the precision for the vertex shader but it's not required. [[1]](https://threejs-journey.com/lessons/shaders)


## Separate Shader Files

For more advanced shader code that goes beyond a couple of lines, you should always use separate shader code files.

* Inside the `src` folder create a `shader` folder
* Add the empty files `pipeline.frag` and `pipeline.vert` 
* Add the inline code from the previous step to the respective files.


`pipeline.vert`:
```glsl
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
```

`pipeline.frag`:

```glsl
precision mediump float;

void main()
{
    gl_FragColor = vec4(1., 0., 1., 1.);
}
```

### Environment For Shader Files

For using separate shader files, you have to set that up within the overall three.js environment. We are using the vite environment and it gives configuration options for loading shader files. Replace what is in your `vite.config.js` with the following.

```
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';


export default defineConfig({
    root: 'src/',
    publicDir: '../static/',
    plugins: [glsl()]
  });
```

### scene.js

* Import the shader files in 'scene.js':

```
import pipelineVertexShader from './shader/pipeline.vert';
import pipelineFragmentShader from './shader/pipeline.frag';
```

* Use the imported shader files in the material by replacing the material initiation one more time:

```
const material = new THREE.RawShaderMaterial({
    vertexShader:pipelineVertexShader,
    fragmentShader:pipelineFragmentShader,
    side: THREE.DoubleSide
});
```

* Now, you scene should run again.

## Adjustments To The Vertices

Now, you are free to explore creative coding adjustments. Usually, we want to do so in world space, meaning after the application of the `modelMatrix`. E.g., we can move the vertices with a `sin` function:

```
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.y += sin(modelPosition.x * 20.) * 0.1;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
```


## Uniform

The goal is to create a custom time value and to pass that to the shader for animation. This time value must be the same for all shader execution calls, hence, we are using a `uniform` element for it. Uniforms can be accessed in both, vertex and fragment shader.

* Add a uniform variable to the shader material in `scene.js`:

```
const material = new THREE.RawShaderMaterial({
    vertexShader:pipelineVertexShader,
    fragmentShader:pipelineFragmentShader,
    side: THREE.DoubleSide,
    uniforms:
    {
        uTime: { value: 0 }
    }
});
```
* Update `uTime` in the `animate()` function in `scene.js`:


```
const clock = new THREE.Clock();

const animate = () =>
{
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;
    ...
}
```

* Add the custom uniform to the vertex shader: `uniform float uTime;` and use it, e.g., as `modelPosition.y += sin(modelPosition.x* 20. + uTime) * 0.1;`

### Hint 

From Bruno Simon Regarding Time Values: If we were to use native JavaScript solution like Date.now(), it wouldn't work. That is due to Date.now() returning the number of milliseconds spent since January 1st, 1970 and this value is too big for a shader. To put it in a shell, remember that we cannot send uniform values too big or too small. [[1]](https://threejs-journey.com/lessons/shaders)


## Attribute

The goal is to create for each vertex a random value and send it as attribute to the vertex shader. In the vertex shader we use that random value as offset for the vertex's y position instead of the sin animation.

* Create in `scene.js` random values:

```
const countVertices = geometry.attributes.position.count;
const randoms = new Float32Array(countVertices);

for (let i = 0; i < countVertices; i++) 
{
    randoms[i] = Math.random();
}
```

* Send the random values as custom attribute to the vertex shader:

```
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
```

with 

```
BufferAttribute( array : TypedArray, itemSize : Integer, normalized : Boolean )
```

* `array` -- the data
* `itemSize ` -- the number of values of the array that should be associated with a particular vertex. For instance, if this attribute is storing a 3-component vector (such as a position, normal, or color), then itemSize should be 3. Here, it's just 1 random value per vertex so we use 1.
* `normalized` -- (optional) Applies to integer data only. Indicates how the underlying data in the buffer maps to the values in the GLSL code. For instance, if array is an instance of UInt16Array, and normalized is true, the values 0 - +65535 in the array data will be mapped to 0.0f - +1.0f in the GLSL attribute. An Int16Array (signed) would map from -32768 - +32767 to -1.0f - +1.0f. If normalized is false, the values will be converted to floats unmodified, i.e. 32767 becomes 32767.0f. 

[[threejs.org - BufferAttribute]](https://threejs.org/docs/#api/en/core/BufferAttribute)

* Add the custom attribute to the vertex shader:
```
attribute float aRandom;
...
modelPosition.y += aRandom * 0.05;
```

## Varying 


The goal is to re-use `aRandom` in the fragment shader to control the surface color. However, attributes can not be accessed in the fragement shader. Instead, we can send the data from the vertex shader to the fragment shader as `varying`.

* Create a varying in the vertex shader: `varying float vRandom;` and give is a value: `vRandom = aRandom;`
* Access that varying in the fragment shader: `varying float vRandom;` and use the value, e.g., as `gl_FragColor = vec4(vec3(vRandom), 1.);` 

Keep in mind with varyings that the values between the vertices are interpolated. If the GPU is drawing a fragment right between two vertices —one having a varying of 1.0 and the other having a varying of 0.0—the fragment value will be 0.5. [[1]](https://threejs-journey.com/lessons/shaders)


## ShaderMaterial 

Above, we have take all necessary steps ourselves, as needed when using `RawShaderMaterial`. The `ShaderMaterial` works just the same, but with pre-built uniforms and attributes prepended in the shader codes. The precision will also be automatically set. 

* Replace your RawShaderMaterial by ShaderMaterial:

```
const material = new THREE.ShaderMaterial({
    ...
});
```

Then remove the following uniform and attribute and precision in both shaders:

* `uniform mat4 projectionMatrix;`
* `uniform mat4 viewMatrix;`
* `uniform mat4 modelMatrix;`
* `attribute vec3 position;`
* `attribute vec2 uv;`
* `precision mediump float;`

```
uniform vec2 uFrequency;
uniform float uTime;

attribute float aRandom;

varying float vElevation;
varying vec2 vUv;

void main()
{
    // ...
}
```

Everything should work just like before because the ShaderMaterial adds those elements automatically.

[[1]](https://threejs-journey.com/lessons/shaders)


## References

[[1] Bruno Simon. 2024. three.js journey - Lesson Shader.](https://threejs-journey.com/lessons/shaders)