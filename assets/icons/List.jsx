import * as React from "react"
import Svg, { Path } from "react-native-svg";

const LeftToRightListBulletIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="#000000" fill="none" {...props}>
    <Path d="M8 5L20 5" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <Path d="M4 5H4.00898" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 12H4.00898" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 19H4.00898" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 12L20 12" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    <Path d="M8 19L20 19" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
  </Svg>
);

export default LeftToRightListBulletIcon;
