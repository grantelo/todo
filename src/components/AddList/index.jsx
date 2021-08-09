import React from 'react'

import List from '../List/List'
import Badge from '../Badge'
import closeSvg from '../../assets/img/close.svg'

import './AddList.scss'
import axios from 'axios'

function AddList({ colors, onAdd }) {
    const [selectedColor, setColor] = React.useState(1)
    const [visiblePopup, setVisiblePopup] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSelectColor = (id) => {
        setColor(id)
    }

    const onOpenPopup = () => {
        setVisiblePopup(true)
    }

    const onClosePopup = () => {
        setVisiblePopup(false)
        setInputValue("")
    }

    const handleChange = (event) => {
        setInputValue(event.target.value)
    }

    const addList = () => {
        if (!inputValue) {
            alert("Введите название списка!")
            return
        }
        setIsLoading(true)
        axios
            .post("/lists", { name: inputValue, colorId: selectedColor })
            .then(({ data }) => {
                const color = colors.find((obj) => obj.id === selectedColor)
                onAdd({ ...data, color, tasks: [] })
                onClosePopup()
            })
            .catch(() => console.log("Не удалось добавить список"))
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="add-list">
            <List items={[{
                className: "list__add-button",
                name: "Добавить список", icon: (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1V11" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1 6H11" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                ),
            }]} onClickItem={onOpenPopup} />

            {visiblePopup && <div className="add-list__popup">
                <img onClick={onClosePopup} className="add-list__popup-close-btn" src={closeSvg} alt="close button" />
                <input value={inputValue} onChange={handleChange} className="field" type="text" placeholder="Название списка" />
                <ul className="add-list__popup-colors">
                    {colors && colors.map((item) => (
                        <li key={item.id} onClick={() => handleSelectColor(item.id)}>
                            <Badge color={item.name} className={selectedColor === item.id && "active"} />
                        </li>
                    ))}
                </ul>
                <button disabled={isLoading} className="button" onClick={addList}>{isLoading ? "Добавление..." : "Добавить"}</button>
            </div>
            }
        </div>
    )
}

export default AddList
