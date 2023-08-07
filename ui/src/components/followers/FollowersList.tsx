import { useEffect, useState, useCallback } from 'react'
import FollowersCard from './FollowersCard'

export default function FollowersList(props: any) {
	const followers = props.followers

	return (
		<div>
			{followers.map((r: any) => {
				return (
					<div key={r.attestationId}>
						<FollowersCard data={r} />
					</div>
				)
			})}
		</div>
	)
}


