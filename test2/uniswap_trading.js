require('dotenv').config();
const { ethers } = require("ethers");
const { ChainId, WETH, Fetcher, Route, Trade, TokenAmount, TradeType } = require('@uniswap/sdk');

async function main() {
    // Step 1: Set up a wallet using ethers.js
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Step 2: Connect to the Uniswap V2 Router
    const uniswapRouterAddress = process.env.UNISWAP_ROUTER_ADDRESS;
    const uniswapRouterAbi = [""]; // Include the full ABI here
    const uniswapRouter = new ethers.Contract(uniswapRouterAddress, uniswapRouterAbi, wallet);

    // Step 3: Define the swap parameters
    const tokenToSwapForAddress = process.env.TOKEN_TO_SWAP_FOR_ADDRESS;
    const amountInEth = ethers.utils.parseEther("1");

    // Fetching the token data using Uniswap SDK
    const tokenToSwapFor = await Fetcher.fetchTokenData(ChainId.MAINNET, tokenToSwapForAddress, provider);
    const weth = WETH[ChainId.MAINNET];

    // Constructing the trade parameters
    const pair = await Fetcher.fetchPairData(tokenToSwapFor, weth, provider);
    const route = new Route([pair], weth);
    const trade = new Trade(route, new TokenAmount(weth, amountInEth.toString()), TradeType.EXACT_INPUT);

    const slippageTolerance = new ethers.BigNumber.from(200); // 2%
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
    const path = [weth.address, tokenToSwapForAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    // Step 4: Execute the swap
    const tx = await uniswapRouter.swapExactETHForTokens(
        amountOutMin.toString(),
        path,
        wallet.address,
        deadline,
        { value: amountInEth }
    );

    console.log("Transaction hash:", tx.hash);

    // Step 5: Monitor the transaction
    await tx.wait();
    console.log("Transaction confirmed");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
