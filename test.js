import React, { useState } from 'react'

const Test = () => {

  const [count, setCount] = useState(100)

  return (
    <h1>{count}</h1>
  )
}

export default Test