import { isOpenSeaBanned } from '@reservoir0x/reservoir-kit-core'
import { useEffect, useState } from 'react'

export default function (contract?: string, token?: number | string) {
  const [isBanned, setIsBanned] = useState<boolean | null>(null)

  useEffect(() => {
    if (contract && token) {
      debugger
      isOpenSeaBanned(contract, token)
        .then((isBanned) => {
          setIsBanned(isBanned)
        })
        .catch((e) => {
          console.error(e)
          setIsBanned(null)
        })
    } else {
      setIsBanned(null)
    }
  }, [contract, token])

  return isBanned
}