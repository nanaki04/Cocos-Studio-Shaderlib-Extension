uniform float u_light_01_scale_y;
uniform float u_light_01_radius;
uniform float u_light_01_intensity;
uniform vec2 u_light_01_offset;
uniform vec4 u_light_01_color;

void main()
{
	//vec4 doubleTransformedTexCoord = CC_PMatrix * CC_MVMatrix * vec4(v_texCoord.xy, 0.0, 0.0);
	//mat4 m = CC_MVMatrix;
	//mat4 transposed = mat4(
	//	m[0][0], m[1][0], m[2][0], m[3][0],
	//	m[0][1], m[1][1], m[2][1], m[3][1],
	//	m[0][2], m[1][2], m[2][2], m[3][2],
	//	m[0][3], m[1][3], m[2][3], m[3][3]
	//);
	//vec4 offset = CC_PMatrix * transposed * vec4(u_light_01_offset.xy, 0.0, 0.0);
	float intensity = max((u_light_01_radius - (sqrt(pow(v_texCoord.x - u_light_01_offset.x, 2.0) + pow(v_texCoord.y - u_light_01_offset.y, 2.0))) / u_light_01_radius), 0.0) * u_light_01_intensity;
	//gl_FragColor = vec4(intensity * u_light_01_color.r, intensity * u_light_01_color.g, intensity * u_light_01_color.b, 1.0);
	gl_FragColor = min((v_fragmentColor * texture2D(CC_Texture0, v_texCoord)) + vec4(intensity * u_light_01_color.r, intensity * u_light_01_color.g, intensity * u_light_01_color.b, 0.0), u_light_01_color);
	//gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord) + vec4(intensity * u_light_01_color.r, intensity * u_light_01_color.g, intensity * u_light_01_color.b, 0.0);
}