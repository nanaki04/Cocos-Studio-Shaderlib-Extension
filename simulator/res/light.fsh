varying float v_light_01_radius;

void main()
{
	//gl_FragColor = v_fragmentColor;
	gl_FragColor = vec4(v_position, v_light_01_radius, 1);
}