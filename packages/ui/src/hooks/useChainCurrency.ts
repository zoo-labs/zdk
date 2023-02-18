import { getClient } from '@zoolabs/sdk'
import { constants } from 'ethers'
import { Chain, goerli, mainnet, useNetwork } from 'wagmi'

export default function (chainId?: number) {
  const { chains } = useNetwork()
  return getChainCurrency(chains, chainId)
}

export const getChainCurrency = (chains: Chain[], chainId?: number) => {
  const client = getClient()
  const reservoirChain = chainId
    ? client.chains.find((chain) => chain.id === chainId)
    : client.currentChain()

  let chain = chains.find((chain) => reservoirChain?.id === chain.id)

  if (!chain && chains.length > 0) {
    chain = chains[0]
  }

  const ETHChains: number[] = [mainnet.id, goerli.id]

  if (!chain || !chain.nativeCurrency || ETHChains.includes(chain.id)) {
    return {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: constants.AddressZero,
      chainId: chain?.id || mainnet.id,
    }
  } else {
    return {
      ...chain.nativeCurrency,
      address: constants.AddressZero,
      chainId: chain.id,
    }
  }
}
