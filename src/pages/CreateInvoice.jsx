/* eslint-disable react/prop-types */
import { useLocation, Navigate } from "react-router-dom";
import Header1 from "../components/Header1";
import Header2 from "../components/Header2";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import useAxiosIntercept from "../hooks/useAxiosIntercept";
import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import { useEffect, useState } from "react";


const CreateInvoice = () => {
    const location = useLocation();
    const patient = location.state;

    const [selectedDiscount, setSelectedDiscount] = useState('');
    const [discounts, setDiscounts] = useState([])
    const [existingServices, setExistingServices] = useState([])

    const axiosPrivate = useAxiosIntercept();


    const { control, handleSubmit, setValue, getValues } = useForm({
        defaultValues: [{
            serviceName: "",
            serviceQuantity: 0,
            selectedDiscount: "",
            servicePrice:0
        }]
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'services'
    })

    useEffect(() => {
        const getExistingDiscountCategories = async () => {
            const response = await axiosPrivate.get('/discount')
            setDiscounts(response.data);
            console.log('/discount', response.data)
        }

        getExistingDiscountCategories();
        const getExistingServices = async () => {
            const response = await axiosPrivate.get('/service')
            setExistingServices(response.data);
            console.log('/service', response.data)
        }

        getExistingServices();
    }, [axiosPrivate])

    if (!patient) {
        return <Navigate to="/patient" replace={true} />
    }

    const serviceList = existingServices?.map(service => ({
        ...service,
        label: service.serviceName,
        id: service._id,
        key: service._id,
        price: service.servicePrice
    }))

    const onSubmit = async (data) => {
        console.log(data)
        // const newService = {
        //     serviceName: data.serviceName,
        //     departmentId: departments.find(dept => dept.label === data.departmentName).id,
        //     servicePrice: data.servicePrice
        // }
        // try {
        //     const response = await axiosPrivate.post('/service', JSON.stringify(newService))
        //     setExistingServices(prev => ([...prev, response.data]))
        // } catch (error) {
        //     console.log(error)
        // }
    }
    return (
        <div className="create-invoice">
            <Header1 title="CREATE INVOICE" subtitle="view create invoice" />
            <Header2 title="PATIENT" subtitle="" />
            <Grid container spacing={2}>
                <Grid container item spacing={1} xs={6}>
                    <Grid item xs={6}>
                        <div><p>Patient Serial:<span> {patient.patientSerial}</span></p></div>
                    </Grid>
                    <Grid item xs={6}>
                        <div><p>Patient Name:<span> {patient.patientName}</span></p></div>
                    </Grid>
                    <Grid item xs={6}>
                        <div><p>Patient Phone Number:<span> {patient.patientPhoneNumber}</span></p></div>
                    </Grid>
                    <Grid item xs={6}>
                        <div><p>Rank:<span> {patient.rank}</span></p></div>
                    </Grid>
                    <Grid item xs={6}>
                        <div><p>RT Number:<span> {patient.rtNumber}</span></p></div>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained">Update Patient Information</Button>
                    </Grid>
                </Grid>
                <Grid container item spacing={1} xs={6}>
                    <Grid item xs={6}>
                        <div><p>Guardian:<span></span></p></div>
                    </Grid>
                    <Grid item xs={6}>
                        <div><p>Guardian Unit:<span></span></p></div>
                    </Grid>
                    <Grid item xs={6}>
                        <div><p>Guardian Mobile Number:<span></span></p></div>
                    </Grid>
                    <Grid item xs={6}>
                        <div><p>Doctor name:<span></span></p></div>
                    </Grid>
                </Grid>
            </Grid>
            <FormControl >
                <FormLabel sx={{ '@media print': { display: 'none', height: 0 } }}>Discount</FormLabel>
                <RadioGroup row
                    name="controlled-radio-buttons-group"
                    value={selectedDiscount}
                    onChange={e => setSelectedDiscount(e.target.value)}
                    sx={{ '@media print': { display: 'none', height: 0 } }}>
                    {
                        discounts.map(discount => (
                            <FormControlLabel
                                key={discount._id}
                                value={discount._id}
                                control={<Radio />}
                                label={discount.discountName}
                            />
                        ))
                    }
                </RadioGroup>
            </FormControl>


            <br />

            <div className="create-invoice">
                <Header2 title="SERVICES" subtitle="" />
                <div className="create-invoice-form-content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ul>
                            {
                                fields.map((item, index) => (
                                    <li key={item.id} style={{ marginBlock: '5px', display: 'flex' }}>
                                        <Controller
                                            control={control}
                                            rules={{ required: true }}
                                            name={`services.${index}.serviceName`}
                                            render={({ field: { onChange, value } }) => (
                                                <Autocomplete
                                                    disablePortal
                                                    options={serviceList}
                                                    getOptionLabel={(option) => option.label}
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    renderOption={(props, option) => {
                                                        const { key, ...otherProps } = props;
                                                        console.log({ props })
                                                        return (
                                                            <Box component="li" key={key} {...otherProps}>
                                                                {option.label}
                                                            </Box>
                                                        )
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            sx={{ marginBlock: 1, width: '300px' }}
                                                            {...params}
                                                            label={index > 0 ? "" : "Service Name"}
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                            }}
                                                        />
                                                    )}
                                                    value={serviceList.find(service => service.label === value) || null}
                                                    onChange={(event, newValue) => {
                                                        onChange(newValue ? newValue.label : "");
                                                        // Update the service price when the service is selected
                                                        const selectedService = serviceList.find(service => service.label === newValue?.label);
                                                        if (selectedService) {
                                                            setValue(`services.${index}.servicePrice`, selectedService.price);
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            rules={{ required: true }}
                                            name={`services.${index}.serviceQuantity`}
                                            render={({ field }) => (
                                                <TextField
                                                    sx={{ marginBlock: 1 }}
                                                    autoComplete="new-password"
                                                    variant="outlined"
                                                    type="number"
                                                    label={index > 0 ? "" : "Service Quantity"}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name={`services.${index}.servicePrice`}
                                            render={({ field }) => (
                                                <TextField
                                                    disabled
                                                    sx={{ marginBlock: 1, width: '100px' }}
                                                    autoComplete="new-password"
                                                    variant="outlined"
                                                    type="number"
                                                    label={index > 0 ? "" : "Service Price"}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        <Button
                                            type='button'
                                            variant="contained"
                                            onClick={() => remove(index)}
                                            sx={{ width: '150px', fontWeight: 'bold', marginInline: 'auto' }}
                                        >
                                            Delete
                                        </Button>
                                    </li>
                                ))
                            }
                        </ul>
                        <Button
                            sx={{ width: '150px', fontWeight: 'bold', marginInline: 'auto' }}
                            variant="contained"
                            type="button"
                            onClick={() => append({ serviceName: "", serviceQuantity: 0 })}
                        >
                            Append
                        </Button>
                        <Button
                            sx={{ width: '150px', fontWeight: 'bold', marginInline: 'auto' }}
                            type="submit"
                            variant="contained"
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateInvoice;