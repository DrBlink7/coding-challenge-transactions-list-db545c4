/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable generator-star-spacing */
import { type ForkEffect, takeEvery } from 'redux-saga/effects'
import {
  JsonRpcProvider,
  type Transaction,
  type TransactionResponse,
  type TransactionReceipt,
  BrowserProvider,
  type Signer
} from 'ethers'

import apolloClient from '../apollo/client'
import { Actions } from '../types'
import { SaveTransaction } from '../queries'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* sendTransaction() {
  const provider = new JsonRpcProvider('http://localhost:8545')

  const walletProvider = new BrowserProvider(window.web3.currentProvider)

  const signer: Signer = yield walletProvider.getSigner()

  const accounts: Array<{ address: string }> = yield provider.listAccounts()

  const randomAddress = (): string => {
    const min = 1
    const max = 19
    const random = Math.round(Math.random() * (max - min) + min)
    return accounts[random].address
  }

  const transaction = {
    to: randomAddress(),
    value: 1000000000000000000
  }

  try {
    const txResponse: TransactionResponse =
      yield signer.sendTransaction(transaction)
    const response: TransactionReceipt = yield txResponse.wait()

    const receipt: Transaction = yield response.getTransaction()

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit?.toString()) ?? '0',
        gasPrice: (receipt.gasPrice?.toString()) ?? '0',
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value?.toString()) ?? '',
        data: (receipt.data !== '') ?? null,
        chainId: (receipt.chainId?.toString()) ?? '123456',
        hash: receipt.hash
      }
    }

    yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables
    })
  } catch (error) {
    //
  }
}

export function* rootSaga(): Generator<ForkEffect<never>, void, unknown> {
  yield takeEvery(Actions.SendTransaction, sendTransaction)
}
