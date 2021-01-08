import React, { useState, useEffect } from 'react'
import './CheckableList.less'

const CheckableList = props => {

  const [data, setData] = useState([])

  const handleClick = e => {
    const id = e.target.dataset.id
    let tempData = data
    for(const item of tempData) {
      if(item.id == id) {
        item.checkable = !item.checkable
        break
      }
    }
    props.getCheckableList(tempData)
    setData([...tempData])
  }

  useEffect(() => {
    let list = props.list
    setData([...list])
  }, [props.list, props.type])
  
  return (
    <div className="checkable-list" onClick={handleClick}>
      {
        data.map(item => {
          if((props.type == 'origin' && !item.isAdded) || (props.type == 'added' && item.isAdded)) {
            return (
              <div className={item.checkable?'item active':'item'} key={'checkable-list-item-' + item.id} data-id={item.id}>
                {item.name}
              </div>
            )
          }else {
            return null
          }
        })
      }
    </div>
  )
}

export default CheckableList
