import { useEffect, useState, useCallback } from 'react'
import {
	getFeedPostsByName,
	getSuggestedPostsByName,
	PER_PAGE,
	Profile
} from '../api/api'

import Pagination from './Pagination'
import { explorerNFTURL, formatPrice, setWindowParam, getWindowParam, tweet } from '../utils'
import { getSnaps } from '../api/registry'
import { useSignMessage, useAccount } from 'wagmi'

import { Post } from './Post'
import { Web3Button } from '@web3modal/react'

const isFeed = () => true // window.location.pathname.indexOf('/feed') !== -1

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
	const account = useAccount()

	console.log({account})

	const [data, setData] = useState([])

	const [page, setPage] = useState(getInitialPage())
	const [search, setSearch] = useState(getWindowParam('strategy') || 'latest')

	const filterData = useCallback((s: string) => {
		setWindowParam('strategy', s)
		setSearch(s)
		setPage(1)
	}, [])


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


	console.log(Object.values(data))

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
				<div onClick={()=>signMessage({message: 'fuck'})}>sign</div>
				{/*JSON.stringify({address, isConnected})*/}<br/>
				{JSON.stringify({ data: dataSign, error, isLoading, signMessage, variables } )}
				

				<div className="scroll">
					<div className="profiles-container">
						{Object.values(data).map((e: any, i) => {
							const isLast = data.length === i + 1

							return <div className="post">
								<div>
									<b>{e.meta[0]}</b><br />
									{e.meta[1]}
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
									</div>
								})}

								{/*JSON.stringify(e)*/}

								<div style={{ borderBottom: '1px solid gray', marginBottom: 15, marginTop: 15 }}></div>
							</div>


						})

						}
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
