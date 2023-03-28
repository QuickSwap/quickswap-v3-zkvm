import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  FarmingAddress,
  FeeConfiguration,
  Owner,
  Pool,
  VaultAddress
} from "../generated/Factory/Factory"

export function createFarmingAddressEvent(
  newFarmingAddress: Address
): FarmingAddress {
  let farmingAddressEvent = changetype<FarmingAddress>(newMockEvent())

  farmingAddressEvent.parameters = new Array()

  farmingAddressEvent.parameters.push(
    new ethereum.EventParam(
      "newFarmingAddress",
      ethereum.Value.fromAddress(newFarmingAddress)
    )
  )

  return farmingAddressEvent
}

export function createFeeConfigurationEvent(
  alpha1: i32,
  alpha2: i32,
  beta1: BigInt,
  beta2: BigInt,
  gamma1: i32,
  gamma2: i32,
  volumeBeta: BigInt,
  volumeGamma: i32,
  baseFee: i32
): FeeConfiguration {
  let feeConfigurationEvent = changetype<FeeConfiguration>(newMockEvent())

  feeConfigurationEvent.parameters = new Array()

  feeConfigurationEvent.parameters.push(
    new ethereum.EventParam(
      "alpha1",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(alpha1))
    )
  )
  feeConfigurationEvent.parameters.push(
    new ethereum.EventParam(
      "alpha2",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(alpha2))
    )
  )
  feeConfigurationEvent.parameters.push(
    new ethereum.EventParam("beta1", ethereum.Value.fromUnsignedBigInt(beta1))
  )
  feeConfigurationEvent.parameters.push(
    new ethereum.EventParam("beta2", ethereum.Value.fromUnsignedBigInt(beta2))
  )
  feeConfigurationEvent.parameters.push(
    new ethereum.EventParam(
      "gamma1",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gamma1))
    )
  )
  feeConfigurationEvent.parameters.push(
    new ethereum.EventParam(
      "gamma2",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(gamma2))
    )
  )
  feeConfigurationEvent.parameters.push(
    new ethereum.EventParam(
      "volumeBeta",
      ethereum.Value.fromUnsignedBigInt(volumeBeta)
    )
  )
  feeConfigurationEvent.parameters.push(
    new ethereum.EventParam(
      "volumeGamma",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(volumeGamma))
    )
  )
  feeConfigurationEvent.parameters.push(
    new ethereum.EventParam(
      "baseFee",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(baseFee))
    )
  )

  return feeConfigurationEvent
}

export function createOwnerEvent(newOwner: Address): Owner {
  let ownerEvent = changetype<Owner>(newMockEvent())

  ownerEvent.parameters = new Array()

  ownerEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownerEvent
}

export function createPoolEvent(
  token0: Address,
  token1: Address,
  pool: Address
): Pool {
  let poolEvent = changetype<Pool>(newMockEvent())

  poolEvent.parameters = new Array()

  poolEvent.parameters.push(
    new ethereum.EventParam("token0", ethereum.Value.fromAddress(token0))
  )
  poolEvent.parameters.push(
    new ethereum.EventParam("token1", ethereum.Value.fromAddress(token1))
  )
  poolEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )

  return poolEvent
}

export function createVaultAddressEvent(
  newVaultAddress: Address
): VaultAddress {
  let vaultAddressEvent = changetype<VaultAddress>(newMockEvent())

  vaultAddressEvent.parameters = new Array()

  vaultAddressEvent.parameters.push(
    new ethereum.EventParam(
      "newVaultAddress",
      ethereum.Value.fromAddress(newVaultAddress)
    )
  )

  return vaultAddressEvent
}
