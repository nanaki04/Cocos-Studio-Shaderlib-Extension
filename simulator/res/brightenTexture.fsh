//REQUIRE defaultTexture

void main()			
{
	vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
	gl_FragColor = min((v_orColor * vec4(3, 3, 3, 1)), vec4(1, 1, 1, 1));
}