import React, { Component } from 'react'

import { storeProducts, detailProduct } from './data';

const ProductContext = React.createContext();
// Provider
// Consumir

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  }

  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let products = [];
    storeProducts.forEach(product => {
      const singleProduct = { ...product };
      products = [...products, singleProduct];
    });
    this.setState(() => {
      return { products }
    })
  }

  getProductById = id => {
    return this.state.products.find(product => product.id === id);
  }

  handleDetail = id => {
    this.setState({ detailProduct: this.getProductById(id) });
  }

  addToCart = id => {
    // let newState = Object.assign({}, this.state);
    // newState.products[this.getProductPosition(id)].inCart = true;
    // this.setState(newState);
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getProductById(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState(
      {
        products: tempProducts,
        cart: [...this.state.cart, product]
      },
      () => this.addTotal()
    );
  }

  openModal = id => {
    const product = this.getProductById(id);
    this.setState(() => {
      return {
        modalProduct: product,
        modalOpen: true
      }
    })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  increment = id => {
    let newState = Object.assign({}, this.state);
    newState.cart[this.state.cart.findIndex(product => product.id === id)].count += 1;
    this.setState(newState);
  }

  decrement = id => {
    let newState = Object.assign({}, this.state);
    let { count } = this.state.cart.find(product => product.id === id);

    count - 1 < 0 ? count = 0 : count -= 1;

    newState.cart[this.state.cart.findIndex(product => product.id === id)].count = count;
    this.setState(newState);
  }

  removeProduct = id => {
    this.setState(state => {
      const cart = state.cart.filter(item => item.id !== id);
      return {
        cart
      }
    })
  }

  clearCart = () => {
    this.setState(
      { 
        cart: [],
        cartSubTotal: 0,
        cartTax: 0,
        cartTotal: 0
      }
    );
  }

  addTotal = () => {
    let cartSubTotal = 0;
    
    this.state.cart.map(item => cartSubTotal += item.price);
    const tempTax = cartSubTotal * 0.23;
    const cartTax = parseFloat(tempTax.toFixed(2));
    const cartTotal = cartSubTotal + cartTax;

    this.setState({
      cartSubTotal,
      cartTax,
      cartTotal
    })
  };

  render() {
    return (
      <ProductContext.Provider value={{
        ...this.state,
        handleDetail: this.handleDetail,
        addToCart: this.addToCart,
        openModal: this.openModal,
        closeModal: this.closeModal,
        increment: this.increment,
        decrement: this.decrement,
        removeProduct: this.removeProduct,
        clearCart: this.clearCart
       }}>
        { this.props.children }
      </ProductContext.Provider>
    )
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
