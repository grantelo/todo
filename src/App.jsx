import axios from 'axios';
import React, { useEffect } from 'react'
import { Redirect, Route, useHistory, useLocation } from 'react-router-dom'
import classNames from 'classnames'

import AddList from './components/AddList';
import { List } from './components/List'
import Tasks from './components/Task';
import './index.scss'
import reducer from './reducer'

const initialState = {
  lists: null,
  colors: null,
  activeItem: null,
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const history = useHistory()
  const location = useLocation()

  const setLists = (lists) => {
    dispatch({ type: 'SET_LISTS', payload: lists })
  }

  const setColors = (colors) => {
    dispatch({ type: 'SET_COLORS', payload: colors })
  }

  const setActiveItem = (activeItem) => {
    dispatch({ type: 'SET_ACTIVE_ITEM', payload: activeItem })
  }

  useEffect(() => {
    axios.get("/lists?_expand=color&_embed=tasks")
      .then(({ data }) => {
        setLists(data)
      });
    axios.get("/colors")
      .then(({ data }) => {
        setColors(data);
      })
  }, [])

  useEffect(() => {
    const listId = location.pathname.split("/lists/")[1]
    const list = state.lists?.find((item) => item.id === +listId)

    setActiveItem(list)
  }, [state.lists, location.pathname])

  const handleClickItem = (list) => {
    if (!list.id) {
      history.push("/")
      return
    }

    history.push(`/lists/${list.id}`)
  }

  const onAddList = (listObj) => {
    setLists([...state.lists, listObj])
  }

  const onCompleteTask = (listId, taskId, completed) => {
    const newList = state.lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (taskId === task.id) {
            task.completed = completed
          }

          return task
        })
      }
      return list
    })

    setLists(newList)


    axios
      .patch("/tasks/" + taskId, {
        completed
      })
      .catch(() => alert("Не удалось обновить задачу"))
  }

  const onRenameTask = (listId, taskObj) => {
    const newTaskText = window.prompt("Введите новый текст задачи", taskObj.text)

    if (!newTaskText) {
      return;
    }

    const newList = state.lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map(task => {
          if (task.id === taskObj.id) {
            task.text = newTaskText
          }

          return task
        })
      }

      return list
    })

    setLists(newList)
    axios
      .patch(`/tasks/${taskObj.id}`, {
        text: newTaskText
      })
      .catch(() => alert("Не удалось обновить задачу"))
  }

  const onDeleteTask = (listId, taskId) => {
    const newList = state.lists.map(list => {
      if (list.id === listId) {
        list.tasks = list.tasks.filter(task => task.id !== taskId)
      }

      return list
    })

    setLists(newList)

    axios
      .delete(`/tasks/${taskId}`)
      .catch(() => alert("Не удалось удалить задачу"))
  }

  const onAddTask = (taskObj) => {
    const newList = state.lists.map(list => {
      if (taskObj.listId === list.id) {
        list.tasks = [...list.tasks, taskObj]
      }

      return list
    })

    setLists(newList)
  }

  const onRenameList = (listId, listName) => {
    const name = window.prompt("Введите название списка", listName)

    if (!name) {
      alert("Название списка не может быть пустым")
      return
    }

    const newLists = state.lists.map(list => {
      if (list.id === listId) {
        list.name = name
      }

      return list
    })

    setLists(newLists)

    axios
      .patch(`/lists/${listId}`, { name })
      .catch(() => alert("Не удалось изменить название списка"))
  }

  const onDeleteList = (list) => {
    if (!window.confirm("Вы действительно хотите удалить список?")) return

    const newList = state.lists.filter((item) => item.id !== list.id)

    axios
      .delete(`/lists/${list.id}`)
      .then(() => setLists(newList))
      .catch(() => alert("Не удалось удалить список"))
  }

  return (
    <div className="todo">
      <div className={classNames("todo__sidebar", { empty: !state.lists?.length })}>
        {!state.lists?.length ? "" :
          <List items={[{
            name: "Все задачи", icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.96 8.10001H7.74C7.2432 8.10001 7.2 8.50231 7.2 9.00001C7.2 9.49771 7.2432 9.90001 7.74 9.90001H12.96C13.4568 9.90001 13.5 9.49771 13.5 9.00001C13.5 8.50231 13.4568 8.10001 12.96 8.10001ZM14.76 12.6H7.74C7.2432 12.6 7.2 13.0023 7.2 13.5C7.2 13.9977 7.2432 14.4 7.74 14.4H14.76C15.2568 14.4 15.3 13.9977 15.3 13.5C15.3 13.0023 15.2568 12.6 14.76 12.6ZM7.74 5.40001H14.76C15.2568 5.40001 15.3 4.99771 15.3 4.50001C15.3 4.00231 15.2568 3.60001 14.76 3.60001H7.74C7.2432 3.60001 7.2 4.00231 7.2 4.50001C7.2 4.99771 7.2432 5.40001 7.74 5.40001ZM4.86 8.10001H3.24C2.7432 8.10001 2.7 8.50231 2.7 9.00001C2.7 9.49771 2.7432 9.90001 3.24 9.90001H4.86C5.3568 9.90001 5.4 9.49771 5.4 9.00001C5.4 8.50231 5.3568 8.10001 4.86 8.10001ZM4.86 12.6H3.24C2.7432 12.6 2.7 13.0023 2.7 13.5C2.7 13.9977 2.7432 14.4 3.24 14.4H4.86C5.3568 14.4 5.4 13.9977 5.4 13.5C5.4 13.0023 5.3568 12.6 4.86 12.6ZM4.86 3.60001H3.24C2.7432 3.60001 2.7 4.00231 2.7 4.50001C2.7 4.99771 2.7432 5.40001 3.24 5.40001H4.86C5.3568 5.40001 5.4 4.99771 5.4 4.50001C5.4 4.00231 5.3568 3.60001 4.86 3.60001Z" fill="#7C7C7C" />
            </svg>
            ),
            active: history.location.pathname === "/"
          }]} onClickItem={handleClickItem} />}
        <List items={state.lists} onClickItem={handleClickItem} activeItem={state.activeItem} isRemovable onDeleteList={onDeleteList} />
        <AddList colors={state.colors} onAdd={onAddList} />
      </div>
      <div className="todo__tasks">
        <Route exact path="/" >
          {state.lists?.map((list) => (
            <Tasks
              key={list.id}
              list={list}
              onCompleteTask={onCompleteTask}
              onRenameTask={onRenameTask}
              onDeleteTask={onDeleteTask}
              onAddTask={onAddTask}
              onRenameList={onRenameList}
            />
          ))}
        </Route>
        <Route exact path="/lists/:id" >
          {state.activeItem && <Tasks
            list={state.activeItem}
            onCompleteTask={onCompleteTask}
            onRenameTask={onRenameTask}
            onDeleteTask={onDeleteTask}
            onAddTask={onAddTask}
            onRenameList={onRenameList}
          />}
        </Route>
        <Redirect to="/" />
        {!state?.lists?.length && <h1>Списки задач отсутвуют</h1>}
      </div>
    </div>
  );
}

export default App;
