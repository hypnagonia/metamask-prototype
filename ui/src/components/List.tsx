import { useEffect, useState, useCallback } from 'react'
import Pagination from './Pagination'
import { explorerNFTURL, formatPrice, setWindowParam, getWindowParam, tweet } from '../utils'
import { getSnaps } from '../api/registry'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend } from '../api/api'
import { SnapCard } from './SnapCard'




const dateToString = (d: string) => {
	if (!d) {
		return ''
	}

	const date = new Date(d)
	return date.toLocaleString('en-US', { month: '2-digit', year: '2-digit' }).replace(',', '/')
}


const getInitialPage = () => {
	return +getWindowParam('page') || 1
}


export default function List(props: any) {
	const { data: dataSign, error, isLoading, signMessage, variables } = useSignMessage()
	const reviews = props.reviews

	const [data, setData] = useState([])


	useEffect(() => {
		const run = async () => {
			const d = await getSnaps()
			setData(d)
		}

		run()
	}, [])

	useEffect(() => {
		console.log({ data: dataSign, error, isLoading, signMessage, variables })

	}, [variables?.message])

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

						{Object.values(data).map((e: any, i) => {

							const reviewsForSnap = reviews.filter((r: any) => +r.scheme[1][1] === i + 1)

							return <>
								<SnapCard id={i + 1} snapData={e} reviewsForSnap={reviewsForSnap} /></>
						})}

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
