attribute vec4 a_position;
					
#ifdef GL_ES
varying highp vec2 v_position;
#else
varying vec2 v_position;
#endif
								
void main()	
{							
  gl_Position = CC_PMatrix * CC_MVMatrix * a_position;
}