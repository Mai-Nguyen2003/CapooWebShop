import {Api, SAS,happyBuy} from "./Context.jsx";
import {useContext, useRef, useState} from "react";

export default function Cart({cart, setCart}) {
    const api = useContext(Api);
    const sas = useContext(SAS);
    const happBuy = useContext(happyBuy);
    const [order, setOrder] = useState({
        userName: null,
        email: null,
        items: []
    })
    const email = useRef("");
    const userName = useRef("");

    function removeOrderedItem(productId) {
        let newCart = cart.filter(i => i.id !== productId);
        setCart(newCart);
    }

    function calculateTotalPrice() {
        return cart.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0).toFixed(2);
    }

    function updateCart(productId, newQuantity) {
        const newCart = cart.map(item => {
            if (item.id === productId) {
                return {...item, quantity: newQuantity};
            }
            return item;
        });

        setCart(newCart);
    }

    function BuyOrder() {
        const buyOrder = {
            userName: userName.current.value,
            email: email.current.value,
            items: [...cart]
        }
        fetch(api + "/buy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(buyOrder)
        })
            .then(response => {
                    if (response.ok) return response.json();
                    else throw new Error(response.statusText);
                }
            )
            .then(result => {
                setOrder(result);
                setCart([]);
            });
    }

    return <>
        <main>
            <b className="heading"> CART</b>
            <div>
                <ul>
                    {cart.map(item =>
                        <li key={item.id}>
                            <img src={item.image + sas} height="100" width="100"/>
                            <span> {item.title} €{item.price} </span>
                            <input type="number" id="quantity" name="quantity" value={item.quantity} required
                                   onChange={e => updateCart(item.id, e.target.value)}/>
                            <button onClick={() => removeOrderedItem(item.id)}>Remove</button>
                        </li>)}
                </ul>
            </div>

            <div>
                <p>Total Price: {calculateTotalPrice()}</p>
                <input type="text" id="userName" name="userName"
                       placeholder="Your name" required ref={userName}/>
                <input type="text" id="email" name="email"
                       placeholder="Your email" required ref={email}/>
                <button disabled={cart.length === 0 } onClick={BuyOrder}>BUY</button>
            </div>
        </main>

        {order.email && (
            <dialog open>
                <article>
                    <h2>Thank you for ordering at Capoo Shop ❤️</h2>
                    <form method="dialog">
                        <img src={happBuy + sas} height="150" width="150"/>
                        <p>{order.userName}, your present will arive soon. Please check your email ({order.email}) for order confirmation.</p>
                        <button onClick={() => setOrder({
                            userName: null,
                            email: null,
                            items: []
                        })}>OK</button>
                    </form>
                </article>
            </dialog>

        )}
    </>
}