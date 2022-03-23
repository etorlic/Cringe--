import { BrowserRouter as Router } from "react-router-dom"

import amogus from "./assets/sussy_amogus.png"
import amogus_sound from "./assets/among_us.mp3"

import PageLoader from "./PageLoader"

import "./App.css"

function App() {
  const handleAmogus = () => {
    const amongus = new Audio(amogus_sound)
    amongus.play()
  }
  return (
    <div className="App">
      <div className="App-large">
        <Router>
          <PageLoader />
        </Router>
      </div>
      <div className="App-small">
        Nothing to see here yet, please view on a laptop or larger screen (but
        you can click me)
        <img className="App-amogus" src={amogus} onClick={handleAmogus} />
      </div>
    </div>
  )
}

export default App
