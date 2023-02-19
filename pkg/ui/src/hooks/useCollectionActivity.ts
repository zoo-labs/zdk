import { paths, setParams } from '@zoolabs/sdk'
import { SWRInfiniteConfiguration } from 'swr/infinite'
import { useInfiniteApi, useZooClient } from './'

type CollectionActivityResponse =
  paths['/collections/activity/v5']['get']['responses']['200']['schema']

type CollectionActivityQuery =
  paths['/collections/activity/v5']['get']['parameters']['query']

export default function (
  options?: CollectionActivityQuery | false,
  swrOptions: SWRInfiniteConfiguration = {},
  chainId?: number
) {
  const client = useZooClient()
  const chain =
    chainId !== undefined
      ? client?.chains.find((chain) => chain.id === chainId)
      : client?.currentChain()

  const response = useInfiniteApi<CollectionActivityResponse>(
    (pageIndex, previousPageData) => {
      if (
        !options ||
        (!options.collection && !options.collectionsSetId && !options.community)
      ) {
        return null
      }

      const url = new URL(`${chain?.baseApiUrl}/collections/activity/v5`)

      let query: CollectionActivityQuery = { ...options }

      if (previousPageData && !previousPageData.continuation) {
        return null
      } else if (previousPageData && pageIndex > 0) {
        query.continuation = previousPageData.continuation
      }

      setParams(url, query)

      return [url.href, chain?.apiKey, client?.version]
    },
    {
      revalidateOnMount: true,
      revalidateFirstPage: false,
      ...swrOptions,
    }
  )

  const activities = response.data?.flatMap((page) => page.activities) ?? []

  return {
    ...response,
    data: activities,
  }
}
