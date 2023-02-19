import type { AppProps } from 'next/app'
import React, {
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
} from 'react'
import { darkTheme } from 'stitches.config'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from 'next-themes'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import * as allChains from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import '../fonts.css'
import {
  ZooProvider,
  darkTheme as defaultTheme,
  zooTheme,
  CartProvider,
} from '@zoolabs/ui'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 1)
const SOURCE = process.env.NEXT_PUBLIC_SOURCE || 'zdk.demo'
const FEE = process.env.NEXT_PUBLIC_MARKETPLACE_FEE
  ? +process.env.NEXT_PUBLIC_MARKETPLACE_FEE
  : undefined
const FEE_RECIPIENT =
  process.env.NEXT_PUBLIC_MARKETPLACE_FEE_RECIPIENT || undefined
const NORMALIZE_ROYALTIES = process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES
  ? process.env.NEXT_PUBLIC_NORMALIZE_ROYALTIES === 'true'
  : false
const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY || ''
console.log('ALCHEMY_KEY', ALCHEMY_KEY)

const { chains, provider } = configureChains(
  [allChains.mainnet, allChains.goerli, allChains.polygon],
  [alchemyProvider({ apiKey: ALCHEMY_KEY }), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'ZDK Demo',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

export const ThemeSwitcherContext = React.createContext<{
  theme: zooTheme
  setTheme: Dispatch<SetStateAction<zooTheme>> | null
}>({
  theme: defaultTheme(),
  setTheme: null,
})

const ThemeSwitcher: FC<any> = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme())

  return (
    <ThemeSwitcherContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeSwitcherContext.Provider>
  )
}

type AppWrapperProps = {
  children: ReactNode
}

const AppWrapper: FC<any> = ({ children }) => {
  const { theme } = useContext(ThemeSwitcherContext)

  return (
    <WagmiConfig client={wagmiClient}>
      <ZooProvider
        options={{
          chains: [
            {
              baseApiUrl: 'https://api.reservoir.tools',
              id: allChains.mainnet.id,
              default: CHAIN_ID === allChains.mainnet.id,
              apiKey: API_KEY,
            },
            {
              baseApiUrl: 'https://api-goerli.reservoir.tools',
              id: allChains.goerli.id,
              default: CHAIN_ID === allChains.goerli.id,
              apiKey: API_KEY,
            },
            {
              baseApiUrl: 'https://api-polygon.reservoir.tools',
              id: allChains.polygon.id,
              default: CHAIN_ID === allChains.polygon.id,
              apiKey: API_KEY,
            },
          ],
          marketplaceFee: FEE,
          marketplaceFeeRecipient: FEE_RECIPIENT,
          source: SOURCE,
          normalizeRoyalties: NORMALIZE_ROYALTIES,
        }}
        theme={theme}
      >
        <CartProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            value={{
              dark: darkTheme.className,
              light: 'light',
            }}
            enableSystem={false}
            storageKey={'demo-theme'}
          >
            <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
          </ThemeProvider>
        </CartProvider>
      </ZooProvider>
    </WagmiConfig>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeSwitcher>
      <AppWrapper>
        {/* @ts-ignore */}
        <Component {...pageProps} />
      </AppWrapper>
    </ThemeSwitcher>
  )
}

export default MyApp
