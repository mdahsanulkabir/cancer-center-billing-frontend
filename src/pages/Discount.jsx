import { DataGrid } from '@mui/x-data-grid';
import Header1 from "../components/Header1";
import Header2 from "../components/Header2";
import { useEffect, useState } from 'react';
import useAxiosIntercept from '../hooks/useAxiosIntercept';
import { Box, Button, TextField, useTheme } from '@mui/material';
import { colorTokens } from '../utils/theme/colorTokens';
import { Controller, useForm } from "react-hook-form";


const Discount = () => {
    const [existingDiscountCategories, setExistingDiscountCategories] = useState([])
    const axiosPrivate = useAxiosIntercept();
    const theme = useTheme();
    const colors = colorTokens(theme.palette.mode);

    useEffect(() => {
        const getExistingDiscountCategories = async () => {
            const response = await axiosPrivate.get('/discount')
            setExistingDiscountCategories(response.data);
            console.log(response.data)
        }

        getExistingDiscountCategories();
    }, [axiosPrivate])

    const columns = [
        { field: "sl", headerName: "SL" },
        {
            field: "discountName",
            headerName: "Discount Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "discountRate",
            headerName: "Rate (%)",
            flex: 1,
            cellClassName: "name-column--cell",
        }
    ]
    // const [deptList, setDeptList] = useState([]);
    let discountListArranged = []
    discountListArranged = existingDiscountCategories.map((discount, index) => {
        return {
            id: discount._id,
            sl: index + 1,
            discountName: discount.discountName,
            discountRate: discount.discountRate
        }
    })

    const { control, handleSubmit } = useForm({
        defaultValues: {
            discountName: "",
            discountRate: 0
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await axiosPrivate.post('/discount',JSON.stringify(data))
            setExistingDiscountCategories(prev => ([...prev, response.data]))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Header1 title="DISCOUNTS" subtitle="view create discounts" />
            <Header2 title="EXISTING DISCOUNT CATEGORIES" subtitle="" />
            <Box
                m="20px 0 20px 0"
                height="40vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid checkboxSelection rows={discountListArranged} columns={columns} />
            </Box>

            <div className="create-discount">
                <Header2 title="CREATE DISCOUNT CATEGORY" subtitle="" />
                <div className="create-discount-form-content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="discountName"
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    sx={{ marginBlock: 2 }}
                                    autoComplete="new-password"
                                    variant="filled"
                                    type="text"
                                    label="Discount Name"
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="discountRate"
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    sx={{ marginBlock: 2 }}
                                    autoComplete="new-password"
                                    variant="filled"
                                    type="text"
                                    label="Discount Rate"
                                    {...field}
                                />
                            )}
                        />
                        <Button
                            sx={{ width: '150px', fontWeight: 'bold', marginInline: 'auto' }}
                            type="submit"
                            variant="contained"
                        >
                            Add Discount Category
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Discount;