/* eslint-disable prefer-const */
import { ONE_BD, ZERO_BD, ZERO_BI } from './constants'
import { Bundle, Pool, Token } from './../types/schema'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { exponentToBigDecimal, safeDiv } from '../utils/index'

const WMatic_ADDRESS = '0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9'//WETH
const USDC_WMatic_03_POOL = '0xc44ad482f24fd750caeba387d2726d8653f8c4bb'

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export let WHITELIST_TOKENS: string[] = [
  '0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9', // WETH
  '0x1e4a5963abfd975d8c9021ce480b42188849d41d', // USDT
  '0xa2036f0538221a77a3937f1379699f44945018d0', //MATIC
  '0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035', //USDC
  '0xc5015b9d9161dca7e18e32f6f25c4ad850731fd4', //DAI
  '0xea034fb02eb1808c2cc3adbc15f447b93cbe08e1', //WBTC
  '0x37eaa0ef3549a5bb7d431be78a3d99bd360d19e5', //USDC.E
  '0x744c5860ba161b5316f7e80d9ec415e2727e5bd5', //DAI.E
  '0xbf6de60ccd9d22a5820a658fbe9fc87975ea204f' //wstETH
]

let MINIMUM_Matic_LOCKED = BigDecimal.fromString('0.1')

let Q192 = Math.pow(2, 192)

let STABLE_COINS: string[] = [
  '0x1e4a5963abfd975d8c9021ce480b42188849d41d', // USDT
  '0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035', //USDC
  '0xc5015b9d9161dca7e18e32f6f25c4ad850731fd4', //DAI
  '0x37eaa0ef3549a5bb7d431be78a3d99bd360d19e5', //USDC.E
  '0x744c5860ba161b5316f7e80d9ec415e2727e5bd5' //DAI.E
]


export function priceToTokenPrices(price: BigInt, token0: Token, token1: Token): BigDecimal[] {
  let num = price.times(price).toBigDecimal()
  let denom = BigDecimal.fromString(Q192.toString())
  let price1 = num
    .div(denom)
    .times(exponentToBigDecimal(token0.decimals))
    .div(exponentToBigDecimal(token1.decimals))

  let price0 = safeDiv(BigDecimal.fromString('1'), price1)
  return [price0, price1]
}

export function getEthPriceInUSD(): BigDecimal {
  let usdcPool = Pool.load(USDC_WMatic_03_POOL) // WETH is token0
  if (usdcPool !== null) {
    return usdcPool.token1Price
  } else {
    return ZERO_BD
  }
} 


/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived Matic (add stablecoin estimates)
 **/
export function findEthPerToken(token: Token): BigDecimal {
  if (token.id == WMatic_ADDRESS) {
    return ONE_BD
  }
  let whiteList = token.whitelistPools
  // for now just take USD from pool with greatest TVL
  // need to update this to actually detect best rate based on liquidity distribution
  let largestLiquidityMatic = ZERO_BD
  let priceSoFar = ZERO_BD
  let bundle = Bundle.load('1')

  // hardcoded fix for incorrect rates
  // if whitelist includes token - get the safe price
  if (STABLE_COINS.includes(token.id)) {
    priceSoFar = safeDiv(ONE_BD, bundle!.maticPriceUSD)
  } else {
  for (let i = 0; i < whiteList.length; ++i) {
    let poolAddress = whiteList[i]
    let pool = Pool.load(poolAddress)!
    if (pool.liquidity.gt(ZERO_BI)) {

      if (pool.token0 == token.id) {
        // whitelist token is token1
        let token1 = Token.load(pool.token1)!
        // get the derived Matic in pool
        let maticLocked = pool.totalValueLockedToken1.times(token1.derivedMatic)
        if (maticLocked.gt(largestLiquidityMatic) && maticLocked.gt(MINIMUM_Matic_LOCKED)) {
          largestLiquidityMatic = maticLocked
          // token1 per our token * Eth per token1
          priceSoFar = pool.token1Price.times(token1.derivedMatic as BigDecimal)
        }
      }
      if (pool.token1 == token.id) {
        let token0 = Token.load(pool.token0)!
        // get the derived Matic in pool
        let maticLocked = pool.totalValueLockedToken0.times(token0.derivedMatic)
        if (maticLocked.gt(largestLiquidityMatic) && maticLocked.gt(MINIMUM_Matic_LOCKED)) {
          largestLiquidityMatic = maticLocked
          // token0 per our token * Matic per token0
          priceSoFar = pool.token0Price.times(token0.derivedMatic as BigDecimal)
        }
      }
    }
  }
}
  return priceSoFar // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedAmountUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let bundle = Bundle.load('1')!
  let price0USD = token0.derivedMatic.times(bundle.maticPriceUSD)
  let price1USD = token1.derivedMatic.times(bundle.maticPriceUSD)

  // both are whitelist tokens, return sum of both amounts
  if (WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount0.times(price0USD).plus(tokenAmount1.times(price1USD))
  }

  // take double value of the whitelisted token amount
  if (WHITELIST_TOKENS.includes(token0.id) && !WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount0.times(price0USD).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount1.times(price1USD).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked amount is 0
  return ZERO_BD
}
