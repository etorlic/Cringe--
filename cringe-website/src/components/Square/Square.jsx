import React from "react"

import { getRandomInt } from "../../assets/utils"

import "./Square.css"

import logo from "../../assets/Cringe--Logo.png"

const Square = (props) => {
  const { dim, showImg, borderWidth, borderColor, top, left, transform } = props

  const getAnimation = () => {
    const choice = getRandomInt(0, 5)
    const duration = getRandomInt(1, 500) / 140
    const delay = getRandomInt(0, 400) / 100
    switch (choice) {
      case 1:
        return `Square-spin infinite ${duration}s ${delay}s reverse linear`
      case 2:
        return `Square-spin infinite ${duration}s ${delay}s linear`
      case 3:
        return `Square-spin-Y infinite ${duration}s ${delay}s reverse linear`
      case 4:
        return `Square-spin-Y infinite ${duration}s ${delay}s linear`
      default:
        return "none"
    }
  }

  return showImg ? (
    <img
      src={logo}
      className="Square-img"
      style={{
        width: dim,
        height: dim,
        top,
        left,
        transform,
        animation: getAnimation(),
      }}
    />
  ) : (
    <div
      className="Square"
      style={{
        width: dim,
        height: dim,
        borderWidth,
        borderColor,
        top,
        left,
        transform,
      }}
    />
  )
}

export default Square
