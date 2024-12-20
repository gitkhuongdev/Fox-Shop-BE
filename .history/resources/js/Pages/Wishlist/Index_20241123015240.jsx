import React, { useState } from "react";

function Index({ wishlist }) {
    const [data, setData] = useState(wishlist);
    const [product, setProduct] = useState(wishlist[0].items);
    console.log(product);
    return <div>fdsafasdfsd</div>;
}

export default Index;
