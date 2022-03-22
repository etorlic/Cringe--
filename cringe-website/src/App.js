import { BrowserRouter as Router } from "react-router-dom"

import PageLoader from "./PageLoader"

import "./App.css"

function App() {
  return (
    <div className="App">
      <div className="App-large">
        <Router>
          <PageLoader />
        </Router>
      </div>
      <div className="App-small">
        No support for mobile devices yet, please view on a laptop or larger
        screen
      </div>
    </div>
  )
}

export default App
