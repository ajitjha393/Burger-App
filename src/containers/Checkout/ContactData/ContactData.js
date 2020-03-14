import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";

import Input from "../../../components/UI/Input/Input";

import classes from "./ContactData.module.css";

class ContactData extends Component {
  state = {
    name: "",
    email: "",
    address: {
      street: "",
      postalCode: ""
    },
    loading: false
  };

  orderHandler = event => {
    event.preventDefault();

    this.setState({
      loading: true
    });
    const orders = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: "Bisu Jha",
        address: {
          street: "Teststreet 1",
          zipCode: "413515",
          country: "India"
        },
        email: "test@test.com"
      },
      deliveryMethod: "fastest"
    };
    axios
      .post("/orders.json", orders)
      .then(response => {
        // console.log(response);
        this.setState({
          loading: false
        });

        this.props.history.push("/");
      })
      .catch(error => {
        // console.log(error);
        this.setState({
          loading: false
        });
      });
  };

  render() {
    let form = (
      <form>
        <Input
          inputType="input"
          type="text"
          name="name"
          placeholder="Your Name"
        />

        <Input
          inputType="input"
          type="email"
          name="email"
          placeholder="Your Email"
        />

        <Input
          inputType="input"
          type="text"
          name="street"
          placeholder="Street"
        />

        <Input
          inputType="input"
          type="text"
          name="postal"
          placeholder="Postal Code"
        />
        <Button btnType="Success" clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4> Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
