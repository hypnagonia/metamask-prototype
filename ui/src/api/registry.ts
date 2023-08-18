import registryABIJSON from './registryABI.json'
import { ethers } from 'ethers'
import SignClient from '@walletconnect/sign-client'

//more rpc providers
//https://rpc.info/#goerli
export const rpcUrl = process.env.REACT_APP_PROVIDER_URL || 'https://rpc.ankr.com/eth_goerli'
// const chainId = 5
const registryAddess = process.env.REACT_APP_SNAPS_REGISTRY_ADDRESS || ''


export const provider = new ethers.JsonRpcProvider(rpcUrl)

const registry = new ethers.Contract(registryAddess, registryABIJSON.abi, provider)

const registryKey = 'snaps-registry-' + registryAddess

export const getSnaps = async () => {

    try {
        const cached = JSON.parse(localStorage.getItem(registryKey) as any)

        if (cached) {
            return cached
        }
    } catch (e) { }

    const res = await getSnapData()

    const r = JSON.parse(JSON.stringify(res, (this, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value
    )))

    localStorage.setItem(registryKey, JSON.stringify(r))
    
    return r
}


let cachedData: any

export const getSnapData = async (ignoreCache = false) => {
    if (!ignoreCache && cachedData) {
        return cachedData
    }

    let count
    try {
        // count = await registry.snapsIndex()
        count = await registry.getSnapTotalSupply()//.then(r => r.toString())
    } catch (e) {
        count = await registry.getSnapTotalSupply()//.then(r => r.toString())
    }
    // console.log('snaps total', count)
    const snaps = {} as any
    for (let i = 1; i <= count; i++) {
        snaps[i] = {} as any
        const meta = await registry.getSnap('' + i)
        
        snaps[i].meta = {
            id: i,
            name: meta[0],
            description: meta[1],
            author: meta[2],
            category: meta[3],
            docUrl: meta[4],
            publisher: meta[5],
            creationTime: meta[6],
        }
        // console.log('getSnap ' + i, snaps[i].meta)
    }

    for (let i = 1; i <= count; i++) {
        const versions = Object.values(await registry.getSnapVersions(i)) as string[]
        
        snaps[i].versionList = versions
        snaps[i].versions = {} as any

        for (let v of versions) {
            const versionData = await registry.getSnapVersion(v)
            
            snaps[i].versions[v] = {
                shasum: versionData[0],
                versionNumber: versionData[2],
                changeLog: versionData[3],
                publisher: versionData[6]
            }
        }
    }

    cachedData = snaps
    return snaps
}


