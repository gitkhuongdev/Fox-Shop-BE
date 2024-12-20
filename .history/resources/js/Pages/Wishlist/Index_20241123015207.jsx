import React, { useState } from "react";

function Index({ wishlist }) {
    const [data, setData] = useState(wishlist);
    const [product, setProduct] = useState(wishlist.items);
    console.log(data);
    return <div>fdsafasdfsd</div>;
}

export default Index;
