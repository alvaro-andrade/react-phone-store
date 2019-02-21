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
    let tempCart = [...this.state.cart];

    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count += 1;
    product.total = product.count * product.price;

    this.setState({
      cart: [...tempCart]
    },
      () => this.addTotal()
    );
  }

  decrement = id => {
    let tempCart = [...this.state.cart];
    const selectedProduc = tempCart.find(item => item.id === id);

    const index = tempCart.indexOf(selectedProduc);
    const product = tempCart[index];

    product.count -= 1;
    
    if (product.count === 0) {
      this.removeProduct(product.id);
    } else {
      product.total = product.count * product.price;
      this.setState({
        cart: [...tempCart]
      },
        () => this.addTotal()
      );
    }
  }

  removeProduct = id => {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];

    tempCart = tempCart.filter(item => item.id !== id);

    const index = tempProducts.indexOf(this.getProductById(id));

    let removeProduct = tempProducts[index];

    removeProduct.inCart = false;
    removeProduct.count = 0;
    removeProduct.total = 0;

    this.setState({
      cart: [...tempCart],
      products: [...tempProducts]
    },
      () => {
        this.addTotal();
      }
    )
  }

  clearCart = () => {
    this.setState(
      {
        cart: []
      },
      () => {
        this.setProducts();
        this.addTotal();
      }
    );
  }

  addTotal = () => {
    let cartSubTotal = 0;
    
    this.state.cart.map(item => cartSubTotal += item.total);
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
