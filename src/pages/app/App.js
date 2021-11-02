import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers, useTokenBalance } from '@usedapp/core'
import { useState } from 'react'
import AskForToken from '../../components/AskForToken/AskForToken'
import './App.scss'

export default function App() {
  const { active, activateBrowserWallet, deactivate, account, error } = useEthers()
  const [actionError, setActionError] = useState(null)
  const etherBalance = useEtherBalance(account)
  const anotherBalance = useTokenBalance('0xA243FEB70BaCF6cD77431269e68135cf470051b4', account)

  function activate() {
    activateBrowserWallet((err => setActionError(err)))
    setActionError(null)
  }

  return (
    <div className="maindiv">
      {(error || actionError) && <div className="error">{error || actionError?.message}</div>}
      {active ?
        <>
          <span>Connected with <b>{account}</b></span>
          <span><b>You have {etherBalance ? formatEther(etherBalance) : 0}</b> ETH</span>
          <span><b>You have {anotherBalance ? formatEther(anotherBalance) : 0}</b> WETH</span>
          <AskForToken />
          <button onClick={deactivate}>Disconnect</button>
        </>
        : <button onClick={activate}>Connect to MetaMask</button>
      }
    </div>
  )
}