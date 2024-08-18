import { useEffect, useState } from "react";
import useAxiosIntercept from "../hooks/useAxiosIntercept";

const ShowInvoice = () => {
    const [ existingInvoices, setExistingInvoices ] = useState([]);
    const axiosPrivate = useAxiosIntercept();

    // load all the users
    useEffect(() => {
        const getExistingInvoices = async () => {
            const response = await axiosPrivate.get('/invoice')
            setExistingInvoices(response.data);
            console.log("invoices", response.data)
        }

        getExistingInvoices();
    }, [axiosPrivate])
    return (
        <div>
            <p>Hello show invoice</p>
        </div>
    )
}

export default ShowInvoice;