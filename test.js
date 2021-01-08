import React from 'react'

// function Test(props) {

//   // const [count, setCount] = useState(100)

//   return (
//     <h1>111</h1>
//   )
// }

class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 111
    }
  }

  render() {
    return (
      <h1>{{count}}</h1>
    )
  }
}

export default Test