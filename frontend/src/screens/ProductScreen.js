import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LoadingBox, MessageBox, Rating } from '../components'
import { Store } from '../Store'
import { getError } from '../utils'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false }
    case 'FETCH_FAIL':
      console.log(action.payload)
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const ProductScreen = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { slug } = params

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  })
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const result = await axios.get(`/api/products/slug/${slug}`)
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchData()
  }, [slug])

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart } = state
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)
    if (data.countInStock < quantity) {
      toast.error('Sorry. Product out of Stock !')
      return
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: quantity },
    })
    toast.success(`${product.name} added to cart !`, {
      autoClose: 500,
      hideProgressBar: true,
    })
    navigate('/cart')
  }

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <div className="error-container">
      <MessageBox variant="danger">{error}</MessageBox>
    </div>
  ) : (
    (console.log(error, product),
    (
      <div className="product-container">
        <Row>
          <Col md={6}>
            <img className="img-large" src={product.image} alt={product.name} />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
              </ListGroup.Item>
              <ListGroup.Item>{product.name}</ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                ></Rating>
              </ListGroup.Item>
              <ListGroup.Item>
                Description:
                <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>${product.price}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Unavailable</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock !== 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Stock:</Col>
                        <Col>{product.countInStock}</Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button
                          className="mt-3"
                          onClick={addToCartHandler}
                          variant="primary"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    ))
  )
}

export default ProductScreen
