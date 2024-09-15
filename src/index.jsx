import App from "./components/App.jsx"
import {createRoot, createElement} from "../kong/create.js"
import {renderRoot} from "../kong/render.js"
// import Kong from "../kong/kong.js"

/**@jsx createElement */
renderRoot(<App/>, createRoot())