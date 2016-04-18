//REQUIRE defaultColor

attribute vec2 a_texCoord;
					
#ifdef GL_ES
varying highp vec2 v_texCoord;
#else
varying vec2 v_texCoord;
#endif
								
void main()	
{
	v_texCoord = a_texCoord;
}