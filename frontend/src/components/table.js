import React, { useState } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/core/styles'
//Data
import { useQuery, gql } from '@apollo/client'
// My comps and utils
import Snack from './snack'
import { getAge } from '../utils'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(2),
    width: '100%',
    height: 400,
  },
}))

const columns = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'country', headerName: 'Country', width: 125 },
  { field: 'birthday', headerName: 'Birthday', width: 120 },
]

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
`

export default function Table() {
  const classes = useStyles()
  const { loading, error, data } = useQuery(getBirthdayBois, {
    pollInterval: 30000,
  })
  const [snack, setSnack] = useState({
    open: false,
    message: '',
  })
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnack(false)
  }
  return (
    <div className={classes.container}>
      <DataGrid
        rows={
          data
            ? data.birthdayBois.map((i) => {
              return {
                id: i._id,
                name: i.name,
                country: i.country,
                birthday: i.birthday,
              }
            })
            : []
        }
        columns={columns}
        loading={loading}
        pageSize={5}
        onRowSelected={({ data }) => {
          let age = getAge(data.birthday)
          let bday = new Date(data.birthday)
          setSnack({
            open: true,
            message: `
              Hello ${data.name} from ${data.country} on 
              ${bday.getDate()} of month
              ${bday.toLocaleDateString('en-US', { month: 'long' })} you will
              have ${age + 1}
            `,
          })
        }}
      />
      <Snack
        open={snack.open || error}
        message={snack.message || (error && 'Something bad happened with the connection. Try again later')}
        handleClose={handleClose}
      />
    </div>
  )
}
