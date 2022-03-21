import React from "react"

import assets from "../../assets/info.json"

import "./Home.css"

import Card from "../../components/Card/Card"

const Home = () => {
  const homeContent = assets.home
  return (
    <div className="Home">
      <div className="Home-content">
        {homeContent.map(([title, content], index) => (
          <Card index={index} title={title} content={content} />
        ))}
      </div>
    </div>
  )
}

export default Home
