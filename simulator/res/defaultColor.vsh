//REQUIRE defaultPosition

attribute vec4 a_color;
					
#ifdef GL_ES
varying lowp vec4 v_fragmentColor;
#else
varying vec4 v_fragmentColor;
#endif
								
void main()	
{
	v_fragmentColor = a_color;
}