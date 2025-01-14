'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import ProductCard from '../../_components/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import SortProducts from '@/app/_components/SortProducts'
import { toast } from 'sonner'

function Explore() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [offset, setOffset] = useState(0)
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState(null)
    const [windowWidth, setWindowWidth] = useState(0);
    const [noProducts, setNoProducts] = useState(false);
    const [limit, setLimit] = useState(10);

    const fetchProducts = async (_offset, lassi = 1) => {
        if (lassi) {
            setProducts([]);
        }

        setLoading(true);
        try {
            const res = await axios.post('/api/all-products', { limit: limit, offset: _offset, sort: sort });
            if(res.data.length == 0){
                toast.error("No More Products");
                setNoProducts(true);
            }
            if(res.data.length > 0){
                setNoProducts(false);
            }
            setProducts(prevProducts => [...prevProducts, ...res.data]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsBySearch = async (search) => {
        if (search.length > 0) {
            setLoading(true);
            const res = await axios.post('/api/all-products', { search: search, sort: sort });
            setProducts(res.data);
            setLoading(false);
        } else {
            setProducts([]);
            setLoading(true);
            fetchProducts(0);
        }
    };

    useEffect(() => {
        fetchProducts(0);
    }, []);

    useEffect(() => {
        if (sort && !loading) {
            setProducts([]);
            if (search.length > 0) {
                fetchProductsBySearch(search);
            } else {
                fetchProducts(0);
            }
        }
    }, [sort]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            <div className='text-3xl font-bold mt-10'>Explore</div>

            <div className='mt-5 mb-5 flex items-center justify-between'>
                <div className='flex items-center gap-2 flex-1 max-w-[30vw] min-w-[250px] max-[500px]:min-w-[200px] max-[800px]:min-w-[400px]'>
                    {windowWidth > 800 && <h2>Search</h2>}
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search for products' />
                    <Button className='bg-primary hover:bg-primary/80' onClick={() => fetchProductsBySearch(search)}>
                        <Search />{windowWidth > 600 ? "Search" : ""}
                    </Button>
                </div>
                <SortProducts onSort={(value) => setSort(value)} />
            </div>

            <div className='flex justify-center items-center'>
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-10 mt-5">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="animate-pulse bg-gray-300 h-64 w-full rounded-md"></div>
                        ))}
                    </div>
                )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5'>
                {!loading && products?.length > 0 && products.map((product, i) => (
                    <div key={product.id}>
                        <ProductCard product={product} index={i} />
                    </div>
                ))}
            </div>
            {!loading && !noProducts && products?.length > 0 && <div className='flex justify-center items-center mt-10'>
                <Button className='bg-primary hover:bg-primary/80' onClick={() => {fetchProducts(offset + limit, 0);setOffset(offset+limit)}}>Load More</Button>
            </div>}
        </div>
    )
}

export default Explore