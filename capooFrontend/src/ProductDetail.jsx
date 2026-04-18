import {useContext, useRef} from "react";
import {SAS} from "./Context.jsx";
export default function ProductDetail({product, closeDetail, setCart}) {
    const quantity = useRef(undefined);
    const sas = useContext(SAS)
    function addOrderedItem() {
        const orderedItem = {
            id: product.id,
            title: product.title,
            price:product.price,
            image:product.image,
            quantity: Number(quantity.current.value)
        };

        setCart(cart => {
            const existingItem = cart.find(
                item => item.id === orderedItem.id
            );

            if (!existingItem) {
                return [...cart, orderedItem];
            }

            return cart.map(item => {
                if (item.id === orderedItem.id) {
                    return {
                        ...item,
                        quantity: item.quantity + orderedItem.quantity
                    };
                }
                return item;
            });
        });
    }

    return <>
        <div className="overlay"></div>
        <div className="modal-content">
            <div className="productDetail">
                <div className="detailBlock">
                    <img src={product.image + sas} height="200px" width="200px"/>
                    <p className="productDescription">{product.description}</p>
                </div>
                <div className="detailBlock">
                    <p>{product.title}</p>
                    <p>€ {product.price}</p>
                    <input type="number" id="quantity" name="quantity" ref={quantity}
                           min="1" placeholder="1" defaultValue="1" required/>
                    <button onClick={() => {addOrderedItem()}}>ADD TO CART</button>
                </div>
            </div>
            <button className="close-modal delete" onClick={closeDetail}>❌</button>
        </div>
    </>
}