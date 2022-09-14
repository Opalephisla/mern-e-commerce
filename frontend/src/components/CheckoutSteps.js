import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>Sign-In</Col>
      <Col className={props.step2 ? 'active' : ''}>
        {props.step2 ? (
          <Link className="checkout-link" to="/shipping">
            Shipping
          </Link>
        ) : (
          'Shipping'
        )}
      </Col>
      <Col className={props.step3 ? 'active' : ''}>
        {props.step3 ? (
          <Link className="checkout-link" to="/payment">
            Payment
          </Link>
        ) : (
          'Payment'
        )}
      </Col>
      <Col className={props.step4 ? 'active' : ''}>Place Order</Col>
    </Row>
  )
}
