/* eslint-disable react/prop-types */
import { useLocation, Navigate } from "react-router-dom";
import Header1 from "../components/Header1";
import Header2 from "../components/Header2";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import useAxiosIntercept from "../hooks/useAxiosIntercept";
import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

let render = 0

const CreateInvoice2 = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const patient = location.state;

    const [discounts, setDiscounts] = useState([])
    const [existingServices, setExistingServices] = useState([])

    const axiosPrivate = useAxiosIntercept();
    console.log('auth', auth)
    console.log('patient', patient)

    render++;

    const { control, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm({
        defaultValues: {
            selectedDiscount: 0,
            patientInfo: {
                patientId: patient?._id || "",
                patientName: patient?.patientName || "",
                patientSerial: patient?.patientSerial || "",
                patientPhoneNumber: patient?.patientPhoneNumber || 0,
                rtNumber: patient?.rtNumber || "",
                rank: patient?.rank || "",
            },
            patientRef: {
                guardianName: "",
                guardianUnit: "",
                guardianPhoneNumber: "",
                doctorName: "",
            },
            services: [{
                serviceName: "",
                serviceQuantity: 0,
                servicePrice: 0,
                serviceTotal: 0,
                selectedDiscount: 0,
            }],
            preparedBy: auth.user_id
        }
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

    const serviceOptions = existingServices?.map(service => ({
        ...service,
        label: service.serviceName,
        id: service._id,
        key: service._id,
        price: service.servicePrice
    }))

    const onSubmit = async (data) => {

        const { patientInfo, patientRef, preparedBy, services } = data
        const newInvoice = {
            patientId: patientInfo.patientId,
            patientPhoneNumber: patientInfo.patientPhoneNumber,
            rtNumber: patientInfo.rtNumber,
            rank: patientInfo.rank,
            invoiceDate: new Date(),
            guardianName: patientRef.guardianName,
            guardianUnit: patientRef.guardianUnit,
            guardianPhoneNumber: patientRef.guardianPhoneNumber,
            doctorName: patientRef.doctorName,
            preparedBy: preparedBy,
            billedServices: services.map(service => ({
                serviceId: existingServices.find(existingService => existingService.serviceName === service.serviceName)?._id,
                serviceQuantity: service.serviceQuantity,
                serviceUnitPrice: service.servicePrice,
                discountRate: service.selectedDiscount,
                serviceStatus: 'Pending'
            }))
        }
        console.log("newInvoice", newInvoice)
        try {
            const response = await axiosPrivate.post('/invoice', JSON.stringify(newInvoice))
            console.log("response", response)
        } catch (error) {
            console.log(error)
        }
    }

    // useEffect(() => {
    //     const selectedDiscount = getValues('selectedDiscount')
    //     fields.forEach((item, index) => {
    //         console.log(`item[${index}]: `, item)
    //         setValue(`services.${index}.selectedDiscount`, selectedDiscount);
    //     });
    //     console.log('selected discount root', selectedDiscount)
    // }, [getValues('selectedDiscount'), fields, setValue]);

    console.log('watch', watch())

    const setTotalPrice = (index) => {
        const { servicePrice, serviceQuantity, selectedDiscount } = getValues(`services.${index}`)
        const serviceTotalPrice = (servicePrice || 0) * (serviceQuantity || 0) * ((100 - selectedDiscount) / 100 || 0)
        setValue(`services.${index}.serviceTotal`, serviceTotalPrice);
    }

    function getGrandTotal(payload) {
        let total = 0;

        for (const item of payload) {
            total = total + (Number.isNaN(item.serviceTotal) ? 0 : item.serviceTotal);
        }

        return total;
    }

    function GrandTotal({ control }) {
        const cartValues = useWatch({
            control,
            name: "services"
        });

        return <h3>Total Price : <span style={{ color: 'blue' }}>{getGrandTotal(cartValues)}</span></h3>
    }

    return (
        <div className="create-invoice">
            <p>Render = {render}</p>
            <Header1 title="CREATE INVOICE" subtitle="view create invoice" />
            <Header2 title="PATIENT" subtitle="" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    {/* <FormControl component="fieldset"> */}
                    {/* <FormLabel component="legend">Patient Information</FormLabel> */}
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
                    {/* </FormControl> */}
                    {/* <FormControl component="fieldset"> */}
                    {/* <FormLabel component="legend">Patient Reference</FormLabel> */}
                    <Grid container item spacing={1} xs={6}>

                        <Grid item xs={6}>
                            {/* <div><p>Guardian Name:<span></span></p></div>*/}
                            <Controller
                                control={control}
                                name={`patientRef.guardianName`}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        // InputLabelProps={{ shrink: true }}
                                        sx={{ marginBlock: 1 }}
                                        autoComplete="new-password"
                                        variant="outlined"
                                        label={"Guardian name"}
                                        {...field}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {/* <div><p>Guardian Unit:<span></span></p></div> */}
                            <Controller
                                control={control}
                                name={`patientRef.guardianUnit`}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        // InputLabelProps={{ shrink: true }}
                                        sx={{ marginBlock: 1 }}
                                        autoComplete="new-password"
                                        variant="outlined"
                                        label={"Guardian Unit"}
                                        {...field}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {/* <div><p>Guardian Mobile Number:<span></span></p></div> */}
                            <Controller
                                control={control}
                                name={`patientRef.guardianPhoneNumber`}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        // InputLabelProps={{ shrink: true }}
                                        sx={{ marginBlock: 1 }}
                                        autoComplete="new-password"
                                        variant="outlined"
                                        label={"Guardian Phone Number"}
                                        type='number'
                                        {...field}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {/* <div><p>Doctor name:<span></span></p></div> */}
                            <Controller
                                control={control}
                                name={`patientRef.doctorName`}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        // InputLabelProps={{ shrink: true }}
                                        sx={{ marginBlock: 1 }}
                                        autoComplete="new-password"
                                        variant="outlined"
                                        label={"Doctor name"}
                                        {...field}
                                    />
                                )}
                            />
                        </Grid>

                    </Grid>
                    {/* </FormControl> */}
                </Grid>

                <br />

                <div className="create-invoice">
                    <Header2 title="SERVICES" subtitle="" />
                    <div className="create-invoice-form-content">
                        <ul>
                            <li>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Please select discount category</FormLabel>
                                    <Controller
                                        name="selectedDiscount"
                                        control={control}
                                        render={({ field }) => (
                                            <RadioGroup
                                                sx={{ display: 'flex', flexDirection: 'row' }}
                                                {...field}
                                                onChange={(e) => {
                                                    const discountRate = parseInt(e.target.value);
                                                    setValue('selectedDiscount', discountRate);

                                                    // Update each service's discount in the field array
                                                    fields.forEach((item, index) => {
                                                        setValue(`services.${index}.selectedDiscount`, discountRate);
                                                        setTotalPrice(index);
                                                    });
                                                }}
                                            >
                                                {discounts.map((discount) => (
                                                    <FormControlLabel
                                                        key={discount._id}
                                                        value={discount.discountRate.toString()}
                                                        control={<Radio />}
                                                        label={discount.discountName}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        )}
                                    />
                                </FormControl>
                            </li>
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
                                                    options={serviceOptions}
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
                                                    value={serviceOptions.find(service => service.label === value) || null}
                                                    onChange={(event, newValue) => {
                                                        onChange(newValue ? newValue.label : "");
                                                        // Update the service price when the service is selected
                                                        const selectedService = serviceOptions.find(service => service.label === newValue?.label);
                                                        if (selectedService) {
                                                            setValue(`services.${index}.servicePrice`, selectedService.price);
                                                        }
                                                        setTotalPrice(index);
                                                    }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            rules={{ required: true, min: { value: 1, message: "minimum quantity is 1" } }}
                                            name={`services.${index}.serviceQuantity`}
                                            render={({ field }) => (
                                                <TextField
                                                    sx={{ marginBlock: 1 }}
                                                    autoComplete="new-password"
                                                    variant="outlined"
                                                    type="number"
                                                    label={index > 0 ? "" : "Service Quantity"}
                                                    {...field}
                                                    value={field.value}
                                                    onChange={e => {
                                                        field.onChange(e.target.valueAsNumber)
                                                        setTotalPrice(index);
                                                    }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name={`services.${index}.servicePrice`}
                                            render={({ field }) => (
                                                <TextField
                                                    disabled
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{ marginBlock: 1, width: '100px' }}
                                                    autoComplete="new-password"
                                                    variant="outlined"
                                                    type="number"
                                                    label={index > 0 ? "" : "Service Price"}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name={`services.${index}.selectedDiscount`}
                                            render={({ field }) => (
                                                <TextField
                                                    disabled
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{ marginBlock: 1, width: '100px' }}
                                                    autoComplete="new-password"
                                                    variant="outlined"
                                                    type="number"
                                                    label={index > 0 ? "" : "Service Discount"}
                                                    {...field}
                                                // value={selectedDiscount ? discounts?.find(discount => discount._id === selectedDiscount).discountRate : null}
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name={`services.${index}.serviceTotal`}
                                            render={({ field }) => (
                                                <TextField
                                                    disabled
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{ marginBlock: 1, width: '100px' }}
                                                    autoComplete="new-password"
                                                    variant="outlined"
                                                    type="number"
                                                    label={index > 0 ? "" : "Service Total"}
                                                    {...field}
                                                // value={
                                                //     (selectedDiscount && getValues(`services.${index}.serviceQuantity`))
                                                //         ? (100 - discounts?.find(discount => discount._id === selectedDiscount).discountRate) / 100 * parseInt(getValues(`services.${index}.serviceQuantity`)) * parseInt(getValues(`services.${index}.servicePrice`))
                                                //         : 0}
                                                />
                                            )}
                                        />
                                        <Button
                                            type='button'
                                            variant="contained"
                                            onClick={() => remove(index)}
                                            sx={{ width: '150px', fontWeight: 'bold', margin: 'auto', height: '32px' }}
                                        >
                                            Delete
                                        </Button>
                                    </li>
                                ))
                            }
                        </ul>
                        <div style={{ display: 'flex', gap: '25px' }}>
                            <div>
                                <Button
                                    sx={{ width: '150px', fontWeight: 'bold', marginInline: 'auto' }}
                                    variant="contained"
                                    type="button"
                                    onClick={() => append({
                                        serviceName: "",
                                        serviceQuantity: 0,
                                        servicePrice: 0,
                                        selectedDiscount: getValues(`selectedDiscount`, { valueAsNumber: true }),
                                        serviceTotal: 0
                                    })}
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
                            </div>
                            <GrandTotal control={control} />
                        </div>

                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateInvoice2;