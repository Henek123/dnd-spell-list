import React from 'react'
import "./styles/Loading.css"

export default function Loading() {
  return (
    <>
      <div className="loading-screen">
        <div className="spinner"></div>
        <h4>Loading...</h4>
      </div>
    </>
  )
}
