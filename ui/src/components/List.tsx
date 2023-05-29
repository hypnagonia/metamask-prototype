import { useEffect, useState, useCallback } from 'react'
import Pagination from './Pagination'
import { explorerNFTURL, formatPrice, setWindowParam, getWindowParam, tweet } from '../utils'
import { getSnaps } from '../api/registry'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend } from '../api/api'
import { SnapCard } from './SnapCard'

import { Web3Button } from '@web3modal/react'



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
			<header>
				<div className="web3-btn">
					<Web3Button />
				</div>
				<div className="logo-container" style={{ marginTop: 40 }}>
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


				<div className="title">
					{/* 
					<h1>Content Feed</h1>
					<p>
						<small style={{ color: 'white' }}>
							Open and Verifiable Content Feed powered by EigenTrust.
							<a style={{ borderBottom: '1px solid white' }} href="https://karma3labs.notion.site/NFT-Reputation-EigenTrust-Scoring-public-6ec9ec4529854a0cabb6e1cb8fefa8cf#74d0793068df4cc19350d7b84175152c" target="_blank">&nbsp;Learn More.</a>
						</small>
					</p>
					*/}
				</div>
			</header>
			<div className="container" style={{ marginTop: 30 }}>

				{/*dataSign && <div style={{ margin: 20, backgroundColor: 'lightcyan', padding: 10 }}>
					Signature: <br />{dataSign}<br />
					Address: <br />{account.address}<br />
				</div>*/}

				<div className="scroll">
					<div className="profiles-container">
						{Object.values(data).length === 0 && <>Loading...</>}

						{Object.values(data).map((e: any, i) => {

							return <>
								<SnapCard id={i + 1} snapData={e} /></>
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
