import React from "react"

import "./Card.css"

const Card = (props) => {
  const { title, content, index, cringeMode } = props

  return (
    <div
      className="Card"
      style={{
        gridColumnStart: 2 * index + 2,
        borderRadius: cringeMode ? "0px" : "20px",
      }}
    >
      <div className="Card-title">{title}</div>
      <div className="Card-content">{content}</div>
    </div>
  )
}

export default Card
