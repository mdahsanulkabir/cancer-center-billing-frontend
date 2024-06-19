import { DataGrid } from '@mui/x-data-grid';
import Header1 from "../components/Header1";
import Header2 from "../components/Header2";
import { useEffect, useState } from 'react';
import useAxiosIntercept from '../hooks/useAxiosIntercept';
import { Box, Button, TextField, useTheme } from '@mui/material';
import { colorTokens } from '../utils/theme/colorTokens';
import { Controller, useForm } from "react-hook-form";


const Department = () => {
    const [existingDepartments, setExistingDepartments] = useState([])
    const axiosPrivate = useAxiosIntercept();
    const theme = useTheme();
    const colors = colorTokens(theme.palette.mode);

    useEffect(() => {
        const getExistingDepartments = async () => {
            const response = await axiosPrivate.get('/department')
            setExistingDepartments(response.data);
            console.log(response.data)
        }

        getExistingDepartments();
    }, [axiosPrivate])

    const columns = [
        { field: "sl", headerName: "SL" },
        {
            field: "departmentName",
            headerName: "Department Name",
            flex: 1,
            cellClassName: "name-column--cell",
        }
    ]
    // const [deptList, setDeptList] = useState([]);
    let deptList = []

    deptList = existingDepartments.map((dept, index) => {
        return {
            id: index,
            sl: index + 1,
            departmentName: dept.departmentName
        }
    })

    const { control, handleSubmit } = useForm({
        defaultValues: {
            departmentName: "",
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await axiosPrivate.post('/department',JSON.stringify(data))
            console.log(response.data)
            setExistingDepartments(prev => ([...prev, response.data]))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Header1 title="Departments" subtitle="view create departments" />
            <Header2 title="EXISTING DEPARTMENTS" subtitle="" />
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
                <DataGrid checkboxSelection rows={deptList} columns={columns} />
            </Box>

            <div className="create-department">
                <Header2 title="CREATE DEPARTMENT" subtitle="" />
                <div className="create-department-form-content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="departmentName"
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    sx={{ marginBlock: 2 }}
                                    autoComplete="new-password"
                                    variant="filled"
                                    type="text"
                                    label="Department Name"
                                    {...field}
                                />
                            )}
                        />
                        <Button
                            sx={{ width: '150px', fontWeight: 'bold', marginInline: 'auto' }}
                            type="submit"
                            variant="contained"
                        >
                            Add Department
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Department;