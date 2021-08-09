import axios from 'axios'
import React from 'react'

import { List } from '../List/'

function AddTask({ list, onAdd }) {
    const [inputValue, setInputValue] = React.useState("")
    const [visiblePopup, setVisiblePopup] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const handleChange = (event) => {
        setInputValue(event.target.value)
    }

    const onOpenPopup = () => {
        setVisiblePopup(true)
    }

    const onClosePopup = () => {
        setVisiblePopup(false)
        setVisiblePopup("")
    }

    const onAddTask = () => {
        if (!inputValue) {
            alert("Невозможно добавить пустую задачу!")
            return
        }

        setIsLoading(true)

        const obj = {
            listId: list.id,
            text: inputValue,
            completed: false
        }

        axios
            .post("/tasks", obj)
            .then(({ data }) => {
                onAdd({ ...data })
                setVisiblePopup(false)
                setInputValue("")
            })
            .catch((alert))
            .finally(() => {
                setIsLoading(false)
            })

    }

    return (
        <div className="tasks__form">
            {!visiblePopup ? (<div className="tasks__form-add">
                <List items={[{
                    name: "Новая задача",
                    icon: (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1V11" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1 6H11" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    )
                }]} onClickItem={onOpenPopup} />
            </div>) :
                (<div className="tasks__form-block">
                    <input placeholder="Текст задачи" className="field" value={inputValue} onChange={handleChange} type="text" />
                    <button disabled={isLoading} onClick={onAddTask} className="button">{isLoading ? 'Добавление...' : 'Добавить задачу'}</button>
                    <button onClick={onClosePopup} className="button button--gray">Отмена</button>
                </div>)}
        </div>
    )
}

export default AddTask
