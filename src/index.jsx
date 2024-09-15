import App from "./components/App.jsx"
import {createRoot, createElement, renderRoot} from "../kong/kong.js"



/**@jsx createElement */
renderRoot(<App/>, createRoot())
