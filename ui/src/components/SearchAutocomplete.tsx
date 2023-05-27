import { useEffect, useState } from 'react'
import { throttle } from '../utils'

const throttled = throttle(500)

export const SearchAutocomplete = (props: any) => {
    const strategy = props.strategy
    const setMode = props.setMode
    const cb = props.onSearch
    const [search, setSearch] = useState(props.initialValue || '')
    const [suggestions, setSuggestions] = useState([] as any)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (search.length < 1) {
                setSuggestions([])
                return
            }

            const results = [] as any[] // await getStrategyData(1, search, strategy.id)

            setSuggestions(results)
        }
        fetchSuggestions()
    }, [search])

    const handleSuggestionClick = (suggestion: any) => {
        cb(suggestion.address)
        setSearch(suggestion.address)
        setSuggestions([])
    }

    return (

        <main>

            <div className="logo-container">
                <a href="https://karma3labs.com/" target="_blank">
                    <img
                        width="180px"
                        className="logo"
                        src="/logo.svg"
                        draggable="false"
                        alt="Karma3Labs Logo"
                    />
                </a>
            </div>

            <div className="container" style={{ paddingTop: 220 }}>

                <div className="search">
                    <input
                        type="text"
                        name="handle"
                        placeholder="Search for your favorite NFTs"
                        value={search}
                        onChange={(e) => {
                            const v = e.target.value.toLowerCase()
                            setSearch(v)
                        }}
                    />


                    <button
                        className="btn"
                        onClick={() => {
                            cb(search)
                            setSuggestions([])
                        }}
                        type="submit">
                        Search
                    </button>


                </div>


                <div className="search">
                    <div
                        onClick={() => setMode(true)}
                        style={{
                            cursor: 'pointer',
                            marginTop: 5,
                            fontSize: 13,
                            textDecoration: 'underline',
                            textAlign: 'right', width: 500
                        }}>
                        See all rankings
                    </div>
                </div>


            </div>

            {suggestions.length > 0 && (
                <div className="suggestions">
                    {suggestions.map((s: any) => (
                        <div className="suggestions-li" key={s.rank} onClick={() => handleSuggestionClick(s)}>

                            <div style={{ width: '80%',opacity: 0.8, fontWeight: 'bold', fontSize: '90%' }}>
                                {s.name}</div>&nbsp;<div style={{ 
                                    fontStyle: 'italic',
                                    color: '#160c28', width: '20%', textAlign: 'right', fontWeight: 'bold', fontSize: '80%' }}>
                                        {s.rank}</div>

                        </div>
                    ))}
                </div>
            )}
        </main >

    )
}
