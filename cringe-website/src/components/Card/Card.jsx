import React from "react"

import { getRandomInt } from "../../assets/utils"

import "./Card.css"

const Card = (props) => {
  const { title, content, index, cringeMode } = props

  const getDirection = () => {
    const choice = getRandomInt(0, 2)
    if (choice === 1) {
      return "reverse linear"
    } else {
      return "linear"
    }
  }

  const getCardAnimation = () => {
    const choice = getRandomInt(0, 2)
    const duration = getRandomInt(5, 6)
    const delay = getRandomInt(2, 6)
    const direction = getDirection()
    switch (choice) {
      case 0:
        return `spinX infinite ${duration}s ${delay}s ${direction}`
      case 1:
        return `spin infinite ${duration}s ${delay}s ${direction}`
    }
  }

  const getTextAnimation = () => {
    const duration = getRandomInt(4, 6) / 3
    const delay = getRandomInt(2, 6)
    const direction = getDirection()
    return `scale-text infinite ${duration}s ${delay}s ${direction}`
  }

  return (
    <div
      className="Card"
      style={{
        color: cringeMode ? "#FF0000" : "",
        gridColumnStart: 2 * index + 2,
        borderRadius: cringeMode ? "0px" : "20px",
        animation: cringeMode ? getCardAnimation() : "none",
        border: cringeMode ? "3px solid #ff0000" : "1px solid #d7d6d6",
        backgroundColor: cringeMode ? "#ffff00" : "rgba(255, 255, 255, 0.1)",
        backdropFilter: cringeMode ? "none" : "blur(3px)",
      }}
    >
      <div
        className="Card-title"
        style={{
          animation: cringeMode ? getTextAnimation() : "none",
        }}
      >
        {title}
      </div>
      <div
        className="Card-content"
        style={{
          animation: cringeMode ? getTextAnimation() : "none",
        }}
      >
        {content}
      </div>
    </div>
  )
}

export default Card
