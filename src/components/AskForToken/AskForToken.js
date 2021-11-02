import { parseEther } from "@ethersproject/units"
import { useContractFunction, useEthers, useSendTransaction } from "@usedapp/core"
import { useEffect, useState } from "react"
import { utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { WethAbi } from './WethAbi'

export default function AskForToken() {
    const { account, error } = useEthers()
    const [actionError, setActionError] = useState(null)
    const [isDisabled, setIsDisabled] = useState(false)
    const [wethAmount, setWethAmount] = useState(0)
    // const { sendTransaction, state } = useSendTransaction()

    const wethInterface = new utils.Interface(WethAbi)
    const wethContractAddress = '0xA243FEB70BaCF6cD77431269e68135cf470051b4'
    const contract = new Contract(wethContractAddress, wethInterface)

    const { state, send } = useContractFunction(contract, 'deposit', { transactionName: 'Wrap' })

    const handleClick = () => {
        if (isDisabled) return
        setIsDisabled(true)
        send({ value: parseEther(wethAmount) })
    }

    const parseStatus = status => {
        if (state.status === 'None') { return true }
        if (state.status === 'Success') { return true }
        return false
    }

    useEffect(() => {
        console.log(state)
        if (state.status !== 'Mining') {
            setIsDisabled(false)
            setWethAmount(0)
        }
        if (state.status === 'Fail' || state.status === 'Exception') {
            setActionError({ message: state.errorMessage })
            return
        }
    }, [state])

    if (actionError) {
        return (<>
            {(error || actionError) && <div className="error">{error || actionError?.message}</div>}
        </>)
    }

    return (
        <>
            <input disabled={isDisabled} placeholder="Insert WETH Amount" value={wethAmount} onChange={evt => setWethAmount(evt.target.value.replaceAll(',', '.'))}></input>
            <button disabled={isDisabled} onClick={() => handleClick()}>{parseStatus(state.status) ? 'BUY WETH' : state.status}</button>
        </>
    )
}