import {useContext, useEffect, useRef, useState} from 'react'
import {Api, SAS,bugCat_Capoo} from "./Context.jsx";
import Product from "./Product.jsx";
import Cart from "./Cart.jsx";

export default function Home() {
    const api = useContext(Api);
    const [view, setView] = useState("home");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const inputProductTitle = useRef("");
    const capooImage = useContext(bugCat_Capoo);
    const sas = useContext(SAS);

    function findProducts() {
        fetch(api + "/search?input=" + (inputProductTitle.current !== null ? inputProductTitle.current.value : "") , {method: "GET"})
            .then(response => {
                if (response.ok) return response.json();
                else throw new Error(response.status);
            })
            .then(result => {
                setProducts(result);
            })
    }

    useEffect(() => {
        findProducts();
    }, [api,view]);

    return <>
        <header>
            <a href="#" onClick={() => setView("home")}>
                <img src={capooImage + sas} alt="bugcat image" width="150" height="150"/>
            </a>
            <a href="#"
               onClick={() => setView("cart")}>🛒 <sup>{cart.reduce((sum, item) => sum + Number(item.quantity), 0)}</sup></a>
        </header>
        <main>
            {view === "home" ?
                <div>
                    <p>
                        Bugcat Capoo is a cartoon character resembling a chubby blue cat with six legs. He was
                        created by the Taiwanese artist Yara in 2014.
                    </p>
                    <p> PRODUCTS</p>

                    <input type="text" placeholder="Search for" ref={inputProductTitle} onInput={findProducts}/>

                    <div className="productList">
                        {products.map(product => <Product key={product.id} product={product} cart={cart} setCart={setCart}/>)}
                    </div>
                </div> :
                <Cart cart={cart} setCart={setCart}/>}
        </main>

    </>
}