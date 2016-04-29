//REQUIRE defaultTexture

void main()			
{
	vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
	float gray = dot(v_orColor.rgb, vec3(0.5, 0.5, 0.5));
	gl_FragColor = vec4(gray, gray, gray, v_orColor.a);
}