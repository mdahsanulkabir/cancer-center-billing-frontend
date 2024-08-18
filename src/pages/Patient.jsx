import { Controller, useForm } from "react-hook-form";
import Header1 from "../components/Header1";
import Header2 from "../components/Header2";
import { Box, Button, TextField, useTheme } from "@mui/material";
import useAxiosIntercept from "../hooks/useAxiosIntercept";
import { colorTokens } from "../utils/theme/colorTokens";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const Patient = () => {
    const [retrievedPatient, setRetrievedPatient] = useState([])
    const axiosPrivate = useAxiosIntercept();
    const theme = useTheme();
    const colors = colorTokens(theme.palette.mode);
    const navigate = useNavigate();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            patientSerial: "",
        }
    });
    const onSubmit = async (data) => {
        try {
            const response = await axiosPrivate.get(`/getPatientBySerial/${data.patientSerial}`);
            setRetrievedPatient(prev => [...prev, response.data])
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const columns = [
        {
            field: "patientSerial",
            headerName: "Patient Serial #",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "patientName",
            headerName: "Patient Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "patientPhoneNumber",
            headerName: "Patient Phone Number",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "rank",
            headerName: "Patient Rank",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "rtNumber",
            headerName: "Patient RT",
            flex: 1,
            cellClassName: "name-column--cell",
        },
    ]

    const patientData = retrievedPatient.map((patient, index) => {
        return {
            id: patient._id,
            sl: index + 1,
            patientSerial: patient.patientSerial,
            patientName: patient.patientName,
            patientPhoneNumber: patient.patientPhoneNumber,
            rank: patient.rank,
            rtNumber: patient.rtNumber
        }
    })

    const handleNavigateToCreateInvoice = () => {
        const patient = retrievedPatient[0];
        navigate('/create-invoice', { state: patient });
    };
    return (
        <div>
            <Header1 title="PATIENT" subtitle="view create patient" />
            <Header2 title="SEARCH PATIENT" subtitle="" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    name="patientSerial"
                    render={({ field }) => (
                        <TextField
                            fullWidth
                            sx={{ marginBlock: 2 }}
                            autoComplete="new-password"
                            variant="filled"
                            type="text"
                            label="Patient Serial"
                            {...field}
                        />
                    )}
                />
                <Button
                    sx={{ width: '150px', fontWeight: 'bold', marginInline: 'auto' }}
                    type="submit"
                    variant="contained"
                >
                    Search By Serial
                </Button>
            </form>


            {/* Show retrieved patinet if the patiend data is available */}
            {
                patientData.length > 0 && (
                    <>
                        <Header2 title="RETRIEVED PATIENT" subtitle="" />
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
                            <DataGrid checkboxSelection rows={patientData} columns={columns} />
                        </Box>
                        {/* Create invoice with retrieved patient */}
                        <Button
                            sx={{ width: '150px', fontWeight: 'bold', marginInline: 'auto' }}
                            type="submit"
                            variant="contained"
                            onClick={handleNavigateToCreateInvoice}
                        >
                            CREATE INVOICE WITH THIS PATIENT
                        </Button>
                    </>
                )
            }

        </div>
    );
};

export default Patient;