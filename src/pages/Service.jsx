/* eslint-disable react/prop-types */
import { Autocomplete, Box, Button, TextField, useTheme } from "@mui/material";
import { colorTokens } from "../utils/theme/colorTokens";
import { useEffect, useState } from "react";
import useAxiosIntercept from "../hooks/useAxiosIntercept";
import Header1 from "../components/Header1";
import Header2 from "../components/Header2";
import { DataGrid } from "@mui/x-data-grid";
import { Controller, useForm } from "react-hook-form";


const Service = () => {
    const theme = useTheme();
    const colors = colorTokens(theme.palette.mode);
    const [existingServices, setExistingServices] = useState([])
    const [existingDepartments, setExistingDepartments] = useState([])
    const axiosPrivate = useAxiosIntercept();

    useEffect(() => {
        const getExistingServices = async () => {
            const response = await axiosPrivate.get('/service')
            setExistingServices(response.data);
        }
        getExistingServices();
    }, [axiosPrivate])
    useEffect(() => {
        const getExistingDepartments = async () => {
            const response = await axiosPrivate.get('/department')
            setExistingDepartments(response.data);
        }

        getExistingDepartments();
    }, [axiosPrivate])

    const departments = existingDepartments.map(dept => ({
        label: dept.departmentName,
        id: dept._id
    }))

    const servicesList = existingServices.map((service, index) => {
        return {
            id: service._id,
            sl: index + 1,
            serviceName: service.serviceName,
            departmentName: service.departmentId.departmentName,
            servicePrice: service.servicePrice
        }
    })

    const columns = [
        { field: "sl", headerName: "SL" },
        {
            field: "serviceName",
            headerName: "Service Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "departmentName",
            headerName: "Department Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "servicePrice",
            headerName: "Price (Tk.)",
            flex: 1,
            cellClassName: "name-column--cell",
        }
    ]

    const { control, handleSubmit } = useForm({
        defaultValues: {
            serviceName: "",
            departmentName: "",
            servicePrice: 0
        }
    });

    const onSubmit = async (data) => {
        console.log(data)
        const newService = {
            serviceName: data.serviceName,
            departmentId: departments.find(dept => dept.label === data.departmentName).id,
            servicePrice: data.servicePrice
        }
        try {
            const response = await axiosPrivate.post('/service', JSON.stringify(newService))
            setExistingServices(prev => ([...prev, response.data]))
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <Header1 title="SERVICES" subtitle="view create services" />
            <Header2 title="EXISTING SERVICES" subtitle="" />

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
                {/* <DataGrid checkboxSelection rows={servicesList} columns={columns} /> */}
                <DataGrid rows={servicesList} columns={columns} />
            </Box>

            <div className="create-service">
                <Header2 title="CREATE SERVICE" subtitle="" />
                <div className="create-service-form-content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="serviceName"
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    sx={{ marginBlock: 2 }}
                                    autoComplete="new-password"
                                    variant="filled"
                                    type="text"
                                    label="Service Name"
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="departmentName"
                            render={({ field: {onChange, value} }) => (
                                <Autocomplete
                                    disablePortal
                                    options={departments}
                                    getOptionLabel={(option) => option.label}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderOption={(props, option) => {
                                        const { key, ...otherProps } = props;
                                        return (
                                            <Box component="li" key={key} {...otherProps}>
                                                {option.label}
                                            </Box>
                                        )
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Department Name"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                    value={departments.find(dept => dept.label === value) || null}
                                    onChange={(event, newValue) => {
                                        onChange(newValue ? newValue.label : "")
                                    }}
                                />
                            )}
                        />


                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="servicePrice"
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    sx={{ marginBlock: 2 }}
                                    autoComplete="new-password"
                                    variant="filled"
                                    type="text"
                                    label="Service Price"
                                    {...field}
                                />
                            )}
                        />
                        <Button
                            sx={{ width: '150px', fontWeight: 'bold', marginInline: 'auto' }}
                            type="submit"
                            variant="contained"
                        >
                            Add Service
                        </Button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default Service;