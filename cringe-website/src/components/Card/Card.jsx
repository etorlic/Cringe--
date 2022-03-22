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

  const getAnimation = () => {
    const choice = getRandomInt(0, 4)
    const duration = getRandomInt(5, 6)
    const delay = getRandomInt(2, 6)
    switch (choice) {
      case 0:
        return `spinX infinite ${duration}s ${delay}s linear`
      case 1:
        return `spinX infinite ${duration}s ${delay}s reverse linear`
      case 2:
        return `spin infinite ${duration}s ${delay}s linear`
      default:
        return `spin infinite ${duration}s ${delay}s reverse linear`
    }
  }

  return (
    <div
      className="Card"
      style={{
        gridColumnStart: 2 * index + 2,
        borderRadius: cringeMode ? "0px" : "20px",
        animation: cringeMode ? getAnimation() : "none",
      }}
    >
      <div className="Card-title">{title}</div>
      <div className="Card-content">{content}</div>
    </div>
  )
}

export default Card
