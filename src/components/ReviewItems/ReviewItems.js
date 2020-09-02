import React from 'react';

const ReviewItems = (props) => {
    const {name,quantity,key,price} = props.product;
    const itemsStyle = { borderBottom:'1px solid black',
    marginBottom: '5px',
    paddingBottom: '5px',
    marginLeft: '200px'
}  
                            
    return (
        <div style={itemsStyle}>
            <h4 className="product-name">{name}</h4>
             <p>Quantity: {quantity}</p>
             <p><small>$ {price}</small></p>
             <br/>
             <button className="main-button"
             onClick = {() => props.removeProduct(key)}
             >Remove</button>
             <br/>
        </div>
    );
};

export default ReviewItems;