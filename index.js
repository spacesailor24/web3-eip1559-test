const Web3 = require('web3');

const ENV = require('./env.json');

let web3, web3Account

(async () => {
    web3 = new Web3(ENV.ropsten.providerUrl)
    web3Account = web3.eth.accounts.privateKeyToAccount(ENV.ropsten.privateKey)

    console.log('Legacy Transaction:', await legacy())
    console.log('Legacy Transaction V2:', await legacyV2())
    console.log('EIP 2930 Transaction:', await eip2930())
    console.log('EIP 2930 Transaction V2:', await eip2930V2())
    console.log('EIP 1559 Transaction:', await eip1559())
    console.log('EIP 1559 Transaction V2:', await eip1559V2())
    console.log('EIP 1559 Transaction V3:', await eip1559V3())
})()

async function signAndSend(transaction) {
    const signedTx = await web3Account.signTransaction(transaction)
    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
}

// Tests that tx is defaulted to legacy (type should be 0)
async function legacy() {
    console.log('Sending legacy transaction...')
    return await signAndSend({
        chainId: 3,
        gas: 21000,
        nonce: await web3.eth.getTransactionCount(ENV.ropsten.address),
        to: ENV.ropsten.address,
        value: '1',
    })
}

// Tests manually setting type to legacy (type should be 0)
async function legacyV2() {
    console.log('Sending legacy V2 transaction...')
    return await signAndSend({
        chainId: 3,
        gas: 21000,
        nonce: await web3.eth.getTransactionCount(ENV.ropsten.address),
        to: ENV.ropsten.address,
        value: '1',
        type: '0'
    })
}

// Tests that tx is set to EIP2930 (type should be 1)
async function eip2930() {
    console.log('Sending EIP 2930 transaction...')
    return await signAndSend({
        chainId: 3,
        gas: 21000,
        nonce: await web3.eth.getTransactionCount(ENV.ropsten.address),
        to: ENV.ropsten.address,
        value: '1',
        accessList: []
    })
}

// Tests that manually setting type to EIP2930 (type should be 1)
async function eip2930V2() {
    console.log('Sending EIP 2930 V2 transaction...')
    return await signAndSend({
        chainId: 3,
        gas: 21000,
        nonce: await web3.eth.getTransactionCount(ENV.ropsten.address),
        to: ENV.ropsten.address,
        value: '1',
        type: '1'
    })
}

// Tests passing maxFeePerGas and maxPriorityFeePerGas (type should be 2)
async function eip1559() {
    console.log('Sending EIP 1559 transaction...')
    return await signAndSend({
        chainId: 3,
        gas: 21000,
        nonce: await web3.eth.getTransactionCount(ENV.ropsten.address),
        to: ENV.ropsten.address,
        value: '1',
        maxFeePerGas: '0x59682F00', // 1.5 Gwei
        maxPriorityFeePerGas: '0x1DCD6500' // .5 Gwei
    })
}

// Tests manually setting type to EIP1559 (type should be 2)
async function eip1559V2() {
    console.log('Sending EIP 1559 V2 transaction...')
    return await signAndSend({
        chainId: 3,
        gas: 21000,
        nonce: await web3.eth.getTransactionCount(ENV.ropsten.address),
        to: ENV.ropsten.address,
        value: '1',
        type: '2'
    })
}

// Tests that tx is set to EIP1559 (type should be 2)
async function eip1559V3() {
    console.log('Sending EIP 1559 V3 transaction...')
    return await signAndSend({
        chainId: 3,
        gas: 21000,
        nonce: await web3.eth.getTransactionCount(ENV.ropsten.address),
        to: ENV.ropsten.address,
        value: '1',
        accessList: [],
        maxFeePerGas: '0x59682F00', // 1.5 Gwei
    })
}
