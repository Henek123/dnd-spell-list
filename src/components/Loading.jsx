import React from 'react'
import "./styles/Loading.css"

export default function Loading() {
    // const [visibility, setVisibility] = React.useState(true)
    // setTimeout(() => {
    //     setVisibility(false)
    // }, 10000);
  return (
    <>
        {/* {visibility && <> */}
            <div className="loading-screen">
                <div className="spinner"></div>
                <h4>Loading...</h4>
            </div>
        {/* </>} */}
    </>
  )
}
