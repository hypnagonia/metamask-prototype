import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { computeSnapScore } from '../api/mockCompute'
import { shortenString } from '../utils'

const createScheme = (o: any) => {
    return o
}

export const SnapDetailPage = (props: any) => {
    const [votes, setVotes] = useState([])

    useEffect(() => {
        const run = async () => {
            // const d = await voteGetAll()
            // setVotes(d)
        }

        run()
    }, [])


    const id = props.id
    const e = props.snapData

    const reviewsForSnap = props.reviewsForSnap

    const { data: dataSign, error, isLoading, signMessage, variables } = useSignMessage()
    const account = useAccount()

    const [scheme, setScheme] = useState(null)
    const [isApproveformVisible, setIsApproveformVisible] = useState({} as any)
    const [isReviewformVisible, setIsReviewformVisible] = useState({} as any)

    const saveData = useCallback((message: any) => {
        console.log('saveData', { message })
        setScheme(message as any)
        signMessage({ message: JSON.stringify(message) })
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


           // await saveRecordToBackend(r as any)

            window.alert('Saved!')
        }

        run()
    }, [dataSign])
    const score = computeSnapScore(id, reviewsForSnap)

    console.log({e})

    return <><div>
        <div className="post-full">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '80%' }}>
                    <Link to={"/snap/" + id}> <h3>{e.meta.name}<br />
                        <span style={{ color: 'orange' }}>
                            {[...Array(~~score)].map((a: any) => <>&#11089;</>)}

                        </span>
                        <span style={{ color: 'lightgrey' }}>
                            {[...Array(5 - ~~score)].map((a: any) => <>&#11089;</>)}

                        </span>

                        &nbsp;<b style={{ fontSize: 13 }}>{score === 0 ? score : score.toFixed(2)}</b>
                    </h3></Link>
                </div>
                <div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}>
                    <img src={'/shield.svg'} style={{ width: 26, height: 26 }} />
                </div>
            </div>
            <div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>

            <div className="small-font">
                {e.meta.description}<br />
                <a href={e.meta[4]} target="_blank">{e.meta[4]}</a><br />

            </div>
        </div>

        
        {e.versionList.length === 0 && <>No versions found</>}

        {e.versionList.map((v: string) => {
            const version = e.versions[v]

            const r = [] as any

            return <div className="post-full"><div className="small-font">
                <h3>Version: <b>{v}</b></h3> <br />

                Origin:  <b>{version.versionNumber}</b><br />

                Checksum:  <b>{shortenString(version.shasum, 20)}</b><br />

                Signature:  <b>{shortenString('', 20)}</b><br />
                Change Log:  <b>{shortenString(version.changeLog, 20)}</b><br />
                <br />
                <div className="delimiter"></div><br />
                {r && r.length > 0 && <div className="review-container">
                    <h3>Audit Scores</h3><br />
                    {r.map((e: any) => {

                        const upvotes = votes.filter((a: any) => e.signature === a.scheme[2][1] && a.scheme[0][1] === 'upvote').length
                        const downvotes = votes.filter((a: any) => e.signature === a.scheme[2][1] && a.scheme[0][1] === 'downvote').length

                        const upvoteMessage = [
                            ['vote', 'upvote'],
                            ['address', e.address],
                            ['signature', e.signature]
                        ]

                        const downvoteMessage = [
                            ['vote', 'downvote'],
                            ['address', e.address],
                            ['signature', e.signature]
                        ]

                        return <>

                            <div>
                                Auditor: <Link to={`/auditor/${e.address}`}><b style={{ color: '#2a2a72' }}>{e.address}</b></Link>
                            </div>
                            <div>
                                Signature: <b>{shortenString(e.signature)}</b>
                            </div>
                            <div>
                                Score: <b>{e.scheme[0][1]}</b>
                            </div>
                            <br />
                            <div style={{ marginBottom: 20 }}>
                                <span
                                    onClick={() => {
                                        saveData(upvoteMessage as any)
                                    }}
                                    className="strategy-btn">&#128077; {upvotes}</span>&nbsp;
                                <span
                                    onClick={() => {
                                        saveData(downvoteMessage as any)
                                    }}
                                    className="strategy-btn" style={{ marginLeft: 10 }}>
                                    &#128078; {downvotes}</span>

                            </div><br />
                        </>
                    })}
                </div>}

                {r && r.length > 0 && <><div className="delimiter"></div><br /></>}

                <div>



                    <span
                        onClick={() => setIsApproveformVisible({ ...isApproveformVisible, [version]: !isApproveformVisible[version] })}
                        className="strategy-btn">Approve with a Score of 1-5</span><br />


                    {isApproveformVisible[version] && <>
                        <br />
                        <div className="delimiter"></div><br />
                        <h3>Audit</h3><br />
                        {[1, 2, 3, 4, 5].map(score => {
                            const message = createScheme({
                                score,
                                version: version.versionNumber,
                                checksum: version.checksum,
                                snapId: id
                            }) as any
                            return <span
                                className="strategy-btn"
                                style={{ marginRight: 10 }}
                                onClick={() => {
                                    saveData(message as any)
                                }}>{score}&nbsp;</span>
                        })}
                        < br />
                        <textarea style={{ marginTop: 20, marginBottom: 20 }} placeholder="Report" className="text-input"></textarea>
                        <br />
                        <div className="delimiter"></div><br />
                    </>}

                    <span
                        onClick={() => setIsReviewformVisible({ ...isReviewformVisible, [version]: !isReviewformVisible[version] })}
                        className="strategy-btn" style={{ marginTop: 10 }}>Leave a Review along with score of 1-5</span><br />

                    {isReviewformVisible[version] && <>
                        <br />
                        <div className="delimiter"></div><br />
                        <h3>Review</h3><br />
                        {[1, 2, 3, 4, 5].map(score => {
                            const message = createScheme({
                                score,
                                version: v,
                                versionOrigin: version[0],
                                checksum: version[1],
                                versionSignature: version[1],
                                snapId: id
                            }) as any
                            return <span
                                className="strategy-btn"
                                style={{ marginRight: 10 }}
                                onClick={() => {
                                    saveData(message as any)
                                }}>{score}&nbsp;</span>
                        })}
                        < br />
                        <textarea style={{ marginTop: 20, marginBottom: 20 }} placeholder="Report" className="text-input"></textarea>
                        <br />
                        <div className="delimiter"></div><br />
                    </>}
                </div>
            </div>
            </div>
        })}


    </div></>


}

