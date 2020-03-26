import React from 'react';

const Form = (props) => (
    <form onSubmit={props.onFormSubmit}>
        <input placeholder="enter your city" name="city"></input>
        <button>submit</button>
    </form>
)

export default Form;