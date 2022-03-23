import React from "react"

import assets from "../../assets/info.json"

import { getRandomInt } from "../../assets/utils"

import "./Home.css"

import Card from "../../components/Card/Card"

const Home = (props) => {
  const { cringeMode } = props
  const homeContent = assets.home

  return (
    <div className="Home">
      <div className="Home-content">
        {homeContent.map(([title, content], index) => (
          <Card
            index={index}
            title={title}
            content={content}
            cringeMode={cringeMode}
            key={`Home-${title}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
