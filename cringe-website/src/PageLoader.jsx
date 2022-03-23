import React, { useState, useEffect } from "react"

import { getRandomInt } from "./assets/utils"

import { Routes, Route } from "react-router-dom"

import amogus_img from "./assets/sussy_amogus.png"
import bruh_sound from "./assets/bruh_sound_effect.mp3"
import amogus_sound from "./assets/among_us.mp3"

import Square from "./components/Square/Square"
import Header from "./components/Header/Header"
import Home from "./pages/Home/Home"

const PageLoader = () => {
  const [cringeMode, setCringeMode] = useState(false)
  const [squares, setSquares] = useState([])
  const [bruh] = useState(new Audio(bruh_sound))
  const [amogus] = useState(new Audio(amogus_sound))
  const [minSquares] = useState(15)
  const [maxSquares] = useState(25)

  const handleCringeMode = () => {
    if (!cringeMode) {
      amogus.play()
      window.alert("You have activated Cringe Mode!")
      bruh.play()
    }
    setCringeMode(!cringeMode)
  }

  useEffect(() => {
    setSquares(
      [
        ...Array(
          Math.floor(Math.random() * (maxSquares - minSquares) + minSquares)
        ),
      ].map(() => [
        `${getRandomInt(5, 10)}vw`,
        `${getRandomInt(1, 3)}px`,
        `${getRandomInt(7, 95)}vh`,
        `${getRandomInt(0, 95)}vw`,
        `rotate(${getRandomInt(0, 360)}deg)`,
      ])
    )
  }, [])

  return (
    <div>
      <div
        className="App-bg"
        style={{
          backgroundImage: cringeMode
            ? "linear-gradient(to bottom right, #74831C, #830F0F)"
            : "linear-gradient(to bottom right, #5200FF, #aa0070)",
        }}
      />
      {cringeMode ? <img src={amogus_img} className="App-sussy" /> : null}
      <Header cringeMode={cringeMode} handleCringeMode={handleCringeMode} />
      {squares.map((arr) => (
        <Square
          dim={arr[0]}
          showImg={cringeMode}
          borderWidth={arr[1]}
          borderColor="#D7D6D6"
          top={arr[2]}
          left={arr[3]}
          transform={arr[4]}
          key={`Square-${arr[0]}${arr[2]}${arr[3]}`}
        />
      ))}
      <Routes>
        <Route
          exact
          path="/Cringe--"
          element={<Home cringeMode={cringeMode} />}
        />
      </Routes>
    </div>
  )
}

export default PageLoader
