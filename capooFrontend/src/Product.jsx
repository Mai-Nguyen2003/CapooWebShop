import {useContext, useState} from "react";
import ProductDetail from "./ProductDetail.jsx";
import {SAS} from "./Context.jsx";

export default function Product({product, setCart}) {
    const [showDetail, setShowDetail] = useState(false);
    const sas = useContext(SAS)
    return <>
        <div className="product" key={product.id}>
            <img src={product.image + sas} height="200px" width="200px"/>
            <div>
                <a href="#" className="heading" onClick={() => setShowDetail(true)}>{product.title}</a>
                {showDetail && <ProductDetail className="modal" product={product}  setCart={setCart}
                                              closeDetail={() => setShowDetail(false)}/>}
            </div>
            <p>€ {product.price}</p>
        </div>
    </>
}