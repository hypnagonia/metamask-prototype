import React, { useState, useEffect } from 'react';
import { getSnaps } from '../../api/registry'

export function useSnaps() {
    const [snaps, setSnaps] = useState([])

    const loadSnaps = async () => {
        const result = await getSnaps()
        setSnaps(result)

    }

    useEffect(() => {
        loadSnaps()
    }, [])

    return { snaps, loadSnaps }
}




