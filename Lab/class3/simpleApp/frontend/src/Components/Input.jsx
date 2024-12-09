import React from "react";

function Input(props){
    const handlerChangeEditor = (evt) => {
        props.handlerChange(evt.target.value)
    }
    return(
        <>
            <div class="form-floating" style={{width: "50%", margin: "0 auto"}}>
                <input style={{ margin: "10px"}} onChange={handlerChangeEditor} type={props.type} class="form-control" id={props.id} placeholder={props.text}></input>
                <label  for="floatingPassword">{props.text}</label>
            </div>
        </>
        );
}
export default Input;