import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg";

const PauseCircleIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="#000000" fill="none" {...props}>
    <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <Path d="M9.5 9L9.5 15M14.5 9V15" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default PauseCircleIcon;
