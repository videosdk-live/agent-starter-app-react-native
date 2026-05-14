import { AppRegistry } from "react-native";
import { register } from "@videosdk.live/react-native-sdk";
import { name as appName } from "./app.json";
import "./global.css";
import "./src/lib/nativewind-interop";
import App from "./App";

register();

AppRegistry.registerComponent(appName, () => App);
