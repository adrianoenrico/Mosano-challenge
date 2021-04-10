import React, { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
// Data
import { useQuery, gql } from "@apollo/client";
// My comps and utils
import Snack from "./snack";
import { getAge } from "../utils";


const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		flexWrap: "wrap",
		padding: theme.spacing(2),
		width: "100%",
		height: 400,
	},
}));

const columns = [
	{ field: "name", headerName: "Name", width: 150 },
	{ field: "country", headerName: "Country", width: 125 },
	{ field: "birthday", headerName: "Birthday", width: 120 },
];

// Mock data
// const rows = [
//   {
//     name: 'Adriano Alecrim',
//     country: 'Portugal',
//     birthday: '08/11/1998',
//     id: 123314,
//   },
// ]

const getBirthdayBois = gql`
	query getBirtdayBois {
		birthdayBois {
			birthday
			name
			_id
			country
		}
	}
`;

export default function Table() {
	const classes = useStyles();
	const { loading, error, data } = useQuery(getBirthdayBois, {
		pollInterval: 30000,
	});
	const [snack, setSnack] = useState({
		open: false,
		message: "",
	});
	useEffect(() => {
		let val = {
			open: false,
			message: "",
		};
		if (error) {
			val = {
				open: true,
				message: `Something bad happenend. Please try again later. (${error.message})`,
			};
		}
		setSnack(val);
	}, [error]);
	const handleClose = (event, reason) => {
		if (reason === "clickaway") return;
		setSnack(false);
	};
	return (
		<div className={classes.container}>
			<DataGrid
				rows={
					data
						? data.birthdayBois.map((i) => ({
								// eslint-disable-next-line no-underscore-dangle
								id: i._id,
								name: i.name,
								country: i.country,
								birthday: i.birthday,
						  }))
						: []
				}
				columns={columns}
				loading={loading}
				pageSize={5}
				disableSelectionOnClick
				// in a normal app, i'd implement pagination in client and api(if in-house)
				// to prevent long ass queries
				onRowClick={({ row }) => {
					const age = getAge(row.birthday);
					const bday = new Date(row.birthday);
					setSnack({
						open: true,
						message: `
							Hello ${row.name} from ${row.country} on 
							${bday.getDate()} of month
							${bday.toLocaleDateString("en-US", { month: "long" })} you will
							have ${age + 1}
						`,
					});
				}}
			/>
			<Snack
				open={snack.open}
				message={snack.message}
				handleClose={handleClose}
			/>
		</div>
	);
}
