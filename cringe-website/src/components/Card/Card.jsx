import React, { useState } from "react"

import { getRandomInt } from "../../assets/utils"

import "./Card.css"

const Card = (props) => {
  const { title, content, index, cringeMode } = props
  const [clicked, setClicked] = useState(false)

  const getRandomLink = () => {
    const LINKS = [
      "https://youtu.be/wnhkbgq3mRI", // SUS Minecraft
      "https://youtu.be/dQw4w9WgXcQ", // Rick Roll
      "https://youtu.be/1KaecOQKNaM", // Among musical
      "https://youtu.be/Gp9gFXf56yQ", // Dream Music Vid
    ]

    return LINKS[getRandomInt(0, LINKS.length)]
  }

  const animateCardOnce = () => {
    const choice = getRandomInt(0, 2)
    const duration = (1, 3) / 2
    const direction = getDirection()

    switch (choice) {
      case 0:
        return `spinX 1 ${duration}s ${direction}`
      case 1:
        return `spin 1 ${duration}s ${direction}`
    }
  }

  const getDirection = () => {
    const choice = getRandomInt(0, 2)
    if (choice === 1) {
      return "reverse linear"
    } else {
      return "linear"
    }
  }

  const animateCard = () => {
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

  const getCardAnimation = () => {
    if (cringeMode) {
      return animateCard()
    } else if (clicked) {
      return animateCardOnce()
    }
    return "none"
  }

  return cringeMode ? (
    <div style={{ gridColumnStart: 2 * index + 2 }}>
      <a href={getRandomLink()} target="_blank" className="Card-a">
        <div
          className="Card-cringe"
          style={{
            animation: getCardAnimation(),
          }}
        >
          <div
            className="Card-title"
            style={{
              animation: getTextAnimation(),
            }}
          >
            {title}
          </div>
          <div
            className="Card-content"
            style={{
              animation: getTextAnimation(),
            }}
          >
            {content}
          </div>
        </div>
      </a>
    </div>
  ) : (
    <div
      className="Card"
      style={{
        gridColumnStart: 2 * index + 2,
        animation: getCardAnimation(),
      }}
      onClick={() => {
        setClicked(true)
      }}
      onAnimationEnd={() => {
        setClicked(false)
      }}
    >
      <div className="Card-title">{title}</div>
      <div className="Card-content">{content}</div>
    </div>
  )
}

export default Card
