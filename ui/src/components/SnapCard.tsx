import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend } from '../api/api'


import { Web3Button } from '@web3modal/react'


const createScheme = (o: any) => {
    // order
    const m = new Map()
    m.set('score', o.score)
    m.set('snapId', o.snapId)
    m.set('version', o.version)
    m.set('versionOrigin', o.versionOrigin)
    m.set('checksum', o.checksum)
    m.set('versionSignature', o.versionSignature)
    m.set('timestamp', Date.now())

    const jsonText = JSON.stringify(Array.from(m.entries()))
    return jsonText
}

export const SnapCard = (props: any) => {

    const id = props.id
    const e = props.snapData

    const { data: dataSign, error, isLoading, signMessage, variables } = useSignMessage()
    const account = useAccount()

    const [scheme, setScheme] = useState(null)


    const saveData = useCallback((message: any) => {
        console.log('saveData', { message })
        setScheme(message as any)
        signMessage({ message })
    }, [])

    useEffect(() => {
        const run = async () => {
            if (!dataSign || !account.address) {
                return
            }

            const r = {
                signature: dataSign,
                address: account.address,
                scheme: scheme
            }
            await saveRecordToBackend(r as any)
            window.alert('Saved!')
        }

        run()
    }, [dataSign])

    return <><div className="post">
        <div>
            <h2>{e.meta[0]}</h2><br />
            {e.meta[1]}<br />
            <a href={e.meta[4]} target="_blank">{e.meta[4]}</a>
        </div>
        <br />

        {e.versionList.length === 0 && <>No versions found</>}

        {e.versionList.map((v: string) => {
            const version = e.versions[v]

            return <div style={{ marginTop: 10 }}>
                Version: <b>{v}</b><br />
                Origin: {version[0]}<br />
                Checksum: {version[1]}<br />
                Signature: {version[2]}<br />
                Change Log: {version[3]}<br />

                <div>
                    <b>Score:&nbsp;</b>
                    {[1, 2, 3, 4, 5].map(score => {
                        const message = createScheme({
                            score,
                            version: v,
                            versionOrigin: version[0],
                            checksum: version[1],
                            versionSignature: version[1],
                            snapId: id + 1
                        }) as any
                        return <span
                            onClick={() => {
                                saveData(message as any)
                            }}

                            className="score-entry">{score}&nbsp;</span>
                    })}
                </div>
            </div>
        })}


        {/*JSON.stringify(e)*/}

        <div style={{ borderBottom: '1px solid gray', marginBottom: 15, marginTop: 15 }}></div>
    </div></>


}

