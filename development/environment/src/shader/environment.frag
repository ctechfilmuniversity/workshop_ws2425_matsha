precision mediump float;




uniform samplerCube cubemap;
varying vec3 vWorldPosition;

void main(){
    vec3 normalizedVWorldPosition = normalize(vWorldPosition);
    vec3 outcolor = textureCube(cubemap, normalizedVWorldPosition).rgb;

    gl_FragColor = vec4(outcolor, 1.0);
}