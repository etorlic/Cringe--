import React from "react"

import "./Square.css"

import logo from "../../assets/Cringe--Logo.png"

const Square = (props) => {
  const {
    dim,
    showImg,
    borderWidth,
    borderColor,
    top,
    left,
    transform,
    animation,
  } = props

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
        animation,
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
