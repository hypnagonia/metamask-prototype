
import { useEffect, useState, useCallback } from 'react'

const style: any = {
    position: 'fixed',
    bottom: 10,
    right: 20,
    widht: 64,
    height: 64
}

export const FetchPatchLoader = (props: any) => {
    const [requestCount, setRequestCount] = useState(0)

    const setFetching = useCallback((event: any) => {
        
    }, [])

    const setNoFetching = useCallback((event: any) => {
        
    }, [])

    return null

    return (<>
        <div >
            {requestCount}
            <img src={`/loader.svg`} style={style} />
        </div>
    </>)
}