varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;
uniform float u_time;
uniform vec4 u_start_color;
uniform vec4 u_end_color;
uniform vec2 resolution;
// uniform sampler2D uSamplers[%count%];

void main(void){
    vec2 st = gl_FragCoord.xy / resolution;
    float pct = 0.0;

    pct = distance(st,vec2(0.5));

    vec4 color_mix = vec4(mix(u_start_color, u_end_color, cos(u_time)));
    vec3 color = vec3(pct);
    // %forloop%
    // gl_FragColor = color * vColor;
    gl_FragColor = vec4(color_mix.xyz / color, 1.0);
}