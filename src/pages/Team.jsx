import { Autocomplete, Box, Button, TextField, useTheme } from "@mui/material";
import useAxiosIntercept from "../hooks/useAxiosIntercept";
import { colorTokens } from "../utils/theme/colorTokens";
import { useEffect, useState } from "react";
import Header1 from "../components/Header1";
import Header2 from "../components/Header2";
import { DataGrid } from "@mui/x-data-grid";
import { Controller, useForm } from "react-hook-form";

const Team = () => {
    const [existingUsers, setExistingUsers] = useState([]);
    const [existingRoles, setExistingRoles] = useState([]);
    const axiosPrivate = useAxiosIntercept();
    const theme = useTheme();
    const colors = colorTokens(theme.palette.mode);



    // load all the users
    useEffect(() => {
        const getExistingUsers = async () => {
            const response = await axiosPrivate.get('/all-users')
            setExistingUsers(response.data);
            console.log("users", response.data)
        }

        getExistingUsers();
    }, [axiosPrivate])



    // load all roles
    useEffect(() => {
        const getExistingRoles = async () => {
            const response = await axiosPrivate.get('/role')
            setExistingRoles(response.data);
            console.log("roles", response.data)
        }

        getExistingRoles();
    }, [])


    // define the columns
    const columns = [
        { field: "sl", headerName: "SL" },
        {
            field: "userName",
            headerName: "User Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "role",
            headerName: "User Role",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "userId",
            headerName: "User Id",
            flex: 1,
            cellClassName: "name-column--cell",
        }
    ]


    // generate the row values
    let memberList = []
    memberList = existingUsers?.map((user, index) => {
        return {
            id: index,
            sl: index + 1,
            userName: user.name,
            role: user.roleId?.role,
            userId: user.userId
        }
    })


    const roles = existingRoles.map(role => ({
        label: role.role,
        id: role._id
    }))


    const { control, handleSubmit } = useForm({
        defaultValues: {
            userName: "",
            userId: "",
            roleId: "",
        }
    });

    const onSubmit = async (data) => {
        console.log(data);
        const newMember = {
            name: data.userName, 
            userId: data.userId, 
            roleId: data.roleId,
        }

        try {
                const response = await axiosPrivate.post('/user', JSON.stringify(newMember)) 
                //TODO resonpose role does not match with the state variable


                setExistingUsers(prev => ([...prev, response.data]))
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <Header1 title="TEAM" subtitle="view create team membter" />
            <Header2 title="EXISTING MEMBERS" subtitle="" />

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
                <DataGrid checkboxSelection rows={memberList} columns={columns} />
            </Box>


            {/* ///////////////////////////////////////////////////
            // create new team member */}
            <div className="create-member">
                <Header2 title="CREATE MEMBER" subtitle="" />
                <div className="create-member-form-content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="userName"
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    sx={{ marginBlock: 2 }}
                                    autoComplete="new-password"
                                    variant="filled"
                                    type="text"
                                    label="User Name"
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="userId"
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    sx={{ marginBlock: 2 }}
                                    autoComplete="new-password"
                                    variant="filled"
                                    type="text"
                                    label="User Id"
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="roleId"
                            render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                    disablePortal
                                    options={roles}
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
                                            label="Role Name"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                    value={roles.find(role => role.label === value) || null}
                                    onChange={(event, newValue) => {
                                        onChange(newValue ? newValue.id : "")
                                    }}
                                />
                            )}
                        />

                        <Button
                            sx={{ width: '150px', fontWeight: 'bold', marginInline: 'auto' }}
                            type="submit"
                            variant="contained"
                        >
                            Add Member
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Team;