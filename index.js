import React from 'react'
import ReactDOM from 'react-dom'
import ChooseMember from './ChooseMember'

const root = document.querySelector('#root')

ReactDOM.render(<ChooseMember userUrl={userUrl} orgUrl={orgUrl} selectedArr={selectedArr} selectedList={selectedList} getSelectedList={res => getSelectedList(res)}/>, root)