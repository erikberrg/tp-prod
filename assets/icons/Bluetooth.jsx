import * as React from "react";
import Svg, { Path } from "react-native-svg";

const Bluetooth = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={36}
    height={36}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <Path
      d="M4 3.99304L20 20.0137"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M12.0094 7.97976C12.0094 6.85151 11.8211 4.37371 12.4988 3.62154C13.3394 2.88737 16.666 5.70138 18.2835 7.05515C17.4525 7.90736 17.0866 8.72598 14.6659 10.5223"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.5002 17.5094C14.6596 19.5714 13.4835 20.7985 12.6288 20.4349C12.5439 20.3988 12.4741 20.3348 12.427 20.2554C11.9013 19.3692 12.0095 17.0485 12.0095 15.9707V11.9932L4.97754 16.7063"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Bluetooth;
