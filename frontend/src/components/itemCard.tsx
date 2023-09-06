import React from 'react';

type Props = {
    title: string;
    price: string;
    score: string;
    imgLink: string;
    productLink: string;
};

const ItemCard = (props: Props) => {

    return (
        <div className="w-full max-w-sm border rounded-lg shadow bg-gray-800 border-gray-700 m-10">
            <a href={props.productLink}>
                <img className="p-8 rounded-t-lg" src={props.imgLink} alt="product" />
            </a>
            <div className="px-5 pb-5">
                <a href={props.productLink}>
                <h5 className="text-xl font-semibold tracking-tight text-white">{props.title}</h5>
                </a>

                {/* A changer */}
                <div className="flex items-center mt-2.5 mb-5">
                <span className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-blue-200 text-blue-800 ml-3">{props.score}</span>
                </div>

                <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-white">{props.price} €</span>
                <a href={props.productLink} className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Add to cart</a>
                </div>
                {/* A changer */}
            </div>
        </div>
    );
};

export default ItemCard;
