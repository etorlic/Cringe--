import React, { useState, useEffect } from "react"

import { getRandomInt } from "./assets/utils"

import { Routes, Route } from "react-router-dom"

import Square from "./components/Square/Square"
import Header from "./components/Header/Header"
import Home from "./pages/Home/Home"

const PageLoader = () => {
  const [cringeMode, setCringeMode] = useState(false)
  const [squares, setSquares] = useState([])
  const minSquares = 15
  const maxSquares = 25
  const ANIMATIONS = [
    "Square-spin infinite 1s reverse linear",
    "Square-spin infinite 1s linear",
    "none",
  ]

  const handleCringeMode = () => {
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
        ANIMATIONS[getRandomInt(0, ANIMATIONS.length)],
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
          animation={arr[5]}
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
