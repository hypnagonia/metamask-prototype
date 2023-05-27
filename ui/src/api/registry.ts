import registryABIJSON from './registryABI.json'
import { ethers } from 'ethers'
import SignClient from '@walletconnect/sign-client'

//more rpc providers
//https://rpc.info/#goerli
export const rpcUrl = 'https://rpc.ankr.com/eth_goerli'
const chainId = 5
const registryAddess = '0x4936d1f3068f8eC36eCbEd39DbA0395b87f4Ce40'

export const provider = new ethers.JsonRpcProvider(rpcUrl, chainId)

const registry = new ethers.Contract(registryAddess, registryABIJSON, provider)


export const getSnaps = async () => {

    try {
        const cached = JSON.parse(localStorage.getItem('registry') as any)
        console.log({ cached })

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

    localStorage.setItem('registry', JSON.stringify(r))
    console.log({ r, res })
    return r
}


export const getSnapData = async () => {
    const count = await registry.snapsIndex()
    const snaps = {} as any
    for (let i = 1; i <= count; i++) {
        snaps[i] = {} as any
        const meta = await registry.snaps(i)

        snaps[i].meta = meta

    }

    for (let i = 1; i <= count; i++) {
        const versions = Object.values(await registry.getSnapReleasedVersions(i)) as string[]

        snaps[i].versionList = versions
        snaps[i].versions = {} as any

        for (let v of versions) {
            const versionData = await registry.getSnapVersion(i, v)
            snaps[i].versions[v] = versionData
        }
    }

    return snaps
}


