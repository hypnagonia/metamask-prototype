import { useEffect, useState } from 'react'
import { throttle } from '../utils'

const throttled = throttle(500)

export const Search = (props: any) => {
    const strategy = props.strategy
    const cb = props.onSearch
    const placeholder = props.placeholder || 'Search...'
    const [search, setSearch] = useState(props.initialValue || '')
    const [suggestions, setSuggestions] = useState([] as any)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (search.length < 2) {
                setSuggestions([])
                return
            }
            setSuggestions([])
        }
        // fetchSuggestions()
    }, [search])

    const handleSuggestionClick = (suggestion: any) => {
        if (cb) {
            cb(suggestion)
        }
        setSearch(suggestion)
        setSuggestions([])
    }

    return (
        <div className="search" style={{ display: 'flex' }}>
            <img src='/search.svg' style={{ position: 'absolute', marginTop: 10, marginLeft: 10 }} />
            <div className='search-input'>
                <input
                    className='search-input-inner'
                    type="text"
                    name="handle"
                    style={{ marginLeft: 25 }}
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => {
                        const v = e.target.value.toLowerCase()
                        setSearch(v)
                        throttled(() => cb && cb(v))
                    }}
                />
            </div>
            {false && suggestions.length > 0 && (
                <div className="suggestions">
                    {suggestions.map((s: any) => (
                        <div className="suggestions-li" key={s} onClick={() => handleSuggestionClick(s)}>
                            {s}
                        </div>
                    ))}
                </div>
            )}


            {/*(
                <button
                    className="btn"
                    type="button"
                    onClick={() => {
                        cb('')
                        setSearch('')
                    }}
                >
                    Clear
                </button>
                )*/}

        </div>
    )
}
