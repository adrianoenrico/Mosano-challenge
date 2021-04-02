import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: theme.spacing(2),
      width: '100%',
      height: 400
    },
  }));

const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'country', headerName: 'Country', width: 125 },
    { field: 'birthday', headerName: 'Birthday', width: 120 }
  ];

const rows = [
    {
        name: 'Adriano Alecrim',
        country: 'Portugal',
        birthday: '08/11/1998',
        id: 123314
    }
]

export default function Table(){
    const classes = useStyles()
    return (
    <div className={classes.container}>
        <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
    </div>
    )
}