#ifdef GL_ES
varying lowp vec4 v_fragmentColor;
varying lowp vec2 v_texCoord;
#else
varying vec4 v_fragmentColor;	
varying vec2 v_texCoord;
#endif
		
void main()			
{
	vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
	//float gray = dot(v_orColor.rgb, vec3(1, 1, 1));
	//gl_FragColor = vec4(gray, gray, gray, v_orColor.a);
	gl_FragColor = min((v_orColor * vec4(3, 3, 3, 1)), vec4(1, 1, 1, 1));
}				
