import { NextPage } from 'next'
import { AcceptBidModal } from '@zoolabs/ui'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import ThemeSwitcher from 'components/ThemeSwitcher'
import { useState, useEffect } from 'react'
import DeeplinkCheckbox from 'components/DeeplinkCheckbox'
import { useRouter } from 'next/router'

const DEFAULT_COLLECTION_ID =
  process.env.NEXT_PUBLIC_DEFAULT_COLLECTION_ID ||
  '0xe14fa5fba1b55946f2fa78ea3bd20b952fa5f34e'
const DEFAULT_TOKEN_ID = process.env.NEXT_PUBLIC_DEFAULT_TOKEN_ID || '39'
const NORMALIZE_ROYALTIES = process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES
  ? process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES === 'true'
  : false

const AcceptBidPage: NextPage = () => {
  const router = useRouter()
  const [collectionId, setCollectionId] = useState(DEFAULT_COLLECTION_ID)
  const [tokenId, setTokenId] = useState(DEFAULT_TOKEN_ID)
  const deeplinkOpenState = useState(true)
  const hasDeeplink = router.query.deeplink !== undefined
  const [bidId, setBidId] = useState('')
  const [normalizeRoyalties, setNormalizeRoyalties] =
    useState(NORMALIZE_ROYALTIES)

  useEffect(() => {
    const prefilledBidId = router.query.bidId
      ? (router.query.bidId as string)
      : ''
    setBidId(prefilledBidId)
    console.log(router.query)
  }, [router.query])

  return (
    <div
      style={{
        display: 'flex',
        height: 50,
        width: '100%',
        gap: 12,
        padding: 24,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 150,
      }}
    >
      <ConnectButton />

      <div>
        <label>Collection Id: </label>
        <input
          type="text"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
        />
      </div>
      <div>
        <label>Token Id: </label>
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
      </div>
      <div>
        <label>Bid Id: </label>
        <input
          type="text"
          value={bidId}
          onChange={(e) => setBidId(e.target.value)}
          placeholder="Enter an bid id or set a bidId query param"
          style={{ width: 250 }}
        />
      </div>
      <DeeplinkCheckbox />
      <div>
        <label>Normalize Royalties: </label>
        <input
          type="checkbox"
          checked={normalizeRoyalties}
          onChange={(e) => {
            setNormalizeRoyalties(e.target.checked)
          }}
        />
      </div>

      <AcceptBidModal
        trigger={
          <button
            style={{
              marginTop: 50,
              padding: 24,
              background: 'blue',
              color: 'white',
              fontSize: 18,
              border: '1px solid #ffffff',
              borderRadius: 8,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Accept Bid
          </button>
        }
        collectionId={collectionId}
        tokenId={tokenId}
        openState={hasDeeplink ? deeplinkOpenState : undefined}
        bidId={bidId}
        normalizeRoyalties={normalizeRoyalties}
        onBidAccepted={(data) => {
          console.log('Bid Accepted', data)
        }}
        onBidAcceptError={(error, data) => {
          console.log('Bid Accept Error', error, data)
        }}
        onCurrentStepUpdate={(data) => {
          console.log('Current Step Updated', data)
        }}
        onClose={() => {
          console.log('AcceptBidModal Closed')
        }}
      />
      <ThemeSwitcher />
    </div>
  )
}

export default AcceptBidPage
