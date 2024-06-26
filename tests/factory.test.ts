import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { FarmingAddress } from "../generated/schema"
import { FarmingAddress as FarmingAddressEvent } from "../generated/Factory/Factory"
import { handleFarmingAddress } from "../src/factory"
import { createFarmingAddressEvent } from "./factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newFarmingAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newFarmingAddressEvent = createFarmingAddressEvent(newFarmingAddress)
    handleFarmingAddress(newFarmingAddressEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("FarmingAddress created and stored", () => {
    assert.entityCount("FarmingAddress", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FarmingAddress",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newFarmingAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
