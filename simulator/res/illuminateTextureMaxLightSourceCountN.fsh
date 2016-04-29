uniform mat4 u_light_scale_y;
//uniform mat3 u_light_01_radius;
//uniform mat3 u_light_01_intensity;
//uniform mat6x3 u_light_01_offset;
//uniform mat12x3 u_light_01_color;

void main()
{
	gl_FragColor = u_light_scale_y[1];
	//float intensity = max(u_light_01_radius - (sqrt(pow(v_texCoord.x - u_light_01_offset.x, 2.0) + pow(v_texCoord.y - u_light_01_offset.y, 2.0)) * u_light_01_intensity), 0.0);
	//gl_FragColor = min((v_fragmentColor * texture2D(CC_Texture0, v_texCoord)) + vec4(intensity * u_light_01_color.r, intensity * u_light_01_color.g, intensity * u_light_01_color.b, 0.0), u_light_01_color);
}