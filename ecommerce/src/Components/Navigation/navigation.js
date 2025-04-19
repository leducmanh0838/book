import { Button } from "@mui/material";
import { FiMenu } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { LiaBookSolid } from "react-icons/lia";
import { GrContact } from "react-icons/gr";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FaAngleRight } from "react-icons/fa6";
import { RiCoupon2Line } from "react-icons/ri";
import { useState, useEffect } from "react";
import axios from "axios";

const Navigation = () => {
    const [categoriesBook, setCategoriesBook] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [isOpenSidebarVal, setisOpenSidebarVal] = useState(false);
    // Danh sách thể loại sách và nhà xuất bản
    useEffect(() => {
        const fetchCategoriesAndPublishers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/book/getCategory');
                setCategoriesBook(response.data.category);
                setPublishers(response.data.publishers);
                setSuppliers(response.data.suppliers);
            } catch (error) {
                console.error("Error fetching categories and publishers:", error);
            }
        };

        fetchCategoriesAndPublishers();
    }, []);


    return (
        <nav>
        <div className='container'>
            <div className='row'>
                
                <div className='col-sm-3 navPart1'>
                    <div className="wrapper">
                    <Button className='allList align-items-center' 
                    onClick={() => setisOpenSidebarVal(!isOpenSidebarVal)}>
                        <span className="fimenu mr-2"><FiMenu/></span>
                        <span className='text'>KHÁM PHÁ THEO DANH MỤC</span>
                    </Button>
                    <div className={`allLists ${isOpenSidebarVal ? 'open' : ''}`}>
                        <ul>
                            <li>
                                <Link to="/"> <Button> Sách <FaAngleRight className="ml-auto"/> </Button></Link>
                                <div className="sub">
                                    {categoriesBook.map((category, index) => (
                                        <Link key={index} to={`/category/${category}`}>
                                            <Button>{category}</Button>
                                        </Link>
                                    ))}
                                </div>
                            </li>
                            <li>
                                <Link to="/"> <Button> Nhà xuất bản <FaAngleRight className="ml-auto"/> </Button></Link>
                                <div className="sub">
                                    {publishers.map((publisher, index) => (
                                        <Link key={index} to={`/publisher/${publisher}`}>
                                            <Button>{publisher}</Button>
                                        </Link>
                                    ))}
                                </div>
                            </li>
                            <li>
                                <Link to="/"> <Button> Nhà cung cấp <FaAngleRight className="ml-auto"/> </Button></Link>
                                <div className="sub">
                                    {suppliers.map((supplier, index) => (
                                            <Link key={index} to={`/supplier/${supplier}`}>
                                                <Button>{supplier}</Button>
                                            </Link>
                                    ))}
                                </div>
                            </li>
                            <li>
                                <Link to="/"> <Button>Giao hàng</Button></Link>
                            </li>
                            <li>
                                <Link to="/"> <Button>7 ngày đổi trả</Button> </Link>
                            </li>
                            <li>
                                <Link to="/"> <Button>Voucher cho bạn</Button></Link>
                            </li>
                            <li>
                                <Link to="/"> <Button>Giá siêu rẻ</Button></Link>
                            </li>
                            <li>
                                <Link to="/"> <Button>Flash sale</Button></Link>
                            </li>

                        </ul>

                    </div>
                    </div>
                    
                </div>

                <div className='col-sm-9 navPart2 d-flex align-items-center'>
                    <ul className="list list-inline ml-auto">

                        <li className="list-inline-item">
                            <Link to='/books/ENGLISH BOOKS'>    
                            <Button> <LiaBookSolid color="#2bbef9"/> English books </Button>
                            </Link>
                        </li>

                        <li className="list-inline-item">
                            <Link to='/books/VIETNAMESE BOOKS'> 
                            <Button> <LiaBookSolid color="#2bbef9"/> Vietnamese books </Button>
                            </Link>
                        </li>

                        <li className="list-inline-item">
                            <Link to="/freeship"> 
                            <Button>
                            <LiaShippingFastSolid color="#2bbef9"/> Freeship
                            </Button>
                            </Link>
                        </li>
{/* Pay */}
                        <li className="list-inline-item">
                            <Link to="/voucher"> 
                            <Button>
                            <RiCoupon2Line color="#2bbef9"/> Voucher
                            </Button>
                            </Link>
                        </li>

                        <li className="list-inline-item">
                            <Link to="/contact"> 
                            <Button>
                            <GrContact color="#2bbef9"/> Contact Us
                            </Button>
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </nav>
    )
}

export default Navigation;