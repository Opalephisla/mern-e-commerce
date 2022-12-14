import axios from 'axios'
import React, { useContext } from 'react'
import {
  Button,
  Card,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MessageBox } from '../components'
import { Store } from '../Store'

const CartScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state
  const navigate = useNavigate()

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      toast.error('Sorry. Product out of Stock !')
      return
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
  }

  const removeItemHandler = async (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  const checkOutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  return (
    <div className="cart-container">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <Link to={`/product/${item.slug}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                      </Link>
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        disabled={item.quantity === 1}
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        disabled={item.quantity === item.countInStock}
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col className="product-price" md={3}>
                      ${item.price}
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                {cartItems.length !== 0 ? (
                  <ListGroup.Item>
                    <h3 className="cart-total">
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                      items) : $
                      {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                    </h3>
                  </ListGroup.Item>
                ) : (
                  <ListGroupItem>
                    <h3 className="cart-total">Your cart is empty.</h3>
                  </ListGroupItem>
                )}
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      className="m-3 mt-4"
                      type="button"
                      variant={cartItems.length === 0 ? 'secondary' : 'primary'}
                      disabled={cartItems.length === 0}
                      onClick={checkOutHandler}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CartScreen
