import { useEffect, useState, useCallback } from 'react'
import Pagination from './Pagination'
import { explorerNFTURL, formatPrice, setWindowParam, getWindowParam, tweet } from '../utils'
import { getSnaps } from '../api/registry'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend } from '../api/api'
import { SnapCard } from './SnapCard'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'

export default function SnapPage(props: any) {
    const { data: dataSign, error, isLoading, signMessage, variables } = useSignMessage()

    const [data, setData] = useState([])
    const { id } = useParams() as any
    console.log({id})


    useEffect(() => {
        const run = async () => {
            const d = await getSnaps()
            setData(d[id])
        }

        run()
    }, [])

    useEffect(() => {
        console.log({ data: dataSign, error, isLoading, signMessage, variables })

    }, [variables?.message])

    if (data.length === 0) {
        return null
    }

    return (
        <main>
            <div className="container" style={{ marginTop: 30 }}>

                {/*dataSign && <div style={{ margin: 20, backgroundColor: 'lightcyan', padding: 10 }}>
					Signature: <br />{dataSign}<br />
					Address: <br />{account.address}<br />
				</div>*/}

                <div className="scroll">
                    <div className="profiles-container">
                        {Object.values(data).length === 0 && <>Loading...</>}

                        <SnapCard id={id} snapData={data} />


                        <div>
                            {data.length === 0 && <div></div>}
                        </div>
                        {/*<Pagination
							numberOfPages={Math.ceil(data.count / PER_PAGE)}
							currentPage={data.page}
							cb={p => setPage(p)}
					/>*/}
                    </div>
                </div>
            </div>
        </main >
    )
}

export function ErrorBoundary({ error }: { error: Error }) {
    return (
        <main>
            <div className="container">
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        </main>
    )
}
