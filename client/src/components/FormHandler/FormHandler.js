import React from "react";
import Form from "../Form/Form";
import axios from "axios";

const FormHandler = () => {
  const handleSubmit = (product) => {
    axios
      .post("http://localhost:3001/AddProduct", { ...product })
      .then((response) => {
        console.log(response.data);
        alert(response.data.msg);
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return <Form submit={handleSubmit}></Form>;
};

export default FormHandler;
