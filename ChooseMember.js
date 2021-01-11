/*
 * @Descripttion: 
 * @version: 
 * @Author: jie.niu
 * @Date: 2020-05-22 09:55:35
 * @LastEditors: jie.niu
 * @LastEditTime: 2020-05-22 11:55:08
 */ 
import React, { useState, useEffect } from 'react'
import { Tree, Button, Input, Switch, Divider } from 'antd'
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons'
import CheckableList from './CheckableList/CheckableList'
import axios from 'axios'
import Qs from 'qs'
import './ChooseMember.less'

const { Search } = Input
const { DirectoryTree } = Tree

axios.defaults.baseURL = '/api/uts'

const httpGet = options => {
  return new Promise((resolve, reject) => {
    options.data = Qs.stringify(options.data)
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    if(window.localStorage.getItem('Token')) {
      headers.Token = window.localStorage.getItem('Token')
    }
    const instance = axios.create({
        headers,
        timeout: 30000,
        method: 'GET',
        withCredentials: true
    })
    instance(options)
    .then(response => {
      switch (response.data.code) {
        case -1:
            reject(response.data.message)
            break
        case -999:
            reject(response.data)
            break
        case -2:
            reject({message: '用户未登录，请登录', code: -2})
            break
        case -3:
            reject({message: '用户token无效', code: -3})
            break
        case -4:
            reject({message: '用户token超时', code: -4})
            break
        case -5:
            reject('获取上传文件失败')
            break
        case -401:
            reject('无权限操作')
            break
        case 1:
            resolve(response.data)
            break
        default:
            resolve(response.data)
            break
      }
    }).catch(() => {
      reject(new Error('系统/网络异常，请检查后重试'))
    })
  })
}

function initTreeData(arr, rootId) {
  let treeData = []
  const rootArr = arr.filter(item => item.pid == rootId)
  let children = []
  for(let item of rootArr) {
      children = arr.filter(item => item.pid == rootId)
      if(children.length > 0) {
          treeData.push({
              title: item.label,
              key: 'node-component-' + item.id,
              children: initTreeData(item.children, item.id)
          })
      }else {
          treeData.push({
              title: item.label,
              key: 'node-component-' + item.id,
              children: []
          })
      }
  }
  return treeData
}

const ChooseMember = (props) => {
    const [selectedArr, setSelectedArr] = useState(props.selectedArr)
    const [treeData, setTreeData] = useState([])
    const [memberList, setMemberList] = useState([])
    const [selectedMemberList, setSelectedMemberList] = useState(props.selectedList)
    const [orgIdForSearch, setOrgIdForSearch] = useState(1)
    const onSearch = (e) => {
      if(e !== '') {
        httpGet({url: `${props.userUrl}?parentOrgId=${orgIdForSearch}/keyword=${e}`})
          .then(response => {
            if(response.code == 1) {
              let t = []
              response.data.forEach(item => {
                if(selectedMemberList.filter(item1 => item1.id == item.id).length == 0) {
                  t.push({
                    name: item.cnName,
                    checkable: false,
                    isAdded: false,
                    id: item.id
                  })
                }
              })
              setMemberList(t)
            }
          })
      }
    }

    let tempCheckableList = []

    const handleClickOrg = key => {
      let orgId = key[0].split('-')[2]
      setOrgIdForSearch(orgId)
      httpGet({url: `${props.userUrl}?parentOrgId=${orgId}`})
      .then(response => {
        if(response.code == 1) {
          let t = []
          response.data.forEach(item => {
            if(selectedMemberList.filter(item1 => item1.id == item.id).length == 0) {
              t.push({
                name: item.cnName,
                checkable: false,
                isAdded: false,
                id: item.id
              })
            }
          })
          setMemberList(t)
        }
      })
    }

    const handleMove = type => {
      if(type == 'right') {
        let arr = tempCheckableList.filter(item => item.checkable)
        let arr1 = tempCheckableList.filter(item => !item.checkable)
        setMemberList(arr1)
        arr.forEach(item => {
          if(item.checkable) {
            item.isAdded = true
            item.checkable = false
          }
        })
        let t = selectedMemberList
        t = arr.concat(t)
        setSelectedMemberList(t)
        props.getSelectedList(t)
      }else {
        let arr = tempCheckableList.filter(item => item.checkable)
        let arr1 = tempCheckableList.filter(item => !item.checkable)
        arr.forEach(item => {
          if(item.checkable) {
            item.isAdded = false
            item.checkable = false
          }
        })
        let t = memberList
        t = arr.concat(t)
        setMemberList(t)
        setSelectedMemberList(arr1)
        props.getSelectedList(arr1)
      }
    }

    const getLeftCheckableList = list => {
      if(list && list.length > 0) {
        tempCheckableList = list
      }
    }

    const getRightCheckableList = list => {
      if(list && list.length > 0) {
        tempCheckableList = list
      }
    }

    useEffect(() => {
      async function getTreeData() {
        let tempTreeData = await httpGet({url: props.orgUrl})
        if(tempTreeData.code == 1) {
          let t = $tools.initTreeData(tempTreeData.data, 1)
          setTreeData([{title: '组织机构', key: 'node-component-1', children: t}])
        }
      }
        getTreeData()
    }, [selectedArr])

    return (
          <div>
            <div>
              <Search placeholder="input search text" onSearch={(e)=>onSearch(e)} enterButton className="choosemember-search"/>
            </div>
            <br />
            <div className="choosemember-content">
                <div className="choosemember-item choosemember-left">
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '15px'}}>
                    <h3>组织架构</h3>
                  </div>
                  <Divider orientation="left">列表</Divider>
                  <DirectoryTree defaultExpandAll treeData={treeData} style={{textAlign: 'left'}} onSelect={(key)=>handleClickOrg(key)}/>
                </div>
                <div className="choosemember-item choosemember-middle">
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '15px'}}>
                    <h3>员工列表</h3>
                    <Switch checkedChildren="开启" unCheckedChildren="关闭"/>
                  </div>
                  <Divider orientation="left">列表</Divider>
                  <CheckableList type="origin" list={memberList} getCheckableList={(tt)=>getLeftCheckableList(tt)}/>
                </div>
                <div className="choosemember-middle-button-group">
                    <Button className="move-btn" type="primary" onClick={()=>handleMove('right')}>
                      <DoubleRightOutlined />
                    </Button>
                    <br></br>
                    <Button className="move-btn" type="primary" onClick={()=>handleMove('left')}>
                      <DoubleLeftOutlined />
                    </Button>
                </div>
                <div className="choosemember-item choosemember-right">
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '15px'}}>
                    <h3>已选员工列表</h3>
                    <Switch checkedChildren="开启" unCheckedChildren="关闭"/>
                  </div>
                  <Divider orientation="left">列表</Divider>
                  <CheckableList type="added" list={selectedMemberList} getCheckableList={(tt)=>getRightCheckableList(tt)}/>
                </div>
            </div>
            </div>
    )
}

export default ChooseMember