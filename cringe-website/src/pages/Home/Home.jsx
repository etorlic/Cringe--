import React from "react"

import assets from "../../assets/info.json"

import { getRandomInt } from "../../assets/utils"

import "./Home.css"

import Card from "../../components/Card/Card"

const Home = (props) => {
  const { cringeMode } = props
  const homeContent = assets.home

  const getRandomLink = () => {
    const LINKS = [
      "https://youtu.be/wnhkbgq3mRI",
      "https://youtu.be/dQw4w9WgXcQ",
      "https://youtu.be/drVQdw6oQ6U",
    ]

    return LINKS[getRandomInt(0, LINKS.length)]
  }

  return (
    <div className="Home">
      <div className="Home-content">
        {homeContent.map(([title, content], index) => (
          <Card
            index={index}
            title={title}
            content={content}
            cringeMode={cringeMode}
            link={getRandomLink()}
            key={`Home-${title}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
