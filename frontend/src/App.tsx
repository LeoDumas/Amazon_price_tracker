import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Custom components
import ItemCard from './components/itemCard';

type ResultItem = string; // Define the type of individual items in resultList

function App() {
  const rootUrl = "http://localhost:5000";
  const [message, setMessage] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]); // Use 'any' as a placeholder type
  const [showProducts, setShowProducts] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  const [inputValue, setInputValue] = useState('');
  const [resultList, setResultList] = useState<ResultItem[]>([]); // Provide the initial type


    useEffect(() => {
        getProducts();
    }, []);


    const getProducts = () => {
        axios.get(`${rootUrl}/getproducts`)
        .then(response => {
            setProducts(response.data.products);
            setLoading(false); // Set loading to false when data is received
        })
        .catch(error => console.error(error))
    }

    const toggleShowProducts = () => {
        if(showProducts === 1){
            setShowProducts(0);
        }else{
            setShowProducts(1);
        }
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        console.log("Form submitted")
    
        // Envoyer la valeur à Flask
        const response = await fetch(`${rootUrl}/addproduct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: inputValue }),
        });
    
        if (response.ok) {
            const data = await response.json();
            setResultList([...resultList, data.message]); // Update resultList with the new message.
        }
      };

    return (
        <div className="bg-slate-950">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h1 className=' text-white text-3xl text-center mb-5'>Amazon price tracker</h1>
                <form onSubmit={handleSubmit}>   
                    <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <input name='linkInput' type="text" onChange={(e) => setInputValue(e.target.value)} className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " placeholder="Product link" required />
                        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Add</button>
                    </div>
                </form>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        products.map(product => (
                            <ItemCard
                                key={product.product_id}
                                title={product.title}
                                price={product.price}
                                score={product.score}
                                imgLink={product.image}
                                productLink={product.link}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>

        // <div className=" w-screen h-screen bg-slate-950 text-white">
        //     <div className=' flex flex-col justify-center items-center h-screen '>
        //         <h1>Amazon price tracker</h1>
        //         <form onSubmit={handleSubmit}>   
        //             <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        //             <div className="relative">
        //                 <input name='linkInput' type="text" onChange={(e) => setInputValue(e.target.value)} className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " placeholder="Product link" required />
        //                 <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Add</button>
        //             </div>
        //         </form>

        //         {/* Avoid mapping an empty array while fetching data from flask */}
        //         <div className=' flex'>
        //             {loading ? (
        //                 <p>Loading...</p>
        //             ) : (
        //                 products.map(product => (
        //                     <ItemCard
        //                         key={product.product_id}
        //                         title={product.title}
        //                         price={product.price}
        //                         score={product.score}
        //                         imgLink={product.image}
        //                         productLink={product.link}
        //                     />
        //                 ))
        //             )}
        //         </div>
        //     </div>
            

        // </div>
    );
}

export default App;