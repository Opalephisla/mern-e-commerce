import React from 'react'
import { CheckoutSteps } from '../components'

export default function PlaceOrderScreen() {
  return (
    <div className="place-order-container">
      <div>
        <CheckoutSteps step1 step2 step3 step4 />
      </div>
    </div>
  )
}
