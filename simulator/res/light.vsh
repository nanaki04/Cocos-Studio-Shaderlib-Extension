uniform float u_light_01_radius;
varying float v_light_01_radius;

void main()
{
  v_position = sign(a_position.xy);
  v_light_01_radius = u_light_01_radius;
}