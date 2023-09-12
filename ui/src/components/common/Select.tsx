import { getAuditorScore } from '../../api/mockCompute'
import { useEffect, useState, useCallback } from 'react'

export const Select = (props: any) => {
    const id = props.id
    const onSelect = props.onSelect
    const styles = props.styles
    const [isOpen, setIsOpen] = useState(false)
    const currentOption = props.currentOption

    const handleOption = useCallback((option: any) => {
        if (onSelect) {
            onSelect(option)
        }
        setIsOpen(false)
    }, [])

    const toggle = useCallback(() => {
        if (isOpen) {
            return
        }
        setIsOpen(!isOpen)
    }, [isOpen])

    const options = props.options
    return (<>
        <div className='dropdown' onClick={toggle}>
            {currentOption}
            <img src='/chevron-down.svg' />
        </div>
        {isOpen ? <>
            <div className='dropdown-list-inner'>
                {options.map((o: any) => {
                    return <>
                        <span className='dropdown-list-li' 
                        style={currentOption === o ? {color: '#7000FF'} : {}}
                        onClick={() => handleOption(o)}>{o}</span><br />
                    </>
                })}
            </div>
        </> : null}
    </>)
}